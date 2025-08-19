'use client'

import { createContext, PropsWithChildren, useContext, useState } from "react";
import { UploadFileMonitorModal } from "../upload-file-modal/UploadFileMonitorModal";

interface MainUploadFileModalContextProp {
    isOpen: boolean,
    setModalState: (state: boolean) => void
}

const MainUploadFileModalContext = createContext<MainUploadFileModalContextProp | undefined>(undefined);


export const useUploadFileModal = () => {
    const context = useContext(MainUploadFileModalContext);
    if (context === undefined) throw new Error("useUploadFileModal must be used within Provider");
    return context;
}


interface MainUploadFileModalProviderProp extends PropsWithChildren {

}

export const MainUploadFileModalProvider = (prop: MainUploadFileModalProviderProp) => {

    const [isOpen, setOpenState] = useState<boolean>(false);


    return (
        <MainUploadFileModalContext.Provider value={{
            isOpen: isOpen,
            setModalState: (state: boolean) => {
                setOpenState(state);
            }
        }}>
            {prop.children}
            <UploadFileMonitorModal />
        </MainUploadFileModalContext.Provider>
    )
}