/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const { DateTimeFormatter } = require('../dist/globe.cjs.development');
describe('date-time-format-options', () => {
  it('constructs without throwing', () => {
    expect(() => new DateTimeFormatter('en-US', true, undefined, undefined, undefined)).not.toThrow();
  });

  it('formats a date', () => {
    const dateTimeFormatter = new DateTimeFormatter('en-US', true, undefined, undefined, undefined);
    const date = new Date(2020, 1, 1, 12, 0, 0);
    expect(dateTimeFormatter.formatDateTime(date)).toBe('2/1/2020');
  });
});
