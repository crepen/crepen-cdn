import { Controller, Get } from "@nestjs/common";
import { CrepenSystemHealthService } from "./health.system.service";
import { BaseResponse } from "src/module/common/base.response";

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