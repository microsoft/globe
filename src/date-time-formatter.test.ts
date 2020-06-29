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
  LONG_WEEKDAY_SHORT_TIME, 
  LONG_WEEKDAY_LONG_TIME,
  SHORT_WEEKDAY_LONG_TIME,
  SHORT_WEEKDAY_SHORT_TIME
} = require('../dist/globe.cjs.development');

describe('date-time-format-options', () => {
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

    it('formats short date with short time', () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(dateTimeFormatter.formatDateTime(date, SHORT_DATE_TIME)).toBe('6/28/20 3:40 PM');
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
