'use client'

import { DateTime } from "luxon"
import { Fragment, useEffect } from "react"
import * as ct from 'countries-and-timezones'

interface DateLocaleWrapProp {
    locale: string,
    date: Date
}

/** @deprecated */
export const ClientDateLocaleWrap = (prop: DateLocaleWrapProp) => {


    const langToTimezone = (lang: string) => {
        const localeTag = new Intl.Locale(lang) as any;
        const tz = localeTag.region && localeTag.getTimeZones?.();
        if (Array.isArray(tz) && tz.length > 0) return tz;

        const countryCode = localeTag.maximize().region;
        const country = ct.getCountry(countryCode);
       
        return country?.timezones || ['UTC'];
    }

    const convertTimezone = (date: Date, originTimeZone: string, convertTimeZone: string) => {


        return DateTime.fromISO(date.toString(), { zone: originTimeZone })
            .setZone(convertTimeZone)
            .toFormat('yyyy-MM-dd HH:mm:ss')
    }

    return (
        <Fragment>
            {
                convertTimezone(prop.date, 'UTC', langToTimezone(prop.locale)[0])
            }
        </Fragment>
    )
}