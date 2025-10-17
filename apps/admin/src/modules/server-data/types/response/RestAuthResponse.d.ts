import { RestSessionUser, RestSessionUserMode } from "../entity/RestAuthType"
import { RestUserEntity, RestUserRole } from "../entity/RestUserType"

export type RestAdminAuthTokenResult = RestSessionToken;
export type RestAdminRefreshTokenResult = RestSessionToken;

export type RestAdminSessionUserResult = RestSessionUser;
export type RestAdminInitAccountStateResult = {
    initPassword : boolean
}

// export type RestAdminChangeInitAccountPasswordResult