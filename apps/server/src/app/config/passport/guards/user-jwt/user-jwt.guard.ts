import { UserRoleEnum } from "@crepen-nest/app/api/user/enum/user-role.enum";
import { CrepenTokenContext } from "@crepen-nest/interface/common-jwt";
import { TokenUnauthorizeError } from "@crepen-nest/lib/error/api/common/token_expire.authorize.error";
import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

export class UserJwtGuard extends AuthGuard('user-jwt') {
    constructor() {
        super();
    }

    static ROLE_KEY = 'user-jwt-role-key'

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    handleRequest<TUser = any>(err: any, user: CrepenTokenContext, info: any, context: ExecutionContext, status?: any): TUser {
        if (err || !user) {
            throw new TokenUnauthorizeError();
        }

        return super.handleRequest(err, user, info, context, status);
    }
}