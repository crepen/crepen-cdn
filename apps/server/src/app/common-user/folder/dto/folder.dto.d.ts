import { FolderEntity } from "../entity/folder.entity";

export interface LoadFolderDataResponseDto {
    info : FolderEntity
}

export interface LoadFolderDataWithChildResponseDto extends LoadFolderDataResponseDto {
    children? : {
        folder? : FolderEntity[],
        file? : any[]
    }    
}