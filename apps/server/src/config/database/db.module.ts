import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {

                const entityDir = __dirname + '/../../modules/**/entity/*.entity{.ts,.js}'

                console.log(configService.get<boolean>('db.logging'))

                const dataSource = new DataSource({
                    type: 'mariadb',
                    host: configService.get<string>('db.host'),
                    port: configService.get<number>('db.port'),
                    database: configService.get<string>('db.database'),
                    username: configService.get<string>('db.username'),
                    password: configService.get<string>('db.password'),
                    entities: [entityDir],
                    synchronize: true,
                    logging: configService.get<boolean>('db.logging')
                })


                try {
                    Logger.log("Check database connection.", TypeOrmModule.name)
                    await dataSource.initialize();
                    Logger.log("Database connect success.", TypeOrmModule.name)
                } catch (err) {
                    Logger.error(`Database initialize failed`);
                    Logger.error(` ⌞ ${err.message}`,)

                    process.exit();
                }


                return dataSource.options;
            },
            inject: [ConfigService]
        })
    ]
})

export class DatabaseConfigModule { }
