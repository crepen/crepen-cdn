import { CrepenFileStore } from "./CrepenFileStore";

export class CrepenFile {

    constructor(){
        this.uid = '';
        this.fileTitle = '';
        this.ownerUid = '';
        this.isShared = false;
        this.fileUid = '';
        this.createDate = new Date();
        this.updateDate = new Date();
    }

    uid: string;
    fileTitle: string;
    ownerUid: string;
    parentFolderUid?: string;
    isShared: boolean;
    fileUid: string;
    createDate: Date;
    updateDate: Date;

    fileStore?: CrepenFileStore
}


