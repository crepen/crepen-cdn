import {ConfigModule, ConfigService} from '@nestjs/config';
import { Module } from "@nestjs/common";
import YamlConfigFactory from "../yaml.factory";
import { MulterModule } from '@nestjs/platform-express';
import { multerConfigFactory } from '../multer.factory';
import { DatabaseConfigModule } from './db.module';

@Module({
    imports : [
        ConfigModule.forRoot({
            envFilePath : [
              process.env.NODE_ENV === 'prod' ? '.env.prod' : '',
              process.env.NODE_ENV === 'dev' ? '.env.development' : '',
              '.env', 
            ],
            isGlobal : true,
            load : [YamlConfigFactory]
          }),
        MulterModule.registerAsync({
            useFactory : multerConfigFactory
        }),
        DatabaseConfigModule
    ]
})

export class ServerConfigModule{}
