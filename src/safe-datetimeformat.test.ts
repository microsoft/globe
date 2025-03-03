/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { getVdiTimeZoneFix } from './safe-datetimeformat';

describe('safe-datetimeformat', () => {

    const nowDate = new Date();

    describe('vdi', () => {

        it('constructs without throwing', () => {
            getVdiTimeZoneFix();
        });

        it('If no offset return GMT', () => {
            const mockDate = new Date();
            mockDate.getTimezoneOffset = jest.fn().mockReturnValue(0);
            const spy = jest.spyOn(global, 'Date').mockImplementation(
                () => (mockDate as unknown) as Date);

            try {
                const tz = getVdiTimeZoneFix();
                expect(tz).toEqual('Etc/GMT');

                Intl.DateTimeFormat('en-GB', {
                    timeZone: tz
                }).format(nowDate);
            } catch (e) {
                fail(e);
            } finally {
                spy.mockRestore();
            }
        });

        it('If unexpected value return UTC', () => {

            const mockDate = new Date();
            mockDate.getTimezoneOffset = jest.fn().mockReturnValue(13);
            const spy = jest.spyOn(global, 'Date').mockImplementation(
                () => (mockDate as unknown) as Date);

            try {

                const tz = getVdiTimeZoneFix();
                expect(tz).toEqual('UTC');

                Intl.DateTimeFormat('en-GB', {
                    timeZone: tz
                }).format(nowDate);
            } catch (e) {
                fail(e);
            } finally {
                spy.mockRestore();
            }
        });

        it('If negative hour returns correct format', () => {

            const mockDate = new Date();
            mockDate.getTimezoneOffset = jest.fn().mockReturnValue(-120);
            const spy = jest.spyOn(global, 'Date').mockImplementation(
                () => (mockDate as unknown) as Date);

            try {
                const tz = getVdiTimeZoneFix();
                expect(tz).toEqual('Etc/GMT-2');

                Intl.DateTimeFormat('en-GB', {
                    timeZone: tz
                }).format(nowDate);
            } catch (e) {
                fail(e);
            } finally {
                spy.mockRestore();
            }
        });

        it('If positive hour returns correct format', () => {

            const mockDate = new Date();
            mockDate.getTimezoneOffset = jest.fn().mockReturnValue(360);
            const spy = jest.spyOn(global, 'Date').mockImplementation(
                () => (mockDate as unknown) as Date);

            try {

                const tz = getVdiTimeZoneFix();
                expect(tz).toEqual('Etc/GMT+6');

                Intl.DateTimeFormat('en-GB', {
                    timeZone: tz
                }).format(nowDate);
            } catch (e) {
                fail(e);
            } finally {
                spy.mockRestore();
            }
        });

    });
});
