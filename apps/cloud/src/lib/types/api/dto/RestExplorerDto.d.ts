export interface ExplorerTreeEntity {
    targetUid: string,
    childLinkUid: string,
    childType: 'folder' | 'file',
    ownerUid: string,
    createDate: string,
    title: string,
    updateDate : string,
    fileSize : number
}

export interface ExplorerFilterData { 
    sort : {
        category : {key : string , text : string}[],
        defaultCategory : {key : string , text : string},
        defaultSortType : 'asc' | 'desc'
    },
    pagination : {
        defaultPage : number,
        defaultPageSize : number
    }
}


export interface ExplorerFileUploadResult {
    uploadFileUid : string
}

export interface ExplorerAddFolderResult {
    folderUid : string
}