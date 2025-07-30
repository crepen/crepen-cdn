'use client'

import { StringUtil } from '@web/lib/util/string.util';
import './CumulativeDataUsageWidget.scss';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, TooltipContentProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { Fragment } from 'react';
import * as ct from 'countries-and-timezones';
import { DateTime } from 'luxon';
import { useGlobalLanguage } from '@web/lib/zustand-state/global.state';
import { CrepenCumulativeTrafficDto } from '@web/modules/crepen/service/monitor/dto/CrepenCumulativeTrafficDto';

interface CumulativeDataUsageWidgetProp {
    data?: CrepenCumulativeTrafficDto[]
}

export const CumulativeDataUsageWidget = (prop: CumulativeDataUsageWidgetProp) => {
    


    return (
        <div className="cp-monitor-widget cp-cumulative-data-usage">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    // width={500}
                    // height={300}
                    data={prop.data ?? []}
                    margin={{
                        top: 50,
                        right: 0,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid stroke='none' />
                    <XAxis dataKey="date" tick={false} hide />
                    <YAxis tick={false} hide />
                    <Tooltip
                        content={CustomTooltip}
                       
                    />

                    <Area type="monotone" dataKey="traffic" stroke="#8884d8" fill="#8884d8"

                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

const CustomTooltip = (prop: TooltipContentProps<ValueType, NameType>) => {

    const locale = useGlobalLanguage();

    const convertDate = () => {
        const localeTag = new Intl.Locale(locale.value) as any;
        const tz = localeTag.region && localeTag.getTimeZones?.();
        if (Array.isArray(tz) && tz.length > 0) return tz;

        const countryCode = localeTag.maximize().region;
        const country = ct.getCountry(countryCode);

        const timezone = country?.timezones || ['UTC'];
        const convertString = DateTime.fromISO(prop.payload[0]?.payload?.date?.toString(), { zone: 'UTC' })
            .setZone(timezone[0])
            .toFormat('yy.MM.dd HH:mm')

        return convertString
    }


    if (prop.active) {
        return (
            <Fragment>
                <div className='cp-graph-custom-tooltip'>
                    <div className='cp-tooltip-title'>
                        <div>~ {convertDate()}</div>
                    </div>
                    <div className='cp-tooltip-value'>
                        <span>{StringUtil.convertFormatByte(prop.payload[0]?.payload?.traffic, 2)}</span>
                    </div>



                </div>
                {
                    // isVisible &&
                    // <div className='cp-custom-tooltip'>
                    //     {/* {prop.active}
                    //     {prop.payload}
                    //     {prop.label} */}
                    // </div>
                }
            </Fragment>
        )
    }
    else {
        return null;
    }


}
