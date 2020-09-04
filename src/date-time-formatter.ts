/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { CachedDateTimeFormat } from './cached-datetimeformat';
import {
  DateTimeFormatOptions,
  FULL,
  FULL_DATE,
  FULL_DATE_WITH_YEAR,
  FULL_TIME,
  FULL_WITH_YEAR,
  HOUR_ONLY,
  LONG_DATE,
  LONG_DATE_WITH_YEAR,
  LONG_TIME,
  LONG_TIME_WITH_TIMEZONE,
  LONG_WEEKDAY,
  LONG_WEEKDAY_LONG_TIME,
  LONG_WEEKDAY_SHORT_TIME,
  LONG_WITH_TIMEZONE,
  LONG_WITH_YEAR_TIMEZONE,
  MEDIUM,
  MEDIUM_DATE,
  MEDIUM_DATE_WITH_YEAR,
  MEDIUM_TIME,
  MEDIUM_WITH_YEAR,
  SHORT,
  SHORT_DATE,
  SHORT_DATE_LONG_TIME,
  SHORT_DATE_TIME,
  SHORT_DATE_WITH_SHORT_YEAR,
  SHORT_DATE_WITH_YEAR,
  SHORT_TIME,
  SHORT_WEEKDAY,
  SHORT_WEEKDAY_LONG_TIME,
  SHORT_WEEKDAY_SHORT_TIME,
  SHORT_WITH_YEAR
} from './date-time-format-options';
import ILocaleInfo from './ILocaleInfo';
import { OsDateTimeFormatter } from './os-date-time-formatter';

export class DateTimeFormatter {
  // We're keying this using JSON.stringify because with a WeakMap we've have a key pair 
  // (locale - string & options - object) and stringify is native so it is so fars it is
  // not worth maintaing the two-level cache (map for string and weak map for object)
  private readonly cachedDateTimeFormat = new CachedDateTimeFormat();

  private formatter?: OsDateTimeFormatter = undefined;

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
      const dtf = this.cachedDateTimeFormat.get(this.locale, format);
      return dtf.format(date);
    }

    return this.formatOsDateTime(date, format, this.locale);
  }

  public formatOsDateTime(date: number | Date, format: DateTimeFormatOptions, localeInfo: ILocaleInfo): string {
    if (!localeInfo) {
      throw new Error('Cannot call the OS date and time formatter without specifying the OS locale info.');
    }

    if (!this.formatter) {
       this.formatter = new OsDateTimeFormatter(localeInfo.regionalFormat, localeInfo.platform, this.cachedDateTimeFormat);
    }

    let loc: string;
    if (typeof this.locale === 'string') {
      loc = this.locale;
    } else {
      loc = this.locale.regionalFormat;
    }

    switch (format) {
      case SHORT_TIME: {
        if (!localeInfo.shortTime) {
          throw new Error(`localeInfo.shortTime was not provided!`);
        }

        return this.formatter.timeToString(date, localeInfo.shortTime);
      }
      case SHORT_DATE:
      case SHORT_DATE_WITH_SHORT_YEAR:
      case SHORT_DATE_WITH_YEAR: {
        if (!localeInfo.shortDate) {
          throw new Error(`localeInfo.shortDate was not provided!`);
        }

        return this.formatter.dateToString(date, localeInfo.shortDate);
      }
      case SHORT_DATE_LONG_TIME: {
        if (!localeInfo.shortDate || !localeInfo.longTime) {
          throw new Error(`localeInfo.shortDate or localeInfo.longTime was not provided!`);
        }

        const d = this.formatter.dateToString(date, localeInfo.shortDate);
        const t = this.formatter.timeToString(date, localeInfo.longTime);
        return this.combineDateAndTime(d, t);
      }
      case SHORT:
      case SHORT_WITH_YEAR:
      case SHORT_DATE_TIME: {
        if (!localeInfo.shortDate || !localeInfo.shortTime) {
          throw new Error(`localeInfo.shortDate or localeInfo.shortTime was not provided!`);
        }

        const d = this.formatter.dateToString(date, localeInfo.shortDate);
        const t = this.formatter.timeToString(date, localeInfo.shortTime);
        return this.combineDateAndTime(d, t);
      }
      case HOUR_ONLY: {
        if (!localeInfo.shortTime) {
          throw new Error(`localeInfo.shortTime was not provided!`);
        }

        if (localeInfo.platform === 'macos') {
          const includesADayPeriod = localeInfo.shortTime.includes('a');
          return this.formatter.timeToString(date, includesADayPeriod ? 'h a' : 'H');
        } else {
          const includesTTDayPeriod = localeInfo.shortTime.includes('tt');
          const includesTDayPeriod = localeInfo.shortTime.includes('t');
          return this.formatter.timeToString(date, includesTTDayPeriod ? 'h tt' : (includesTDayPeriod ? 'h t' : 'H'));
        }
      }
      case FULL_TIME:
      case MEDIUM_TIME:
      case LONG_TIME:
      case LONG_TIME_WITH_TIMEZONE: {
        if (!localeInfo.longTime) {
          throw new Error(`localeInfo.longTime was not provided!`);
        }

        const time = this.formatter.timeToString(date, localeInfo.longTime);
        return (format === LONG_TIME_WITH_TIMEZONE || format === FULL_TIME)
          ? this.ensureTimeZone(time, date, localeInfo.longTime, format, localeInfo)
          : time;
      }
      case MEDIUM:
      case MEDIUM_WITH_YEAR: {
        if (!localeInfo.longDate || !localeInfo.longTime) {
          throw new Error(`localeInfo.longDate or localeInfo.longTime was not provided!`);
        }

        const d = this.formatter.dateToString(date, localeInfo.longDate);
        const t = this.formatter.timeToString(date, localeInfo.longTime);
        return this.combineDateAndTime(d, t);
      }
      case FULL:
      case FULL_WITH_YEAR: {
        if (!localeInfo.longDate || !localeInfo.longTime) {
          throw new Error(`localeInfo.longDate or localeInfo.longTime was not provided!`);
        }

        const d = this.formatter.dateToString(date, localeInfo.longDate);
        const t = this.formatter.timeToString(date, localeInfo.longTime);
        const timeWithTimeZone = this.ensureTimeZone(t, date, localeInfo.longTime, format, localeInfo);
        return this.combineDateAndTime(d, timeWithTimeZone);
      }
      case LONG_WEEKDAY:
      case SHORT_WEEKDAY: {
        return this.cachedDateTimeFormat.get(loc, format).format(date); 
      }
      case LONG_WEEKDAY_LONG_TIME:
      case SHORT_WEEKDAY_LONG_TIME: {
        if (!localeInfo.longDate || !localeInfo.longTime) {
          throw new Error(`localeInfo.longDate or localeInfo.longTime was not provided!`);
        }
        
        const weekFormat = format === LONG_WEEKDAY_LONG_TIME 
          ? this.cachedDateTimeFormat.get(loc, LONG_WEEKDAY).format(date) 
          : this.cachedDateTimeFormat.get(loc, SHORT_WEEKDAY).format(date);

        return `${weekFormat}, ${this.formatter.timeToString(date, localeInfo.longTime)}`;
      }
      case LONG_WEEKDAY_SHORT_TIME:
      case SHORT_WEEKDAY_SHORT_TIME: {
        if (!localeInfo.shortTime) {
          throw new Error(`localeInfo.shortTime was not provided!`);
        }

        const weekFormat = format === LONG_WEEKDAY_SHORT_TIME
          ? this.cachedDateTimeFormat.get(loc, LONG_WEEKDAY).format(date) 
          : this.cachedDateTimeFormat.get(loc, SHORT_WEEKDAY).format(date);

        return `${weekFormat}, ${this.formatter.timeToString(date, localeInfo.shortTime)}`;
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

        return this.formatter.dateToString(date, localeInfo.longDate);
      }

      case LONG_WITH_TIMEZONE:
      case LONG_WITH_YEAR_TIMEZONE: {
        if (!localeInfo.longDate || !localeInfo.longTime) {
          throw new Error(`localeInfo.longDate or localeInfo.longTime was not provided!`);
        }

        const d = this.formatter.dateToString(date, localeInfo.longDate);
        const t = this.formatter.timeToString(date, localeInfo.longTime);
        const timeWithTimeZone = this.ensureTimeZone(t, date, localeInfo.longTime, format, localeInfo);
        return this.combineDateAndTime(d, timeWithTimeZone);
      }
    }

    let formatStringified = undefined;
    try {
      formatStringified = JSON.stringify(format);
    } catch { }

    throw new Error('Incorrect OS locale info format specified:' + (formatStringified || format));
  }

  private combineDateAndTime(date: string, time: string) {
    return `${date} ${time}`;
  }

  private ensureTimeZone(time: string, date: number | Date, mask: string, format: Intl.DateTimeFormatOptions, localeInfo: ILocaleInfo) {
    if (this.formatter?.timeHasTimeZone(mask)) {
      return time;
    }
    
    const timeZoneName = this.formatter?.getTimeZoneName(date, format);
    return `${time} ${timeZoneName}`;
  }
}
