'use client'

import { GroupBox } from "@web/component/global/control/group-box/GroupBox"
import { useClientLocale } from "@web/lib/module/locale/ClientLocaleProvider"
import { UploadFileObject, UploadFileState } from "@web/lib/types/entity/ClientUploadFile"
import { UploadFileMonitorItem } from "../UploadFileMonitorItem"

interface UploadMonitorItemListProp {
    type: UploadFileState[],
    className?: string,
    itemList: UploadFileObject[],
    onChangeState?: (uuid: string, state: UploadFileState, message?: string) => void,
    abort?: (uuid: string) => void,
    title? : string
}

export const UploadMonitorItemList = (prop: UploadMonitorItemListProp) => {

    return (
        <GroupBox className="cp-monitor-item cp-monitor-header-group cp-upload-list cp-wait-list"
            hidden={!prop.itemList.find(x => prop.type.indexOf(x.uploadState) > -1)}
        >
            <div className="cp-item-header">
                {prop.title}
            </div>
            <div className="cp-item-content">
                <div className="cp-item-list">
                    {
                        prop.itemList
                            .filter(x => prop.type.indexOf(x.uploadState) > -1)
                            .sort((x, y) => y.timestamp - x.timestamp)
                            .map((item, idx) => (
                                <UploadFileMonitorItem
                                    key={idx}
                                    item={item}
                                    uuid={item.uuid}
                                    state={item.uploadState}
                                    onChangeState={prop.onChangeState}
                                    abort={() => prop.abort && prop.abort(item.uuid)}
                                />
                            ))
                    }

                </div>
            </div>
        </GroupBox>
    )
}