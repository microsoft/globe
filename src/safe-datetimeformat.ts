/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

let _fallbackNeeded: boolean | undefined = undefined;
const fallbackNeeded = (locales?: string | string[] | undefined) => {
  if (_fallbackNeeded === undefined) {
    _fallbackNeeded = checkFallback(locales);
  }
  return _fallbackNeeded;
};

const checkFallback = (locales?: string | string[] | undefined) => {
  const format = Intl.DateTimeFormat(locales);
  const tz = format.resolvedOptions().timeZone;
  if (!tz || tz.toLowerCase() === 'etc/unknown') {
    return true;
  }

  try {
    format.format(new Date());
  } catch (e) {
    if (e && e.message && (
      e.message.indexOf('Invalid time zone specified')
      || e.message.indexOf('Unsupported time zone specified'))) {
        return true;        
    }
  }

  return false;
};

export function getVdiTimeZoneFix()  {
  const offset: number = new Date().getTimezoneOffset();
  if (offset % 60 === 0) {
    const tz: number = offset / 60;
    if (tz === 0) {
      return 'Etc/GMT';
    } 
    if (tz > 0) {
      return 'Etc/GMT+' + tz;
    }
    return 'Etc/GMT' + tz;
  }
  return 'UTC';
}

const getOptionsWithFallback = (locales?: string | string[] | undefined, options?: Intl.DateTimeFormatOptions) => {
  if (options && options['timeZone']) {
    return options;
  }

  if (!fallbackNeeded(locales)) {
    return options;
  }

  return {
    ...options,
    timeZone:  getVdiTimeZoneFix()
  };
};

/**
 * Intl.DateTimeFormat can throw an exception when it does not detect time zone
 * If time zone is not specified, use fallback to UTC instead of throwing an exception
 */
export const SafeDateTimeFormat = (locales?: string | string[] | undefined, options?: Intl.DateTimeFormatOptions) => {
  const optionsWithFallback = getOptionsWithFallback(locales, options);
  return Intl.DateTimeFormat(locales, optionsWithFallback);
};
