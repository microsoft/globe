/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { CachedDateTimeFormat } from './cached-datetimeformat';
import {
  dateTranslationMaps,
  IDateTimeFormatPartKeys,
  ITranslationMap,
  timeTranslationMaps,
  unsupportedMask,
} from './os-date-time-translation-maps';

interface IDateTimeFormatParts extends Intl.DateTimeFormatOptions {
  dayperiod?: string;
  dayPeriod?: string;
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
  m: true,
  s: true,
};

const FORCE_2_DIGIT_PARTS: {[key: string]: boolean } = {
  hh: true,
  HH: true,
  mm: true,
  ss: true,
};

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

    let result = false;
    format.parts.every(part => {
      if (typeof(part) !== 'string') {
        if (part.intlOptionsOverride && part.intlOptionsOverride.timeZoneName) {
          result = true;
          return false;
        }
      }
      return true;
    });

    return result;
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
    Object.keys(map).every(entry => {
      const value = map[entry];
      const symbols = value.symbol;
      if (!Array.isArray(symbols)) {
        result[symbols] = value;
      } else {
        symbols.every(symbol => {
          result[symbol] = value;
          return true;
        });
      }
      return true;
    });
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

    const mask = this.stripUnsupported(formatMask);

    while (toMaskIndex < mask.length) {
      maskPartFound = false;
      for (let endIndex = mask.length; endIndex > toMaskIndex; endIndex--) {
        const slice = mask.slice(toMaskIndex, endIndex);
        if (map[slice]) {
          maskPartFound = true;
          const entry = map[slice];
          const force1Digit = FORCE_1_DIGIT_PARTS[slice] || false;
          const force2Digits = FORCE_2_DIGIT_PARTS[slice] || false;

          // we can only use merged object if entries do not overlap
          // if an entry would change some props, create new intlOptions and store it as override for the part
          // if there are no changes, it is safe to merge new options into intlOptions
          const change = this.didValuesChange(intlOptions, entry.intl.options);

          if (change) {
            parts.push({ replacePart: entry.intl.part, force1Digit, force2Digits,  intlOptionsOverride: entry.intl.options});
          } else {
            intlOptions = Object.assign(intlOptions, entry.intl.options);
            parts.push({ replacePart: entry.intl.part, force1Digit, force2Digits });
          }
          
          toMaskIndex = endIndex;
          break;
        }
      }
      if (!maskPartFound) {
        parts.push(mask[toMaskIndex]);
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
    this.unsupportedMask.every(m => {
      result = result.replace(m, '');
      return true;
    });
    return result;
  }

  private didValuesChange(oldOptions: any, newOptions: any) {
    let change = false;
    Object.keys(newOptions).every(key => {
      if (oldOptions[key] && oldOptions[key] !== newOptions[key]) {
        change = true;
        return false;
      }
      return true;
    });
    return change;
  }

  private partsToObject(parts: IElectronDateTimePart[]): IDateTimeFormatParts {
    const partsObject: IDateTimeFormatParts = {};
    parts.every(part => {
      if (part.type !== 'literal') {
        partsObject[part.type] = part.value as any;
      }
      return true;
    });
    return partsObject;
  }

  private applyFormat(format: IFormat, date: number | Date): string {
    const partValues = this.getPartValues(format.intlOptions, date);
    const formatted = format.parts
      .map(part => this.getValue(part, partValues, date))
      .join('');

    return formatted.replace(/\s+/g, ' ').trim();
  }

  private getValue(part: ReplacePart | string, partValues: IDateTimeFormatParts, date: number | Date): string {
    if (typeof part === 'string') {
      return part;
    }

    const values = part.intlOptionsOverride ? this.getPartValues(part.intlOptionsOverride, date) : partValues;

    let value = undefined;

    if (Array.isArray(part.replacePart)) {
      part.replacePart.every(partCandidate => {
        const valueCandidate = values[partCandidate];
        if (valueCandidate) {
          value = valueCandidate;
          return false;
        }
        return true;
      });
    } else {
      value = values[part.replacePart];
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
