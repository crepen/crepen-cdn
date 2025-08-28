import { Body, Controller, Get, Headers, HttpCode, HttpStatus, NotFoundException, Param, ParseArrayPipe, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { CrepenLoggerService } from "../common/logger/logger.service";
import { ApiBearerAuth, ApiHeader, ApiTags } from "@nestjs/swagger";
import { BaseResponse } from "@crepen-nest/lib/common/base.response";
import { I18n, I18nContext } from "nestjs-i18n";
import { AddUserRequest } from "./dto/add-user.user.request";
import { CrepenUserService } from "./user.service";
import { DatabaseService } from "@crepen-nest/module/config/database/database.config.service";
import { UserNotFoundError } from "@crepen-nest/lib/error/api/user/not_found.user.error";
import { AddUserValidateCheckRequest } from "./dto/validate-check.user.request";
import { CheckUserValueValidateCategory } from "./types/validate-add-value.user";
import { UserEditCategory, UserEditDataRequest } from "./dto/edit-data.user.request";
import { AuthUser } from "@crepen-nest/lib/extensions/decorator/param/auth-user.param.decorator";
import { UserEntity } from "./entity/user.default.entity";
import { AuthJwtGuard } from "@crepen-nest/module/config/passport/jwt/jwt.guard";
import { TokenTypeEnum } from "../auth/enum/token-type.auth.request";
import { CrepenAuthService } from "../auth/auth.service";
import { CustomParseStringToArrayPipe } from "@crepen-nest/lib/extensions/pipe/custom-parse-array.pipe";


@ApiTags('[USER] 사용자 관리')
@ApiHeader({
    name: 'Accept-Language',
    required: false,
    enum: ['en', 'ko']
})
@Controller('user')
export class CrepenUserController {
    constructor(

        private readonly logService: CrepenLoggerService,
        private readonly userService: CrepenUserService,
        private readonly databaseService: DatabaseService,
        private readonly authService: CrepenAuthService,
    ) { }


    @Get('/find/:type')
    @HttpCode(HttpStatus.OK)
    async findAccountId(
        @Req() req: Request,
        @I18n() i18n: I18nContext,
        @Param('type') type: string,
        @Query('key') emailOrId: string,
        @Query('reset') resetUrl: string
    ) {

        return (await this.databaseService.getDefault()).transaction(async (manager) => {

            if (type !== 'id' && type !== 'password') {
                throw new NotFoundException();
            }
            else {
                await this.userService.findIdOrPassword(type, emailOrId, resetUrl, { manager: manager })
            }

            return BaseResponse.ok(
                undefined,
                HttpStatus.OK,
                i18n.t('common.SUCCESS')
            )


        });


    }


    @Post('/add')
    @HttpCode(HttpStatus.OK)
    async addUser(
        @Req() req: Request,
        @I18n() i18n: I18nContext,
        @Body() reqBody: AddUserRequest
    ) {
        return (await this.databaseService.getDefault()).transaction(async (manager) => {

            const addUser = await this.userService.addUser(
                reqBody.id,
                reqBody.password,
                reqBody.name,
                reqBody.email,
                { manager: manager }
            )

            return BaseResponse.ok(
                {
                    userUid: addUser.uid
                },
                HttpStatus.OK,
                i18n.t('common.SUCCESS')
            )
        })

    }

    @Post('/add/validate')
    @HttpCode(HttpStatus.OK)
    // @UseGuards(AuthJwtGuard.whitelist(TokenTypeEnum.ACCESS_TOKEN))
    async addUserValidateCheck(
        @Req() req: Request,
        @I18n() i18n: I18nContext,
        @Body() reqBody: AddUserValidateCheckRequest,
        @AuthUser() user: UserEntity,
        @Headers('authorization') token: string | undefined,
        @Query('category', CustomParseStringToArrayPipe) category: CheckUserValueValidateCategory[]
    ) {
        let userData: UserEntity = undefined;
        try {
            userData = await this.authService.getUserDataFromToken(token);
        }
        catch (e) {

        }

        const validateData = await this.userService.validateAddUserInfo(
            category,
            i18n,
            userData,
            reqBody.id,
            reqBody.password,
            reqBody.name,
            reqBody.email
        )

        return BaseResponse.ok(
            validateData,
            HttpStatus.OK,
            i18n.t('common.SUCCESS')
        )
    }


    @Put()
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthJwtGuard.whitelist(TokenTypeEnum.ACCESS_TOKEN))
    async editUserData(
        @Req() req: Request,
        @I18n() i18n: I18nContext,
        @Body() reqBody: UserEditDataRequest,
        @AuthUser() user: UserEntity,
        @Query('edit', CustomParseStringToArrayPipe) editCategory?: UserEditCategory[],
    ) {
        return (await this.databaseService.getDefault()).transaction(async (manager) => {

            void await this.userService.editUserData(
                editCategory,
                user.uid,
                reqBody.name,
                reqBody.email,
                reqBody.language,
                {manager : manager}
            )

            return BaseResponse.ok(
                {
                    edit: editCategory
                },
                HttpStatus.OK,
                i18n.t('common.SUCCESS')
            )
        })
    }





}