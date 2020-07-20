/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * Intl.DateTimeFormat can throw an exception when it does not detect time zone
 * If time zone is not specified, use fallback to UTC instead of throwing an exception
 */
export class SafeDateTimeFormat {
  private static _fallbackNeeded: boolean | undefined = undefined;
  private static fallbackNeeded = (locales?: string | string[] | undefined) => {
    if (SafeDateTimeFormat._fallbackNeeded === undefined) {
      const format = Intl.DateTimeFormat(locales);
      const tz = format.resolvedOptions().timeZone;
      if (!tz || tz.toLowerCase() === 'etc/unknown') {
        SafeDateTimeFormat._fallbackNeeded = true;
      } else {
        SafeDateTimeFormat._fallbackNeeded = false;
      }
    }

    return SafeDateTimeFormat._fallbackNeeded;
  }

  private _format: Intl.DateTimeFormat;

  private getOptionsWithFallback(locales?: string | string[] | undefined, options?: Intl.DateTimeFormatOptions) {
    if (options && options['timeZone']) {
      return options;
    }

    const fallbackNeeded = SafeDateTimeFormat.fallbackNeeded(locales);
    if (!fallbackNeeded) {
      return options;
    }

    return {
      ...options,
      timeZone: 'UTC'
    };
  }

  constructor(locales?: string | string[] | undefined, options?: Intl.DateTimeFormatOptions) {
    const optionsWithFallback = this.getOptionsWithFallback(locales, options);
    this._format = Intl.DateTimeFormat(locales, optionsWithFallback);
  }

  public format(date?: number | Date | undefined): string {
    return this._format.format(date);
  }

  public formatToParts(date?: number | Date | undefined): Intl.DateTimeFormatPart[] {
    return this._format.formatToParts(date);
  }
}
