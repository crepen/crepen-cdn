import { Module } from "@nestjs/common";
import { MulterModule } from '@nestjs/platform-express';
import { multerConfigFactory } from './system/multer.factory';
import { DatabaseConfigModule } from './database/db.module';
import { I18nConfigModule } from './i18n/i18n.module';
import { CrepenEnvModule } from './env/env.module';

@Module({
  imports: [
    CrepenEnvModule,
    MulterModule.registerAsync({
      useFactory: multerConfigFactory
    }),
    DatabaseConfigModule,
    I18nConfigModule,
  ]
})

export class ServerConfigModule { }
