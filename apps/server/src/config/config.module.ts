import { Module } from "@nestjs/common";
import { CrepenDatabaseConfigModule } from "./database/database.module";
import { CrepenEnvConfigModule } from "./env/env.module";
import { CrepenI18nConfigModule } from "./i18n/i18n.module";
import { CrepenLoggerConfigModule } from "./logger/logger.module";
import { CrepenPassportConfigModule } from "./passport/passport.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports : [
        CrepenEnvConfigModule,
        CrepenI18nConfigModule,
        CrepenLoggerConfigModule,
        CrepenDatabaseConfigModule,
        CrepenPassportConfigModule,
        
    ]
})
export class CrepenConfigModule {}