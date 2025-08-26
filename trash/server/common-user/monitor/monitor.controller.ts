import { Controller, Get, HttpCode, HttpStatus, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CrepenUserMonitorService } from "./monitor.service";
import { ConfigService } from "@nestjs/config";
import { I18n, I18nContext } from "nestjs-i18n";
import { AuthUser } from "@crepen-nest/lib/extensions/decorator/param/auth-user.param.decorator";
import { UserEntity } from "../user/entity/user.entity";
import { BaseResponse } from "@crepen-nest/lib/common/base.response";
import { AuthJwtGuard } from "@crepen-nest/module/config/passport/jwt/jwt.guard";

@ApiTags('[COMMON_USER] 사용자 데이터 모니터링 컨트롤러')
@ApiHeader({
    name: 'Accept-Language', required: false, enum: ['en', 'ko']
})
@Controller('monitor')
export class CrepenUserMonitorController {
    constructor(
        private readonly monitorService: CrepenUserMonitorService,
        private readonly configService: ConfigService,
    ) { }


    @Get('/traffic/cumulative')
    //#region Decorator
    @ApiOperation({ summary: '사용자 업로드 파일 누적 트래픽 조회', description: '사용자 업로드 파일 누적 트래픽 조회' })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthJwtGuard.whitelist('access_token'))
    //#endregion Decorator
    async getCumulativeData (
        @Req() req : Request,
        @I18n() i18n : I18nContext,
        @AuthUser() user : UserEntity | undefined
    ) {

        const ss = await this.monitorService.getCumulativeData(user?.uid);
        

        return BaseResponse.ok(ss);
    }
}