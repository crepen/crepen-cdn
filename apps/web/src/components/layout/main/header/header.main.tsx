import { StringUtil } from '@web/lib/util/string.util'
import './header.main.scss'
import { ExpandAsideHeaderIconButton } from './icon-button/expand.icon-button.header.main'
import { SearchHeaderIconButton } from './search-modal/search.icon-button.header.main'
import { UploadModalIconButton } from '@web/components-new/global/layout/controls/upload-state-modal-bt/UploadModalIconButton'

interface MainHeaderProp {
    className?: string
}

export const MainHeader = (prop: MainHeaderProp) => {
    return (
        <header className={StringUtil.joinClassName('cp-header', prop.className)}>
            <div className='cp-header-box'>
                <div className='cp-header-icon'>
                    <ExpandAsideHeaderIconButton />
                </div>
                <div className='cp-header-action'>
                    <UploadModalIconButton />
                    <SearchHeaderIconButton />
                </div>
            </div>
        </header>
    )
}