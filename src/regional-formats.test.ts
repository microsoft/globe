/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { describe, it, expect } from "vitest";
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
  SHORT_TIME_ZONE_NAME,
  SHORT_WEEKDAY,
  SHORT_WEEKDAY_LONG_TIME,
  SHORT_WEEKDAY_SHORT_TIME,
  SHORT_WITH_YEAR,
} from "./date-time-format-options";
import { DateTimeFormatter } from "./date-time-formatter";
import {
  WindowsRegionalSettingsPerLocale,
  CldrRegionalSettingsPerLocale,
} from "./regional-formats";

const supportedLocales = [
  "ar-sa",
  "az-latn-az",
  "bg-bg",
  "ca-es",
  "ca-es-valencia",
  "cs-cz",
  "cy-gb",
  "da-dk",
  "de-at",
  "de-ch",
  "de-de",
  "de-li",
  "de-lu",
  "en-029",
  "en-au",
  "en-bz",
  "en-ca",
  "en-gb",
  "en-ie",
  "en-in",
  "en-jm",
  "en-my",
  "en-nz",
  "en-ph",
  "en-sg",
  "en-tt",
  "en-us",
  "en-za",
  "en-zw",
  "es-ar",
  "es-bo",
  "es-cl",
  "es-co",
  "es-cr",
  "es-do",
  "es-ec",
  "es-es",
  "es-gt",
  "es-hn",
  "es-mx",
  "es-ni",
  "es-pa",
  "es-pe",
  "es-pr",
  "es-py",
  "es-sv",
  "es-us",
  "es-uy",
  "es-ve",
  "et-ee",
  "fi-fi",
  "fil-ph",
  "fr-be",
  "fr-ca",
  "fr-ch",
  "fr-fr",
  "fr-lu",
  "fr-mc",
  "gl-es",
  "he-il",
  "hi-in",
  "hr-hr",
  "hu-hu",
  "id-id",
  "is-is",
  "it-ch",
  "it-it",
  "ja-jp",
  "ka-ge",
  "kk-kz",
  "ko-kr",
  "lt-lt",
  "lv-lv",
  "mk-mk",
  "nb-no",
  "nl-be",
  "nl-nl",
  "nn-no",
  "pl-pl",
  "pt-br",
  "pt-pt",
  "ro-ro",
  "ru-ru",
  "sk-sk",
  "sl-si",
  "sq-al",
  "sr-latn-rs",
  "sv-fi",
  "sv-se",
  "th-th",
  "tr-tr",
  "uk-ua",
  "vi-vn",
  "zh-cn",
  "zh-hk",
  "zh-mo",
  "zh-sg",
  "zh-tw",
];
const formatsToTest: { [key: string]: any } = {
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
  SHORT_TIME_ZONE_NAME,
  SHORT_WEEKDAY,
  SHORT_WEEKDAY_LONG_TIME,
  SHORT_WEEKDAY_SHORT_TIME,
  SHORT_WITH_YEAR,
};

describe.skip("Windows Regional Formats", () => {
  const date = new Date(2020, 0, 15, 13, 30, 45);
  supportedLocales.forEach(locale => {
    const regionalFormat = WindowsRegionalSettingsPerLocale.filter(
      regionalFormat =>
        regionalFormat.Culture.toLocaleLowerCase() ===
        locale.toLocaleLowerCase()
    )[0];

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
          longTime: regionalFormat.LongTimeFormat,
        });
        regionalBasedDateTimeFormat =
          regionalBasedDateTimeFormatter.formatDateTime(date, format);
      } catch {
        regionalBasedDateTimeFormat = "Not supported";
      }
      it(`Locale based formatting ${locale} - ${formatName}`, () => {
        expect(localeBasedDateTimeFormat).toMatchSnapshot();
      });

      it(`Regional settings based formatting ${locale} - ${formatName}`, () => {
        expect(regionalBasedDateTimeFormat).toMatchSnapshot();
      });
    });
  });
});

describe.skip("Cldr Regional Formats", () => {
  const date = new Date(2020, 0, 15, 13, 30, 45);
  supportedLocales.forEach(locale => {
    const regionalFormat = CldrRegionalSettingsPerLocale.filter(
      regionalFormat =>
        regionalFormat.Culture.toLocaleLowerCase() ===
        locale.toLocaleLowerCase()
    )[0];

    Object.keys(formatsToTest).forEach((formatName: string) => {
      const format = formatsToTest[formatName];
      let regionalBasedDateTimeFormat;

      try {
        const regionalBasedDateTimeFormatter = new DateTimeFormatter({
          platform: "macos",
          regionalFormat: regionalFormat.Culture,
          shortDate: regionalFormat.ShortDateFormat,
          longDate: regionalFormat.LongDateFormat,
          shortTime: regionalFormat.ShortTimeFormat,
          longTime: regionalFormat.LongTimeFormat,
        });
        regionalBasedDateTimeFormat =
          regionalBasedDateTimeFormatter.formatDateTime(date, format);
      } catch {
        regionalBasedDateTimeFormat = "Not supported";
      }

      it(`Regional settings based formatting ${locale} - ${formatName}`, () => {
        expect(regionalBasedDateTimeFormat).toMatchSnapshot();
      });
    });
  });
});
