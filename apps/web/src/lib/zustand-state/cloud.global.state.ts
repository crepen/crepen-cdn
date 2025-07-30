import { create } from "zustand";

interface GlobalAsideExpandStateResult {
    state: boolean,
    toggle: (changeState: boolean) => void
}

export const useGlobalAsideExpandState = create<GlobalAsideExpandStateResult>()((set => ({
    state: false,
    toggle: (changeState: boolean) => set(() => ({ state: changeState }))
})))   