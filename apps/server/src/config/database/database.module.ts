import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {

                const entityDir = __dirname + '/../../app/**/entity/*.entity{.ts,.js}'

                const dataSource = new DataSource({
                    type: 'mariadb',
                    host: configService.get<string>('db.host'),
                    port: configService.get<number>('db.port'),
                    database: configService.get<string>('db.database'),
                    username: configService.get<string>('db.username'),
                    password: configService.get<string>('db.password'),
                    entities: [entityDir],
                    synchronize: true,
                    logging: configService.get<boolean>('db.logging'),
                    
                })

                return dataSource.options;
            },
            inject: [ConfigService]
        })
    ]
})
export class CrepenDatabaseConfigModule { }