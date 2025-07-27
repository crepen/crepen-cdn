/**
 * JUSTAND STATE
 */

import { create } from "zustand";

interface GlobalBasePathResult {
    value: string,
    update: (changePath?: string) => void,
    join: (pathname?: string) => string
}

/** @deprecated */
export const useGlobalBasePath = create<GlobalBasePathResult>()(((set, get) => ({
    value: '/',
    update: (changePath?: string) => set(() => {

        let path = changePath;

        if (path?.endsWith('/')) {
            path = path.slice(0, path.length - 1);
        }

        return {
            value: path ?? '/'
        }
    }),
    join: (pathName?: string) => {

        let joinUrl = pathName?.trim() ?? '';
        if (!joinUrl.startsWith('/')) {
            joinUrl = '/' + joinUrl;
        }

        joinUrl = get().value + joinUrl;

        if (joinUrl.endsWith('/')) {
            joinUrl = joinUrl.slice(0, joinUrl.length - 1);
        }

        return joinUrl;
    }
})))

interface GlobalLanguageResult {
    value: string,
    update: (value?: string) => void,
}

export const useGlobalLanguage = create<GlobalLanguageResult>()(((set, get) => ({
    value: 'en',
    update: (value?: string) => set(() => {

        return {
            value: value
        };
    })
})))

// interface GlobalLoadingStateResult {
//     isLoading: boolean,
//     active: (value?: boolean) => void,
// }

// export const useGlobalLoadingState = create<GlobalLoadingStateResult>()(((set, get) => ({
//     isLoading: false,
//     active: (value?: boolean) => set(() => {
//         return {
//             isLoading: value
//         };
//     })
// })))   
