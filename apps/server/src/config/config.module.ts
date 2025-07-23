import { Module } from "@nestjs/common";
import { CrepenI18nConfigModule } from "./i18n/i18n.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CrepenLoggerConfigModule } from "./logger/logger.module";
import { CrepenDatabaseModule } from "./database/database.config.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CrepenPassportConfigModule } from "./passport/passport.module";

@Module({
    imports : [
        // ConfigService,
        CrepenI18nConfigModule,
        CrepenLoggerConfigModule,
        CrepenPassportConfigModule,
        ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true
        }),
        CrepenDatabaseModule
    ]
})
export class CrepenConfigModule {}