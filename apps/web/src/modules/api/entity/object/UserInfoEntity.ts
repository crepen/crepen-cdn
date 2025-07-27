import { ObjectUtil } from "@web/lib/util/object.util";
import { ParseUtil } from "@web/modules/util/ParseUtil";
import { DateUtil } from "@web/modules/util/DateUtil";

export interface UserInfoEntityInterface {
    uid?: string;
    id?: string;
    name?: string;
    email?: string;
    createDate?: Date;
    updateDate?: Date;
    isLock?: boolean;
    roles?: string[];
}

export class UserInfoEntity {

    constructor() { }

    uid?: string;
    id?: string;
    name?: string;
    email?: string;
    createDate?: Date;
    updateDate?: Date;
    isLock?: boolean;
    roles?: string[];

    
    static recordToEntity = (data: Record<string, unknown> | unknown | undefined) => {

        if (!ObjectUtil.isObject(data)) {
            return undefined;
        }

        const instance = new UserInfoEntity();

        
        instance.uid = ParseUtil.parseString(data.uid);
        instance.id = ParseUtil.parseString(data.id);
        instance.name = ParseUtil.parseString(data.name);
        instance.email = ParseUtil.parseString(data.email);
        instance.createDate = DateUtil.unknownToDate(data.createDate);
        instance.updateDate = DateUtil.unknownToDate(data.updateDate);
        instance.isLock = ParseUtil.parseBoolean(data.isLock);
        instance.roles = ParseUtil.parseStringArray(data.roles);
        
        return instance;
    }


}