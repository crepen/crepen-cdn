'use client'

import { createContext, PropsWithChildren, useContext } from "react"

interface ClientBasePathContextProp {
    getBasePath : () => string
}

const ClientBasePathContext = createContext<ClientBasePathContextProp | undefined>(undefined);

export const useClientBasePath = () => {
    const context = useContext(ClientBasePathContext);
    if (context === undefined) throw new Error("useClientBasePath must be used within Provider");
    return context;
}


interface ClientBasePathProviderProp extends PropsWithChildren {
    basePath : string
}

export const ClientBasePathProvider = (prop : ClientBasePathProviderProp) => {
    return (
        <ClientBasePathContext.Provider
            value={{
                getBasePath : () => {
                    return prop.basePath;
                }
            }}
        >
            {prop.children}
        </ClientBasePathContext.Provider>
    )
}