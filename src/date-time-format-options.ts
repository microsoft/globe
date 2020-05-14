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

type MediumWithYear = MediumDateWithYear & MediumTime;

type Medium = MediumDate & MediumTime;

type LongWeekday = Readonly<{ weekday: 'long' }>;

type ShortWeekday = Readonly<{ weekday: 'short' }>;

type HourOnly = Readonly<{ hour: 'numeric' }>;

export type TimeStringFormat = 'numeric' | '2-digit';

export type DateTimeFormatOptions =
  | ShortTime
  | ShortDate
  | ShortDateWithYear
  | ShortDateTime
  | ShortDateWithShortYear
  | LongDate
  | LongDateWithYear
  | LongTime
  | FullDateWithYear
  | FullDate
  | MediumTime
  | MediumDate
  | MediumDateWithYear
  | MediumWithYear
  | Medium
  | LongWeekday
  | ShortWeekday
  | HourOnly
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
