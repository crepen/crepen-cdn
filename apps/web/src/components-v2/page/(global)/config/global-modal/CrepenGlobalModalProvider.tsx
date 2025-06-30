'use client'

import { createContext, PropsWithChildren, useContext, useState } from "react"
import { CrepenGlobalModal } from "./CrepenGlobalModal";


interface GlobalModalContextProp {
    isOpen: boolean,
    container: React.ReactNode,
    setOpen: (content: React.ReactNode) => void,
    close: () => void
}

const GlobalModalContext = createContext<GlobalModalContextProp | undefined>(undefined);


export const useCrepenGlobalModal = () => {
    const context = useContext(GlobalModalContext);
    if (context === undefined) throw new Error("useCrepenGlobalModal must be used within ItemProvider");
    return context;
}


export const CrepenGlobalModalProvider = (prop: PropsWithChildren) => {
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


            <CrepenGlobalModal />
        </GlobalModalContext.Provider>
    )
}