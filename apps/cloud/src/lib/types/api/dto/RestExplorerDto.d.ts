export interface ExplorerTreeEntity {
    targetUid: string,
    childLinkUid: string,
    childType: 'folder' | 'file',
    ownerUid: string,
    createDate: string,
    title: string,
    updateDate: string,
    fileSize: number
}

export interface ExplorerFolderDataResult {
    dir?: ExplorerFolderData,
    path: { uid: string, title: string, depth: number }[]
}



export interface ExplorerFolderData {
    uid: string,
    title: string,
    folder_owner_uid: string,
    folder_state: string,
    create_date: string,
    update_date: string,
}

export interface ExplorerFilterData {
    sort: {
        category: { key: string, text: string }[],
        defaultCategory: { key: string, text: string },
        defaultSortType: 'asc' | 'desc'
    },
    pagination: {
        defaultPage: number,
        defaultPageSize: number
    }
}


export interface ExplorerFileUploadResult {
    uploadFileUid: string
}

export interface ExplorerAddFolderResult {
    folderUid: string
}


// #region FILE


export interface ExplorerFileInfoResult {
    uid: string;
    title: string;
    fileSize: string;
    fileName: string;
    fileExtension: string;
    fileMimeType: string;
    createDate: string;
    updateDate: string;
    isFileEncrypt: boolean;
    fileState : 'stable' | 'encrypting';
    isPublished : boolean;
}


//#endregion FILE