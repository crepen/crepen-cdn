import { ObjectUtil } from "@web/lib/util/object.util";
import { DateUtil } from "@web/lib/util/DateUtil";
import { ParseUtil } from "@web/lib/util/ParseUtil";
 
export type FilePermissionType = "READ" | "WRITE";

export class FilePermissionEntity {
    constructor() { }

    uid?: string;
    fileUid?: string;
    userUid?: string;
    permissionType?: FilePermissionType;
    createDate?: Date;



    static recordToEntity = (data: Record<string, unknown> | unknown | undefined) => {

        if (!ObjectUtil.isObject(data)) {
            return undefined;
        }

        const instance = new FilePermissionEntity();

        instance.uid = ParseUtil.parseString(data.uid);
        instance.fileUid = ParseUtil.parseString(data.fileUid);
        instance.userUid = ParseUtil.parseString(data.userUid);
        instance.permissionType = ParseUtil.parseString<FilePermissionType>(data.permissionType);
        instance.createDate = DateUtil.unknownToDate(data.createDate);


        return instance;
    }
}