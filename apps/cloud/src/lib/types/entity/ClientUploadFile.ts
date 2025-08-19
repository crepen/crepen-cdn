import uuid  from 'react-uuid'

export type UploadFileState = 'WAIT' | 'UPLOADING' | 'SUSPENSE' | 'COMPLETE' | 'ERROR' | 'STANDBY' | 'CANCELLED';

export interface UploadFileObject {
    uuid : string,
    file : File,
    uploadState : UploadFileState,
    parentFolderUid : string,
    errorMessage?: string,
    timestamp : number,
    uploadFileSize : number
}
