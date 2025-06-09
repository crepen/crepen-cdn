import { ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { I18nContext } from "nestjs-i18n";
import { CrepenLocaleHttpException } from "src/lib/exception/crepen.http.exception";
import { StringUtil } from "@crepen-nest/lib/util/string.util";

type TokenWhiteListType = 'all' | 'access_token' | 'refresh_token';
export class CrepenAuthJwtGuard extends AuthGuard('jwt') {
    constructor(whiteListTokenType?: TokenWhiteListType, whiteListRole?: string[]) {
        super()
        if (whiteListTokenType === 'all' || whiteListTokenType === 'access_token' || whiteListTokenType === 'refresh_token') {
            this.whiteListTokenType = whiteListTokenType;
        }
        else {
            this.whiteListTokenType = 'all'
        }

        this.whiteListRole = whiteListRole ?? [];
    }

    static whitelist = (type: TokenWhiteListType, role?: string[]) => new CrepenAuthJwtGuard(type, role)


    whiteListTokenType: TokenWhiteListType = 'all';
    whiteListRole: string[] = [];


    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {


        // White Token Type Filter
        if (typeof user === 'object') {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (this.whiteListTokenType !== 'all' && this.whiteListTokenType !== user?.payload?.type) {
                throw new CrepenLocaleHttpException('cloud_auth', 'AUTHORIZATION_NOT_ALLOW_TYPE', HttpStatus.UNAUTHORIZED)
            }
            else if (this.whiteListRole.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                if (typeof (user?.payload?.role) === 'string') {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    const roleList = ((user?.payload?.role as string) ?? '').split(',')
                        .filter(x => !StringUtil.isEmpty(x))
                        .map(x => x.trim());

                    let isPass: boolean = false;

                    for (const item of this.whiteListRole) {
                        if (roleList.includes(item)) {
                            isPass = true;
                        }
                    }

                    if (isPass === false) {
                        throw new CrepenLocaleHttpException('cloud_auth', 'AUTHORIZATION_ROLE_BLOCK', HttpStatus.UNAUTHORIZED)
                    }
                }


            }
        }



        if (err || !user) {
            throw new CrepenLocaleHttpException('cloud_auth', 'AUTHORIZATION_TOKEN_EXPIRED', HttpStatus.UNAUTHORIZED)
        }

        return super.handleRequest(err, user, info, context, status);
    }
}