import { Body, Controller, Get, Header, Headers, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { CrepenLoggerService } from "../common/logger/logger.service";
import { ApiBearerAuth, ApiHeader, ApiTags } from "@nestjs/swagger";
import { BaseResponse } from "@crepen-nest/lib/common/base.response";
import { I18n, I18nContext } from "nestjs-i18n";
import { AuthUser } from "@crepen-nest/lib/extensions/decorator/param/auth-user.param.decorator";
import { UserEntity } from "../user/entity/user.default.entity";
import { SignInRequest } from "./dto/sign-in.auth.request";
import { AuthJwtGuard } from "@crepen-nest/module/config/passport/jwt/jwt.guard";
import { DatabaseService } from "@crepen-nest/module/config/database/database.config.service";
import { CrepenAuthService } from "./auth.service";
import { GrantTypeEnum } from "./enum/grant-type.auth.request";
import { TokenGroup } from "./types/token.type";
import { TokenTypeEnum } from "./enum/token-type.auth.request";

@ApiTags('[AUTH] 사용자 인증')
@ApiHeader({
    name: 'Accept-Language',
    required: false,
    enum: ['en', 'ko']
})
@Controller('auth')
export class CrepenAuthController {
    constructor(

        private readonly logService: CrepenLoggerService,
        private readonly databaseService: DatabaseService,
        private readonly authService: CrepenAuthService
    ) { }



    @Get('user')
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthJwtGuard.whitelist(TokenTypeEnum.ACCESS_TOKEN))
    async getSessionUserData(
        @I18n() i18n: I18nContext,
        @AuthUser() user: UserEntity
    ) {
        return BaseResponse.ok(
            user,
            HttpStatus.OK,
            i18n.t('common.SUCCESS')
        )
    }




    @Post('/token')
    @HttpCode(HttpStatus.OK)
    async getSignInToken(
        @I18n() i18n: I18nContext,
        @Body() reqBody: SignInRequest,
        @Headers('authorization') refToken?: string
    ) {
        return (await this.databaseService.getDefault()).transaction(async (manager) => {

            let tokenGroup: TokenGroup = undefined;

            if (reqBody.grantType === GrantTypeEnum.PASSWORD) {
                tokenGroup = await this.authService.signIn(reqBody.id, reqBody.password, { manager: manager });
            }
            else if (reqBody.grantType === GrantTypeEnum.REFRESH_TOKEN) {
                tokenGroup = await this.authService.refreshUserToken(refToken?.replace('Bearer', '').trim())
            }

            return BaseResponse.ok(
                tokenGroup,
                HttpStatus.OK,
                i18n.t('common.SUCCESS')
            )
        })
    }
}