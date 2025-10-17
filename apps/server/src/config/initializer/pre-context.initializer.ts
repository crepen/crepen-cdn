import { StringUtil } from "@crepen-nest/lib/util";
import { ConsoleLogger, INestApplicationContext, Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import * as fs from 'fs';
import * as path from "path";
import { CrepenConfig } from "@crepen-nest/interface/config";
import { StoreConfigExtension } from "@crepen-nest/lib/extensions/module/config-encrypt/store.config.extension";




export class PreContextInitializer {

    constructor(private context: INestApplicationContext, isError?: boolean) {
        this.configService = context.get(ConfigService);
        this.isError = isError ?? false;
    }

    private configService: ConfigService;
    private isError: boolean = false;

    private _config: CrepenConfig = {
        init: false
    };

    static setContext = async () => {

        let context: INestApplicationContext;
        let isError = false;

        try {
            Logger.log("Load pre context - Config Service", "PRE_INIT");
            context = await NestFactory.createApplicationContext({
                module: PreAppModule,
                imports: [
                    ConfigModule.forRoot({
                        envFilePath: [
                            '.env',
                            process.env.NODE_ENV === 'dev'
                                ? '.env.development'
                                : 'env.prod'
                        ]
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
        this.Init.loadConfig();
        this.Init.applyEnvPort();
        this.Init.checkEnvDir();
        this.Init.initSecret();
        this.Init.initJwt();
        this.Init.initAdminPassword();
        this.Init.saveConfig();
    }


    private Init = {
        loadConfig: () => {
            try {
                const configPath = path.join(process.env.CREPEN_CDN_CONFIG_DIR, 'crepen_cdn.conf.enc');

                if (fs.existsSync(configPath)) {
                    const readBuffer = fs.readFileSync(configPath);
                    this._config = StoreConfigExtension.decrypt(readBuffer);
                }

                Logger.log('', 'PRE_INIT')
                Logger.log('┌ Load Config', 'PRE_INIT')
                Logger.log(`│ - CONFIG_FILE_PATH : ${configPath}`, 'PRE_INIT')
                Logger.log(`└`, 'PRE_INIT')
            }
            catch (e) {
                Logger.error('', 'PRE_INIT')
                Logger.error('┌ Failed Load Config', 'PRE_INIT')
                Logger.error(`└`, 'PRE_INIT')
                if (process.env.NODE_ENV === 'dev') {
                    Logger.error(e, 'PRE_INIT')
                }
                this.isError = true;
            }

        },
        applyEnvPort: () => {
            try {
                if (!process.env.CREPEN_CDN_PORT) {
                    if (!isNaN(Number(process.env.CREPEN_CDN_PORT))) {
                        this._config.server = {
                            port: Number(process.env.CREPEN_CDN_PORT)
                        }
                        Logger.log('', 'PRE_INIT')
                        Logger.log('┌ Load Port Env', 'PRE_INIT')
                        Logger.log(`│ - CREPEN_CDN_PORT : ${Number(process.env.CREPEN_CDN_PORT)}`, 'PRE_INIT')
                        Logger.log(`└`, 'PRE_INIT')
                    }
                    else {
                        this._config.server = {
                            port: 13332
                        }

                        Logger.log('', 'PRE_INIT')
                        Logger.log('┌ Load Port Env', 'PRE_INIT')
                        Logger.warn(`│ - Port env is not number`, 'PRE_INIT')
                        Logger.warn(`│ - CREPEN_CDN_PORT : ${Number(process.env.CREPEN_CDN_PORT)}`, 'PRE_INIT')
                        Logger.warn(`│ - Default port apply : 13332`, 'PRE_INIT')
                        Logger.log(`└`, 'PRE_INIT')
                    }
                }
            }
            catch (e) {
                Logger.error('', 'PRE_INIT')
                Logger.error('┌ Failed Load Port Env', 'PRE_INIT')
                Logger.error(`└`, 'PRE_INIT')
                if (process.env.NODE_ENV === 'dev') {
                    Logger.error(e, 'PRE_INIT')
                }
                this.isError = true;
            }
        },
        checkEnvDir: () => {
            if (this.isError === true) {
                return;
            }

            const serverDataPath = process.env.CREPEN_CDN_DATA_DIR;
            const serverLogPath = process.env.CREPEN_CDN_LOG_DIR;
            const serverConfigPath = process.env.CREPEN_CDN_CONFIG_DIR;

            try {
                if (!fs.existsSync(serverConfigPath)) {
                    // Config Path
                    fs.mkdirSync(serverConfigPath, {
                        mode: 644,
                        recursive: true
                    })
                }

                if (!fs.existsSync(serverDataPath)) {
                    // Data Path
                    fs.mkdirSync(serverDataPath, {
                        mode: 644,
                        recursive: true
                    })
                }

                if (!fs.existsSync(serverLogPath)) {
                    // Log Path
                    fs.mkdirSync(serverLogPath, {
                        mode: 644,
                        recursive: true
                    })
                }

                fs.accessSync(serverConfigPath, fs.constants.R_OK | fs.constants.W_OK | fs.constants.F_OK);
                fs.accessSync(serverDataPath, fs.constants.R_OK | fs.constants.W_OK);
                fs.accessSync(serverLogPath, fs.constants.R_OK | fs.constants.W_OK);

                this._config.path = {
                    data: serverDataPath,
                    config: serverConfigPath,
                    log: serverLogPath
                }

                Logger.log('', 'PRE_INIT')
                Logger.log('┌ ENV DIR PATH', 'PRE_INIT')
                Logger.log(`│ - CREPEN_CDN_DATA_DIR : ${serverDataPath}`, 'PRE_INIT')
                Logger.log(`│ - CREPEN_CDN_CONFIG_DIR : ${serverConfigPath}`, 'PRE_INIT')
                Logger.log(`│ - CREPEN_CDN_LOG_DIR : ${serverLogPath}`, 'PRE_INIT')
                Logger.log(`└`, 'PRE_INIT')
            }
            catch (e) {
                Logger.error('', 'PRE_INIT')
                Logger.error('┌ Failed Initialize Directory', 'PRE_INIT')
                Logger.error(`│ - CREPEN_CDN_DATA_DIR : ${serverDataPath}`, 'PRE_INIT')
                Logger.error(`│ - CREPEN_CDN_CONFIG_DIR : ${serverConfigPath}`, 'PRE_INIT')
                Logger.error(`│ - CREPEN_CDN_LOG_DIR : ${serverLogPath}`, 'PRE_INIT')
                Logger.error(`└`, 'PRE_INIT')
                if (process.env.NODE_ENV === 'dev') {
                    Logger.error(e, 'PRE_INIT')
                }
                this.isError = true;
            }

        },
        initSecret: () => {
            try {
                if (StringUtil.isEmpty(this._config.secret)) {
                    this._config.secret = StringUtil.randomString(12);
                }

            }
            catch (e) {
                Logger.error('', 'PRE_INIT')
                Logger.error('┌ Failed Init Secret key', 'PRE_INIT')
                Logger.error(`└`, 'PRE_INIT')
                if (process.env.NODE_ENV === 'dev') {
                    Logger.error(e, 'PRE_INIT')
                }
                this.isError = true;
            }
        },
        initJwt: () => {
            try {
                if (StringUtil.isEmpty(this._config.jwt?.secret)) {
                    this._config.jwt = {
                        secret: StringUtil.randomString(16),
                        expireAct : '5m',
                        expireRef : '1h'
                    }
                }
            }
            catch (e) {
                Logger.error('', 'PRE_INIT')
                Logger.error('┌ Failed Init Jwt Secret key', 'PRE_INIT')
                Logger.error(`└`, 'PRE_INIT')
                if (process.env.NODE_ENV === 'dev') {
                    Logger.error(e, 'PRE_INIT')
                }
                this.isError = true;
            }
        },
        initAdminPassword: () => {
            try {
                if (
                    StringUtil.isEmpty(this._config.initAccount?.password)
                    || StringUtil.isEmpty(this._config.initAccount?.id)
                ) {
                    this._config.initAccount = {
                        id: StringUtil.randomString(20),
                        password: StringUtil.randomString(30),
                    }
                }

                Logger.log(`┌ Administrator account for initial setup`, 'PRE_INIT')
                Logger.log(`│ ID : ${this._config.initAccount.id}`, 'PRE_INIT')
                Logger.log(`│ Password : ${this._config.initAccount.password}`, 'PRE_INIT')
                Logger.log(`└`, 'PRE_INIT')

            }
            catch (e) {
                Logger.error('', 'PRE_INIT')
                Logger.error('┌ Failed Init Admin Password', 'PRE_INIT')
                Logger.error(`└`, 'PRE_INIT')
                if (process.env.NODE_ENV === 'dev') {
                    Logger.error(e, 'PRE_INIT')
                }
                this.isError = true;
            }
        },
        saveConfig: () => {
            try {
                this._config.init = true;

                const configPath = path.join(process.env.CREPEN_CDN_CONFIG_DIR, 'crepen_cdn.conf.enc');

                const saveBuffer = StoreConfigExtension.encrypt(this._config);

                fs.writeFileSync(configPath, saveBuffer, {
                    encoding: 'utf8',
                    mode: 644
                })

                this.configService.set('root', this._config);
            }
            catch (e) {
                Logger.error('', 'PRE_INIT')
                Logger.error('┌ Failed Save Config', 'PRE_INIT')
                Logger.error(`└`, 'PRE_INIT')
                if (process.env.NODE_ENV === 'dev') {
                    Logger.error(e, 'PRE_INIT')
                }
                this.isError = true;
            }
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
            this.isError = undefined;
            this._config = undefined;
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