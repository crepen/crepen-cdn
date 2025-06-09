import { Module } from "@nestjs/common";
import { CrepenLoggerConfigService } from "./logger.service";
import { CrepenSystemModule } from "@crepen-nest/app/system/system.module";

@Module({
    imports : [CrepenSystemModule],
    providers: [CrepenLoggerConfigService]
})
export class CrepenLoggerConfigModule { }