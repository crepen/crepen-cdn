import { Module } from "@nestjs/common";
import { CrepenCryptoModule } from "./crypto/crypto.module";

@Module({
    imports : [
        CrepenCryptoModule
    ]
})
export class CrepenCommonModule {}