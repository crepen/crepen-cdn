import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SystemInstallRequestDto, SystemInstallResponseDto } from "./dto/install.system.dto";
import { CrepenSystemInstallService } from "./install.system.service";
import { BaseResponse } from "src/module/common/base.response";
import { SystemInstallCheckDatabaseRequestDto, SystemInstallCheckDatabaseResponseDto } from "./dto/db-check.system.dto";
import { CrepenApiSystemInstallHttpError } from "@crepen-nest/lib/error/http/install.system.api.http.error";


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
            installState : await this.installService.getInstallState()
        })
    }


    @Post('chk-db')
    async checkDatabaseConn(
        @Req() req: Request,
        @Body() bodyData : SystemInstallCheckDatabaseRequestDto
    )
    {
        
        const connCheck = await this.installService.checkDatabaseConnection({
            host : bodyData.dbHost,
            database : bodyData.dbDatabase,
            password : bodyData.dbPassword,
            port : bodyData.dbPort,
            username : bodyData.dbUser
        })

        if(!connCheck){
            throw CrepenApiSystemInstallHttpError.TEST_DB_CONN_FAILED;
        }

        return BaseResponse.ok<SystemInstallCheckDatabaseResponseDto>({
            state : connCheck
        })
    }
}