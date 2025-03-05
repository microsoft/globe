/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { getVdiTimeZoneFix } from './safe-datetimeformat';

describe('safe-datetimeformat', () => {

    const nowDate = new Date();

    describe('vdi', () => {
        let spy: any;

        afterEach(() => {
            spy?.mockRestore();
        });

        it('constructs without throwing', () => {
            getVdiTimeZoneFix();
        });

        it('If no offset return GMT', () => {
            const mockDate = new Date();
            mockDate.getTimezoneOffset = vi.fn().mockReturnValue(0);
            spy = vi.spyOn(global, 'Date').mockImplementation(
                () => (mockDate as unknown) as Date);

            const tz = getVdiTimeZoneFix();
            expect(tz).toEqual('Etc/GMT');

            Intl.DateTimeFormat('en-GB', {
                timeZone: tz
            }).format(nowDate);
        });

        it('If unexpected value return UTC', () => {
            const mockDate = new Date();
            mockDate.getTimezoneOffset = vi.fn().mockReturnValue(13);
            spy = vi.spyOn(global, 'Date').mockImplementation(
                () => (mockDate as unknown) as Date);

            const tz = getVdiTimeZoneFix();
            expect(tz).toEqual('UTC');

            Intl.DateTimeFormat('en-GB', {
                timeZone: tz
            }).format(nowDate);
        });

        it('If negative hour returns correct format', () => {
            const mockDate = new Date();
            mockDate.getTimezoneOffset = vi.fn().mockReturnValue(-120);
            spy = vi.spyOn(global, 'Date').mockImplementation(
                () => (mockDate as unknown) as Date);

            const tz = getVdiTimeZoneFix();
            expect(tz).toEqual('Etc/GMT-2');

            Intl.DateTimeFormat('en-GB', {
                timeZone: tz
            }).format(nowDate);
        });

        it('If positive hour returns correct format', () => {

            const mockDate = new Date();
            mockDate.getTimezoneOffset = vi.fn().mockReturnValue(360);
            spy = vi.spyOn(global, 'Date').mockImplementation(
                () => (mockDate as unknown) as Date);

            const tz = getVdiTimeZoneFix();
            expect(tz).toEqual('Etc/GMT+6');

            Intl.DateTimeFormat('en-GB', {
                timeZone: tz
            }).format(nowDate);
        });
    });
});
