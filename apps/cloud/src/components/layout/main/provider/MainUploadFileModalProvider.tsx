'use client'

import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { UploadFileMonitorModal } from "../upload-file-modal/UploadFileMonitorModal";
import { usePathname } from "next/navigation";


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


type MainUploadFileModalProviderProp = PropsWithChildren

export const MainUploadFileModalProvider = (prop: MainUploadFileModalProviderProp) => {

    const [isOpen, setOpenState] = useState<boolean>(false);

    const pathHook = usePathname();

    useEffect(() => {
        setOpenState(false);
    },[pathHook])

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