'use client'

import { CrepenUser } from "@web/services/types/object/user.object"
import { createContext, PropsWithChildren, useContext, useState } from "react"

const UserDataContext = createContext<CrepenUser | undefined>(undefined)


export const useProfileUserData = () => {
      const context = useContext(UserDataContext);
        if (context === undefined) throw new Error("useProfileUserData must be used within ItemProvider");
        return context;
}


interface ProfileUserDataProviderProp extends PropsWithChildren{
    userData : CrepenUser
}

export const ProfileUserDataProvider = (prop : ProfileUserDataProviderProp) => {

    const [userData , setUserData] = useState<CrepenUser>(prop.userData)
    
    return (
        <UserDataContext.Provider value={userData}>
            {prop.children}
        </UserDataContext.Provider>
    )
}