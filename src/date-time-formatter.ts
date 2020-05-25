/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
  DateTimeFormatOptions,
  FULL_DATE,
  FULL_DATE_WITH_YEAR,
  HOUR_ONLY,
  LONG_DATE,
  LONG_DATE_WITH_YEAR,
  LONG_TIME,
  LONG_WEEKDAY,
  LONG_WEEKDAY_LONG_TIME,
  LONG_WEEKDAY_SHORT_TIME,
  MEDIUM,
  MEDIUM_DATE,
  MEDIUM_DATE_WITH_YEAR,
  MEDIUM_TIME,
  MEDIUM_WITH_YEAR,
  SHORT_DATE,
  SHORT_DATE_LONG_TIME,
  SHORT_DATE_TIME,
  SHORT_DATE_WITH_SHORT_YEAR,
  SHORT_DATE_WITH_YEAR,
  SHORT_TIME,
  SHORT_WEEKDAY,
  SHORT_WEEKDAY_LONG_TIME,
  SHORT_WEEKDAY_SHORT_TIME
} from './date-time-format-options';
import ILocaleInfo from './ILocaleInfo';
import {
  dateTranslationMaps,
  IDateTimeFormatPartKeys,
  ITranslationMap,
  timeTranslationMaps
} from './os-date-time-translation-maps';

export class DateTimeFormatter {
  // We're keying this using JSON.stringify because with a WeakMap we've have a key pair 
  // (locale - string & options - object) and stringify is native so it is so fars it is
  // not worth maintaing the two-level cache (map for string and weak map for object)
  private readonly localeFormatCache = new Map<string, Intl.DateTimeFormat>();

  /**
   * Instantiates DateTimeFormatter
   * @param locale The desired locale to which to format the date and time value (default: en-US)
   */
  constructor(private locale: string | ILocaleInfo = 'en-US') { }

  /**
   * Localizes the date/time value
   * @param date The date/time to localize
   * @param format The format to be used for the localization
   * @returns The localized date/time string
   */
  public formatDateTime(date: number | Date, format: DateTimeFormatOptions) {
    if (typeof this.locale === 'string') {
      const key = JSON.stringify({ locale: this.locale, format });
      let dtf = this.localeFormatCache.get(key);
      if (!dtf) {
        dtf = new Intl.DateTimeFormat(this.locale, format);
        this.localeFormatCache.set(key, dtf);
      }

      return dtf.format(date);
    }

    return this.formatOsDateTime(date, format, this.locale);
  }

  private partsToObject(parts: IElectronDateTimePart[]): IDateTimeFormatParts {
    const partsObject: IDateTimeFormatParts = {};
    for (const part of parts) {
      if (part.type !== 'literal') {
        // eslint-disable-next-line msteams/no-explicit-any-with-exceptions
        partsObject[part.type] = part.value as any;
      }
    }
    return partsObject;
  }

  private getDateTimeParts(
    dateTimeOptions: Intl.DateTimeFormatOptions,
    date: number | Date
  ): IDateTimeFormatParts {
    if (typeof this.locale === 'string') {
      throw new Error('Must be called only when using the OS formatter.');
    }

    const partsArray = Intl.DateTimeFormat(this.locale.regionalFormat, dateTimeOptions).formatToParts(date);
    return this.partsToObject(partsArray);
  }

  private formatDateTimeFromMask(
    mask: string,
    dateTimeMap: IDateTimeMap
  ): string {
    let formatted = '';
    let toMaskIndex = 0;
    let maskPartFound: boolean;
    while (toMaskIndex < mask.length) {
      maskPartFound = false;
      for (let endIndex = mask.length; endIndex > toMaskIndex; endIndex--) {
        if (dateTimeMap[mask.slice(toMaskIndex, endIndex)]) {
          maskPartFound = true;
          formatted += dateTimeMap[mask.slice(toMaskIndex, endIndex)];
          toMaskIndex = endIndex;
          break;
        }
      }
      if (!maskPartFound) {
        formatted += mask[toMaskIndex];
        toMaskIndex += 1;
      }
    }

    return formatted;
  }

  private addToMap(
    map: IDateTimeMap,
    symbols: string | string[],
    value: string | boolean | undefined
  ) {
    const syms = Array.isArray(symbols) ? symbols : [symbols];
    for (const symbol of syms) {
      map[symbol] = value ? value.toString() : symbol;
    }
  }

  private fixChromiumDigitBug(dateTimeMap: IDateTimeMap) {
    // fix of chromium bug - Chromium Intl.DateTimeFormat ignores numeric/2-digit for hour/min/sec settings

    // fix of 2-digit symbols
    for (const symbol of ['hh', 'HH', 'mm', 'ss']) {
      if (dateTimeMap[symbol] && dateTimeMap[symbol].length === 1) {
        dateTimeMap[symbol] = `0${dateTimeMap[symbol]}`;
      }
    }

    // fix of numeric symbols
    for (const symbol of ['h', 'H', 'm', 's']) {
      if (
        dateTimeMap[symbol] &&
        dateTimeMap[symbol].length === 2 &&
        dateTimeMap[symbol][0] === '0'
      ) {
        dateTimeMap[symbol] = dateTimeMap[symbol][1];
      }
    }
  }

  private macTimeToString(date: number | Date, macTimeFormat: string): string {
    const dateTimeMap = this.getDateTimeMap(
      timeTranslationMaps['mac'],
      date
    );
    dateTimeMap.V = 'unk';

    let timeFormat = macTimeFormat; // local copy of macDateFormat to enable changes and preserve the original value
    timeFormat = timeFormat.replace(/x/g, '');
    timeFormat = timeFormat.replace(/X/g, '');

    timeFormat = this.sanitizeOsFormat(timeFormat);

    return this.formatDateTimeFromMask(timeFormat, dateTimeMap);
  }

  private windowsTimeToString(
    date: number | Date,
    windowsTimeFormat: string
  ): string {
    const dateTimeMap = this.getDateTimeMap(
      timeTranslationMaps['windows'],
      date
    );
    const format = this.sanitizeOsFormat(windowsTimeFormat);
    return this.formatDateTimeFromMask(format, dateTimeMap);
  }

  private macDateToString(date: number | Date, macDateFormat: string): string {
    const dateTimeMap = this.getDateTimeMap(
      dateTranslationMaps['mac'],
      date
    );
    let dateFormat = macDateFormat; // local copy of macDateFormat to enable changes and preserve the original value

    dateFormat = dateFormat.replace(/l/g, '');

    dateFormat = dateFormat.replace(/w/g, '');
    dateFormat = dateFormat.replace(/W/g, '');
    dateFormat = dateFormat.replace(/D/g, '');
    dateFormat = dateFormat.replace(/F/g, '');
    dateFormat = dateFormat.replace(/g/g, '');
    dateFormat = dateFormat.replace(/U/g, '');
    dateFormat = dateFormat.replace(/q/g, '');
    dateFormat = dateFormat.replace(/Q/g, '');

    dateFormat = this.sanitizeOsFormat(dateFormat);

    return this.formatDateTimeFromMask(dateFormat, dateTimeMap);
  }

  private windowsDateToString(
    date: number | Date,
    windowsDateFormat: string
  ): string {
    const dateTimeMap = this.getDateTimeMap(
      dateTranslationMaps['windows'],
      date
    );

    // Windows "y" = Year represented only by the last digit
    // Intl doesn't support 1-digit year, but it supports 2-digit year -> let create it from it
    dateTimeMap['y'] =
      dateTimeMap['y'].length === 2 ? dateTimeMap['y'][1] : dateTimeMap['y'];

    const format = this.sanitizeOsFormat(windowsDateFormat);
    return this.formatDateTimeFromMask(format, dateTimeMap);
  }

  private getDateTimeMap(
    translationMap: ITranslationMap,
    date: number | Date
  ): IDateTimeMap {
    const dateTimeMap: IDateTimeMap = {};

    for (const key of Object.keys(translationMap)) {
      const parts = this.getDateTimeParts(
        translationMap[key].intl.options,
        date
      );
      const symbolParts = Array.isArray(translationMap[key].intl.part)
        ? translationMap[key].intl.part
        : [translationMap[key].intl.part];
      let symbolValue;
      for (const symbolPart of symbolParts as IDateTimeFormatPartKeys[]) {
        if (parts[symbolPart]) {
          symbolValue = parts[symbolPart];
          break;
        }
      }

      this.addToMap(dateTimeMap, translationMap[key].symbol, symbolValue);
    }

    this.fixChromiumDigitBug(dateTimeMap);
    return dateTimeMap;
  }

  private sanitizeOsFormat(format: string): string {
    return format.replace(/\s+/g, ' ').trim();
  }

  private formatOsDateTime(date: number | Date, format: DateTimeFormatOptions, localeInfo: ILocaleInfo): string {
    if (!localeInfo) {
      throw new Error('Cannot call the OS date and time formatter without specifying the OS locale info.');
    }

    switch (format) {
      case SHORT_TIME: {
        if (!localeInfo.shortTime) {
          throw new Error(`localeInfo.shortTime was not provided!`);
        }

        if (localeInfo.platform === 'macos') {
          return this.macTimeToString(date, localeInfo.shortTime);
        } else {
          return this.windowsTimeToString(date, localeInfo.shortTime);
        }
      }
      case SHORT_DATE:
      case SHORT_DATE_WITH_SHORT_YEAR:
      case SHORT_DATE_WITH_YEAR: {
        if (!localeInfo.shortDate) {
          throw new Error(`localeInfo.shortDate was not provided!`);
        }

        if (localeInfo.platform === 'macos') {
          return this.macDateToString(date, localeInfo.shortDate);
        } else {
          return this.windowsDateToString(date, localeInfo.shortDate);
        }
      }
      case SHORT_DATE_LONG_TIME: {
        if (!localeInfo.shortDate || !localeInfo.longDate) {
          throw new Error(`localeInfo.shortDate or localeInfo.longTime was not provided!`);
        }

        if (localeInfo.platform === 'macos') {
          return `${this.macDateToString(date, localeInfo.shortDate)} ${this.macTimeToString(date, localeInfo.longTime)}`;
        } else {
          return `${this.windowsDateToString(date, localeInfo.shortDate)} ${this.windowsTimeToString(date, localeInfo.longTime)}`;
        }
      }
      case SHORT_DATE_TIME: {
        if (!localeInfo.shortDate || !localeInfo.shortTime) {
          throw new Error(`localeInfo.shortDate or localeInfo.shortTime was not provided!`);
        }

        if (localeInfo.platform === 'macos') {
          return `${this.macDateToString(date, localeInfo.shortDate)} ${this.macTimeToString(date, localeInfo.shortTime)}`;
        } else {
          return `${this.windowsDateToString(date, localeInfo.shortDate)} ${this.windowsTimeToString(date, localeInfo.shortTime)}`;
        }
      }
      case HOUR_ONLY: {
        if (!localeInfo.shortTime) {
          throw new Error(`localeInfo.shortTime was not provided!`);
        }

        if (localeInfo.platform === 'macos') {
          const includesADayPeriod = localeInfo.shortTime.includes('a');
          return this.macTimeToString(date, includesADayPeriod ? 'h a' : 'H');
        } else {
          const includesTTDayPeriod = localeInfo.shortTime.includes('tt');
          const includesTDayPeriod = localeInfo.shortTime.includes('t');
          return this.windowsTimeToString(date, includesTTDayPeriod ? 'h tt' : (includesTDayPeriod ? 'h t' : 'H'));
        }
      }
      case MEDIUM_TIME:
      case LONG_TIME: {
        if (!localeInfo.longTime) {
          throw new Error(`localeInfo.longTime was not provided!`);
        }

        if (localeInfo.platform === 'macos') {
          return this.macTimeToString(date, localeInfo.longTime);
        } else {
          return this.windowsTimeToString(date, localeInfo.longTime);
        }
      }
      case MEDIUM:
      case MEDIUM_WITH_YEAR: {
        if (!localeInfo.longDate || !localeInfo.longTime) {
          throw new Error(`localeInfo.longDate or localeInfo.longTime was not provided!`);
        }

        if (localeInfo.platform === 'macos') {
          return `${this.macDateToString(date, localeInfo.longDate)} ${this.macTimeToString(date, localeInfo.longTime)}`;
        } else {
          return `${this.windowsDateToString(date, localeInfo.longDate)} ${this.windowsTimeToString(date, localeInfo.longTime)}`;
        }
      }
      case LONG_WEEKDAY_LONG_TIME:
      case SHORT_WEEKDAY_LONG_TIME: {
        if (!localeInfo.longDate || !localeInfo.longTime) {
          throw new Error(`localeInfo.longDate or localeInfo.longTime was not provided!`);
        }

        let loc: string;
        if (typeof this.locale === 'string') {
          loc = this.locale;
        } else {
          loc = this.locale.regionalFormat;
        }

        const weekFormat = format === LONG_WEEKDAY_LONG_TIME 
          ? Intl.DateTimeFormat(loc, LONG_WEEKDAY).format(date) 
          : Intl.DateTimeFormat(loc, SHORT_WEEKDAY).format(date);

        if (localeInfo.platform === 'macos') {
          return `${weekFormat}, ${this.macTimeToString(date, localeInfo.longTime)}`;
        } else {
          return `${weekFormat}, ${this.windowsTimeToString(date, localeInfo.longTime)}`;
        }
      }
      case LONG_WEEKDAY_SHORT_TIME:
      case SHORT_WEEKDAY_SHORT_TIME: {
        if (!localeInfo.shortTime) {
          throw new Error(`localeInfo.shortTime was not provided!`);
        }

        let loc: string;
        if (typeof this.locale === 'string') {
          loc = this.locale;
        } else {
          loc = this.locale.regionalFormat;
        }

        const weekFormat = format === LONG_WEEKDAY_SHORT_TIME
          ? Intl.DateTimeFormat(loc, LONG_WEEKDAY).format(date) 
          : Intl.DateTimeFormat(loc, SHORT_WEEKDAY).format(date);

        if (localeInfo.platform === 'macos') {
          return `${weekFormat}, ${this.macTimeToString(date, localeInfo.shortTime)}`;
        } else {
          return `${weekFormat}, ${this.windowsTimeToString(date, localeInfo.shortTime)}`;
        }
      }
      case MEDIUM_DATE:
      case LONG_DATE:
      case FULL_DATE:
      case MEDIUM_DATE_WITH_YEAR:
      case LONG_DATE_WITH_YEAR:
      case FULL_DATE_WITH_YEAR: {
        if (!localeInfo.longDate) {
          throw new Error(`localeInfo.longDate was not provided!`);
        }

        if (localeInfo.platform === 'macos') {
          return this.macDateToString(date, localeInfo.longDate);
        } else {
          return this.windowsDateToString(date, localeInfo.longDate);
        }
      }
    }

    throw new Error('Incorrect OS locale info format specified:' + format);
  }
}

interface IDateTimeMap {
  [symbol: string]: string;
}

interface IDateTimeFormatParts extends Intl.DateTimeFormatOptions {
  dayperiod?: string;
  dayPeriod?: string;
}

type ElectronDateTimePartItem = keyof IDateTimeFormatParts | 'literal';

export interface IElectronDateTimePart {
  type: ElectronDateTimePartItem;
  value: string;
}
