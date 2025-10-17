import { Injectable } from "@nestjs/common";
import { CrepenUserService } from "../user/user.service";
import { UserNotFoundError } from "@crepen-nest/lib/error/api/user/not_found.user.error";
import { UserStateEnum } from "../user/enum/user-state.enum";
import { UserUnapprovalError } from "@crepen-nest/lib/error/api/user/unapproval.user.error";
import { RepositoryOptions } from "@crepen-nest/interface/repo";
import { UserEntity } from "../user/entity/user.default.entity";
import { JwtService } from "@nestjs/jwt";
import { TokenData, TokenGroup, TokenOriginData } from "./types/token.type";
import { AuthUserTokenExpiredError } from "@crepen-nest/lib/error/api/auth/expire_token.auth.error";
import { CryptoUtil, StringUtil } from "@crepen-nest/lib/util";
import { AuthUserTokenUndefinedError } from "@crepen-nest/lib/error/api/auth/undefined_token.auth.error copy";
import { DynamicConfigService } from "@crepen-nest/app/config/dynamic-config/dynamic-config.service";
import { CrepenTokenType } from "@crepen-nest/interface/common-jwt";

@Injectable()
export class CrepenAuthService {

    constructor(
        private readonly userService: CrepenUserService,
        private readonly dynamicConfig: DynamicConfigService,
        private readonly jwtService: JwtService,
    ) { }

    signIn = async (userId: string, userPassword?: string, options?: RepositoryOptions): Promise<TokenGroup> => {
        const userData = await this.userService.getUserByIdOrEmail(userId);

        if (!userData || userData.accountState === UserStateEnum.DELETE || !(await CryptoUtil.Hash.compare(userPassword, userData.accountPassword))) {
            throw new UserNotFoundError()
        }
        else if (userData.accountState === UserStateEnum.UNAPPROVED) {
            throw new UserUnapprovalError();
        }

        return this.getUserToken(userData);
    }

    getUserToken = async (user: UserEntity): Promise<TokenGroup> => {

        const expireAct = this.dynamicConfig.get<string | undefined>('jwt.expireAct');
        const expireRft = this.dynamicConfig.get<string | undefined>('jwt.expireRft');


        const accessToken = this.jwtService.sign(
            {
                type: CrepenTokenType.ACCESS_TOKEN,
                uid: user.uid,
                mode: 'common',
                role: (user.userRole ?? []).map(x => x.userRole).join('|')
            } as TokenOriginData,
            {
                expiresIn: expireAct ?? '5m',
            }
        )

        const refreshToken = this.jwtService.sign(
            {
                type: CrepenTokenType.REFRESH_TOKEN,
                uid: user.uid,
                mode: 'common',
                role: (user.userRole ?? []).map(x => x.userRole).join('|')
            } as TokenOriginData,
            {
                expiresIn: expireRft ?? '1h'
            }
        )


        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }

    }


    refreshUserToken = async (refreshToken?: string, options?: RepositoryOptions): Promise<TokenGroup> => {

        let tokenData: TokenData = undefined;
        const refToken = refreshToken?.replace('Bearer', '').trim()

        if (StringUtil.isEmpty(refToken)) {
            throw new AuthUserTokenUndefinedError();
        }

        try {
            tokenData = await this.jwtService.verifyAsync<TokenData>(refToken);
        }
        catch (e) {
            throw new AuthUserTokenExpiredError();
        }

        const matchUser = await this.userService.getUserByUid(tokenData.uid);

        return this.getUserToken(matchUser);
    }


    getUserDataFromToken = async (tokenStr: string, options?: RepositoryOptions): Promise<UserEntity> => {
        const token = tokenStr.replace('Bearer', '').trim();
        let tokenData: TokenData = undefined;
        try {
            tokenData = await this.jwtService.verifyAsync<TokenData>(token);
        }
        catch (e) {
            throw new AuthUserTokenExpiredError();
        }


        const matchUser = await this.userService.getUserByUid(tokenData.uid);


        if (!matchUser) {
            throw new UserNotFoundError();
        }

        return matchUser;
    }


}