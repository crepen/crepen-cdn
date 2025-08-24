import { Injectable } from "@nestjs/common";
import { CrepenUserService } from "../user/user.service";
import { FileNotFoundError } from "@crepen-nest/lib/error/api/file/not_found_file.error";
import { UserNotFoundError } from "@crepen-nest/lib/error/api/user/not_found.user.error";
import { UserStateEnum } from "../user/enum/user-state.enum";
import { UserUnapprovalError } from "@crepen-nest/lib/error/api/user/unapproval.user.error";
import { RepositoryOptions } from "@crepen-nest/interface/repo";
import { UserEntity } from "../user/entity/user.default.entity";
import { ConfigService } from "@nestjs/config";
import { JsonWebTokenError, JwtService } from "@nestjs/jwt";
import { TokenTypeEnum } from "./enum/token-type.auth.request";
import { TokenData, TokenGroup } from "./types/token.type";
import { AuthUserTokenExpiredError } from "@crepen-nest/lib/error/api/auth/expire_token.auth.error";
import { StringUtil } from "@crepen-nest/lib/util";
import { AuthUserTokenUndefinedError } from "@crepen-nest/lib/error/api/auth/undefined_token.auth.error copy";

@Injectable()
export class CrepenAuthService {

    constructor(
        private readonly userService: CrepenUserService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) { }

    signIn = async (userId: string, userPassword?: string, options?: RepositoryOptions): Promise<TokenGroup> => {
        const userData = await this.userService.getUserByIdOrEmail(userId);

        if (!userData || userData.accountState === UserStateEnum.DELETE || !StringUtil.isMatch(userPassword, userData.accountPassword)) {
            throw new UserNotFoundError()
        }
        else if (userData.accountState === UserStateEnum.UNAPPROVED) {
            throw new UserUnapprovalError();
        }

        return this.getUserToken(userData);
    }

    getUserToken = async (user: UserEntity): Promise<TokenGroup> => {

        const expireAct = this.configService.get<string>('jwt.expireAct');
        const expireRft = this.configService.get<string>('jwt.expireRft');

        const accessToken = this.jwtService.sign(
            {
                type: TokenTypeEnum.ACCESS_TOKEN.toString(),
                uid: user.uid
            } as TokenData,
            {
                expiresIn: expireAct,
            }
        )

        const refreshToken = this.jwtService.sign(
            {
                type: TokenTypeEnum.REFRESH_TOKEN,
                uid: user.uid
            } as TokenData,
            {
                expiresIn: expireRft
            }
        )


        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }

    }


    refreshUserToken = async (refreshToken: string, options?: RepositoryOptions): Promise<TokenGroup> => {

        let tokenData: TokenData = undefined;

        if (StringUtil.isEmpty(refreshToken)) {
            throw new AuthUserTokenUndefinedError();
        }

        try {
            tokenData = await this.jwtService.verifyAsync<TokenData>(refreshToken);
        }
        catch (e) {
            throw new AuthUserTokenExpiredError();
        }

        const matchUser = await this.userService.getUserByUid(tokenData.uid);

        return this.getUserToken(matchUser);
    }


    getUserDataFromToken = async (token: string, options?: RepositoryOptions): Promise<UserEntity> => {
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