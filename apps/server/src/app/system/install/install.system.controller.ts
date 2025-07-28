import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, HttpStatus, Post, Req, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SystemInstallRequestDto, SystemInstallResponseDto } from "./dto/install.system.dto";
import { SystemInstallService } from "./install.system.service";
import { BaseResponse } from "src/module/common/base.response";
import { SystemInstallCheckDatabaseRequestDto, SystemInstallCheckDatabaseResponseDto } from "./dto/db-check.system.dto";
import { CrepenApiSystemInstallHttpError } from "@crepen-nest/lib/error/http/install.system.api.http.error";
import { DisableValidDBDeco } from "src/module/extension/valid-db/chk-conn-db.decorator";
import { SystemHealthService } from "../health/health.system.service";


@ApiTags('[SYSTEM] 시스템 컨트롤러')
@ApiHeader({
    name: 'Accept-Language', required: false, enum: ['en', 'ko']
})
@Controller('system/install')
@UseInterceptors(ClassSerializerInterceptor)
@DisableValidDBDeco.getClassDeco()
export class SystemInstallController {

    constructor(
        private readonly configService: ConfigService,
        private readonly installService: SystemInstallService,
        private readonly systemHealthService : SystemHealthService
    ) { }

    @Post()
    //#region Decorator
    @ApiOperation({ summary: '초기 시스템 설정', description: '초기 시스템 설정' })
    @HttpCode(HttpStatus.OK)
    //#endregion
    async installSystem(
        @Req() req: Request,
        @Body() bodyData: SystemInstallRequestDto
    ) {
        await this.installService.applySystemInit(bodyData);
        return BaseResponse.ok();
    }


    @Get()
    async getInstallState(
        @Req() req: Request,
    ) {
        return BaseResponse.ok<SystemInstallResponseDto>({
            installState: await this.systemHealthService.isPlatformInstalled()
        })
    }


    @Post('chk-db')
    async checkDatabaseConn(
        @Req() req: Request,
        @Body() bodyData: SystemInstallCheckDatabaseRequestDto
    ) {

        const connCheck = await this.installService.tryConnectDB({
            host: bodyData.dbHost,
            database: bodyData.dbDatabase,
            password: bodyData.dbPassword,
            port: bodyData.dbPort,
            username: bodyData.dbUser
        })

        return BaseResponse.ok<SystemInstallCheckDatabaseResponseDto>({
            state: connCheck
        })
    }
}