import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SystemInstallRequestDto, SystemInstallResponseDto } from "./dto/install.system.dto";
import { CrepenSystemInstallService } from "./install.system.service";
import { BaseResponse } from "src/module/common/base.response";


@ApiTags('[SYSTEM] 시스템 컨트롤러')
@ApiHeader({
    name: 'Accept-Language', required: false, enum: ['en', 'ko']
})
@Controller('system/install')
@UseInterceptors(ClassSerializerInterceptor)
export class CrepenSystemInstallController {

    constructor(
        private readonly configService: ConfigService,
        private readonly installService: CrepenSystemInstallService
    ) { }

    @Post()
    //#region Decorator
    @ApiOperation({ summary: '시스템 설정', description: '시스템 설정' })
    @HttpCode(HttpStatus.OK)
    //#endregion
    async installSystem(
        @Req() req: Request,
        @Body() bodyData: SystemInstallRequestDto
    ) {

        await this.installService.applySystemInit(
            bodyData.dbHost,
            bodyData.dbPort,
            bodyData.dbUser,
            bodyData.dbPassword,
            bodyData.dbDatabase
        );

        return BaseResponse.ok();
    }


    @Get()
    async getInstallState(
        @Req() req: Request,
    ) {
        return BaseResponse.ok<SystemInstallResponseDto>({
            installState : await this.installService.getInstallState()
        })
    }
}