import { UserEntity } from "@crepen-nest/app/api/user/entity/user.default.entity";
import { UserRoleEnum } from "@crepen-nest/app/api/user/enum/user-role.enum";
import { CrepenTokenMode } from "@crepen-nest/interface/common-jwt";

export type AdminAuthMode = 'init' | 'common';

export type CrepenAdminAuthUser ={
    user? : UserEntity,
    mode? : CrepenTokenMode,
    role? : UserRoleEnum[]
}
