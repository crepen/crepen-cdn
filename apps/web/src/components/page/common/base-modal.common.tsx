import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './base-modal.common.scss';

import { StringUtil } from "@web/lib/util/string.util"
import { PropsWithChildren } from "react"
import { faCross, faXmark } from '@fortawesome/free-solid-svg-icons';

interface CrepenModalHeaderOption {
    title?: string,
    enableCloseButton?: boolean
}

interface CrepenModalFooterOption {
    render?: React.ReactNode,
    enableCloseButton?: boolean,
    enableSubmitButton?: boolean,
    isLoadingSubmitButton? : boolean,
    submit?: () => void
}

interface CrepenModalProp extends PropsWithChildren {
    className?: string,
    close: () => void,
    isOpen: boolean,
    headerOptions?: CrepenModalHeaderOption,
    footerOptions?: CrepenModalFooterOption
}

export const CrepenModal = (prop: CrepenModalProp) => {
    return (
        <div
            className={StringUtil.joinClassName('cp-modal', prop.className)}
            data-state={prop.isOpen ? 'open' : 'close'}
        >
            <div className='cp-modal-backdrop' onClick={prop.close}></div>
            <div className="cp-modal-box">
                <div className='cp-modal-header'>
                    <span>{prop.headerOptions?.title}</span>
                    {
                        (prop.headerOptions?.enableCloseButton ?? true) === true &&
                        <FontAwesomeIcon
                            icon={faXmark}
                            className='cp-modal-close-bt'
                            onClick={prop.close}
                        />
                    }
                </div>
                <div className="cp-modal-context">
                    {prop.children}
                </div>
                <div className='cp-modal-footer'>

                    {prop.footerOptions?.render}
                    {
                        (prop.footerOptions?.enableCloseButton ?? false) === true &&
                        <button className='cp-modal-close-bt cp-footer-bt' onClick={prop.close}>
                            Close
                        </button>
                    }
                    {
                        (prop.footerOptions?.enableSubmitButton ?? false) === true &&
                        <button className='cp-modal-submit-bt cp-footer-bt' onClick={prop.footerOptions?.submit} disabled={prop.footerOptions?.isLoadingSubmitButton === true}>
                            {
                                prop.footerOptions?.isLoadingSubmitButton
                                ? 'Loading..'
                                : 'Submit'
                            }
                        </button>
                    }

                </div>
            </div>
        </div>
    )
}