'use client'

import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import urlJoin from "url-join";

interface GlobalBasePathContextProp {
    basePath: string,
    join : (...joinPath : string[]) => string
}

const GlobalBasePathContext = createContext<GlobalBasePathContextProp>({ basePath: '/' , join : () => '' });


export const useGlobalBasePath = () => {
    const context = useContext(GlobalBasePathContext);
    if (context === undefined) throw new Error("useGlobalBasePath must be used within ItemProvider");
    return context;
}

interface GlobalBasePathProviderProp extends PropsWithChildren {
    basePath?: string
}

export const GlobalBasePathProvider = (prop: GlobalBasePathProviderProp) => {

 
    return (
        <GlobalBasePathContext.Provider value={{
            basePath: prop.basePath ?? '/',
            join : (...joinPath : string[]) => {
                return urlJoin(prop.basePath ?? '/' , ...joinPath);
            }
        }}>
            {prop.children}
        </GlobalBasePathContext.Provider>
    )
}