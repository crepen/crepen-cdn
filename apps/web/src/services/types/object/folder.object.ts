import { CrepenFile } from "./file.object"

export class CrepenFolder {

    constructor() {
        this.uid = '';
        this.ownerUid = '';
        this.folderTitle = '';
        this.createDate = new Date();
        this.updateDate = new Date();
    }

    uid: string;
    ownerUid: string;
    parentFolderUid?: string;
    folderTitle: string;
    createDate: Date;
    updateDate: Date;
    files?: CrepenFile[];
    parentFolder?: CrepenFolder;
    childFolder?: CrepenFolder[];
}
