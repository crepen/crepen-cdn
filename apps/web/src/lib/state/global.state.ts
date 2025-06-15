/**
 * JUSTAND STATE
 */

import { create } from "zustand";

interface GlobalBasePathResult {
    basePath: string,
    update: (changePath?: string) => void,
    join: (pathname?: string) => string
}

export const useGlobalBasePath = create<GlobalBasePathResult>()(((set, get) => ({
    basePath: '/',
    update: (changePath?: string) => set(() => {

        let path = changePath;

        if (path?.endsWith('/')) {
            path = path.slice(0, path.length - 1);
        }

        return {
            basePath: path
        }
    }),
    join: (pathName?: string) => {

        let joinUrl = pathName?.trim() ?? '';
        if (!joinUrl.startsWith('/')) {
            joinUrl = '/' + joinUrl;
        }

        joinUrl = get().basePath + joinUrl;

        if (joinUrl.endsWith('/')) {
            joinUrl = joinUrl.slice(0, joinUrl.length - 1);
        }

        return joinUrl;
    }
})))   