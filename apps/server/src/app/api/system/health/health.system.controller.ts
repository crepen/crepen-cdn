import { Controller, Get } from "@nestjs/common";
import { SystemHealthService } from "./health.system.service";
import { ApiHeader, ApiTags } from "@nestjs/swagger";
import { DisableValidDBDeco } from "@crepen-nest/lib/extensions/decorator/chk-conn-db.decorator";
import { BaseResponse } from "@crepen-nest/lib/common/base.response";
import { DynamicConfigService } from "@crepen-nest/app/config/dynamic-config/dynamic-config.service";

@ApiTags('[SYSTEM] 서버 Health 컨트롤러')
@ApiHeader({
    name: 'Accept-Language', required: false, enum: ['en', 'ko']
})
@Controller('system/health')
@DisableValidDBDeco.getClassDeco()
export class SystemHealthController {

    constructor(
        private readonly healthService: SystemHealthService,
        private readonly dynamicConfig : DynamicConfigService
    ) { }

    @Get()
    @DisableValidDBDeco.getMethodDeco()
    async getHealth() {

        const initState = await this.healthService.isPlatformInstalled();
        const defaultDBState = await this.healthService.isDefaultDatabaseConnect();
        const localDBState = await this.healthService.isLocalDatabaseConnect();


        return BaseResponse.ok({
            api: true,
            install: initState,
            database: {
                default: defaultDBState,
                local: localDBState
            }
        });
    }
}