/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import ILocaleInfo from "../ILocaleInfo";
// import { DateTimeFormatter } from "../date-time-formatter";
// import { SHORT_DATE } from "../date-time-format-options";

const { DateTimeFormatter, SHORT_DATE, LONG_DATE } = require('../../dist/globe.cjs.development');

describe('en-US Formatter', () => {
  describe('Mac default formatter', () => {
    // TODO: add each format type: Long/Short, Date/Time, Year/NoYear 
    // TODO: Add locale tests
    const date = new Date(2019, 7, 14, 22, 48, 32);
    let formatter; //: DateTimeFormatter;

    beforeAll(() => {
      formatter = new DateTimeFormatter("en-US");
    });

    it('formats en-US short date', () => {
      const result = formatter.formatDateTime(date, SHORT_DATE);

      expect(result).toBe('8/14');
    });
    it('formats en-US long date', () => {
      const result = formatter.formatDateTime(date, LONG_DATE);

      expect(result).toBe('August 14');
    });
    it('formats en-US short time', () => {});
    it('formats en-US long time', () => {});
  });

  describe('Mac ILocaleInfo formatter', () => {
    // TODO: add each format type: Long/Short, Date/Time, Year/NoYear 
    // TODO: Add locale tests
    const date = new Date(2020, 7, 14, 22, 48, 32);
    let localeInfo; //: ILocaleInfo;
    let formatter; //: DateTimeFormatter;

    beforeAll(() => {
      localeInfo = {
        platform: 'macos',
        regionalFormat: 'en-US',
        shortDate: 'dd/MM/y',
        longDate: 'd MMMM y',
        shortTime: 'HH:mm',
        longTime: 'HH:mm:ss',
      };

      formatter = new DateTimeFormatter(localeInfo);
    });

    it('formats en-US short date', () => {
      const result = formatter.formatDateTime(date, SHORT_DATE);

      expect(result).toBe('14/08/2020');
    });
    it('formats en-US long date', () => {
      const result = formatter.formatDateTime(date, LONG_DATE);

      expect(result).toBe('14 August 2020');
    });
    it('formats en-US short time', () => {});
    it('formats en-US long time', () => {});
  });
});