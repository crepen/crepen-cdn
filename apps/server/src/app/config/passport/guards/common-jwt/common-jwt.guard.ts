import { CrepenTokenContext } from "@crepen-nest/interface/common-jwt";
import { TokenUnauthorizeError } from "@crepen-nest/lib/error/api/common/token_expire.authorize.error";
import { ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

export class CommonJwtGuard extends AuthGuard('common-jwt') {
    constructor(

    ) {
        super()
    }

   

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