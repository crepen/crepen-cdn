import './CrepenGlobalModal.scss';

import { useCrepenGlobalModal } from "./CrepenGlobalModalProvider"

interface CrepenGlobalModalProp {

}

export const CrepenGlobalModal = (prop: CrepenGlobalModalProp) => {

    const modalStateHook = useCrepenGlobalModal();

    return (
        <div
            className="cp-global-modal"
            data-state={modalStateHook.isOpen ? 'open' : 'close'}
        >
            <div className="cp-modal-backdrop" 
                onClick={() => {
                    modalStateHook.close();
                }}
            />
            <div className="cp-modal-box"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                {modalStateHook.container}
            </div>
        </div>
    )
}