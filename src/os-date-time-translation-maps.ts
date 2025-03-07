/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

type IDateTimeFormatPartKeys =
  | keyof Intl.DateTimeFormatOptions
  | "dayperiod" // Chromium bug going to be fixed in Electron 5
  | "dayPeriod";

interface ITranslationItem {
  symbol: string | string[];
  intl: {
    options: Intl.DateTimeFormatOptions;
    part: IDateTimeFormatPartKeys | IDateTimeFormatPartKeys[];
  };
}

interface ITranslationMap {
  [key: string]: ITranslationItem;
}

interface IPlatformUnsupportedMask {
  [key: string]: RegExp[];
}

interface ITranslationMaps {
  [os: string]: ITranslationMap;
}

export const intlToDateFns = {
  day: {
    numeric: "d",
    "2-digit": "dd",
  },
  weekday: {
    narrow: "EEEEEE",
    short: "E",
    long: "EEEE",
  },
  month: {
    numeric: "M",
    narrow: "MMMMM",
    "2-digit": "MM",
    short: "MMM",
    long: "MMMM",
  },
  year: {
    numeric: "y",
    "2-digit": "yy",
  },
  era: {
    narrow: "GGGGG",
    short: "GG",
    long: "GGGG",
  },
  // TODO: add 12/24 hour
  hour: {
    numeric: "H",
    "2-digit": "HH",
  },
  minute: {
    numeric: "m",
    "2-digit": "mm",
  },
  second: {
    numeric: "s",
    "2-digit": "ss",
  },
  timeZoneName: {
    short: "zzz",
    long: "zzzz",
  },
  dayPeriod: {
    hour12: "a",
  },
  dayperiod: {
    hour12: "a",
  },
};

const windowsTime: ITranslationMap = {
  hh: {
    symbol: "hh",
    intl: {
      options: {
        // hour12: true,
        hourCycle: "h12",
        hour: "2-digit",
      } as Intl.DateTimeFormatOptions,
      part: "hour",
    },
  },
  h: {
    symbol: "h",
    intl: {
      options: {
        // hour12: true,
        hourCycle: "h12",
        hour: "numeric",
      } as Intl.DateTimeFormatOptions,
      part: "hour",
    },
  },
  HH: {
    symbol: "HH",
    intl: {
      options: {
        // hour12: false,
        hourCycle: "h23",
        hour: "2-digit",
      } as Intl.DateTimeFormatOptions,
      part: "hour",
    },
  },
  H: {
    symbol: "H",
    intl: {
      options: {
        // hour12: false,
        hourCycle: "h23",
        hour: "numeric",
      } as Intl.DateTimeFormatOptions,
      part: "hour",
    },
  },
  mm: {
    symbol: "mm",
    intl: {
      options: {
        minute: "2-digit",
      },
      part: "minute",
    },
  },
  m: {
    symbol: "m",
    intl: {
      options: {
        minute: "numeric",
      },
      part: "minute",
    },
  },
  ss: {
    symbol: "ss",
    intl: {
      options: {
        second: "2-digit",
      },
      part: "second",
    },
  },
  s: {
    symbol: "s",
    intl: {
      options: {
        second: "numeric",
      },
      part: "second",
    },
  },
  period: {
    symbol: ["t", "tt"],
    intl: {
      options: {
        hour12: true,
        hour: "numeric",
      },
      part: ["dayPeriod", "dayperiod"],
    },
  },
};

const macTime: ITranslationMap = {
  a: {
    symbol: "a",
    intl: {
      options: {
        hour12: true,
        hour: "numeric",
      },
      part: ["dayPeriod", "dayperiod"],
    },
  },
  // we should use hourCycle https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/hourCycle
  // but for now it is not working consistently across varous versions of Electron and Node
  h: {
    symbol: "h",
    intl: {
      options: {
        // hour12: true,
        hourCycle: "h12",
        hour: "numeric",
      } as Intl.DateTimeFormatOptions,
      part: "hour",
    },
  },
  hh: {
    symbol: "hh",
    intl: {
      options: {
        // hour12: true,
        hourCycle: "h12",
        hour: "2-digit",
      } as Intl.DateTimeFormatOptions,
      part: "hour",
    },
  },
  H: {
    symbol: "H",
    intl: {
      options: {
        // hour12: false,
        hourCycle: "h23",
        hour: "numeric",
      } as Intl.DateTimeFormatOptions,
      part: "hour",
    },
  },
  HH: {
    symbol: "HH",
    intl: {
      options: {
        // hour12: false,
        hourCycle: "h23",
        hour: "2-digit",
      } as Intl.DateTimeFormatOptions,
      part: "hour",
    },
  },
  k: {
    symbol: "k",
    intl: {
      options: {
        hour: "numeric",
        hourCycle: "h24",
        // hour12: false,
      } as Intl.DateTimeFormatOptions,
      part: "hour",
    },
  },
  kk: {
    symbol: "kk",
    intl: {
      options: {
        hour: "2-digit",
        // hour12: false,
        hourCycle: "h24",
      } as Intl.DateTimeFormatOptions,
      part: "hour",
    },
  },
  K: {
    symbol: "K",
    intl: {
      options: {
        hour: "numeric",
        hourCycle: "h11",
        // hour12: true,
      } as Intl.DateTimeFormatOptions,
      part: "hour",
    },
  },
  KK: {
    symbol: "KK",
    intl: {
      options: {
        hour: "2-digit",
        hourCycle: "h11",
        // hour12: true,
      } as Intl.DateTimeFormatOptions,
      part: "hour",
    },
  },
  m: {
    symbol: "m",
    intl: {
      options: {
        minute: "numeric",
      },
      part: "minute",
    },
  },
  mm: {
    symbol: "mm",
    intl: {
      options: {
        minute: "2-digit",
      },
      part: "minute",
    },
  },
  s: {
    symbol: "s",
    intl: {
      options: {
        second: "numeric",
      },
      part: "second",
    },
  },
  ss: {
    symbol: "ss",
    intl: {
      options: {
        second: "2-digit",
      },
      part: "second",
    },
  },
  "zone-short": {
    symbol: [
      "x",
      "xx",
      "xxx",
      "xxxx",
      "xxxxx",
      "X",
      "XX",
      "XXX",
      "XXXX",
      "XXXXX",
      "z",
      "zz",
      "zzz",
      "Z",
      "ZZ",
      "ZZZ",
      "ZZZZ",
      "ZZZZZ",
      "O",
      "OOOO",
    ],
    intl: {
      options: {
        timeZoneName: "short",
      },
      part: "timeZoneName",
    },
  },
  "zone-long": {
    symbol: ["zzzz", "v", "vvvv", "V", "VV", "VVV", "VVVV"],
    intl: {
      options: {
        timeZoneName: "long",
      },
      part: "timeZoneName",
    },
  },
};

const timeTranslationMaps: ITranslationMaps = {};
timeTranslationMaps.windows = windowsTime;
timeTranslationMaps.macos = macTime;

const windowsDate: ITranslationMap = {
  d: {
    symbol: "d",
    intl: {
      options: {
        day: "numeric",
      },
      part: "day",
    },
  },
  dd: {
    symbol: "dd",
    intl: {
      options: {
        day: "2-digit",
      },
      part: "day",
    },
  },
  ddd: {
    symbol: "ddd",
    intl: {
      options: {
        weekday: "short",
      },
      part: "weekday",
    },
  },
  dddd: {
    symbol: "dddd",
    intl: {
      options: {
        weekday: "long",
      },
      part: "weekday",
    },
  },
  M: {
    symbol: "M",
    intl: {
      options: {
        month: "numeric",
      },
      part: "month",
    },
  },
  MM: {
    symbol: "MM",
    intl: {
      options: {
        month: "2-digit",
      },
      part: "month",
    },
  },
  MMM: {
    symbol: "MMM",
    intl: {
      options: {
        month: "short",
      },
      part: "month",
    },
  },
  MMMM: {
    symbol: "MMMM",
    intl: {
      options: {
        month: "long",
      },
      part: "month",
    },
  },
  "year-short": {
    symbol: ["y", "yy"],
    intl: {
      options: {
        year: "2-digit",
      },
      part: "year",
    },
  },
  "year-long": {
    symbol: ["yyyy", "yyyyy"],
    intl: {
      options: {
        year: "numeric",
      },
      part: "year",
    },
  },
  era: {
    symbol: ["g", "gg"],
    intl: {
      options: {
        era: "narrow",
      },
      part: "era",
    },
  },
};

const macDate: ITranslationMap = {
  "era-short": {
    symbol: ["G", "GG", "GGG"],
    intl: {
      options: {
        era: "short",
      },
      part: "era",
    },
  },
  GGGG: {
    symbol: "GGGG",
    intl: {
      options: {
        era: "long",
      },
      part: "era",
    },
  },
  GGGGG: {
    symbol: "GGGG",
    intl: {
      options: {
        era: "narrow",
      },
      part: "era",
    },
  },
  "year-numeric": {
    symbol: [
      "y",
      "yyy",
      "yyyy",
      "yyyyy",
      "Y",
      "YYY",
      "YYYY",
      "YYYYY",
      "u",
      "uuu",
      "uuuu",
      "uuuuu",
    ],
    intl: {
      options: {
        year: "numeric",
      },
      part: "year",
    },
  },
  "year-short": {
    symbol: ["yy", "YY", "uu"],
    intl: {
      options: {
        year: "2-digit",
      },
      part: "year",
    },
  },
  "month-numeric": {
    symbol: ["M", "L"],
    intl: {
      options: {
        month: "numeric",
      },
      part: "month",
    },
  },
  "month-2-digit": {
    symbol: ["MM", "LL"],
    intl: {
      options: {
        month: "2-digit",
      },
      part: "month",
    },
  },
  "month-short": {
    symbol: ["MMM", "LLL"],
    intl: {
      options: {
        month: "short",
      },
      part: "month",
    },
  },
  "month-long": {
    symbol: ["MMMM", "LLLL"],
    intl: {
      options: {
        month: "long",
      },
      part: "month",
    },
  },
  "month-narrow": {
    symbol: ["MMMMM", "LLLLL"],
    intl: {
      options: {
        month: "narrow",
      },
      part: "month",
    },
  },
  d: {
    symbol: "d",
    intl: {
      options: {
        day: "numeric",
      },
      part: "day",
    },
  },
  dd: {
    symbol: "dd",
    intl: {
      options: {
        day: "2-digit",
      },
      part: "day",
    },
  },
  "weekday-long": {
    symbol: [
      "E",
      "EE",
      "EEE",
      "EEEE",
      "e",
      "ee",
      "eee",
      "eeee",
      "c",
      "cc",
      "ccc",
      "cccc",
    ],
    intl: {
      options: {
        weekday: "long",
      },
      part: "weekday",
    },
  },
  "weekday-narrow": {
    symbol: ["EEEEE", "eeeee", "ccccc"],
    intl: {
      options: {
        weekday: "narrow",
      },
      part: "weekday",
    },
  },
  "weekday-short": {
    symbol: ["EEEEEE", "eeeeee", "cccccc"],
    intl: {
      options: {
        weekday: "short",
      },
      part: "weekday",
    },
  },
};

const dateTranslationMaps: ITranslationMaps = {};
dateTranslationMaps.windows = windowsDate;
dateTranslationMaps.macos = macDate;

const unsupportedMask: IPlatformUnsupportedMask = {
  macos: [
    /l/g, // deprecared
    /w/g, // week of year
    /W/g, // week of month
    /D/g, // day of year
    /F/g, // day of week in month
    /g/g, // modified julian day
    /U/g, // cyclic year
    /q/g, // quarter
    /Q/g, // quarter
  ],
};

export {
  timeTranslationMaps,
  dateTranslationMaps,
  IDateTimeFormatPartKeys,
  ITranslationItem,
  ITranslationMap,
  IPlatformUnsupportedMask,
  unsupportedMask,
};
