import { useGlobalModal } from '../../../config/GlobalModalProvider';
import './GlobalModal.scss';


interface CrepenGlobalModalProp {

}

export const GlobalModal = (prop: CrepenGlobalModalProp) => {

    const modalStateHook = useGlobalModal();

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