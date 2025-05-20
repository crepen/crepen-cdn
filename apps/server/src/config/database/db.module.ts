import {ConfigModule, ConfigService} from '@nestjs/config';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports : [
        TypeOrmModule.forRootAsync({
            imports : [ConfigModule],
            useFactory : (configService : ConfigService) => {

                const entityDir = __dirname + '/../../modules/**/entity/*.entity{.ts,.js}'
                
                console.log(configService.get<boolean>('db.logging') )

                return ({
                    type : 'mariadb',
                    host : configService.get<string>('db.host'),
                    port : configService.get<number>('db.port'),
                    database : configService.get<string>('db.database'),
                    username : configService.get<string>('db.username'),
                    password : configService.get<string>('db.password'),
                    entities: [entityDir],
                    synchronize: true,
                    logging : configService.get<boolean>('db.logging')
                })
            },
            inject : [ConfigService]
        })
    ]
})

export class DatabaseConfigModule{}
