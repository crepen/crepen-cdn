'use client'

import { createContext, PropsWithChildren, RefObject, useContext, useState } from "react";

interface MainAsideStateContextProp {
    state: boolean,
    setState: (state: boolean) => void,
    toggle: () => void,
}

const MainAsideStateContext = createContext<MainAsideStateContextProp | undefined>(undefined);


export const useMainAsideState = () => {
    const context = useContext(MainAsideStateContext);
    if (context === undefined) throw new Error("useMainAsideState must be used within Provider");
    return context;
}


interface MainAsideStateProviderProp extends PropsWithChildren {

}

export const MainAsideStateProvider = (prop: MainAsideStateProviderProp) => {

    const [asideState, setAsideState] = useState<boolean>(false);

    return (
        <MainAsideStateContext.Provider
            value={{
                state: asideState,
                setState: (state: boolean) => {
                    setAsideState(state);
                },
                toggle: () => {
                    setAsideState(!asideState)
                }
            }}
        >
            {prop.children}
        </MainAsideStateContext.Provider>
    )
}