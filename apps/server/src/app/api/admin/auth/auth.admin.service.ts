import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenTypeEnum } from "../../auth/enum/token-type.auth.request";
import { TokenData, TokenGroup } from "../../auth/types/token.type";
import { UserRoleEnum } from "../../user/enum/user-role.enum";
import { AuthUserTokenExpiredError } from "@crepen-nest/lib/error/api/auth/expire_token.auth.error";
import { AuthUserTokenUndefinedError } from "@crepen-nest/lib/error/api/auth/undefined_token.auth.error copy";
import { StringUtil } from "@crepen-nest/lib/util";
import { DynamicConfigService } from "@crepen-nest/app/config/dynamic-config/dynamic-config.service";

@Injectable()
export class CrepenAdminAuthService {
    constructor(
        private readonly dynamicConfig: DynamicConfigService,
        private readonly jwtService: JwtService
    ) { }

    getAdminInitAccountToken = (): TokenGroup => {

        const expireAct = this.dynamicConfig.get<string | undefined>('jwt.expireAct');
        const expireRft = this.dynamicConfig.get<string | undefined>('jwt.expireRft');

        const accessToken = this.jwtService.sign(
            {
                type: TokenTypeEnum.ACCESS_TOKEN.toString(),
                uid: undefined,
                mode: 'init',
                role: [
                    UserRoleEnum.ROLE_ADMIN,
                    UserRoleEnum.ROLE_DEMO
                ].join('|')
            } as TokenData,
            {
                expiresIn: expireAct ?? '5m',
                secret: this.dynamicConfig.getConfig().jwt.secret
            }
        )

        const refreshToken = this.jwtService.sign(
            {
                type: TokenTypeEnum.REFRESH_TOKEN,
                uid: undefined,
                mode: 'init',
                role: [
                    UserRoleEnum.ROLE_ADMIN,
                    UserRoleEnum.ROLE_DEMO
                ].join('|')
            } as TokenData,
            {
                expiresIn: expireRft ?? '1h',
                secret: this.dynamicConfig.getConfig().jwt.secret
            }
        )


        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }

    }

    verifyToken = async (refToken: string) => {
        let tokenData: TokenData = undefined;

        if (StringUtil.isEmpty(refToken)) {
            throw new AuthUserTokenUndefinedError();
        }

        try {
            tokenData = await this.jwtService.verifyAsync<TokenData>(refToken);
        }
        catch (e) {
            throw new AuthUserTokenExpiredError();
        }
    }

    getTokenPayload = async (refToken?: string) => {
        let tokenData: TokenData = undefined;

        refToken = refToken?.replace("Bearer" , '').trim()

        if (StringUtil.isEmpty(refToken)) {
            throw new AuthUserTokenUndefinedError();
        }

        try {
            tokenData = await this.jwtService.verifyAsync<TokenData>(refToken , {
                secret : this.dynamicConfig.getConfig().jwt.secret
            });
        }
        catch (e) {
            throw new AuthUserTokenExpiredError();
        }

        return tokenData;
    }
}