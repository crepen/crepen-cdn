import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Query, Req } from "@nestjs/common";
import { CrepenLoggerService } from "../common/logger/logger.service";
import { ApiHeader, ApiTags } from "@nestjs/swagger";
import { BaseResponse } from "@crepen-nest/lib/common/base.response";
import { I18n, I18nContext } from "nestjs-i18n";
import { AddUserRequest } from "./dto/add-user.user.request";
import { CrepenUserService } from "./user.service";
import { DatabaseService } from "@crepen-nest/module/config/database/database.config.service";
import { UserNotFoundError } from "@crepen-nest/lib/error/api/user/not_found.user.error";
import { AddUserValidateCheckRequest } from "./dto/validate-check.user.request";
import { CheckUserValueValidateCategory } from "./types/validate-add-value.user";


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
    async addUserValidateCheck(
        @Req() req: Request,
        @I18n() i18n: I18nContext,
        @Body() reqBody: AddUserValidateCheckRequest,
        @Query('category') category : string
    ) {

        const validateData = await this.userService.validateAddUserInfo(
            (category.split(',')) as CheckUserValueValidateCategory[],
            i18n,
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





}