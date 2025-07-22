import { Module } from "@nestjs/common";
import { CrepenLoggerConfigService } from "./logger.service";

@Module({
    providers: [CrepenLoggerConfigService]
})
export class CrepenLoggerConfigModule { }