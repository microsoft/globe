/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
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
  MEDIUM_DATE_SHORT_TIME,
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
} from "./date-time-format-options";
import { DateTimeFormatter } from "./date-time-formatter";
import { RegionalSettingsPerLocale } from "./windows-regional-formats";

xdescribe("Windows Regional Formats >", () => {
  const formatsToTest: { [key: string]: any } = {
    SHORT,
    SHORT_WITH_YEAR,
    SHORT_TIME,
    SHORT_DATE,
    SHORT_DATE_WITH_YEAR,
    SHORT_DATE_WITH_SHORT_YEAR,
    SHORT_DATE_TIME,
    LONG_DATE,
    LONG_TIME_WITH_TIMEZONE,
    LONG_WITH_TIMEZONE,
    LONG_WITH_YEAR_TIMEZONE,
    SHORT_DATE_LONG_TIME,
    LONG_DATE_WITH_YEAR,
    LONG_TIME,
    LONG_WEEKDAY,
    SHORT_WEEKDAY,
    FULL_DATE_WITH_YEAR,
    FULL_DATE,
    FULL_TIME,
    FULL_WITH_YEAR,
    FULL,
    MEDIUM_TIME,
    MEDIUM_DATE,
    MEDIUM_DATE_WITH_YEAR,
    MEDIUM_WITH_YEAR,
    MEDIUM,
    MEDIUM_DATE_SHORT_TIME,
    HOUR_ONLY,
    LONG_WEEKDAY_SHORT_TIME,
    LONG_WEEKDAY_LONG_TIME,
    SHORT_WEEKDAY_SHORT_TIME,
    SHORT_WEEKDAY_LONG_TIME
  };
  const date = new Date(2020, 0, 15, 13, 30, 45);
  const regionalFormats = RegionalSettingsPerLocale;
  // list of windows supported regional formats
  regionalFormats.forEach(regionalFormat => {
    const locale = regionalFormat.Culture;
    Object.keys(formatsToTest).forEach((formatName: string) => {
      const format = formatsToTest[formatName];
      let localeBasedDateTimeFormat;
      let regionalBasedDateTimeFormat;
      try {
        const localeBasedDateTimeFormatter = new DateTimeFormatter(locale);
        localeBasedDateTimeFormat = localeBasedDateTimeFormatter.formatDateTime(
          date,
          format
        );
      } catch {
        localeBasedDateTimeFormat = "Not supported";
      }

      try {
        const regionalBasedDateTimeFormatter = new DateTimeFormatter({
          platform: "windows",
          regionalFormat: regionalFormat.Culture,
          shortDate: regionalFormat.ShortDateFormat,
          longDate: regionalFormat.LongDateFormat,
          shortTime: regionalFormat.ShortTimeFormat,
          longTime: regionalFormat.LongTimeFormat
        });
        regionalBasedDateTimeFormat = regionalBasedDateTimeFormatter.formatDateTime(
          date,
          format
        );
      } catch {
        regionalBasedDateTimeFormat = "Not supported";
      }

      test(`Locale based formatting ${locale} - ${formatName}`, () => {
        expect(localeBasedDateTimeFormat).toMatchSnapshot();
      });

      test(`Regional settings based formatting ${locale} - ${formatName}`, () => {
        expect(regionalBasedDateTimeFormat).toMatchSnapshot();
      });
    });
  });
});
