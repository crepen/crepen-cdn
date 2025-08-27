import { INestApplicationContext, Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SQLiteDataSourceProvider } from "@crepen-nest/config/provider/database/sqlite.database.provider";
import { DataSource } from "typeorm";
import * as os from 'os';
import { LocalConfigEntity } from "@crepen-nest/lib/types/entity/local/config.local.entity";
import { CryptoUtil, StringUtil } from "@crepen-nest/lib/util";
import { join } from "path";
import { SystemError } from "@crepen-nest/lib/error/system.error";
import { NestFactory } from "@nestjs/core";
import { GlobalDataPath } from "@crepen-nest/lib/types/enum/global-path.enum";
import { InitLoadDatabaseConfigError } from "@crepen-nest/lib/error/platform/init_db_config.system.error";
import { InitJwtConfigError } from "@crepen-nest/lib/error/platform/init_jwt_config.system.error";
import { InitLocalDatabaseInitializeError } from "@crepen-nest/lib/error/platform/init_local_db.system.error";
import { InitLocalDatabaseConnectError } from "@crepen-nest/lib/error/platform/init_local_db_conn.system.error";
import { InitPathConfigError } from "@crepen-nest/lib/error/platform/init_path_config.system.error";
import { InitSecretConfigError } from "@crepen-nest/lib/error/platform/init_secret_config.system.error copy";

export class PreInitializer {
    constructor(
        private context: INestApplicationContext
    ) {
        this.configService = context.get(ConfigService);
    }

    configService: ConfigService;

    static current = async () => {
        return new PreInitializer(await NestFactory.createApplicationContext({
            module: PreAppModule,
            imports: [
                ConfigModule.forRoot({ isGlobal: true, load: [() => undefined] })
            ]
        }));
    }


    active = async () => {
        try {
            await this.initDatabase();
            await this.initConfig();

            return this;
        }
        catch (e) {
            if (e instanceof SystemError) {
                Logger.error(e.message, 'PRE_INIT');

                if (e.cause && process.env.NODE_ENV === 'developments') {
                    Logger.error(e.getInnerError(), 'PRE_INIT')
                }
            }
            else if (e instanceof Error) {
                Logger.error(e.message, 'PRE_INIT')
            }

            process.exit(1)
        }

    }

    getPreConfig = () => {
        return this.configService.get<object>('root');
    }

    destroy = async () => {
        try {
            await this.context.close();
        }
        catch (e) {
            /** empty */
        }

    }

    private initDatabase = async () => {

        // Check Connect Local DB
        let dataSource: DataSource;

        try {
            dataSource = await SQLiteDataSourceProvider.getDataSource().initialize();
        }
        catch (e) {
            throw new InitLocalDatabaseConnectError();
        }

        try {
            const tableList = await dataSource.query<{ name: string }[]>(`SELECT name FROM sqlite_master WHERE type='table'`);

            if (!tableList.find(x => x.name === 'config')) {
                await dataSource.query(`
                    CREATE TABLE config (
                        "key" TEXT NOT NULL,
                        value TEXT NOT NULL,
                        CONSTRAINT NewTable_PK PRIMARY KEY ("key")
                    )
                `);
            }

            if (!tableList.find(x => x.name === 'state')) {
                await dataSource.query(`
                    CREATE TABLE state (
                        "key" TEXT NOT NULL,
                        value TEXT NOT NULL,
                        CONSTRAINT NewTable_PK PRIMARY KEY ("key")
                    )
                `);
            }
        }
        catch (e) {
            throw new InitLocalDatabaseInitializeError();
        }
    }

    private initConfig = async () => {
        await this.loadDatabaseConfig();
        await this.loadJwtConfig();
        await this.loadPathConfig();
        await this.loadSecretConfig();
    }




    //#region CONFIG_INITIALIZER

    loadDatabaseConfig = async () => {
        let dataSource: DataSource;

        try {
            dataSource = await SQLiteDataSourceProvider
                .getDataSource()
                .initialize()
        }
        catch (e) {
            return;
        }

        try {
            const dbData = await dataSource
                .getRepository(LocalConfigEntity)
                .findOne({
                    where: {
                        key: 'db'
                    }
                })

            if (dbData === null) {
                Logger.warn("Config data not defined in local database.", 'CONFIG')
            }
            else {
                try {
                    const connData = JSON.parse(CryptoUtil.Symmentic.decrypt(dbData.value)) as object;

                    for (const key of Object.keys(connData)) {
                        this.configService.set(`root.database.default.${key}`, connData[key])
                    }
                }
                catch (e) {
                    Logger.warn("Config load failed.", 'CONFIG')
                }
            }
        }
        catch (e) {
            if (dataSource?.isInitialized) {
                await dataSource.destroy();
            }

            console.log((e as Error).message)

            throw new InitLoadDatabaseConfigError({ innerError: e as Error });
        }
    }



    loadJwtConfig = async () => {

        let dataSource: DataSource;


        try {
            dataSource = await SQLiteDataSourceProvider
                .getDataSource()
                .initialize()
        }
        catch (e) {
            return;
        }

        try {
            const jwtSecretData = await dataSource
                .getRepository(LocalConfigEntity)
                .findOne({
                    where: {
                        key: 'jwt'
                    }
                })

            if (jwtSecretData === null) {

                const data = {
                    expireAct: '5m',
                    expireRft: '1h'
                }

                await dataSource.getRepository(LocalConfigEntity)
                    .save(LocalConfigEntity.data('jwt', CryptoUtil.Symmentic.encrypt(JSON.stringify(data))))

                this.configService.set(`root.jwt`, data);
            }
            else {
                try {
                    const jwtConfigObj = JSON.parse(CryptoUtil.Symmentic.decrypt(jwtSecretData.value)) as object;
                    this.configService.set(`root.jwt`, jwtConfigObj);
                }
                catch (e) {
                    Logger.warn("Config load failed.", 'CONFIG')
                }
            }
        }
        catch (e) {
            if (dataSource?.isInitialized) {
                await dataSource.destroy();
            }

            throw new InitJwtConfigError({ innerError: e as Error });
        }

    }


    ////path.fileStore
    loadPathConfig = async () => {
        let dataSource: DataSource;


        try {
            dataSource = await SQLiteDataSourceProvider
                .getDataSource()
                .initialize()
        }
        catch (e) {
            return;
        }

        try {
            const pathData = await dataSource
                .getRepository(LocalConfigEntity)
                .findOne({
                    where: {
                        key: 'path'
                    }
                })

            if (pathData === null) {
                let dataPath: string;
                if(process.env.CREPEN_CDN_DATA_DIR){
                    dataPath = process.env.CREPEN_CDN_DATA_DIR;
                }
                else if (os.type() === 'Linux') {
                    dataPath = GlobalDataPath.DATA_DIR_PATH_LINUX;
                }
                else if (os.type() === 'Windows_NT') {
                    dataPath = GlobalDataPath.DATA_DIR_PATH_WIN;
                }
                else if (os.type() === 'Darwin') {
                    dataPath = GlobalDataPath.DATA_DIR_PATH_MAC;
                }

                const data = {
                    fileStore: join(dataPath, 'data')
                }

                await dataSource.getRepository(LocalConfigEntity)
                    .save(LocalConfigEntity.data('path', CryptoUtil.Symmentic.encrypt(JSON.stringify(data))))

                this.configService.set(`root.path`, data);
            }
            else {
                try {
                    const pathConfigObj = JSON.parse(CryptoUtil.Symmentic.decrypt(pathData.value)) as object;
                    this.configService.set(`root.path`, pathConfigObj);
                }
                catch (e) {
                    Logger.warn("Config load failed.", 'CONFIG')
                }
            }
        }
        catch (e) {
            if (dataSource?.isInitialized) {
                await dataSource.destroy();
            }

            throw new InitPathConfigError({ innerError: e as Error });
        }
    }


    loadSecretConfig = async () => {
        let dataSource: DataSource;


        try {
            dataSource = await SQLiteDataSourceProvider
                .getDataSource()
                .initialize()
        }
        catch (e) {
            return;
        }

        try {
            const pathData = await dataSource
                .getRepository(LocalConfigEntity)
                .findOne({
                    where: {
                        key: 'secret'
                    }
                })

            if (pathData === null) {
                const jwtSecret: string = StringUtil.randomString(12);
                const fileSecret: string = StringUtil.randomString(12);

                const data = {
                    file: fileSecret,
                    jwt: jwtSecret
                }

                await dataSource.getRepository(LocalConfigEntity)
                    .save(LocalConfigEntity.data('secret', CryptoUtil.Symmentic.encrypt(JSON.stringify(data))))

                this.configService.set(`root.secret`, data);
            }
            else {
                try {
                    const configObj = JSON.parse(CryptoUtil.Symmentic.decrypt(pathData.value)) as object;
                    this.configService.set(`root.secret`, configObj);
                }
                catch (e) {
                    Logger.warn("Config load failed.", 'CONFIG')
                }
            }
        }
        catch (e) {
            if (dataSource?.isInitialized) {
                await dataSource.destroy();
            }

            throw new InitSecretConfigError({ innerError: e as Error })
        }
    }


    //#endregion CONFIG_INITILIZER


}

@Module({})
class PreAppModule { }