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

type LongWeekday = Readonly<{ weekday: 'long' }>;

type ShortWeekday = Readonly<{ weekday: 'short' }>;

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
  | LongWeekday
  | ShortWeekday
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
