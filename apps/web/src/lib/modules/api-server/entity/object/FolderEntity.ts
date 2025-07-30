import { ObjectUtil } from "@web/lib/util/object.util";
import { DateUtil } from "@web/lib/util/DateUtil";
import { ParseUtil } from "@web/lib/util/ParseUtil";
import { FileEntity } from "./FileEntity";

export interface FolderEntityInterface {
    uid?: string;
    parentFolderUid?: string;
    ownerUid?: string;
    folderTitle?: string;
    state?: boolean;
    isRemoved?: boolean;
    createDate?: Date | string | number;
    updateDate?: Date | string | number;
    parentFolder?: FolderEntity | unknown;
    childFolder?: FolderEntity[] | unknown[];
}

export class FolderEntity {
    constructor() { }


    uid?: string;
    parentFolderUid?: string;
    ownerUid?: string;
    folderTitle?: string;
    state?: boolean;
    isRemoved?: boolean;
    createDate?: Date;
    updateDate?: Date;
    parentFolder?: FolderEntity;
    childFolder?: FolderEntity[];
    files? : FileEntity[];


    static recordToEntity = (data: Record<string, unknown> | unknown | undefined) => {

        if (!ObjectUtil.isObject(data)) {
            return undefined;
        }

        const instance = new FolderEntity();

        instance.uid = ParseUtil.parseString(data.uid);
        instance.state = ParseUtil.parseBoolean(data.state);
        instance.folderTitle = ParseUtil.parseString(data.folderTitle);
        instance.isRemoved = ParseUtil.parseBoolean(data.isRemoved);
        instance.ownerUid = ParseUtil.parseString(data.ownerUid);
        instance.parentFolderUid = ParseUtil.parseString(data.parentFolderUid);
        instance.createDate = DateUtil.unknownToDate(data.createDate);
        instance.updateDate = DateUtil.unknownToDate(data.updateDate);
        instance.parentFolder = FolderEntity.recordToEntity(data.parentFolder);

        if (Array.isArray(data.childFolder)) {
            instance.childFolder = data.childFolder.map(x => {
                if (!ObjectUtil.isObject(x)) {
                    return undefined;
                }

                return FolderEntity.recordToEntity(x);
            }).filter(x => x !== undefined)
        }

        if (Array.isArray(data.files)) {
            instance.files = data.files.map(x => {
                if (!ObjectUtil.isObject(x)) {
                    return undefined;
                }

                return FileEntity.recordToEntity(x);
            }).filter(x => x !== undefined)
        }



        return instance;
    }
}