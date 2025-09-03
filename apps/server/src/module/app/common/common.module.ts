import { Module } from "@nestjs/common";
import { CrepenCryptoModule } from "./crypto/crypto.module";
import { SchedulerModule } from "./scheduler/scheduler.module";
import { CrepenLoggerModule } from "./logger/logger.module";

@Module({
    imports : [
        // CrepenCryptoModule,
        // SchedulerModule,
        // CrepenLoggerModule
    ]
})
export class CrepenCommonModule {}