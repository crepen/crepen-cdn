import { Module } from "@nestjs/common";
import { CrepenCryptoModule } from "./crypto/crypto.module";
import { CrepenSchedulerModule } from "./scheduler/scheduler.module";
import { CrepenLoggerModule } from "./logger/logger.module";

@Module({
    imports : [
        CrepenCryptoModule,
        CrepenSchedulerModule,
        CrepenLoggerModule
    ]
})
export class CrepenCommonModule {}