/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const { DateTimeFormatter, LONG_DATE } = require('../dist/globe.cjs.development');

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
});
