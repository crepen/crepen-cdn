'use client'

import { FolderEntity } from "@web/lib/modules/api-server/entity/object/FolderEntity";
import { createContext, PropsWithChildren, useContext, useState } from "react";

interface FolderDataContextProp {
    value : FolderEntity | undefined,
    setValue : (value : FolderEntity) => void
}

const FolderDataContext = createContext<FolderEntity | undefined>(undefined);


export const useFolderData = () => {
    const context = useContext(FolderDataContext);
    if (context === undefined) throw new Error("useSelectItem must be used within ItemProvider");
    return context;
}


export const FolderDataProvider = (prop : PropsWithChildren<{folderData : FolderEntity}>) => {

    const [folder , setFolder] = useState<FolderEntity | undefined>(prop.folderData);

    return (
        <FolderDataContext.Provider value={folder}>
            {prop.children}
        </FolderDataContext.Provider>
    )
}