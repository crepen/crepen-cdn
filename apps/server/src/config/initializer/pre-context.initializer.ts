import { CryptoUtil, StringUtil } from "@crepen-nest/lib/util";
import { CommonUtil } from "@crepen-nest/lib/util/common.util";
import { ConsoleLogger, INestApplicationContext, Injectable, Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import * as fs from 'fs';
import { DataSource } from "typeorm";
import { SQLiteDataSourceProvider } from "../provider/database/sqlite.database.provider";
import * as os from 'os';
import * as path from "path";


export class PreContextInitializer {

    constructor(private context: INestApplicationContext, isError?: boolean) {
        this.configService = context.get(ConfigService);
        this.isError = isError ?? false;
    }

    private configService: ConfigService;
    private isError: boolean = false;
    private dataSource: DataSource | undefined = undefined;
    private secretKey: string | undefined = undefined;

    private pathData = {
        data: '',
        log: '',
        config: ''
    }


    static setContext = async () => {

        let context: INestApplicationContext;
        let isError = false;

        try {
            Logger.log("Load pre context - Config Service", "PRE_INIT");
            context = await NestFactory.createApplicationContext({
                module: PreAppModule,
                imports: [
                    ConfigModule.forRoot({
                        envFilePath: ['.env', '.env.development']
                    })
                ]
            }, {
                logger: new InternalDisabledLogger()
            });
        }
        catch (e) {
            Logger.error("Failed load pre context", "PRE_INIT");
            Logger.error(e, "PRE_INIT");
            isError = true;
        }


        return new PreContextInitializer(context, isError);
    }

    apply = async () => {
        // Set Config Path
        this.applyEnvData()
            .setConfigPath()
            // Set Secret Key
            .loadSecretKey();

        // Load Config From SQLite
        await this.loadLocalDatabaseConfig();
    }

    private applyEnvData = () => {
        try {
            Logger.log('', 'PRE_INIT')
            Logger.log('┌ Apply environment vairable', 'PRE_INIT')

            Logger.log(`│ - Load server port (CREPEN_CDN_PORT)`, 'PRE_INIT')
            if (isNaN(Number(process.env.CREPEN_CDN_PORT))) {
                Logger.warn('│   - The server port is not set or is not formatted correctly. It will be automatically set to 13332.', 'PRE_INIT')
                this.configService.set('root.port', 13332);
            }
            else {
                Logger.log(`│   - Apply server port : ${process.env.CREPEN_CDN_PORT}`, 'PRE_INIT')
                this.configService.set('root.port', process.env.CREPEN_CDN_PORT);
            }

            Logger.log('└ Complete', 'PRE_INIT')
        }
        catch (e) {
            Logger.error('└ - Failed apply environment variable.', 'PRE_INIT')
            Logger.error(e, 'PRE_INIT');
            this.isError = true;
        }

        return this;
    }

    private setConfigPath = () => {
        try {
            Logger.log('', 'PRE_INIT')
            Logger.log('┌ Initializer config directory', 'PRE_INIT')

            let configPath = process.env.CREPEN_CDN_CONFIG_DIR;
            Logger.log(`│ - Config directory enviroment variable : ${process.env.CREPEN_CDN_CONFIG_DIR}`, 'PRE_INIT')

            if (StringUtil.isEmpty(configPath)) {
                configPath = path.join(os.userInfo().homedir, '/crepen/cdn/config');
                Logger.warn(`│ - Config directory env is undefined or empty. replace new directory path : ${configPath}`, 'PRE_INIT')
            }
            else {
                Logger.log(`│ - Config dir path : ${configPath}`, 'PRE_INIT')
            }

            if (!fs.existsSync(configPath)) {
                fs.mkdirSync(configPath, { recursive: true })
            }

            this.pathData.config = configPath;
            this.configService.set('root.path.config', configPath);

            Logger.log('└ Complete', 'PRE_INIT')

            return this;
        }
        catch (e) {
            Logger.error('└ - Failed initializer config directory.', 'PRE_INIT')
            Logger.error(e, 'PRE_INIT');
            this.isError = true;
        }
    }

    private loadSecretKey = () => {
        try {
            Logger.log('', 'PRE_INIT')
            Logger.log('┌ Load global secret key', 'PRE_INIT')


            const filePath = path.join(this.pathData.config, 'PR.CRP');

            if (!fs.existsSync(filePath)) {
                Logger.warn('│ - Secret key could not be found. Key will be generated automatically.', 'PRE_INIT')
                const encryptKey = StringUtil.randomString(16);
                const configSecretKey = StringUtil.randomString(16);
                const key = encryptKey + CryptoUtil.Symmentic.encrypt(configSecretKey, encryptKey);

                fs.writeFileSync(filePath, key, { encoding: 'utf-8' });

                this.secretKey = configSecretKey;
                this.configService.set('root.secret', configSecretKey);
            }
            else {
                const storeKey = fs.readFileSync(filePath, { encoding: 'utf-8' });

                const key = CryptoUtil.Symmentic.decrypt(
                    storeKey.slice(16, storeKey.length),
                    storeKey.slice(0, 16)
                )

                this.secretKey = key;
                this.configService.set('root.secret', key);
            }




            Logger.log('└ Complete', 'PRE_INIT')

            return this;
        }
        catch (e) {
            Logger.error('└ - Failed load secret key.', 'PRE_INIT')
            Logger.error(e, 'PRE_INIT');
            this.isError = true;
        }
    }

    private loadLocalDatabaseConfig = async () => {

        try {
            Logger.log('', 'PRE_INIT')
            Logger.log('┌ Load config from local database', 'PRE_INIT')


            Logger.log('│ - Connect local database', 'PRE_INIT')
            this.dataSource = await SQLiteDataSourceProvider
                .getDataSource()
                .initialize();

            await this.dataSource.transaction(async (manager) => {
                Logger.log('│ - Check table', 'PRE_INIT')
                const findConfigTable = await manager.query<{ name: string }[]>('SELECT name FROM sqlite_master WHERE name=?', ['config']);

                if (findConfigTable.length === 0) {
                    Logger.log('│ - Config table not defined. Create config table.', 'PRE_INIT')
                    void await manager.query<unknown[]>(`
                        CREATE TABLE "config" 
                        (
                            "key" varchar PRIMARY KEY NOT NULL,
                            "value" varchar NOT NULL
                        )
                    `);
                }

                Logger.log('│ - Check system initialized.', 'PRE_INIT')
                const isInit = await manager.query<{ key: string, value: string }[]>(
                    `SELECT * FROM config WHERE key=? AND value=?`
                    , ['INIT', 'COMPLETE']
                )

                if (isInit.length === 0) {
                    // INIT CONFIG
                    Logger.warn('│   - System is not initialized. Starting initialize.', 'PRE_INIT')


                    // Check Data Dir
                    let dataDir = process.env.CREPEN_CDN_DATA_DIR;
                    Logger.log(`│     - Data directory enviroment variable : ${dataDir}`, 'PRE_INIT')
                    if (StringUtil.isEmpty(dataDir)) {
                        dataDir = path.join(os.userInfo().homedir, '/crepen/cdn/data');
                        Logger.warn(`│     - Data directory env is undefined or empty. replace new directory path : ${dataDir}`, 'PRE_INIT')
                    }
                    this.pathData.data = dataDir;

                    // Check Log Dir
                    let logDir = process.env.CREPEN_CDN_LOG_DIR;
                    Logger.log(`│     - Log directory enviroment variable : ${logDir}`, 'PRE_INIT')
                    if (StringUtil.isEmpty(logDir)) {
                        logDir = path.join(os.userInfo().homedir, '/crepen/cdn/log');
                        Logger.warn(`│     - Log directory env is undefined or empty. replace new directory path : ${logDir}`, 'PRE_INIT')
                    }
                    this.pathData.log = logDir;

                    Logger.log('│     - Init config data.', 'PRE_INIT')
                    void await manager.createQueryBuilder()
                        .insert()
                        .into<{ key: string, value: string }>('config')
                        .values([
                            { key: 'DATA_DIR', value: this.pathData.data },
                            { key: 'LOG_DIR', value: this.pathData.log },
                            { key: 'DB_CS', value: CryptoUtil.Symmentic.encrypt('', this.secretKey) },
                            { key: 'TK_SK', value: CryptoUtil.Symmentic.encrypt(StringUtil.randomString(16), this.secretKey) },
                            { key: 'INIT', value: 'COMPLETE' }
                        ])
                        .execute();
                }

                Logger.log('│ - Load config data.', 'PRE_INIT')
                const pathData = await manager.createQueryBuilder()
                    .select('*')
                    .from('config', 'cfg')
                    .getRawMany<{ key: string, value?: string }>();

                // #region INIT_DATA_DIR
                const storeDataDir = pathData.find(x => x.key === 'DATA_DIR')?.value;
                Logger.log(`│   - Data directory path : ${storeDataDir}`, 'PRE_INIT')

                if (!fs.existsSync(storeDataDir)) {
                    Logger.warn(`│     - Data directory not found. It will be created automatically.`, 'PRE_INIT')
                    fs.mkdirSync(storeDataDir, { recursive: true });
                }
                this.configService.set('root.path.data', storeDataDir);
                // #endregion INIT_DATA_DIR

                // #region INIT_LOG_DIR
                const storeLogDir = pathData.find(x => x.key === 'LOG_DIR')?.value;
                Logger.log(`│   - Log directory path : ${storeLogDir}`, 'PRE_INIT')

                if (!fs.existsSync(storeLogDir)) {
                    Logger.warn(`│     - Log directory not found. It will be created automatically.`, 'PRE_INIT')
                    fs.mkdirSync(storeLogDir, { recursive: true });
                }
                this.configService.set('root.path.log', storeLogDir);
                // #endregion INIT_LOG_DIR

                // #region INIT_DB_CONNECTION_STRING
                Logger.log(`│ - Load Common Database connect info`, 'PRE_INIT')
                const dbConnStr = pathData.find(x => x.key === 'DB_CS')?.value;

                if (!StringUtil.isEmpty(dbConnStr) && !StringUtil.isEmpty(CryptoUtil.Symmentic.decrypt(dbConnStr, this.secretKey))) {
                    const decryptConnString = CryptoUtil.Symmentic.decrypt(dbConnStr, this.secretKey)
                    try {


                        const dataSource: DataSource = new DataSource({
                            type: 'mariadb',
                            url: decryptConnString,
                            synchronize: false
                        })

                        await dataSource.initialize();
                        await dataSource.destroy();

                        this.configService.set('root.db.conn_str', decryptConnString);
                    }
                    catch (e) {
                        Logger.warn(`│   - An attempt was made to connect based on the database connection information, but the connection failed.`, 'PRE_INIT')
                    }
                }
                else {
                    Logger.warn(`│   - There is no database connection information. Please configure it manually.`, 'PRE_INIT')
                }
                // #endregion INIT_DB_CONNECTION_STRING

                // #region INIT_TOKEN_SECRET_KEY
                Logger.log(`│ - Load JWT Secret key`, 'PRE_INIT')
                const jwtSecretKey = pathData.find(x => x.key === 'TK_SK')?.value;

                if (!StringUtil.isEmpty(jwtSecretKey)) {
                    const decrpytString = CryptoUtil.Symmentic.decrypt(jwtSecretKey, this.secretKey);
                    if (!StringUtil.isEmpty(decrpytString)) {
                        this.configService.set('root.jwt.secret', decrpytString);
                    }
                }
                else {
                    Logger.warn(`│   - JWT Secret key not found. It will be created automatically.`, 'PRE_INIT')
                    const newJwtSecretKey = StringUtil.randomString(16);
                    const newJwtSecretEncryptKey = CryptoUtil.Symmentic.encrypt(newJwtSecretKey, this.secretKey);

                    if (pathData.find(x => x.key === 'TK_SK')) {
                        void await manager.createQueryBuilder()
                            .update('config')
                            .set({ value: newJwtSecretEncryptKey })
                            .where('key = :key', { key: 'TK_SK' })
                            .execute();
                    }
                    else {
                        void await manager.createQueryBuilder()
                            .insert()
                            .into<{ key: string, value: string }>('config')
                            .values([
                                { key: 'TK_SK', value: newJwtSecretEncryptKey }
                            ])
                            .execute();
                    }

                    this.configService.set('root.jwt.secret', newJwtSecretEncryptKey);

                }
                // #endregion INIT_TOKEN_SECRET_KEY
            })

            Logger.log(`└ Complete`, 'PRE_INIT')
        }
        catch (e) {
            Logger.error('└ Failed load config.', 'PRE_INIT')
            Logger.error(e, 'PRE_INIT');
            this.isError = true;
        }
        finally {
            try {
                if (this.dataSource.isInitialized) {
                    await this.dataSource.destroy();
                }
            }
            catch (e) { }
        }
    }








    getConfigData = async () => {
        return this.configService.get<Record<string, object>>('root');
    }


    dispose = async () => {
        try {
            await this.context.close();
        }
        catch (e) {

        }
        finally {
            this.configService = undefined;
            this.secretKey = undefined;
            this.isError = undefined;
            this.dataSource = undefined;
            this.pathData = undefined;
        }


    }



    getStatus = () => !this.isError;

}

@Module({})
export class PreAppModule implements OnModuleInit {
    onModuleInit() {
    }
}





//#region IGNORE_LOGGER


class InternalDisabledLogger extends ConsoleLogger {
    static contextsToIgnore = [
        'InstanceLoader',
        'RoutesResolver',
        'RouterExplorer',
        'NestFactory', // I prefer not including this one
    ]

    log(_: any, context?: string): void {
        if (!InternalDisabledLogger.contextsToIgnore.includes(context)) {
            // eslint-disable-next-line prefer-rest-params
            super.log.apply(this, arguments)
        }
    }

}

//#endregion IGNORE_LOGGER