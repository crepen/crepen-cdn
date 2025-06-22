import uuid from "react-uuid";
import { create } from "zustand";

export type UploadStateType = 'waiting' | 'running' | 'complete' | 'error'

export interface UploadFileItemObject {
    state: UploadStateType,
    file: File,
    message?: string,
    disableRetry?: boolean,
    uid: string,
    timestamp: number,
    uploadServerUid? : string
}

interface UploadFileStateResult {
    value: UploadFileItemObject[],
    appendFiles: (files: File[]) => void,
    reset: () => void,
    deleteItem: (itemUid: string) => void,
    updateItem: (itemUid: string, updateObj: UploadFileItemObject) => void
}

export const useUploadFileState = create<UploadFileStateResult>()((
    (set, get) => ({
        value: [],
        reset: () => set(() => {
            return {
                value: []
            }
        }),
        appendFiles: (files: File[]) => set((state) => {
            const appendFileList: File[] = [];
            for (const item of files) {
                if (state.value.filter(x => x.file === item).length === 0) {
                    appendFileList.push(item);
                }
            }

            return {
                value: [
                    ...state.value,
                    ...appendFileList.map((x, idx) => ({
                        file: x,
                        state: 'waiting',
                        uid: uuid(),
                        timestamp: new Date().getTime() * 1000 + idx
                    }) as UploadFileItemObject)
                ]
            }
        }),
        deleteItem: (itemUid: string) => set((state) => {
            return {
                value: state.value.filter(x => x.uid !== itemUid)
            }
        }),
        updateItem: (itemUid: string, updateObj: UploadFileItemObject) => set((state) => {
            return {
                value: [
                    ...state.value.filter(x => x.uid !== itemUid),
                    {
                        ...updateObj,
                        uid: itemUid
                    }
                ]
            }
        })
    })
))