'use client'

import { CrepenComponentError } from "@web/modules/common-1/error/CrepenComponentError";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

interface SelectItemContextProp {
    value: SelectFolderItemProp[],
    update: (value: SelectFolderItemProp[]) => void,
    remove: (...value: SelectFolderItemProp[]) => void,
    event: {
        subscribe: (key: string, func: Function) => void,
        unSubscribe: (key: string) => void,
        getEvent : (key : string) => Function | undefined,
        existEvent : (key : string) => boolean
    }
}

export interface SelectFolderItemProp {
    type: 'file' | 'folder',
    uid: string
}

const SelectItemContext = createContext<SelectItemContextProp | undefined>(undefined);


export const useSelectFolderItem = () => {
    const context = useContext(SelectItemContext);
    if (context === undefined) throw new Error("useSelectItem must be used within ItemProvider");
    return context;
}






export const FolderSelectItemProvider = (prop: PropsWithChildren) => {
    const [items, setItems] = useState<SelectFolderItemProp[]>([]);
    const [subscribeEvent, setSubscribeEvent] = useState<{ key: string, func: Function }[]>([]);

    const updateItems = (itemListValue: SelectFolderItemProp[]) => {
        const updateList : SelectFolderItemProp[] = [];
        for (const item of itemListValue) {
            if (items.filter(x => x.type === item.type && x.uid === item.uid).length === 0) {
                updateList.push(item);
                
            }
        }

        setItems([...items, ...updateList]);
    }

    const removeItem = (...itemValue: SelectFolderItemProp[]) => {

        let resultList = items;

        for (const item of itemValue) {
            resultList = resultList.filter(x => !(x.type === item.type && x.uid === item.uid));
        }

        setItems(resultList);
    }

    useEffect(() => {
        console.log('update select item', items);
    }, [items])

    return (
        <SelectItemContext.Provider value={{
            value: items,
            update: updateItems,
            remove: removeItem,
            event: {
                getEvent : (key) => {
                    return subscribeEvent.find(x=>x.key === key)?.func;
                },
                subscribe: (key, func) => {
                    // if (subscribeEvent.filter(x => x.key === key).length > 0) {
                    //     throw new CrepenComponentError(`Already Subscribe : ${key}`, 400)
                    // }

                    setSubscribeEvent([
                        ...subscribeEvent.filter(x=>x.key !== key),
                        { key: key, func: func }
                    ])
                },
                unSubscribe : (key) => {
                    setSubscribeEvent([
                        ...subscribeEvent.filter(x=>x.key !== key)
                    ])
                },
                existEvent : (key) => {
                    return subscribeEvent.filter(x=>x.key === key).length >0
                }
            }
        }}>
            {prop.children}
        </SelectItemContext.Provider>
    )
}