import { Controller, Get, HttpStatus } from "@nestjs/common";
import { CrepenLoggerService } from "../common/logger/logger.service";
import { ApiHeader, ApiTags } from "@nestjs/swagger";
import { BaseResponse } from "@crepen-nest/lib/common/base.response";
import { I18n, I18nContext } from "nestjs-i18n";

@ApiTags('[AUTH] 사용자 인증')
@ApiHeader({
    name: 'Accept-Language',
    required: false,
    enum: ['en', 'ko']
})
@Controller('auth')
export class CrepenAuthController {
    constructor(

        private readonly logService: CrepenLoggerService
    ) { }



    @Get('user')
    async getSessionUserData(
        @I18n() i18n: I18nContext,
    ) {
        return BaseResponse.ok(
            undefined,
            HttpStatus.OK,
            i18n.t('common.SUCCESS')
        )
    }
}