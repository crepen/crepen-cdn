import { Controller, Get } from "@nestjs/common";
import { CrepenSystemHealthService } from "./health.system.service";
import { BaseResponse } from "src/module/common/base.response";
import { ApiHeader, ApiTags } from "@nestjs/swagger";

@ApiTags('[SYSTEM] 서버 Health 컨트롤러')
@ApiHeader({
    name: 'Accept-Language', required: false, enum: ['en', 'ko']
})
@Controller('system/health')
export class CrepenSystemHealthController {

    constructor(
        private readonly healthService: CrepenSystemHealthService
    ) { }

    @Get()
    async getHealth() {

        const initState = await this.healthService.getInitState();


        return BaseResponse.ok({
            install: initState,
            database: {
                default: await this.healthService.getDefaultDatabaseHealth(),
                local: await this.healthService.getLocalDatabaseHealth()
            }
        });
    }
}