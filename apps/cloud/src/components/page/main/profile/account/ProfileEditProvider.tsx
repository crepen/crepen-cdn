'use client'

import { createContext, PropsWithChildren, useContext, useState } from "react";
import EventEmitter from 'eventemitter3'

type ProfileEditEventType = 'cancel-signal' | 'save-signal';

interface ProfileEditContextProp {
    isEditable: boolean,
    setEditState: (state: boolean) => void,
    onSignal: (type: ProfileEditEventType) => void,
    addEvent: (type: ProfileEditEventType, func: () => void) => void,
    removeEvent: (type: ProfileEditEventType, func: () => void) => void,
    isLoading : boolean,
    setLoading : (state : boolean) => void
}

const ProfileEditContext = createContext<ProfileEditContextProp | undefined>(undefined);

export const useProfileEdit = () => {
    const context = useContext(ProfileEditContext);
    if (context === undefined) throw new Error("useProfileEdit must be used within Provider");
    return context;
}

export const ProfileEditProvider = (prop: PropsWithChildren) => {

    const [isEdit, setEditState] = useState<boolean>(false);
    const [eventEmitter] = useState<EventEmitter>(new EventEmitter());
    const [isSaveLoading , setSaveLoading] = useState<boolean>(false);

    return (
        <ProfileEditContext.Provider
            value={{
                isEditable: isEdit,
                setEditState: (state: boolean) => {
                    setEditState(state);
                },
                onSignal: (type: ProfileEditEventType) => eventEmitter.emit(type),
                addEvent: (type: ProfileEditEventType, func: () => void) => eventEmitter.on(type, func),
                removeEvent: (type: ProfileEditEventType, func: () => void) => eventEmitter.removeListener(type, func),
                isLoading : isSaveLoading,
                setLoading : (state) => setSaveLoading(state)
            }}
        >
            {prop.children}
        </ProfileEditContext.Provider>
    )
}