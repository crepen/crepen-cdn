import { Module } from "@nestjs/common";
import { CrepenCryptoModule } from "./crypto/crypto.module";
import { CrepenSchedulerModule } from "./scheduler/scheduler.module";

@Module({
    imports : [
        CrepenCryptoModule,
        CrepenSchedulerModule
    ]
})
export class CrepenCommonModule {}