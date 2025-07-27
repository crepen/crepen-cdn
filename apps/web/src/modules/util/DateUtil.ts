import * as ct from 'countries-and-timezones'
import { DateTime } from 'luxon';

export class DateUtil {
    static unknownToDate = (dateObj: unknown) => {
        try {
            if (typeof dateObj === 'string' || typeof dateObj === 'number') {
                return new Date(dateObj);
            }
            else if (dateObj instanceof Date) {
                return dateObj;
            }
            else {
                return undefined;
            }
        }
        catch (e) {
            return undefined;
        }

    }

    static langToTimezone = (lang: string) => {
        const localeTag = new Intl.Locale(lang) as any;
        const tz = localeTag.region && localeTag.getTimeZones?.();
        if (Array.isArray(tz) && tz.length > 0) return tz;

        const countryCode = localeTag.maximize().region;
        const country = ct.getCountry(countryCode);

        return country?.timezones || ['UTC'];
    }

    static convertDateStringTimeZone = (date: string | undefined, originTimeZone: string, convertTimeZone: string) => {

        if (date === undefined) {
            return undefined;
        }

        return DateTime.fromISO(date, { zone: originTimeZone })
            .setZone(this.langToTimezone(convertTimeZone)[0])
            .toFormat('yyyy-MM-dd HH:mm:ss')
    }

    static convertDateTimeZone = (date: Date, originTimeZone: string, convertTimeZone: string) => {

        if (date === undefined) {
            return undefined;
        }

        return DateTime.fromJSDate(date, { zone: originTimeZone })
            .setZone(this.langToTimezone(convertTimeZone)[0])
            .toFormat('yyyy-MM-dd HH:mm:ss')
    }

    static convertDateTimeZoneFromUTC = (date: Date | string | undefined, convertTimeZone: string) => {

        if (typeof date === 'string') {
            return this.convertDateStringTimeZone(date, 'UTC', convertTimeZone);
        }
        else if (date instanceof Date) {
            return this.convertDateTimeZone(date, 'UTC', convertTimeZone);
        }
        else {
            return undefined;
        }


    }
}