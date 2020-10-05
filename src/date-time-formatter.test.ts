/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const { 
  DateTimeFormatter, 
  LONG_DATE, 
  HOUR_ONLY, 
  SHORT_DATE_LONG_TIME, 
  SHORT_DATE_TIME, 
  SHORT_DATE_TIME_NO_YEAR,
  LONG_WEEKDAY_SHORT_TIME, 
  LONG_WEEKDAY_LONG_TIME,
  SHORT_WEEKDAY_LONG_TIME,
  SHORT_WEEKDAY_SHORT_TIME,
  FULL_TIME,
  LONG_TIME_WITH_TIMEZONE,
  LONG_WITH_TIMEZONE,
  FULL_WITH_YEAR,
  FULL,
  SHORT_WITH_YEAR,
  SHORT,
  SHORT_TIME
} = require('../dist/globe.cjs.development');

describe('date-time-format-options', () => {
  describe('functionality', () => {
    it('constructs without throwing', () => {
      expect(() => new DateTimeFormatter('en-US')).not.toThrow();
    });

    it('formats a date using a locale string', () => {
      const dateTimeFormatter = new DateTimeFormatter('en-US');
      const date = new Date(2020, 1, 1, 12, 0, 0);
      expect(dateTimeFormatter.formatDateTime(date)).toBe('2/1/2020');
    });

    it('formats a date using ILocaleInfo', () => {
      const localeInfo = {
        platform: 'macos',
        regionalFormat: 'en-US',
        shortDate: 'dd/MM/y',
        longDate: 'd MMMM y',
        shortTime: 'HH:mm',
      };

      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 1, 1, 12, 0, 0);
      expect(dateTimeFormatter.formatDateTime(date, LONG_DATE)).toBe('1 February 2020');
    });

    describe('Mac', () => {
      const localeInfo = {
        platform: 'macos',
        regionalFormat: 'en-US',
        shortDate: 'M/d/yy',
        longDate: 'MMMM d, y',
        shortTime: 'h:mm a',
        longTime: 'h:mm:ss a',
      };

      it('uses mac 12 hour format', () => {
        const localeInfo = { platform: 'macos', regionalFormat: 'en-US', shortTime: 'h:mm a' };
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 1, 1, 15, 0, 0);
        expect(dateTimeFormatter.formatDateTime(date, HOUR_ONLY)).toBe('3 PM');
      });

      it('uses mac 24 hour format', () => {
        const localeInfo = { platform: 'macos', regionalFormat: 'en-US', shortTime: 'HH:mm' };
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 1, 1, 15, 0, 0);
        expect(dateTimeFormatter.formatDateTime(date, HOUR_ONLY)).toBe('15');
      });

      it('uses time zone in mask correctly', () => {
        const localeInfo = { platform: 'macos', regionalFormat: 'en-US', longTime: 'h:mm a x' };
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 1, 1, 15, 0, 0);
        expect(dateTimeFormatter.formatDateTime(date, FULL_TIME)).toBe('3:00 PM UTC');
      });

      it('formats short date with short time', () => {
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 15, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, SHORT_DATE_TIME)).toBe('6/28/20 3:40 PM');
      });

      it('formats short date with short time no year', () => {
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 15, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, SHORT_DATE_TIME_NO_YEAR)).toBe('6/28 3:40 PM');
      });

      it('formats short', () => {
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 15, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, SHORT)).toBe('6/28/20 3:40 PM');
      });

      it('formats short with year', () => {
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 15, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, SHORT_WITH_YEAR)).toBe('6/28/20 3:40 PM');
      });

      it('formats short date with long time', () => {
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 15, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, SHORT_DATE_LONG_TIME)).toBe('6/28/20 3:40:25 PM');
      });

      it('long weekend with short time', () => {
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 15, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, LONG_WEEKDAY_SHORT_TIME)).toBe('Sunday, 3:40 PM');
      });

      it('long weekend with long time', () => {
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 15, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, LONG_WEEKDAY_LONG_TIME)).toBe('Sunday, 3:40:25 PM');
      });

      it('short weekend with short time', () => {
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 15, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, SHORT_WEEKDAY_SHORT_TIME)).toBe('Sun, 3:40 PM');
      });
      
      it('short weekend with long time', () => {
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 15, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, SHORT_WEEKDAY_LONG_TIME)).toBe('Sun, 3:40:25 PM');
      });

      it('removes unsupported symbols', () => {
        const localeInfo = { platform: 'macos', regionalFormat: 'en-US', shortTime: 'llwwWWDDFFggUUqqQQh:mm a' };
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 1, 1, 15, 0, 0);
        expect(dateTimeFormatter.formatDateTime(date, HOUR_ONLY)).toBe('3 PM');
      });

      it('long time with time zone', () => {
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 15, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, LONG_TIME_WITH_TIMEZONE)).toBe('3:40:25 PM UTC');
      });

      it('long date and time with time zone', () => {
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 15, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, LONG_WITH_TIMEZONE)).toBe('June 28, 2020 3:40:25 PM UTC');
      });

      it('full date and time with year', () => {
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 15, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, FULL_WITH_YEAR)).toBe('June 28, 2020 3:40:25 PM Coordinated Universal Time');
      });

      it('full', () => {
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 15, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, FULL)).toBe('June 28, 2020 3:40:25 PM Coordinated Universal Time');
      });
    });

    describe('Windows', () => {
      const localeInfo = {
        platform: 'windows',
        regionalFormat: 'en-US',
        shortDate: 'M/d/yyyy',
        longDate: 'dddd, MMMM d, yyyy',
        shortTime: 'h:mm tt',
        longTime: 'h:mm:ss tt',
      };

      it('formats short date with short time', () => {      
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 15, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, SHORT_DATE_TIME)).toBe('6/28/2020 3:40 PM');
      });

      it('formats short date with short time no year', () => {      
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 15, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, SHORT_DATE_TIME_NO_YEAR)).toBe('6/28 3:40 PM');
      });

      it('formats short date with short time and two digit hour', () => {      
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 5, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, SHORT_DATE_TIME)).toBe('6/28/2020 5:40 AM');
      });

      it('formats short date with short time, not year, and two digit hour', () => {      
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 5, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, SHORT_DATE_TIME_NO_YEAR)).toBe('6/28 5:40 AM');
      });

      it('formats short date with short time and one digit hour', () => {      
        const localeInfo = {
          platform: 'windows',
          regionalFormat: 'en-US',
          shortDate: 'M/d/yyyy',
          longDate: 'dddd, MMMM d, yyyy',
          shortTime: 'hh:mm tt',
          longTime: 'hh:mm:ss tt',
        };

        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 5, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, SHORT_DATE_TIME)).toBe('6/28/2020 05:40 AM');
      });

      it('formats short date with short time, not year, and one digit hour', () => {      
        const localeInfo = {
          platform: 'windows',
          regionalFormat: 'en-US',
          shortDate: 'M/d/yyyy',
          longDate: 'dddd, MMMM d, yyyy',
          shortTime: 'hh:mm tt',
          longTime: 'hh:mm:ss tt',
        };

        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 5, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, SHORT_DATE_TIME_NO_YEAR)).toBe('6/28 05:40 AM');
      });

      it('formats short date with long time', () => {
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 15, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, SHORT_DATE_LONG_TIME)).toBe('6/28/2020 3:40:25 PM');
      });

      it('long weekend with short time', () => {
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 15, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, LONG_WEEKDAY_SHORT_TIME)).toBe('Sunday, 3:40 PM');
      });

      it('long weekend with long time', () => {
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 15, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, LONG_WEEKDAY_LONG_TIME)).toBe('Sunday, 3:40:25 PM');
      });

      it('short weekend with short time', () => {
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 15, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, SHORT_WEEKDAY_SHORT_TIME)).toBe('Sun, 3:40 PM');
      });
      
      it('short weekend with long time', () => {
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 15, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, SHORT_WEEKDAY_LONG_TIME)).toBe('Sun, 3:40:25 PM');
      });

      it('combines short month and long month', () => {
        const localeInfo = {
          platform: 'windows',
          regionalFormat: 'en-US',
          shortDate: 'M/d/yyyy',
          longDate: 'd-dddd, M-MMMM d, yy-yyyy',
          shortTime: 'h:mm tt',
          longTime: 'h:mm:ss tt',
        };
    
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 1, 1, 12, 0, 0);
        expect(dateTimeFormatter.formatDateTime(date, LONG_DATE)).toBe('1-Saturday, 2-February 1, 20-2020');
      });

      it('Uses 0 for midnight', () => {
        const localeInfo = {
          platform: 'windows',
          regionalFormat: 'en-us',
          shortTime: 'H:mm',
        };
    
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 1, 1, 0, 15, 30);
        expect(dateTimeFormatter.formatDateTime(date, SHORT_TIME)).toBe('0:15');
      });

      it('long time with time zone', () => {
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 15, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, LONG_TIME_WITH_TIMEZONE)).toBe('3:40:25 PM UTC');
      });

      it('long date and time with time zone', () => {
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 15, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, LONG_WITH_TIMEZONE)).toBe('Sunday, June 28, 2020 3:40:25 PM UTC');
      });

      it('full date and time with year', () => {
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 15, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, FULL_WITH_YEAR)).toBe('Sunday, June 28, 2020 3:40:25 PM Coordinated Universal Time');
      });

      it('full', () => {
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 15, 40, 25);
        expect(dateTimeFormatter.formatDateTime(date, FULL)).toBe('Sunday, June 28, 2020 3:40:25 PM Coordinated Universal Time');
      });
    });

    describe('platform fallback', () => {
      const localeInfo = {
        platform: 'msdos',
        regionalFormat: 'en-US',
        shortDate: 'M/d/yyyy',
        longDate: 'dddd, MMMM d, yyyy',
        shortTime: 'h:mm tt',
        longTime: 'h:mm:ss tt',
      };

      it('falls back to windows for unknown platforms', () => {      
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);
        const date = new Date(2020, 5, 28, 15, 40, 25);
        const result = dateTimeFormatter.formatDateTime(date, SHORT_DATE_TIME);
        expect(result).toBe('6/28/2020 3:40 PM');
      });
    });
  });

  xdescribe('performance', () => {
    const localeInfo = {
      platform: 'windows',
      regionalFormat: 'en-US',
      shortDate: 'M/d/yyyy',
      longDate: 'dddd, MMMM d, yyyy',
      shortTime: 'h:mm tt',
      longTime: 'h:mm:ss tt',
    };

    it('is fast', () => {      
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      let result = '';
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        result = dateTimeFormatter.formatDateTime(date, SHORT_DATE_TIME);
      }
      const end = performance.now();
      expect(result).toBe('6/28/2020 3:40 PM');
      expect(end - start).toBe(0);
    });
  });
});
