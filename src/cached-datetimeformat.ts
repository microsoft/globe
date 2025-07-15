/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { SafeDateTimeFormat } from './safe-datetimeformat';

export class CachedDateTimeFormat {
  // We're keying this using JSON.stringify because with a WeakMap we've have a key pair
  // (locale - string & options - object) and stringify is native so it is so fars it is
  // not worth maintaing the two-level cache (map for string and weak map for object)
  private readonly localeFormatCache = new Map<string, Intl.DateTimeFormat>();

  public get(locale: string, dateTimeOptions: Intl.DateTimeFormatOptions) {
    const key = `${locale}:${JSON.stringify(dateTimeOptions)}`;
    let dtf = this.localeFormatCache.get(key);
    if (!dtf) {
      dtf = SafeDateTimeFormat(locale, dateTimeOptions);
      this.localeFormatCache.set(key, dtf);
    }

    return dtf;
  }

  public reset() {
    this.localeFormatCache.clear();
  }
}
