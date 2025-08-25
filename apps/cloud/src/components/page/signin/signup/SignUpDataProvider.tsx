'use client'

import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

export interface SignUpData {
    id?: string,
    password?: string,
    email?: string,
    name?: string
}

type SignUpCategory = 'id' | 'password' | 'email' | 'name';


interface SignUpDataContextProp {
    setData: (value: SignUpData) => void,
    data: SignUpData
}

export const SignUpDataContext = createContext<SignUpDataContextProp | undefined>(undefined);

export const useSignUpData = () => {
    const context = useContext(SignUpDataContext);
    if (context === undefined) throw new Error("useSignUpData must be used within Provider");
    return context;
}



interface SignUpDataProviderProp {

}

export const SignUpDataProvider = (prop: PropsWithChildren<SignUpDataProviderProp>) => {

    const [signUpData, setSignUpData] = useState<SignUpData>({});

    useEffect(() => {
        console.log('ℹ️ SIGN UP DATA' ,signUpData);
    },[signUpData])

    return (
        <SignUpDataContext.Provider
            value={{
                setData: ( value) => {
                     setSignUpData({
                            ...signUpData,
                            ...value
                        })
                },
                data: signUpData
            }}
        >
            {prop.children}
        </SignUpDataContext.Provider>
    )
}