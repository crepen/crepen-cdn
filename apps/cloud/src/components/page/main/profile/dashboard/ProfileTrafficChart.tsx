'use client'

import { StringUtil } from "@web/lib/util/StringUtil"
import { ReactNode } from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, LabelList } from "recharts"

interface ChartData {
    date: string,
    value: number
}

const data: ChartData[] = [
    {
        date: '2025-08-01',
        value: 10000
    },
    {
        date: '2025-08-02',
        value: 20000
    }
]

export const ProfileTrafficChart = () => {

    const convertUnit = (data: ReactNode): ReactNode => {
        if (isNaN(Number(data))) {
            return data;
        }
        else {
            return StringUtil.convertFormatByte(Number(data) , 0);
        }
    }

    return (
        <div className="cp-widget-chart cp-traffic-chart">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                >
                    <defs>
                        <linearGradient id="gradientColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#667eea" />
                            <stop offset="100%" stopColor="#764ba2" />
                        </linearGradient>
                    </defs>

                    <Bar
                        dataKey="value"
                        fill="url(#gradientColor)"
                        maxBarSize={50}
                    >
                        <LabelList
                            dataKey='value'
                            position='insideTop'
                            fill="#fff"
                            formatter={convertUnit}
                            fontSize={12}

                        />
                    </Bar>
                    <XAxis dataKey='date' fontSize={12} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
