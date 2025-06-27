import './BaseFolderItem.scss'

import { faFile, faFolder } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MobileDiv, MobileDivElementProp } from "@web/components-new/common/controls/mobile-div/MobileDiv";
import { StringUtil } from "@web/lib/util/string.util";

export interface BaseFolderItemProp extends MobileDivElementProp {
    type: 'file' | 'folder',
    value?: string,
}

export const BaseFolderItem = (prop: BaseFolderItemProp) => {
    return (
        <MobileDiv
            {...prop}
            title={prop.value}
            className={StringUtil.joinClassName('cp-folder-item', prop.className)}
        >
            <div className='cp-item-box'>
                <FontAwesomeIcon
                    icon={prop.type === 'file' ? faFile : faFolder}
                    className='cp-item-icon'
                />
            </div>
            <div className='cp-item-title'>
                {prop.value}
            </div>
        </MobileDiv>
    )
}