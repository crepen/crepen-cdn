import { CrepenFileStore } from "./CrepenFileStore";

export class CrepenFile {

    constructor(){
        this.uid = '';
        this.fileTitle = '';
        this.ownerUid = '';
        this.isPublished = false;
        this.fileUid = '';
        this.createDate = new Date();
        this.updateDate = new Date();
    }

    uid: string;
    fileTitle: string;
    ownerUid: string;
    parentFolderUid?: string;
    isPublished: boolean;
    fileUid: string;
    createDate: Date;
    updateDate: Date;

    trafficSize: number = 0;

    fileStore?: CrepenFileStore
}


