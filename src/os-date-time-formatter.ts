/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { CachedDateTimeFormat } from './cached-datetimeformat';
import {
  dateTranslationMaps,
  IDateTimeFormatPartKeys,
  ITranslationItem,
  ITranslationMap,
  timeTranslationMaps,
  unsupportedMask,
} from './os-date-time-translation-maps';

interface IDateTimeFormatParts extends Intl.DateTimeFormatOptions {
  dayperiod?: string;
  dayPeriod?: 'narrow' | 'short' | 'long' | undefined;
}

type ElectronDateTimePartItem = keyof IDateTimeFormatParts | 'literal';

export interface IElectronDateTimePart {
  type: ElectronDateTimePartItem;
  value: string;
}

interface IReplacePart {
  replacePart: IDateTimeFormatPartKeys | IDateTimeFormatPartKeys[];
  force1Digit?: boolean;
  force2Digits?: boolean;
  force0forMidnight?: boolean;
  intlOptionsOverride?: Intl.DateTimeFormatOptions;
}

type ReplacePart = string | IReplacePart;

interface IFormat {
  intlOptions: Intl.DateTimeFormatOptions;
  parts: ReplacePart[];
}

const FORCE_1_DIGIT_PARTS: {[key: string]: boolean } = {
  h: true,
  H: true,
  k: true,
  K: true,
  m: true,
  s: true,
};

const FORCE_2_DIGIT_PARTS: {[key: string]: boolean } = {
  hh: true,
  HH: true,
  kk: true,
  KK: true,
  mm: true,
  ss: true,
};

const FORCE_0_FOR_MIDNIGHT: {[key: string]: boolean } = {
  H: true,
  HH: true,
  K: true,
  KK: true
};

const QUOTE =  '\'';
const QUOTE_ESCAPED =  '~';
const DOUBLE_QUOTES_REGEX = /''/g;
const ESCAPED_QUOTES_REGEX = new RegExp(QUOTE_ESCAPED, 'g');

export class OsDateTimeFormatter {
  private readonly timeTranslationMap: ITranslationMap;
  private readonly dateTranslationMap: ITranslationMap;
  private readonly formats = new Map<string, IFormat>();
  private readonly locale: string;
  private readonly cachedDateTimeFormat: CachedDateTimeFormat;
  private readonly unsupportedMask: RegExp[];

  constructor(locale: string, platform: string, cachedDateTimeFormat: CachedDateTimeFormat) {
    this.timeTranslationMap = this.expandMap(timeTranslationMaps[platform] || timeTranslationMaps['windows']);
    this.dateTranslationMap = this.expandMap(dateTranslationMaps[platform] || dateTranslationMaps['windows']);
    this.locale = locale;
    this.cachedDateTimeFormat = cachedDateTimeFormat;
    this.unsupportedMask = unsupportedMask[platform];
  }

  public timeToString(date: number | Date, mask: string): string {
    const format = this.getFormat(mask, this.timeTranslationMap);
    return this.applyFormat(format, date);
  }

  public dateToString(date: number | Date, mask: string): string {
    const format = this.getFormat(mask, this.dateTranslationMap);
    return this.applyFormat(format, date);
  }

  public timeHasTimeZone(mask: string): boolean {
    const format = this.getFormat(mask, this.timeTranslationMap);
    if (format.intlOptions.timeZoneName) {
      return true;
    }
    for (let i = 0; i < format.parts.length; i++) {
      const part = format.parts[i];
      if (typeof part !== 'string' && part.intlOptionsOverride?.timeZoneName) {
          return true;
      }
    }
    return false;
  }

  public getTimeZoneName(date: number | Date, formatOptions: Intl.DateTimeFormatOptions) {
    const format = {
      intlOptions: { timeZoneName: formatOptions.timeZoneName },
      parts: [
        { replacePart: 'timeZoneName' } as IReplacePart
      ]};
    return this.applyFormat(format, date);
  }

  private expandMap(map: ITranslationMap): ITranslationMap {
    const result: ITranslationMap = {};
    Object.values(map).reduce(this.expandMapReducer, result);
    return result;
  }

  private expandMapReducer(result: ITranslationMap, value: ITranslationItem) {
    const symbols = value.symbol;
    if (!Array.isArray(symbols)) {
      result[symbols] = value;
    } else {
      for (let i = 0; i < symbols.length; i++) {
        result[symbols[i]] = value;  
      }
    }
  
    return result;
  }

  private getFormat(mask: string, map: ITranslationMap) {
    let format = this.formats.get(mask);
    if (!format) {
      format = this.buildFormat(mask, map);
      this.formats.set(mask, format);
    }
    return format;
  }

  private buildFormat(formatMask: string, map: ITranslationMap) {
    let intlOptions = {};

    let parts: ReplacePart[] = [];
    let toMaskIndex = 0;
    let maskPartFound: boolean;
    let inQuotes = false;
    let quoted = '';

    const mask = this.escapeQuotes(this.stripUnsupported(formatMask));

    while (toMaskIndex < mask.length) {
      maskPartFound = false;

      if (mask[toMaskIndex] === QUOTE) {
        if (inQuotes && quoted) {
          parts.push(quoted);
          quoted = '';
        }
        inQuotes = !inQuotes;
        toMaskIndex++;
        continue;
      }

      if (inQuotes) {
        quoted += mask[toMaskIndex];
        toMaskIndex++;
        continue;
      }
      
      for (let endIndex = mask.length; endIndex > toMaskIndex; endIndex--) {
        const slice = mask.slice(toMaskIndex, endIndex);
        if (map[slice]) {
          maskPartFound = true;
          const entry = map[slice];
          const force1Digit = FORCE_1_DIGIT_PARTS[slice] || false;
          const force2Digits = FORCE_2_DIGIT_PARTS[slice] || false;
          const force0forMidnight = FORCE_0_FOR_MIDNIGHT[slice] || false;

          // we can only use merged object if entries do not overlap
          // if an entry would change some props, create new intlOptions and store it as override for the part
          // if there are no changes, it is safe to merge new options into intlOptions
          const change = this.didValuesChange(intlOptions, entry.intl.options);

          if (change) {
            parts.push({
              replacePart: entry.intl.part,
              force1Digit,
              force2Digits,
              force0forMidnight,
              intlOptionsOverride: entry.intl.options
            });
          } else {
            intlOptions = Object.assign(intlOptions, entry.intl.options);
            parts.push({ replacePart: entry.intl.part, force1Digit, force2Digits, force0forMidnight });
          }
          
          toMaskIndex = endIndex;
          break;
        }
      }
      if (!maskPartFound) {
        parts.push(this.unescapeQuotes(mask[toMaskIndex]));
        toMaskIndex += 1;
      }
    }

    return { intlOptions, parts };
  }

  private stripUnsupported(mask: string) {
    if (!this.unsupportedMask) {
      return mask;
    }
    let result = mask;
    for (let i = 0; i < this.unsupportedMask.length; i++) {
        result = result.replace(this.unsupportedMask[i], '');
    }
    return result;
  }

  private escapeQuotes(mask: string) {
    return mask && mask.replace(DOUBLE_QUOTES_REGEX, QUOTE_ESCAPED);
  }

  private unescapeQuotes(mask: string) {
    return mask && mask.replace(ESCAPED_QUOTES_REGEX, QUOTE);
  }

  private didValuesChange(oldOptions: any, newOptions: any) {
    const acc = { change: false, newOptions, oldOptions };
    Object.keys(newOptions).reduce(this.didValuesChangeReducer, acc);

    // hour12 overrides hourCycle, mark it as change if it was added
    if (newOptions['hourCycle'] || oldOptions['hourCycle']) {
      if (!!newOptions['hour12'] !== !!oldOptions['hour12']) {
        acc.change = true;
      }
    }

    return acc.change;
  }

  private didValuesChangeReducer(acc: { change: boolean, newOptions: any, oldOptions: any }, key: string) {
    if (acc.change) {
      return acc;
    }
    if (acc.oldOptions[key] && acc.oldOptions[key] !== acc.newOptions[key]) {
      acc.change = true;
    }
    return acc;
  }

  private partsToObject(parts: IElectronDateTimePart[]): IDateTimeFormatParts {
    const partsObject: IDateTimeFormatParts = {};
    for (let i = 0; i < parts.length; i++) {
      const type = parts[i].type;
      if (type !== 'literal') {
          partsObject[type] = parts[i].value as any;
      }
    }
    return partsObject;
  }

  private applyFormat(format: IFormat, date: number | Date): string {
    const partValues = this.getPartValues(format.intlOptions, date);
    let formatted = '';
    for (let i = 0; i < format.parts.length; i++) {
        formatted = `${formatted}${this.getValue(format.parts[i], partValues, date)}`;
    }
    return formatted.replace(/\s+/g, ' ').trim();
  }

  private getValue(part: ReplacePart | string, partValues: IDateTimeFormatParts, date: number | Date): string {
    if (typeof part === 'string') {
      return part;
    }

    const values = part.intlOptionsOverride ? this.getPartValues(part.intlOptionsOverride, date) : partValues;

    let value = undefined;

    if (Array.isArray(part.replacePart)) {
      for (let i = 0; i < part.replacePart.length; i++) {
        const partCandidate = part.replacePart[i];
        const valueCandidate = values[partCandidate];
        if (valueCandidate) {
            value = valueCandidate;
            break;
        }
      }
    } else {
      value = values[part.replacePart];
    }

    if (part.force0forMidnight && value === '24') {
      value = '0';
    }

    if (part.force1Digit && value && typeof value === 'string' && value.length === 2 && value[0] === '0') {
      return value[1];
    }

    if (part.force2Digits && value && typeof value === 'string' && value.length === 1) {
      return `0${value}`;
    }

    return typeof value === 'string' ? value : '';
  }

  private getPartValues(options: Intl.DateTimeFormatOptions, date: number | Date) {
    const partsArray = this.cachedDateTimeFormat.get(this.locale, options).formatToParts(date);
    return this.partsToObject(partsArray);
  }

}
