import { CheckConnDB } from "src/module/decorator/chk-conn-db/chk-conn-db.decorator";
import { BaseResponse } from "@crepen-nest/lib/util/base.response";
import { Controller, Get } from "@nestjs/common";
import { CrepenSystemHealthService } from "./health.system.service";

@Controller('system/health')
export class CrepenSystemHealthController {

    constructor(
        private readonly healthService: CrepenSystemHealthService
    ) { }

    @Get()
    // @CheckConnDB()
    async getHealth() {
        // console.log(await this.healthService.getInitState())

        const initState = await this.healthService.getInitState();


        return BaseResponse.ok({
            install: initState,
            database: {
                default: await this.healthService.getDefaultDatabaseHealth()
            }
        });
    }
}