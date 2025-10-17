import { BaseResponse } from "@crepen-nest/lib/common/base.response";
import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { I18n, I18nContext } from "nestjs-i18n";
import { SignInRequest } from "../../auth/dto/sign-in.auth.request";
import { CrepenAdminAuthService } from "./auth.admin.service";
import { GrantTypeEnum } from "../../auth/enum/grant-type.auth.request";
import { TokenUnauthorizeError } from "@crepen-nest/lib/error/api/common/token_expire.authorize.error";
import { TokenGroup } from "../../auth/types/token.type";
import { CrepenAdminAuthUser } from "./dto/auth.admin.response";
import { UserRoleEnum } from "../../user/enum/user-role.enum";
import { CrepenUserService } from "../../user/user.service";
import { UserNotFoundError } from "@crepen-nest/lib/error/api/user/not_found.user.error";
import { CryptoUtil, StringUtil } from "@crepen-nest/lib/util";
import { UserInvalidatePasswordError } from "@crepen-nest/lib/error/api/user/validate_password.user.error";
import { CrepenAuthService } from "../../auth/auth.service";
import { CommonError } from "@crepen-nest/lib/error/common.error";
import { TokenTypeEnum } from "../../auth/enum/token-type.auth.request";
import { NotAllowTokenTypeError } from "@crepen-nest/lib/error/api/common/not_allow_token_type.authorize.error";
import { ChangeInitAccountPasswordRequest } from "./dto/auth.admin.request";
import { AlreadySetupInitPasswordError } from "@crepen-nest/lib/error/api/admin/auth/already_init_password.auth.admin.error";
import { DynamicConfigService } from "@crepen-nest/app/config/dynamic-config/dynamic-config.service";
import { DatabaseService } from "@crepen-nest/app/config/database/database.config.service";
import { CommonJwtGuard } from "@crepen-nest/app/config/passport/guards/common-jwt/common-jwt.guard";
import { AllowRoles } from "@crepen-nest/modules/token/allow-role.decorator";
import { AllowRoleGuard } from "@crepen-nest/modules/token/allow-role.guard";
import { AllowTokenType } from "@crepen-nest/modules/token/allow-token-type.decorator";
import { AllowTokenTypeGuard } from "@crepen-nest/modules/token/allow-token-type.guard";
import { CrepenTokenContext, CrepenTokenType, CrepenTokenMode } from "@crepen-nest/interface/common-jwt";
import { TokenContext } from "@crepen-nest/modules/token/token-data.decorator";

@Controller('admin/auth')
export class CrepenAdminAuthController {
    constructor(
        private readonly dynamicConfig: DynamicConfigService,
        private readonly adminAuthService: CrepenAdminAuthService,
        private readonly userService: CrepenUserService,
        private readonly authService: CrepenAuthService,
        private readonly dataService: DatabaseService
    ) { }



    @Post('token')
    @HttpCode(HttpStatus.OK)
    async getSignInToken(
        @Req() req: Request,
        @I18n() i18n: I18nContext,
        @Body() reqBody: SignInRequest,
        @TokenContext() tokenContext: CrepenTokenContext,
        @Headers('Authorization') token: string
    ) {
        let tokenData: TokenGroup = undefined;
        if (reqBody.grantType === GrantTypeEnum.PASSWORD) {
            if (reqBody.id === this.dynamicConfig.getConfig().initAccount.id) {

                if (StringUtil.isEmpty(this.dynamicConfig.getConfig().initAccount.userPassword)) {
                    if (reqBody.password !== this.dynamicConfig.getConfig().initAccount.password) {
                        throw new TokenUnauthorizeError()
                    }


                    tokenData = this.adminAuthService.getAdminInitAccountToken();
                }
                else {

                    const isMatchPassword = await CryptoUtil.Hash.compare(
                        reqBody.password,
                        this.dynamicConfig.getConfig().initAccount.userPassword
                    )

                    if (!isMatchPassword) {
                        throw new TokenUnauthorizeError()
                    }


                    tokenData = this.adminAuthService.getAdminInitAccountToken();
                }


            }
            else {
                try {
                    void (await this.dataService.getDefault()).isInitialized
                }
                catch (e) {
                    throw new CommonError('DB OUT', 503, 'DB_OUT')
                }


                const userInfo = await this.userService.getUserByIdOrEmail(reqBody.id);

                if (!userInfo) {
                    throw new UserNotFoundError();
                }
                else if (!userInfo.userRole.find(x => x.userRole === UserRoleEnum.ROLE_ADMIN)) {
                    throw new TokenUnauthorizeError();
                }

                const isMatchPassword = await CryptoUtil.Hash.compare(reqBody.password, userInfo.accountPassword);

                if (!isMatchPassword) {
                    throw new UserInvalidatePasswordError();
                }

                tokenData = await this.authService.getUserToken(userInfo);
            }

        }
        else if (reqBody.grantType === GrantTypeEnum.REFRESH_TOKEN) {

            const refTokenData = await this.adminAuthService.getTokenPayload(token);

            if (refTokenData.type === TokenTypeEnum.ACCESS_TOKEN) {
                throw new NotAllowTokenTypeError();
            }

            if (refTokenData?.mode === 'init') {
                // void await this.adminAuthService.verifyToken(token);
                tokenData = this.adminAuthService.getAdminInitAccountToken();
            }
            else {
                tokenData = await this.authService.refreshUserToken(token);
            }
        }


        return BaseResponse.ok<TokenGroup>(
            tokenData,
            HttpStatus.OK,
            i18n.t('common.SUCCESS')
        )
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(CommonJwtGuard, AllowTokenTypeGuard, AllowRoleGuard)
    @AllowRoles(UserRoleEnum.ROLE_ADMIN)
    @AllowTokenType(CrepenTokenType.ACCESS_TOKEN)
    async getUserData(
        @Req() req: Express.Request,
        @I18n() i18n: I18nContext,
        @TokenContext() tokenContext: CrepenTokenContext
    ) {
        let resData: CrepenAdminAuthUser | undefined = undefined;

        if (tokenContext.payload.mode === CrepenTokenMode.INIT) {
            resData = {
                mode: tokenContext.payload.mode,
                role: tokenContext.payload.role,
                user: undefined
            }
        }
        else if (tokenContext.payload.mode === CrepenTokenMode.COMMON) {
            resData = {
                mode: tokenContext.payload.mode,
                role: tokenContext.payload.role,
            };
        }
        else {

            throw new TokenUnauthorizeError();
        }

        return BaseResponse.ok<CrepenAdminAuthUser>(
            resData,
            HttpStatus.OK,
            i18n.t('common.SUCCESS')
        )
    }


    @Get('init-account')
    @HttpCode(HttpStatus.OK)
    @UseGuards(CommonJwtGuard, AllowTokenTypeGuard, AllowRoleGuard)
    @AllowRoles(UserRoleEnum.ROLE_ADMIN)
    @AllowTokenType(CrepenTokenType.ACCESS_TOKEN)
    async getInitAccountState(
        @Req() req: Express.Request,
        @I18n() i18n: I18nContext,
        @TokenContext() tokenData: CrepenTokenContext,
    ) {

        const isInitPassword = !StringUtil.isEmpty(this.dynamicConfig.getConfig().initAccount.userPassword) || tokenData.payload.mode === CrepenTokenMode.COMMON

        return BaseResponse.ok(
            {
                init_password: isInitPassword
            },
            HttpStatus.OK,
            i18n.t('common.SUCCESS')
        )
    }

    @Post('init-account/password')
    @HttpCode(HttpStatus.OK)
    @UseGuards(CommonJwtGuard, AllowTokenTypeGuard, AllowRoleGuard)
    @AllowRoles(UserRoleEnum.ROLE_ADMIN)
    @AllowTokenType(CrepenTokenType.ACCESS_TOKEN)
    async changeInitAccountPassword(
        @Req() req: Express.Request,
        @I18n() i18n: I18nContext,
        @TokenContext() tokenData: CrepenTokenContext,
        @Body() reqBody: ChangeInitAccountPasswordRequest
    ) {
        const isInitPassword = !StringUtil.isEmpty(this.dynamicConfig.getConfig().initAccount.userPassword) || tokenData.payload.mode === CrepenTokenMode.COMMON

        if (!isInitPassword) {
            if (!StringUtil.isEmpty(reqBody.password)) {
                const encryptPassword = await CryptoUtil.Hash.encrypt(reqBody.password);
                this.dynamicConfig.set('initAccount.userPassword', encryptPassword);
                this.dynamicConfig.saveStore();
            }
        }
        else {
            throw new AlreadySetupInitPasswordError()
        }

        return BaseResponse.ok(
            undefined,
            HttpStatus.OK,
            i18n.t('common.SUCCESS')
        )
    }
}