import { Body, Controller, Get, HttpStatus, Post, Req } from "@nestjs/common";
import { CrepenLoggerService } from "../common/logger/logger.service";
import { ApiHeader, ApiTags } from "@nestjs/swagger";
import { BaseResponse } from "@crepen-nest/lib/common/base.response";
import { I18n, I18nContext } from "nestjs-i18n";
import { AddUserRequest } from "./dto/add-user.user.request";
import { CrepenUserService } from "./user.service";
import { DatabaseService } from "@crepen-nest/module/config/database/database.config.service";


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



    @Post('/add')
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
}