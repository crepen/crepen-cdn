import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { JwtUserRequest } from "src/interface/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthJwtGuard } from "src/config/passport/jwt/jwt.guard";
import { CrepenUserRouteService } from "./user.service";
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AddUserDto, UpdateUserDto, UpdateUserPasswordDto } from "./dto/user.common.dto";
import { CrepenCommonHttpLocaleError } from "@crepen-nest/lib/error/http/common.http.error";
import { CrepenAuthRouteService } from "../auth/auth.service";
import { I18n, I18nContext } from "nestjs-i18n";
import { CryptoUtil } from "@crepen-nest/lib/util/crypto.util";
import { BaseResponse } from "src/module/common/base.response";


@ApiTags('[COMMON_USER] 사용자 관리 컨트롤러')
@ApiHeader({
    name: 'Accept-Language', required: false, enum: ['en', 'ko']
})
@Controller('user')
export class CrepenUserRouteController {
    constructor(
        private readonly userService: CrepenUserRouteService,
        private readonly configService: ConfigService,
        private readonly authService: CrepenAuthRouteService
    ) { }


    @Get()
    //#region Decorator
    @ApiOperation({ summary: '사용자 데이터 조회', description: '로그인된 사용자 데이터 조회' })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthJwtGuard.whitelist('access_token'))
    //#endregion Decorator
    async getUserData(
        @Req() req: JwtUserRequest,
        @I18n() i18n: I18nContext
    ) {
        return BaseResponse.ok(req.user.entity);
    }


    @Put()
    //#region Decorator
    @ApiOperation({ summary: '사용자 데이터 수정', description: '로그인된 사용자 데이터 수정' })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthJwtGuard.whitelist('access_token'))
    //#endregion Decorator
    async updateUserData(
        @Req() req: JwtUserRequest,
        @Body() bodyData: UpdateUserDto,
        @I18n() i18n: I18nContext
    ) {
        await this.userService.updateUser(req.user.entity.uid, bodyData)
        return BaseResponse.ok();
    }


    @Post()
    //#region Decorator
    @ApiOperation({ summary: '사용자 데이터 생성', description: '로그인된 사용자 데이터 생성' })
    @HttpCode(HttpStatus.OK)
    //#endregion Decorator
    async addUserData(
        @Req() req: Request,
        @Body() bodyData: AddUserDto,
        @I18n() i18n: I18nContext
    ) {
        await this.userService.addUser(bodyData);
        return BaseResponse.ok();
    }



    @Put('password')
    //#region Decorator
    @ApiOperation({ summary: '사용자 데이터 생성', description: '로그인된 사용자 데이터 생성' })
    @UseGuards(AuthJwtGuard.whitelist('access_token'))
    @HttpCode(HttpStatus.OK)
    //#endregion Decorator
    async changeUserPassword(
        @Req() req: JwtUserRequest,
        @Body() bodyData: UpdateUserPasswordDto,
        @I18n() i18n: I18nContext
    ) {
        if (bodyData.confirmPassword.trim() !== bodyData.newPassword.trim()) {
            throw new CrepenCommonHttpLocaleError('cloud_user', 'USER_PASSWORD_CHANGE_NEW_PASSWORD_NOT_MATCH', HttpStatus.BAD_REQUEST)
        }

        if (!this.authService.validatePassword(bodyData.newPassword)) {
            throw new CrepenCommonHttpLocaleError('cloud_auth', 'VALIDATE_PASSWORD_REGEX_FAILED', HttpStatus.BAD_REQUEST)
        }

        const loginUserData = await this.userService.getMatchUserByUid(req.user.entity.uid);

        if (!await CryptoUtil.Hash.compare(bodyData.currentPassword, loginUserData.password)) {
            throw new CrepenCommonHttpLocaleError('cloud_user', 'USER_PASSWORD_CHANGE_CURRENT_PASSWORD_NOT_MATCH', HttpStatus.BAD_REQUEST);
        }


        const updatePassword = await this.userService.updateUser(loginUserData.uid, {
            password: bodyData.newPassword
        })

        return BaseResponse.ok(undefined, undefined, i18n.t('cloud_user.USER_PASSWORD_CHANGE_SUCCESS'));
    }


}