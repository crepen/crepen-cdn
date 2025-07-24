import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './DashboardPageLayout.scss'
import { faDashboard } from '@fortawesome/free-solid-svg-icons'
import { GroupExpandBox } from '@web/components/page/common/group-box/group-box.common'
import { CumulativeDataUsageWidget } from '../containers/cumulative-data-usage-widget/CumulativeDataUsageWidget'
import { CrepenMonitorOperationService } from '@web/modules/crepen/service/monitor/CrepenMonitorOperationService'
import { Suspense } from 'react'

export const DashboardPageLayout = async () => {



    return (
        <div className="cp-page-layout cp-dashboard-layout">
            <div className="cp-page-header">
                <div className='cp-page-title'>
                    <FontAwesomeIcon icon={faDashboard} className='cp-title-icon' />
                    <span>Dashboard</span>
                </div>
            </div>
            <div className="cp-page-content">
                <Suspense fallback={<div>LOADING</div>}>
                    <CumulativeDataUsageWidgetBox />
                </Suspense>

                <GroupExpandBox
                    title='Traffic'
                    defaultOpen
                >

                </GroupExpandBox>
            </div>
        </div>
    )
}

export const CumulativeDataUsageWidgetBox = async () => {
    const cumulativeData = await CrepenMonitorOperationService.getCumulativeTrafficMonitorData();

    return (
        <GroupExpandBox
            title='Traffic'
            defaultOpen
            className='cp-cumulative-data-usage-widget'
        >
            <CumulativeDataUsageWidget
                data={cumulativeData.data ?? undefined}
            />
        </GroupExpandBox>
    )
}