import './search.modal.header.main.scss'

import { CrepenModal } from "@web/components/page/common/base-modal.common"

interface HeaderSearchModalProp {
    isOpen: boolean,
    close: () => void
}

export const HeaderSearchModal = (prop: HeaderSearchModalProp) => {
    return (
        <CrepenModal
            isOpen={prop.isOpen}
            close={prop.close}
            headerOptions={{
                title: 'Search',
                enableCloseButton: false
            }}
            className="cp-header-search-modal"
            footerOptions={{
                enableCloseButton: true
            }}
        >
            <div className='cp-modal-search-box'>
                <input
                    type='text'
                    className='cp-search-input'
                    placeholder='Search..'
                />
            </div>
            <div className='cp-modal-match-box'>
                
            </div>

        </CrepenModal>
    )
}