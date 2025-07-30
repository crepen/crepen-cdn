import { ObjectUtil } from "@web/lib/util/object.util";
import { DateUtil } from "@web/lib/util/DateUtil";
import { ParseUtil } from "@web/lib/util/ParseUtil";



export class FileStoreEntity {


    uid?: string;
    uploaderUid?: string;
    fileName?: string;
    fileType?: string;
    fileSize?: number;
    fileExt?: string;
    originFileMine?: string;
    hash?: string;
    expireDate?: Date;
    createDate?: Date;
    updateDate?: Date;


    static recordToEntity = (data: Record<string, unknown> | unknown | undefined) => {

        if (!ObjectUtil.isObject(data)) {
            return undefined;
        }

        const instance = new FileStoreEntity();

        instance.createDate = DateUtil.unknownToDate(data.createDate);
        instance.expireDate = DateUtil.unknownToDate(data.expireDate);
        instance.updateDate = DateUtil.unknownToDate(data.updateDate);
        instance.fileExt = ParseUtil.parseString(data.fileExt);
        instance.fileName = ParseUtil.parseString(data.fileName);
        instance.fileSize = ParseUtil.parseNumber(data.fileSize);
        instance.fileType = ParseUtil.parseString(data.fileType);
        instance.hash = ParseUtil.parseString(data.hash);
        instance.originFileMine = ParseUtil.parseString(data.originFileMine);
        instance.uid = ParseUtil.parseString(data.uid);
        instance.uploaderUid = ParseUtil.parseString(data.uploaderUid);
        
        

        return instance;
    }


}