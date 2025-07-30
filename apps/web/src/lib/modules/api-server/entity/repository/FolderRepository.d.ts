export interface FolderResultEntity {
    uid?: string;
    parentFolderUid?: string;
    ownerUid?: string;
    folderTitle?: string;
    state?: boolean;
    isRemoved?: boolean;
    createDate?: string;
    updateDate?: string;
    parentFolder?: FolderEntity;
    childFolder?: FolderEntity[];
}