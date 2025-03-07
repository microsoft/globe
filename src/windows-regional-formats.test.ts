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
  SHORT_WEEKDAY,
  SHORT_WEEKDAY_LONG_TIME,
  SHORT_WEEKDAY_SHORT_TIME,
  SHORT_WITH_YEAR,
} from "./date-time-format-options";
import { DateTimeFormatter } from "./date-time-formatter";
import { RegionalSettingsPerLocale } from "./windows-regional-formats";

describe("Windows Regional Formats", () => {
  // const supportedLocales = [
  //   "ar-sa",
  //   "az-latn-az",
  //   "bg-bg",
  //   "ca-es",
  //   "ca-es-valencia",
  //   "cs-cz",
  //   "cy-gb",
  //   "da-dk",
  //   "de-at",
  //   "de-de",
  //   "de-li",
  //   "de-lu",
  //   "de-ch",
  //   "nl-be",
  //   "nl-nl",
  //   "en-au",
  //   "en-bz",
  //   "en-ca",
  //   "en-029",
  //   "en-in",
  //   "en-ie",
  //   "en-jm",
  //   "en-my",
  //   "en-nz",
  //   "en-ph",
  //   "en-sg",
  //   "en-za",
  //   "en-tt",
  //   "en-gb",
  //   "en-us",
  //   "en-zw",
  //   "et-ee",
  //   "fi-fi",
  //   "fil-ph",
  //   "fr-be",
  //   "fr-ca",
  //   "fr-fr",
  //   "fr-lu",
  //   "fr-mc",
  //   "fr-ch",
  //   "gl-es",
  //   "ka-ge",
  //   "he-il",
  //   "hi-in",
  //   "hr-hr",
  //   "hu-hu",
  //   "is-is",
  //   "id-id",
  //   "it-it",
  //   "it-ch",
  //   "ja-jp",
  //   "kk-kz",
  //   "ko-kr",
  //   "lv-lv",
  //   "lt-lt",
  //   "mk-mk",
  //   "nb-no",
  //   "nn-no",
  //   "pl-pl",
  //   "pt-br",
  //   "pt-pt",
  //   "ro-ro",
  //   "ru-ru",
  //   "sq-al",
  //   "sr-latn-rs",
  //   "sk-sk",
  //   "sl-si",
  //   "es-ar",
  //   "es-ve",
  //   "es-bo",
  //   "es-cl",
  //   "es-co",
  //   "es-cr",
  //   "es-do",
  //   "es-ec",
  //   "es-sv",
  //   "es-gt",
  //   "es-hn",
  //   "es-mx",
  //   "es-ni",
  //   "es-py",
  //   "es-pa",
  //   "es-pe",
  //   "es-pr",
  //   "es-es",
  //   "es-us",
  //   "es-uy",
  //   "sv-fi",
  //   "sv-se",
  //   "th-th",
  //   "tr-tr",
  //   "uk-ua",
  //   "vi-vn",
  //   "zh-cn",
  //   "zh-sg",
  //   "zh-hk",
  //   "zh-mo",
  //   "zh-tw",
  // ];
  const supportedLocales = ["es-es", "ro-ro"];
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
    SHORT_WEEKDAY_LONG_TIME,
  };
  const date = new Date(2020, 0, 15, 13, 30, 45);
  supportedLocales.forEach(locale => {
    const regionalFormat = RegionalSettingsPerLocale.filter(
      regionalFormat =>
        regionalFormat.Culture.toLocaleLowerCase() ===
        locale.toLocaleLowerCase()
    )[0];

    // let localeBasedDateTimeFormat;
    let regionalBasedDateTimeFormatter: DateTimeFormatter | undefined;
    // try {
    //   const localeBasedDateTimeFormatter = new DateTimeFormatter(locale);
    //   localeBasedDateTimeFormat = localeBasedDateTimeFormatter.formatDateTime(
    //     date,
    //     format
    //   );
    // } catch {
    //   localeBasedDateTimeFormat = "Not supported";
    // }

    try {
      regionalBasedDateTimeFormatter = new DateTimeFormatter({
        platform: "windows",
        regionalFormat: regionalFormat.Culture,
        shortDate: regionalFormat.ShortDateFormat,
        longDate: regionalFormat.LongDateFormat,
        shortTime: regionalFormat.ShortTimeFormat,
        longTime: regionalFormat.LongTimeFormat,
      });
    } catch {
      console.log(`Regional settings not supported for ${locale}`);
    }
    // it(`Locale based formatting ${locale} - ${formatName}`, () => {
    //   expect(localeBasedDateTimeFormat).toMatchSnapshot();
    // });

    Object.keys(formatsToTest).forEach((formatName: string) => {
      const format = formatsToTest[formatName];

      it(`Regional settings based formatting ${locale} - ${formatName}`, () => {
        const regionalBasedDateTimeFormat = regionalBasedDateTimeFormatter
          ? regionalBasedDateTimeFormatter.formatDateTime(date, format)
          : "Not supported";
        expect(regionalBasedDateTimeFormat).toMatchSnapshot();
      });
    });
  });
});
