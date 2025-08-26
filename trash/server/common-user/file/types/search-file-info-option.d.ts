import { FilePermissionType } from "@crepen-nest/lib/types/enum/file-permission-type.enum"

export interface SearchFileInfoOptions{
    includeStore? : boolean,
    permission? : {
        userUid : string,
        permissionType : FilePermissionType
    },
    includeTrafficSize? : boolean
}