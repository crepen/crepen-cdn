import { DenyRollError } from "@crepen-nest/lib/error/api/common/deny_roll.authorize.error";
import { NotAllowTokenTypeError } from "@crepen-nest/lib/error/api/common/not_allow_token_type.authorize.error";
import { TokenUnauthorizeError } from "@crepen-nest/lib/error/api/common/token_expire.authorize.error";
import { StringUtil } from "@crepen-nest/lib/util";
import { TokenTypeEnum } from "@crepen-nest/module/app/auth/enum/token-type.auth.request";
import { ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

type TokenWhiteListType = 'all' | TokenTypeEnum.ACCESS_TOKEN | TokenTypeEnum.REFRESH_TOKEN | 'access_token' | 'refresh_token';
export class AuthJwtGuard extends AuthGuard('jwt') {
    constructor(whiteListTokenType?: TokenWhiteListType, whiteListRole?: string[]) {
        super()
        if (whiteListTokenType === 'all' || whiteListTokenType === TokenTypeEnum.ACCESS_TOKEN || whiteListTokenType === TokenTypeEnum.REFRESH_TOKEN) {
            this.whiteListTokenType = whiteListTokenType;
        }
        else {
            this.whiteListTokenType = 'all'
        }

        this.whiteListRole = whiteListRole ?? [];
    }

    static whitelist = (type: TokenWhiteListType, role?: string[]) => new AuthJwtGuard(type, role)


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
                throw new NotAllowTokenTypeError()
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
                        throw new DenyRollError()
                    }
                }


            }
        }



        if (err || !user) {
            throw new TokenUnauthorizeError();
        }

        return super.handleRequest(err, user, info, context, status);
    }
}