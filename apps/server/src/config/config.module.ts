import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from "@nestjs/common";
import LoadYamlConfigFactory from "./env/load-yaml.factory";
import { MulterModule } from '@nestjs/platform-express';
import { multerConfigFactory } from './system/multer.factory';
import { DatabaseConfigModule } from './database/db.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        process.env.NODE_ENV === 'prod' ? '.env.prod' : '',
        process.env.NODE_ENV === 'dev' ? '.env.development' : '',
        '.env',
      ],
      isGlobal: true,
      load: [LoadYamlConfigFactory]
    }),
    MulterModule.registerAsync({
      useFactory: multerConfigFactory
    }),
    DatabaseConfigModule,
    // PassportConfigModule
  ]
})

export class ServerConfigModule { }
