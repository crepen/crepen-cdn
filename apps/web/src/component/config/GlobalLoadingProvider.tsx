'use client'
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { GlobalLoadingContainer } from "../page/(global)/global-loading/GlobalLoadingContainer";


interface GlobalLoadingContextProp {
    isLoading: boolean,
    setState: (state: boolean) => void
}

const GlobalLoadingContext = createContext<GlobalLoadingContextProp | undefined>(undefined);

export const useGlobalLoading = () => {
    const context = useContext(GlobalLoadingContext);
    if (context === undefined) throw new Error("useGlobalLoading must be used within ItemProvider");
    return context;
}

interface GlobalLoadingProviderProp extends PropsWithChildren {

}

export const GlobalLoadingProvider = (prop: GlobalLoadingProviderProp) => {

    const [state, setState] = useState<boolean>(false);

    return (
        <GlobalLoadingContext.Provider value={{
            isLoading: state,
            setState: (state: boolean) => setState(state)
        }}>
            <GlobalLoadingContainer />
            {prop.children}
        </GlobalLoadingContext.Provider>
    )
}