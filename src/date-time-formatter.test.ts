/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { describe, it, expect } from "vitest";
import {
  FULL,
  FULL_TIME,
  FULL_WITH_YEAR,
  HOUR_ONLY,
  LONG_DATE,
  LONG_TIME,
  LONG_TIME_WITH_TIMEZONE,
  LONG_WEEKDAY_LONG_TIME,
  LONG_WEEKDAY_SHORT_TIME,
  LONG_WITH_TIMEZONE,
  MEDIUM_DATE_SHORT_TIME,
  SHORT,
  SHORT_DATE,
  SHORT_DATE_LONG_TIME,
  SHORT_DATE_TIME,
  SHORT_DATE_WITH_YEAR,
  SHORT_TIME,
  SHORT_WEEKDAY_LONG_TIME,
  SHORT_WEEKDAY_SHORT_TIME,
  SHORT_WITH_YEAR,
} from "./date-time-format-options";
import { DateTimeFormatter } from "./date-time-formatter";
import { ILocaleInfo } from "./ILocaleInfo";

describe("date-time-format-options", () => {
  describe("functionality", () => {
    it("constructs without throwing", () => {
      expect(() => new DateTimeFormatter("en-US")).not.toThrow();
    });

    it("formats a date using a locale string", () => {
      const dateTimeFormatter = new DateTimeFormatter("en-US");
      const date = new Date(2020, 1, 1, 12, 0, 0);
      expect(dateTimeFormatter.formatDateTime(date, SHORT_DATE_WITH_YEAR)).toBe(
        "2/1/2020"
      );
    });

    it("formats a date using ILocaleInfo", () => {
      const localeInfo = {
        platform: "macos",
        regionalFormat: "en-US",
        shortDate: "dd/MM/y",
        longDate: "d MMMM y",
        shortTime: "HH:mm",
      } as ILocaleInfo;

      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 1, 1, 12, 0, 0);
      expect(dateTimeFormatter.formatDateTime(date, LONG_DATE)).toBe(
        "1 February 2020"
      );
    });
  });

  describe("Quotes", () => {
    const localeInfo = {
      platform: "macos",
      regionalFormat: "en-US",
      shortDate: "dd'd'MM'MM' y 'yyyy'",
      longDate: "'d'd'MMMM'MMMM'y'y",
      shortTime: "''HH:mm''",
    } as ILocaleInfo;

    const dateTimeFormatter = new DateTimeFormatter(localeInfo);
    const date = new Date(2020, 1, 1, 12, 0, 0);

    it("respects quotes after symbols", () => {
      expect(dateTimeFormatter.formatDateTime(date, SHORT_DATE)).toBe(
        "01d02MM 2020 yyyy"
      );
    });

    it("respects quotes before symbols", () => {
      expect(dateTimeFormatter.formatDateTime(date, LONG_DATE)).toBe(
        "d1MMMMFebruaryy2020"
      );
    });

    it("transforms double quotes to single", () => {
      expect(dateTimeFormatter.formatDateTime(date, SHORT_TIME)).toBe(
        "'12:00'"
      );
    });

    it("handles unpaired quote at the beginning", () => {
      const localeInfo = {
        platform: "macos",
        regionalFormat: "en-US",
        longTime: "'HH:mm",
      } as ILocaleInfo;
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);

      expect(dateTimeFormatter.formatDateTime(date, LONG_TIME)).toBe("");
    });

    it("handles unpaired quote at the end", () => {
      const localeInfo = {
        platform: "macos",
        regionalFormat: "en-US",
        longTime: "HH:mm'",
      } as ILocaleInfo;
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);

      expect(dateTimeFormatter.formatDateTime(date, LONG_TIME)).toBe("12:00");
    });

    it("handles unpaired quote in the middle", () => {
      const localeInfo = {
        platform: "macos",
        regionalFormat: "en-US",
        longTime: "HH:m'm",
      } as ILocaleInfo;
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);

      expect(dateTimeFormatter.formatDateTime(date, LONG_TIME)).toBe("12:0");
    });
  });

  describe("Mac", () => {
    const localeInfo = {
      platform: "macos",
      regionalFormat: "en-US",
      shortDate: "M/d/yy",
      longDate: "MMMM d, y",
      fullDate: "EEEE MMMM d, y",
      shortTime: "h:mm a",
      longTime: "h:mm:ss a",
    } as ILocaleInfo;

    it("uses mac 12 hour format", () => {
      const localeInfo = {
        platform: "macos",
        regionalFormat: "en-US",
        shortTime: "h:mm a",
      } as ILocaleInfo;
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 1, 1, 15, 0, 0);
      expect(dateTimeFormatter.formatDateTime(date, HOUR_ONLY)).toBe("3 PM");
    });

    it("uses mac 24 hour format", () => {
      const localeInfo = {
        platform: "macos",
        regionalFormat: "en-US",
        shortTime: "HH:mm",
      } as ILocaleInfo;
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 1, 1, 15, 0, 0);
      expect(dateTimeFormatter.formatDateTime(date, HOUR_ONLY)).toBe("15");
    });

    it("uses mac k format", () => {
      const localeInfo = {
        platform: "macos",
        regionalFormat: "en-US",
        shortTime: "k:mm",
        longTime: "kk:mm",
      } as ILocaleInfo;
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 1, 1, 0, 0, 0);
      expect(dateTimeFormatter.formatDateTime(date, SHORT_TIME)).toBe("24:00");
      expect(dateTimeFormatter.formatDateTime(date, LONG_TIME)).toBe("24:00");
    });

    it("uses mac K format", () => {
      const localeInfo = {
        platform: "macos",
        regionalFormat: "en-US",
        shortTime: "K:mm a",
        longTime: "KK:mm a",
      } as ILocaleInfo;
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 1, 1, 0, 0, 0);
      expect(dateTimeFormatter.formatDateTime(date, SHORT_TIME)).toBe(
        "0:00 AM"
      );
      expect(dateTimeFormatter.formatDateTime(date, LONG_TIME)).toBe(
        "00:00 AM"
      );
    });

    it("uses mac B format", () => {
      const localeInfo = {
        platform: "macos",
        regionalFormat: "zh-Hant-Tw",
        shortTime: "Bh:mm",
        longTime: "Bh:mm",
      } as ILocaleInfo;
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const dateAM = new Date(2020, 1, 1, 11, 39, 0);
      expect(dateTimeFormatter.formatDateTime(dateAM, SHORT_TIME)).toBe(
        "上午11:39"
      );
      expect(dateTimeFormatter.formatDateTime(dateAM, LONG_TIME)).toBe(
        "上午11:39"
      );
      const datePM = new Date(2020, 1, 1, 15, 39, 0);
      expect(dateTimeFormatter.formatDateTime(datePM, SHORT_TIME)).toBe(
        "下午3:39"
      );
      expect(dateTimeFormatter.formatDateTime(datePM, LONG_TIME)).toBe(
        "下午3:39"
      );
    });

    it("uses mac b format", () => {
      const localeInfo = {
        platform: "macos",
        regionalFormat: "zh-Hant-Tw",
        shortTime: "bh:mm",
        longTime: "bh:mm",
      } as ILocaleInfo;
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const dateAM = new Date(2020, 1, 1, 11, 39, 0);
      expect(dateTimeFormatter.formatDateTime(dateAM, SHORT_TIME)).toBe(
        "上午11:39"
      );
      expect(dateTimeFormatter.formatDateTime(dateAM, LONG_TIME)).toBe(
        "上午11:39"
      );
      const datePM = new Date(2020, 1, 1, 15, 39, 0);
      expect(dateTimeFormatter.formatDateTime(datePM, SHORT_TIME)).toBe(
        "下午3:39"
      );
      expect(dateTimeFormatter.formatDateTime(datePM, LONG_TIME)).toBe(
        "下午3:39"
      );
    });

    it("uses time zone in mask correctly", () => {
      const localeInfo = {
        platform: "macos",
        regionalFormat: "en-US",
        longTime: "h:mm a x",
      } as ILocaleInfo;
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 1, 1, 15, 0, 0);
      expect(dateTimeFormatter.formatDateTime(date, FULL_TIME)).toBe(
        "3:00 PM UTC"
      );
    });

    it("formats short date with short time", () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(dateTimeFormatter.formatDateTime(date, SHORT_DATE_TIME)).toBe(
        "6/28/20 3:40 PM"
      );
    });

    it("formats short", () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(dateTimeFormatter.formatDateTime(date, SHORT)).toBe(
        "6/28/20 3:40 PM"
      );
    });

    it("formats short with year", () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(dateTimeFormatter.formatDateTime(date, SHORT_WITH_YEAR)).toBe(
        "6/28/20 3:40 PM"
      );
    });

    it("formats short date with long time", () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(dateTimeFormatter.formatDateTime(date, SHORT_DATE_LONG_TIME)).toBe(
        "6/28/20 3:40:25 PM"
      );
    });

    it("long weekend with short time", () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(
        dateTimeFormatter.formatDateTime(date, LONG_WEEKDAY_SHORT_TIME)
      ).toBe("Sunday, 3:40 PM");
    });

    it("long weekend with long time", () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(
        dateTimeFormatter.formatDateTime(date, LONG_WEEKDAY_LONG_TIME)
      ).toBe("Sunday, 3:40:25 PM");
    });

    it("short weekend with short time", () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(
        dateTimeFormatter.formatDateTime(date, SHORT_WEEKDAY_SHORT_TIME)
      ).toBe("Sun, 3:40 PM");
    });

    it("short weekend with long time", () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(
        dateTimeFormatter.formatDateTime(date, SHORT_WEEKDAY_LONG_TIME)
      ).toBe("Sun, 3:40:25 PM");
    });

    it("medium date with short time", () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(
        dateTimeFormatter.formatDateTime(date, MEDIUM_DATE_SHORT_TIME)
      ).toBe("Jun 28, 3:40 PM");
    });

    it("removes unsupported symbols", () => {
      const localeInfo = {
        platform: "macos",
        regionalFormat: "en-US",
        shortTime: "llwwWWDDFFggUUqqQQh:mm a",
      } as ILocaleInfo;
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 1, 1, 15, 0, 0);
      expect(dateTimeFormatter.formatDateTime(date, HOUR_ONLY)).toBe("3 PM");
    });

    it("long time with time zone", () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(
        dateTimeFormatter.formatDateTime(date, LONG_TIME_WITH_TIMEZONE)
      ).toBe("3:40:25 PM UTC");
    });

    it("long date and time with time zone", () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(dateTimeFormatter.formatDateTime(date, LONG_WITH_TIMEZONE)).toBe(
        "June 28, 2020 3:40:25 PM UTC"
      );
    });

    it("full date and time with year", () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(dateTimeFormatter.formatDateTime(date, FULL_WITH_YEAR)).toBe(
        "Sunday June 28, 2020 3:40:25 PM Coordinated Universal Time"
      );
    });

    it("full date and time with year (long fallback)", () => {
      const dateTimeFormatter = new DateTimeFormatter({
        ...localeInfo,
        fullDate: null,
      } as any as ILocaleInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(dateTimeFormatter.formatDateTime(date, FULL_WITH_YEAR)).toBe(
        "June 28, 2020 3:40:25 PM Coordinated Universal Time"
      );
    });

    it("full", () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(dateTimeFormatter.formatDateTime(date, FULL)).toBe(
        "Sunday June 28, 2020 3:40:25 PM Coordinated Universal Time"
      );
    });

    it("full (long fallback", () => {
      const dateTimeFormatter = new DateTimeFormatter({
        ...localeInfo,
        fullDate: null,
      } as any as ILocaleInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(dateTimeFormatter.formatDateTime(date, FULL)).toBe(
        "June 28, 2020 3:40:25 PM Coordinated Universal Time"
      );
    });
  });

  describe("Mac hours", () => {
    const midnight = new Date(2020, 1, 1, 0, 15, 0);
    const noon = new Date(2020, 1, 1, 12, 15, 0);

    const testMacHours = (
      symbol: string,
      expectedMidnight: string,
      expectedNoon: string,
      includeA?: boolean
    ) => {
      it(`Symbol ${symbol}`, () => {
        const localeInfo = {
          platform: "macos",
          regionalFormat: "sk-sk",
          shortTime: `${symbol}:mm${includeA ? " a" : ""}`,
          longTime: `${symbol}${symbol}:mm${includeA ? " a" : ""}`,
        } as ILocaleInfo;
        const dateTimeFormatter = new DateTimeFormatter(localeInfo);

        const ensureLong = (t: string) =>
          t.length === 4 || t.length === 7 ? `0${t}` : t;
        const m = (t: string) => `midnight ${t}`;
        const n = (t: string) => `noon ${t}`;

        expect(m(dateTimeFormatter.formatDateTime(midnight, SHORT_TIME))).toBe(
          m(expectedMidnight)
        );
        expect(m(dateTimeFormatter.formatDateTime(midnight, LONG_TIME))).toBe(
          m(ensureLong(expectedMidnight))
        );
        expect(n(dateTimeFormatter.formatDateTime(noon, SHORT_TIME))).toBe(
          n(expectedNoon)
        );
        expect(n(dateTimeFormatter.formatDateTime(noon, LONG_TIME))).toBe(
          n(ensureLong(expectedNoon))
        );
      });
    };

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/hourCycle
    testMacHours("h", "12:15 AM", "12:15 PM", true); //h12
    testMacHours("H", "0:15", "12:15", false); //h23
    testMacHours("K", "0:15 AM", "0:15 PM", true); //h11
    testMacHours("k", "24:15", "12:15", false); //h24
  });

  describe("Windows", () => {
    const localeInfo = {
      platform: "windows",
      regionalFormat: "en-US",
      shortDate: "M/d/yyyy",
      longDate: "dddd, MMMM d, yyyy",
      shortTime: "h:mm tt",
      longTime: "h:mm:ss tt",
    } as ILocaleInfo;

    it("formats short date with short time", () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(dateTimeFormatter.formatDateTime(date, SHORT_DATE_TIME)).toBe(
        "6/28/2020 3:40 PM"
      );
    });

    it("formats short date with short time and two digit hour", () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 5, 40, 25);
      expect(dateTimeFormatter.formatDateTime(date, SHORT_DATE_TIME)).toBe(
        "6/28/2020 5:40 AM"
      );
    });

    it("formats short date with short time and one digit hour", () => {
      const localeInfo = {
        platform: "windows",
        regionalFormat: "en-US",
        shortDate: "M/d/yyyy",
        longDate: "dddd, MMMM d, yyyy",
        shortTime: "hh:mm tt",
        longTime: "hh:mm:ss tt",
      } as ILocaleInfo;

      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 5, 40, 25);
      expect(dateTimeFormatter.formatDateTime(date, SHORT_DATE_TIME)).toBe(
        "6/28/2020 05:40 AM"
      );
    });

    it("formats short date with long time", () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(dateTimeFormatter.formatDateTime(date, SHORT_DATE_LONG_TIME)).toBe(
        "6/28/2020 3:40:25 PM"
      );
    });

    it("long weekend with short time", () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(
        dateTimeFormatter.formatDateTime(date, LONG_WEEKDAY_SHORT_TIME)
      ).toBe("Sunday, 3:40 PM");
    });

    it("long weekend with long time", () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(
        dateTimeFormatter.formatDateTime(date, LONG_WEEKDAY_LONG_TIME)
      ).toBe("Sunday, 3:40:25 PM");
    });

    it("short weekend with short time", () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(
        dateTimeFormatter.formatDateTime(date, SHORT_WEEKDAY_SHORT_TIME)
      ).toBe("Sun, 3:40 PM");
    });

    it("short weekend with long time", () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(
        dateTimeFormatter.formatDateTime(date, SHORT_WEEKDAY_LONG_TIME)
      ).toBe("Sun, 3:40:25 PM");
    });

    it("medium date with short time", () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(
        dateTimeFormatter.formatDateTime(date, MEDIUM_DATE_SHORT_TIME)
      ).toBe("Jun 28, 3:40 PM");
    });

    it("combines short month and long month", () => {
      const localeInfo = {
        platform: "windows",
        regionalFormat: "en-US",
        shortDate: "M/d/yyyy",
        longDate: "d-dddd, M-MMMM d, yy-yyyy",
        shortTime: "h:mm tt",
        longTime: "h:mm:ss tt",
      } as ILocaleInfo;

      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 1, 1, 12, 0, 0);
      expect(dateTimeFormatter.formatDateTime(date, LONG_DATE)).toBe(
        "1-Saturday, 2-February 1, 20-2020"
      );
    });

    it("Uses 0 for midnight", () => {
      const localeInfo = {
        platform: "windows",
        regionalFormat: "en-us",
        shortTime: "H:mm",
      } as ILocaleInfo;

      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 1, 1, 0, 15, 30);
      expect(dateTimeFormatter.formatDateTime(date, SHORT_TIME)).toBe("0:15");
    });

    it("long time with time zone", () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(
        dateTimeFormatter.formatDateTime(date, LONG_TIME_WITH_TIMEZONE)
      ).toBe("3:40:25 PM UTC");
    });

    it("long date and time with time zone", () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(dateTimeFormatter.formatDateTime(date, LONG_WITH_TIMEZONE)).toBe(
        "Sunday, June 28, 2020 3:40:25 PM UTC"
      );
    });

    it("full date and time with year", () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(dateTimeFormatter.formatDateTime(date, FULL_WITH_YEAR)).toBe(
        "Sunday, June 28, 2020 3:40:25 PM Coordinated Universal Time"
      );
    });

    it("full", () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      expect(dateTimeFormatter.formatDateTime(date, FULL)).toBe(
        "Sunday, June 28, 2020 3:40:25 PM Coordinated Universal Time"
      );
    });
  });

  describe("platform fallback", () => {
    const localeInfo = {
      platform: "msdos",
      regionalFormat: "en-US",
      shortDate: "M/d/yyyy",
      longDate: "dddd, MMMM d, yyyy",
      shortTime: "h:mm tt",
      longTime: "h:mm:ss tt",
    } as any as ILocaleInfo;

    it("falls back to windows for unknown platforms", () => {
      const dateTimeFormatter = new DateTimeFormatter(localeInfo);
      const date = new Date(2020, 5, 28, 15, 40, 25);
      const result = dateTimeFormatter.formatDateTime(date, SHORT_DATE_TIME);
      expect(result).toBe("6/28/2020 3:40 PM");
    });
  });
});
