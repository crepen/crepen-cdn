import { Controller, Get } from "@nestjs/common";
import { SystemHealthService } from "./health.system.service";
import { BaseResponse } from "src/module/common/base.response";
import { ApiHeader, ApiTags } from "@nestjs/swagger";
import { DisableValidDBDeco } from "src/module/extension/valid-db/chk-conn-db.decorator";
import { I18n, I18nContext } from "nestjs-i18n";
import { CommonError } from "src/module/error/common.error";

@ApiTags('[SYSTEM] 서버 Health 컨트롤러')
@ApiHeader({
    name: 'Accept-Language', required: false, enum: ['en', 'ko']
})
@Controller('system/health')
@DisableValidDBDeco.getClassDeco()
export class SystemHealthController {

    constructor(
        private readonly healthService: SystemHealthService
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