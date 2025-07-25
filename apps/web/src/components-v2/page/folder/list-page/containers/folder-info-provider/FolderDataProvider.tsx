'use client'

import { CrepenFolder } from "@web/modules/crepen/service/explorer/folder/dto/CrepenFolder";
import { createContext, PropsWithChildren, useContext, useState } from "react";

interface FolderDataContextProp {
    value : CrepenFolder | undefined,
    setValue : (value : CrepenFolder) => void
}




const FolderDataContext = createContext<CrepenFolder | undefined>(undefined);


export const useFolderData = () => {
    const context = useContext(FolderDataContext);
    if (context === undefined) throw new Error("useSelectItem must be used within ItemProvider");
    return context;
}


export const FolderDataProvider = (prop : PropsWithChildren<{folderData : CrepenFolder}>) => {

    const [folder , setFolder] = useState<CrepenFolder | undefined>(prop.folderData);

    return (
        <FolderDataContext.Provider value={folder}>
            {prop.children}
        </FolderDataContext.Provider>
    )
}