'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UploadFileState, UploadFileObject } from "@web/lib/types/entity/ClientUploadFile";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react"




interface MainUploadFileContextProp {
    addQueue: (...files: UploadFileObject[]) => void,
    updateState: (uuid: string, state: UploadFileState, message?: string) => void,
    updateUploadFileSize: (uuid: string, progressValue: number) => void,
    removeQueue : (uuid : string) => void,
    files: UploadFileObject[],
}

const MainUploadFileContext = createContext<MainUploadFileContextProp | undefined>(undefined);


export const useMainUploadFile = () => {
    const context = useContext(MainUploadFileContext);
    if (context === undefined) throw new Error("useMainUploadFile must be used within Provider");
    return context;
}





interface MainUploadFileProviderProp extends PropsWithChildren {

}

const queryClient = new QueryClient();

export const MainUploadFileProvider = (prop: MainUploadFileProviderProp) => {

    const [uploadFileQueue, setFileQueue] = useState<UploadFileObject[]>([]);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isClient, setIsClient] = useState(false);


    //#region USE_EFFECT

    useEffect(() => {
        // 페이지가 언로드될 때 경고 메시지를 표시하는 함수
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                // 브라우저의 기본 동작을 막고 경고창을 띄웁니다.
                e.preventDefault();
                e.returnValue = ''; // 일부 브라우저에서 필요
            }
        };

        // 이벤트 리스너 등록
        window.addEventListener('beforeunload', handleBeforeUnload);

        // 클린업 함수: 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasUnsavedChanges]);

    useEffect(() => {

        if (uploadFileQueue.find(x => x.uploadState === 'UPLOADING')) {
            setHasUnsavedChanges(true);
        }
        else {
            setHasUnsavedChanges(false);
        }
    }, [uploadFileQueue])

    useEffect(() => {
        console.log("WAIT UPLOAD FILE");
        setIsClient(true);
    }, []);

    //#endregion USE_EFFECT

    if (!isClient) {
        return null; // 클라이언트가 될 때까지 렌더링하지 않음
    }

    return (
        <QueryClientProvider client={queryClient}>
            <MainUploadFileContext.Provider
                value={{
                    addQueue: (...files: UploadFileObject[]) => {
                        setFileQueue([
                            ...uploadFileQueue,
                            ...files
                        ])
                    },
                    updateState: (uuid: string, state: UploadFileState, message?: string) => {
                        const targetData = uploadFileQueue.find(x => x.uuid === uuid);
                        if (targetData) {

                            targetData.errorMessage = message;
                            targetData.uploadState = state;
                            targetData.uploadFileSize = 0;

                            setFileQueue([
                                ...uploadFileQueue.filter(x => x.uuid !== uuid),
                                targetData
                            ])
                        }
                    },
                    updateUploadFileSize: (uuid: string, fileSize: number) => {
                        const targetData = uploadFileQueue.find(x => x.uuid === uuid);
                        if (targetData) {

                            targetData.uploadFileSize = fileSize;

                            setFileQueue([
                                ...uploadFileQueue.filter(x => x.uuid !== uuid),
                                targetData
                            ])
                        }
                    },
                    removeQueue : (uuid :string )=> {
                        setFileQueue([
                            ...uploadFileQueue.filter(x=>x.uuid !== uuid)
                        ])
                    },
                    files: uploadFileQueue
                }}
            >
                {prop.children}
            </MainUploadFileContext.Provider>
        </QueryClientProvider>

    )

}   