import { CrepenFolder } from '@web/modules/crepen/explorer/folder/dto/CrepenFolder';
import uuid from 'react-uuid'

export type CrepenUploadFileStateType = 'error' | 'wait' | 'upload' | 'running'

export class CrepenUploadFile {
    uuid: string;
    data: File;
    uploadState: CrepenUploadFileStateType = 'wait';
    targetFolderUid: string;
    message?: string;
    createDate: Date;
    abortControl: AbortController

    constructor(file: File, targetFolderUid: string) {
        this.uuid = uuid();
        this.data = file;
        this.targetFolderUid = targetFolderUid
        this.createDate = new Date();
        this.abortControl = new AbortController();
    }


  
}