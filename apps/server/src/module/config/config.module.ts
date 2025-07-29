import { Module } from "@nestjs/common";
import { PlatformI18nConfigModule } from "./i18n/i18n.module";
import { LoggerConfigModule } from "./logger/logger.module";
import { DatabaseModule } from "./database/database.config.module";
import { PassportConfigModule } from "./passport/passport.module";

@Module({
    imports : [
        PlatformI18nConfigModule,
        LoggerConfigModule,
        PassportConfigModule,
        DatabaseModule
    ]
})
export class PlatformConfigModule {}