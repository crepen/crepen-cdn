import { ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { I18nContext } from "nestjs-i18n";
import { CrepenLocaleHttpException } from "src/lib/exception/crepen.http.exception";

type TokenWhiteListType = 'all' | 'access_token' | 'refresh_token';
export class CrepenAuthJwtGuard extends AuthGuard('jwt') {
    constructor(whiteTokenType?: TokenWhiteListType) {
        super()
        if (whiteTokenType === 'all' || whiteTokenType === 'access_token' || whiteTokenType === 'refresh_token') {
            this.whiteToken = whiteTokenType;
        }
        else {
            this.whiteToken = 'all'
        }

    }

    static whitelist = (type: TokenWhiteListType) => new CrepenAuthJwtGuard(type)


    whiteToken: TokenWhiteListType = 'all';



    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {


        // White Token Type Filter
        if (typeof user === 'object') {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (this.whiteToken !== 'all' && this.whiteToken !== user?.payload?.type) {
                throw new CrepenLocaleHttpException('cloud_auth', 'AUTHORIZATION_NOT_ALLOW_TYPE', HttpStatus.UNAUTHORIZED)
            }
        }



        if (err || !user) {
            throw new CrepenLocaleHttpException('cloud_auth', 'AUTHORIZATION_TOKEN_EXPIRED', HttpStatus.UNAUTHORIZED)
        }

        return super.handleRequest(err, user, info, context, status);
    }
}