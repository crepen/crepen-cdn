export class CrepenFileStore {

    constructor(){
        this.uid = '';
        this.uploaderUid = '';
        this.fileName = '';
        this.originFileMine = '';
        this.hash = '';
        this.fileSize = 0;
        this.fileType = '';
        this.createDate = new Date();
        this.updateDate = new Date();
    }

    uid: string;
    uploaderUid: string;
    fileName: string;
    originFileMine: string;
    fileSize: number;
    fileType : string;
    hash: string;
    expireDate?: Date;
    createDate: Date;
    updateDate: Date;
}