/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

type ShortTime = Readonly<{ hour: 'numeric'; minute: 'numeric' }>;

type ShortDate = Readonly<{ day: 'numeric'; month: 'numeric' }>;

type ShortDateWithYear = Readonly<{
  day: 'numeric';
  month: 'numeric';
  year: 'numeric';
}>;

type ShortDateTime = Readonly<{
  day: 'numeric';
  month: 'numeric';
  year: 'numeric';
  hour: 'numeric';
  minute: 'numeric';
}>;

type ShortDateLongTime = Readonly<{
  day: 'numeric';
  month: 'numeric';
  year: 'numeric';
  hour: 'numeric';
  minute: 'numeric';
  second: 'numeric';
}>;

type ShortDateWithShortYear = Readonly<{
  day: 'numeric';
  month: 'numeric';
  year: '2-digit';
}>;

type LongDate = Readonly<{ day: 'numeric'; month: 'long' }>;

type LongDateWithYear = Readonly<{
  day: 'numeric';
  month: 'long';
  year: 'numeric';
}>;

type LongTime = Readonly<{
  hour: 'numeric';
  minute: 'numeric';
  second: 'numeric';
}>;

type FullDateWithYear = Readonly<{
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
}>;

type FullDate = Readonly<{
  weekday: 'long',
  day: 'numeric',
  month: 'long'
}>;

type MediumTime = Readonly<{
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
}>;

type MediumDate = Readonly<{
  day: 'numeric',
  month: 'short'
}>;

type MediumDateWithYear = Readonly<{
  day: 'numeric',
  month: 'short',
  year: 'numeric'
}>;

type ShortTimeZoneName = Readonly<{ timeZoneName: 'short' }>;

type LongTimeZoneName = Readonly<{ timeZoneName: 'long' }>;

type LongWithYearTimeZone = LongDateWithYear & ShortTimeZoneName;

type MediumWithYear = MediumDateWithYear & MediumTime;

type Medium = MediumDate & MediumTime;

type LongWeekday = Readonly<{ weekday: 'long' }>;

type ShortWeekday = Readonly<{ weekday: 'short' }>;

type HourOnly = Readonly<{ hour: 'numeric' }>;

type LongWeekdayShortTime = LongWeekday & ShortTime;
type LongWeekdayLongTime = LongWeekday & LongTime;
type LongTimeWithTimeZone = LongTime & ShortTimeZoneName;
type LongWithTimeZone = LongTime & LongDate & ShortTimeZoneName;

type ShortWeekdayShortTime = ShortWeekday & ShortTime;
type ShortWeekdayLongTime = ShortWeekday & LongTime;

type Full = FullDate & FullTime;
type FullWithYear = FullDateWithYear & FullTime;
type FullTime = LongTime & LongTimeZoneName;

type Short = ShortDate & ShortTime;
type ShortWithYear = ShortDateWithYear & ShortTime;

export type TimeStringFormat = 'numeric' | '2-digit';

export type DateTimeFormatOptions =
  | ShortTime
  | ShortDate
  | ShortDateWithYear
  | ShortDateTime
  | ShortDateWithShortYear
  | ShortDateLongTime
  | LongDate
  | LongDateWithYear
  | LongWithYearTimeZone
  | LongWithTimeZone
  | LongWithYearTimeZone
  | LongTimeWithTimeZone
  | LongTime
  | FullDateWithYear
  | FullDate
  | FullTime
  | Full
  | FullWithYear
  | MediumTime
  | MediumDate
  | MediumDateWithYear
  | MediumWithYear
  | Medium
  | LongWeekday
  | ShortWeekday
  | HourOnly
  | LongWeekdayShortTime
  | LongWeekdayLongTime
  | ShortWeekdayShortTime
  | ShortWeekdayLongTime
  | Short
  | ShortWithYear
  | Readonly<{ hour: 'numeric' | '2-digit' }>
  | Readonly<{ minute: 'numeric' | '2-digit' }>
  | Readonly<{ second: 'numeric' | '2-digit' }>;

export const SHORT_TIME: ShortTime = { hour: 'numeric', minute: 'numeric' };

export const SHORT_DATE: ShortDate = { day: 'numeric', month: 'numeric' };

export const SHORT_DATE_WITH_YEAR: ShortDateWithYear = {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric'
};

export const SHORT_DATE_TIME: ShortDateTime = {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric'
};

export const SHORT_DATE_LONG_TIME: ShortDateLongTime = {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
};

export const SHORT_DATE_WITH_SHORT_YEAR: ShortDateWithShortYear = {
  day: 'numeric',
  month: 'numeric',
  year: '2-digit'
};

export const LONG_DATE: LongDate = { day: 'numeric', month: 'long' };

export const LONG_DATE_WITH_YEAR: LongDateWithYear = {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
};

export const LONG_TIME: LongTime = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
};

export const LONG_TIME_WITH_TIMEZONE: LongTimeWithTimeZone = {
  ...LONG_TIME,
  timeZoneName: 'short'
};

export const LONG_WITH_TIMEZONE: LongWithTimeZone = {
  ...LONG_DATE,
  ...LONG_TIME,
  timeZoneName: 'short'
};

export const LONG_WITH_YEAR_TIMEZONE: LongWithYearTimeZone = {
  ...LONG_DATE_WITH_YEAR,
  ...LONG_TIME,
  timeZoneName: 'short'
};

export const LONG_WEEKDAY: LongWeekday = { weekday: 'long' };

export const SHORT_WEEKDAY: ShortWeekday = { weekday: 'short' };

export const FULL_DATE_WITH_YEAR: FullDateWithYear = {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
};

export const FULL_DATE: FullDate = {
  weekday: 'long',
  day: 'numeric',
  month: 'long'
};

export const FULL_TIME: FullTime = {
  ...LONG_TIME,
  timeZoneName: 'long'
};

export const FULL: Full = {
  ...FULL_DATE,
  ...FULL_TIME
};

export const FULL_WITH_YEAR: FullWithYear = {
  ...FULL_DATE_WITH_YEAR,
  ...FULL_TIME,
};

export const MEDIUM_TIME: MediumTime = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
};

export const MEDIUM_DATE: MediumDate = {
  day: 'numeric',
  month: 'short'
};

export const MEDIUM_DATE_WITH_YEAR: MediumDateWithYear = {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
};

export const MEDIUM_WITH_YEAR: MediumWithYear = {
  ...MEDIUM_DATE_WITH_YEAR,
  ...MEDIUM_TIME
};

export const MEDIUM: Medium = {
  ...MEDIUM_DATE,
  ...MEDIUM_TIME
};

export const HOUR_ONLY: HourOnly = {
  hour: 'numeric'
};

export const LONG_WEEKDAY_SHORT_TIME: LongWeekdayShortTime = {
  ...LONG_WEEKDAY,
  ...SHORT_TIME
};

export const LONG_WEEKDAY_LONG_TIME: LongWeekdayLongTime = {
  ...LONG_WEEKDAY,
  ...LONG_TIME
};

export const SHORT: Short = {
  ...SHORT_DATE,
  ...SHORT_TIME
};

export const SHORT_WITH_YEAR: ShortWithYear = {
  ...SHORT_DATE_WITH_YEAR,
  ...SHORT_TIME,
};

export const SHORT_WEEKDAY_SHORT_TIME: ShortWeekdayShortTime = {
  ...SHORT_WEEKDAY,
  ...SHORT_TIME
};

export const SHORT_WEEKDAY_LONG_TIME: ShortWeekdayLongTime = {
  ...SHORT_WEEKDAY,
  ...LONG_TIME
};
