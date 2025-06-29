import { create } from "zustand";

interface FileUploadMonitorVisibleResult {
    value : boolean,
    changeState : (isVisible : boolean) => void
}

export const useFileUploadMonitorVisible = create<FileUploadMonitorVisibleResult>()((
    (set, get) => ({
        value: false,
        changeState : (isVisible : boolean) => set(() => {
            return {
                value : isVisible
            }
        })
    })
));

