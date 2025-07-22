import { BaseResponse } from "@crepen-nest/lib/util/base.response";
import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger";


@ApiTags('[SYSTEM] 시스템 컨트롤러')
@ApiHeader({
    name: 'Accept-Language', required: false, enum: ['en', 'ko']
})
@Controller('system/install')
export class CrepenSystemInstallController {

    constructor(
        private readonly configService: ConfigService
    ) { }

    @Post()
    //#region Decorator
    @ApiOperation({ summary: '시스템 설정', description: '시스템 설정' })
    @HttpCode(HttpStatus.OK)
    //#endregion
    async installSystem(
        @Req() req : Request
    ) {
        return BaseResponse.ok();
    }
}