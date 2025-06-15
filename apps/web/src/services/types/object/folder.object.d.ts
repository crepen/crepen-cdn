export interface CrepenFolder {
    uid: string ,
    ownerUid: string ,
    parentFolderUid: string ,
    folderTitle: string ,
    createDate?: string,
    updateDate? : string
}

export interface CrepenFolderWithRelation {
    info : CrepenFolder ,
    children? : {
        folder? : CrepenFolder[]
    }
}