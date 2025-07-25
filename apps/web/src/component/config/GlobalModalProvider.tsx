'use client'

import { createContext, PropsWithChildren, useContext, useState } from "react"
import { GlobalModal } from "../page/(global)/global-modal/GlobalModal";


interface GlobalModalContextProp {
    isOpen: boolean,
    container: React.ReactNode,
    setOpen: (content: React.ReactNode) => void,
    close: () => void
}

const GlobalModalContext = createContext<GlobalModalContextProp | undefined>(undefined);


export const useGlobalModal = () => {
    const context = useContext(GlobalModalContext);
    if (context === undefined) throw new Error("useGlobalModal must be used within ItemProvider");
    return context;
}


export const GlobalModalProvider = (prop: PropsWithChildren) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<React.ReactNode>(undefined);


    return (
        <GlobalModalContext.Provider value={{
            isOpen: isOpen,
            container : modalContent,
            setOpen: (content: React.ReactNode) => {
                setModalContent(content);
                setIsOpen(true);
            },
            close: () => {
                setIsOpen(false);
                setModalContent(undefined);
            }
        }}>
            {prop.children}

            {
                isOpen && <GlobalModal />
            }
        </GlobalModalContext.Provider>
    )
}