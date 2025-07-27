import { create } from "zustand";
import { CrepenUploadFile, CrepenUploadFileStateType } from "../entity/CrepenUploadFile";

interface FileUploadStateResult {
    value: CrepenUploadFile[],
    reset: () => void,
    uploadData: (files: File[], targetFolderUid : string, targetFolderTitle : string) => void,
    removeItem: (file: CrepenUploadFile) => void,
    updateUploadState: (uuid: string, state: CrepenUploadFileStateType , message?: string) => void,
    removeSpecificStateItems: (uploadState : CrepenUploadFileStateType) => void
}



export const useFileUploadState = create<FileUploadStateResult>()((
    (set, get) => ({
        value: [],
        reset: () => set(() => ({ value: [] })),
        uploadData: (files: File[] , targetFolderUid : string , targetFolderTitle : string) => set((state) => {

            return ({
                value: [
                    ...state.value,
                    ...files.map(x => new CrepenUploadFile(x , targetFolderUid , targetFolderTitle))
                ]
            })
        }),
        removeItem: (file: CrepenUploadFile) => set((state) => {
            return ({
                value: state.value.filter(x => x.uuid !== file.uuid)
            })
        }),
        updateUploadState: (uuid: string, uploadState: CrepenUploadFileStateType, message?: string) => set((state) => {
            const data = state.value.find(x => x.uuid === uuid);
            if (data) {
                data.uploadState = uploadState;
                data.message = message;
                return ({
                    value: [
                        ...state.value.filter(x => x.uuid !== uuid),
                        data
                    ]
                })
            }
            else {
                return { value: state.value };
            }

        }),
        removeSpecificStateItems : (uploadState : CrepenUploadFileStateType) => set((state) => {
            return { value: state.value.filter(x => x.uploadState !== uploadState) };
        })

    })
));

