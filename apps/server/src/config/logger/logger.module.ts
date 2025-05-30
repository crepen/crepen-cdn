import { Module } from "@nestjs/common";
import { CrepenLoggerConfigService } from "./logger.service";
import { CrepenSystemConfigModule } from "../system/system.module";

@Module({
    imports : [CrepenSystemConfigModule],
    providers: [CrepenLoggerConfigService]
})
export class CrepenLoggerConfigModule { }