import { Module } from "@nestjs/common";
import { LoggerConfigService } from "./logger.service";

@Module({
    providers: [LoggerConfigService]
})
export class LoggerConfigModule { }