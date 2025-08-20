import { Body, Controller, Get, HttpStatus, Post } from "@nestjs/common";
import { CrepenLoggerService } from "../common/logger/logger.service";
import { ApiHeader, ApiTags } from "@nestjs/swagger";
import { BaseResponse } from "@crepen-nest/lib/common/base.response";
import { I18n, I18nContext } from "nestjs-i18n";
import { AddUserRequest } from "./dto/add-user.user.request";


@ApiTags('[USER] 사용자 관리')
@ApiHeader({
    name: 'Accept-Language',
    required: false,
    enum: ['en', 'ko']
})
@Controller('user')
export class CrepenUserController {
    constructor(

        private readonly logService: CrepenLoggerService
    ) { }



    @Post('/add')
    async addUser(
        @I18n() i18n: I18nContext,
        @Body() reqBody : AddUserRequest
    ) {


        return BaseResponse.ok(
            undefined,
            HttpStatus.OK,
            i18n.t('common.SUCCESS')
        )
    }
}