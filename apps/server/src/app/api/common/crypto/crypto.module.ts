import { Module } from "@nestjs/common";
import { CrepenCryptoService } from "./crypto.service";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports : [
        ConfigModule
    ],
    providers : [CrepenCryptoService],
    exports : [CrepenCryptoService]
})
export class CrepenCryptoModule {}