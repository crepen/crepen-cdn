import { useMutation } from '@tanstack/react-query';
import { UploadFileObject } from '@web/lib/types/entity/ClientUploadFile';
import axios, { AxiosError, CanceledError } from 'axios';
import { UploadFileProgress, useMainUploadFile } from '../provider/MainUploadFileProvider';
import { useClientBasePath } from '@web/lib/module/basepath/ClientBasePathProvider';
import urlJoin from 'url-join';
import * as http from 'http'
import * as https from 'https'

const uploadFile = async (
    basePath: string,
    fileItem: UploadFileObject,
    updateProgress: (state : UploadFileProgress) => void,
    signal: AbortSignal
) => {
    const formData = new FormData();
    
    formData.append('file', fileItem.file);

    const url = urlJoin(
        basePath,
        '/api/folder',
        fileItem.parentFolderUid ?? "NFD",
        '/file/upload'
    )

    try {
        if(fileItem.file.size > 1.8 * 1024 * 1024 * 1024){
            throw new Error('Limit Over (Max 1.8GB)')
        }

        updateProgress({
            progress : 0,
            total : 0,
            uploadSize : 0
        })
        const response = await axios.put(url, formData, {
            signal: signal,
            headers : {
                'Content-Disposition' : `attachment; filename="${encodeURIComponent(fileItem.file.name)}"`,
                'Content-File-Type' : fileItem.file.type
            },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    // const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    updateProgress({
                        total : progressEvent.total,
                        uploadSize : progressEvent.loaded,
                        progress : (progressEvent.loaded * 100) / progressEvent.total
                    });
                }
            },
            httpAgent : new http.Agent({keepAlive : true}),
            httpsAgent : new https.Agent({keepAlive : true}),
        });

        console.log(response.data);

        return response.data;
    }
    catch (e) {
        if (e instanceof CanceledError){
            throw e;
        }
        else if(e instanceof AxiosError){
            console.log('🛑 ERR' , e , e.response?.data.message);
            throw new Error (e.response?.data.message)
            
        }
        else if (e instanceof Error){
            throw e;
        }
        
    }

};

export const useFileUploadMutation = () => {
    const uploadFileHook = useMainUploadFile();
    const basePathHook = useClientBasePath();

    return useMutation({
        mutationFn: async (prop: { fileItem: UploadFileObject, signal: AbortSignal }) => {
            return await uploadFile(
                basePathHook.getBasePath(),
                prop.fileItem,
                uploadFileHook.progress.setProgress,
                prop.signal
            );
        },
        onSuccess: (_, variables) => {
            uploadFileHook.updateState(variables.fileItem.uuid, 'COMPLETE');
        },
        onError: (error, variables) => {
            if (axios.isCancel(error)) {
                uploadFileHook.updateState(variables.fileItem.uuid, 'CANCELLED', error.message);
            }
            else {
                uploadFileHook.updateState(variables.fileItem.uuid, 'ERROR' , (error as Error).message);
            }

        },
        onMutate: async (fileItem) => {
            uploadFileHook.updateState(fileItem.fileItem.uuid, 'UPLOADING');
        },
    });
};