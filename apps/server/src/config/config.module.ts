import { Module } from "@nestjs/common";
import { CrepenI18nConfigModule } from "./i18n/i18n.module";
import { ConfigModule } from "@nestjs/config";
import { CrepenLoggerConfigModule } from "./logger/logger.module";

@Module({
    imports : [
        CrepenI18nConfigModule,
        CrepenLoggerConfigModule,
        // CrepenPassportConfigModule,
        ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true
        })
    ]
})
export class CrepenConfigModule {}