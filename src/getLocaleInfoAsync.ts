/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import ILocaleInfo from './ILocaleInfo';

export async function getLocaleInfoAsync(platform: 'windows' | 'macos'): Promise<ILocaleInfo | null> {
  if (window.getLocaleInfoAsync) {
    const localeInfo = await window.getLocaleInfoAsync();
    return {
      platform,
      regionalFormat: localeInfo.regionalFormat,
      shortDate: localeInfo.date.shortDate,
      longDate: localeInfo.date.longDate,
      shortTime: localeInfo.date.shortTime,
      longTime: localeInfo.date.longTime,
    };
  }

  return null;
}

declare global {
  // tslint:disable-next-line: interface-name
  interface Window {
    getLocaleInfoAsync(): Promise<{
      regionalFormat: string;
      date: {
        shortDate: string;
        longDate: string;
        shortTime: string;
        longTime: string;
        calendar: string;
        firstDayOfWeek: string;
      };
    }>;
  }
}
