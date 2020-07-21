/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

let _fallbackNeeded: boolean | undefined = undefined;
const fallbackNeeded = (locales?: string | string[] | undefined) => {
  if (_fallbackNeeded === undefined) {
    const format = Intl.DateTimeFormat(locales);
    const tz = format.resolvedOptions().timeZone;
    if (!tz || tz.toLowerCase() === 'etc/unknown') {
      _fallbackNeeded = true;
    } else {
      _fallbackNeeded = false;
    }
  }

  return _fallbackNeeded;
};

const getOptionsWithFallback = (locales?: string | string[] | undefined, options?: Intl.DateTimeFormatOptions) => {
  if (options && options['timeZone']) {
    return options;
  }

  if (!fallbackNeeded(locales)) {
    return options;
  }

  return {
    ...options,
    timeZone: 'UTC'
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
