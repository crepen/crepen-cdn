import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@web/assets/style/cloud/page/group/cloud.group.scss';

import { PropsWithChildren } from 'react'

interface GroupLayoutProp extends PropsWithChildren {

}

const GroupLayoutRouter = async (prop: GroupLayoutProp) => {


    return (
        <div className='cp-layout cp-group cp-root-group'>

            <div className='cp-header'>
                <span className='cp-title'>Group</span>
                <div className='cp-action'>
                    <button className='cp-button cp-action-bt cp-icon-text-button'>
                        <FontAwesomeIcon icon={faPlus} className='cp-button-icon' />
                        <span className='cp-button-label'>Add SubGroup</span>
                    </button>
                    <button className='cp-button cp-action-bt cp-icon-button'>
                        <FontAwesomeIcon icon={faSearch} className='cp-button-icon' />
                    </button>
                </div>
            </div>

            <div className='cp-group-list'>
                {prop.children}
            </div>
        </div>
    )
}

export default GroupLayoutRouter;