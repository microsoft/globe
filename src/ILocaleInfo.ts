/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export default interface ILocaleInfo {
  platform: 'windows' | 'macos';
  regionalFormat: string;
  date: {
    shortDate: string;
    longDate: string;
    shortTime: string;
    longTime: string;
    calendar: string;
    firstDayOfWeek: string;
  };
}
