import { DateUtil } from "@web/lib/util/DateUtil";
import { FileStoreEntity, } from "./FileStoreEntity";
import { ObjectUtil } from "@web/lib/util/object.util";
import { ParseUtil } from "@web/lib/util/ParseUtil";
import { FilePermissionEntity } from "./FilePermissionEntity";



export class FileEntity {

    constructor() { }

    uid?: string;
    fileTitle?: string;
    ownerUid?: string;
    parentFolderUid?: string;
    isPublished?: boolean;
    isRemoved?: boolean;
    fileUid?: string;
    createDate?: Date;
    updateDate?: Date;
    fileStore?: FileStoreEntity;
    trafficSize?: number;
    matchPermissions?: FilePermissionEntity[]

    static recordToEntity = (data: Record<string, unknown> | unknown | undefined) => {

        if (!ObjectUtil.isObject(data)) {
            return undefined;
        }

        const instance = new FileEntity();

        instance.uid = ParseUtil.parseString(data.uid);
        instance.fileTitle = ParseUtil.parseString(data.fileTitle);
        instance.ownerUid = ParseUtil.parseString(data.ownerUid);
        instance.parentFolderUid = ParseUtil.parseString(data.parentFolderUid);
        instance.isPublished = ParseUtil.parseBoolean(data.isPublished);
        instance.isRemoved = ParseUtil.parseBoolean(data.isRemoved);
        instance.fileUid = ParseUtil.parseString(data.fileUid);
        instance.createDate = DateUtil.unknownToDate(data.createDate);
        instance.updateDate = DateUtil.unknownToDate(data.updateDate);
        instance.fileStore = FileStoreEntity.recordToEntity(data.fileStore);
        instance.trafficSize = ParseUtil.parseNumber(data.trafficSize);

        if (Array.isArray(data.matchPermissions)) {
            instance.matchPermissions = data.matchPermissions.map(x => {
                if (!ObjectUtil.isObject(x)) {
                    return undefined;
                }

                return FilePermissionEntity.recordToEntity(x);
            }).filter(x => x !== undefined)
        }


        return instance;
    }


}