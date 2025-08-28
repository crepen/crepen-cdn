import { StringUtil } from "@crepen-nest/lib/util";
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


    static apply = async () => {

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

    checkEnv = () => {
        Logger.log('', 'PRE_INIT')
        Logger.log('Check Enviroment variable', 'PRE_INIT')
        Logger.log(` - CREPEN_CDN_DATA_DIR : ${process.env.CREPEN_CDN_DATA_DIR}`, 'PRE_INIT')
        if (StringUtil.isEmpty(process.env.CREPEN_CDN_DATA_DIR)) {
            Logger.warn(` - CREPEN_CDN_DATA_DIR variable does not exist. It will be replaced with '${path.join(os.userInfo().homedir , '/crepen/cdn/data')}'.`, 'PRE_INIT')
        }
        Logger.log(` - CREPEN_CDN_LOG_DIR : ${process.env.CREPEN_CDN_LOG_DIR}`, 'PRE_INIT')
        if (StringUtil.isEmpty(process.env.CREPEN_CDN_LOG_DIR)) {
            Logger.warn(` - CREPEN_CDN_LOG_DIR variable does not exist. It will be replaced with '${path.join(os.userInfo().homedir , '/crepen/cdn/log')}'.`, 'PRE_INIT')
        }
        Logger.log(` - CREPEN_CDN_CONFIG_DIR : ${process.env.CREPEN_CDN_CONFIG_DIR}`, 'PRE_INIT')
        if (StringUtil.isEmpty(process.env.CREPEN_CDN_CONFIG_DIR)) {
            Logger.warn(` - CREPEN_CDN_CONFIG_DIR variable does not exist. It will be replaced with '${path.join(os.userInfo().homedir , '/crepen/cdn/config')}'.`, 'PRE_INIT')
        }
        Logger.log(` - CREPEN_CDN_PORT : ${process.env.CREPEN_CDN_PORT}`, 'PRE_INIT')
        if (isNaN(Number(process.env.CREPEN_CDN_PORT))) {
            Logger.warn(` - CREPEN_CDN_PORT variable does invalid. It will be replaced with '13332'.`, 'PRE_INIT')
        }
        return this;
    }


    configurePath = () => {

        try {
            Logger.log('', 'PRE_INIT')
            Logger.log('Configure Directories', 'PRE_INIT')



            Logger.log(' - Check Data Directory', 'PRE_INIT')
            let dataDir = process.env.CREPEN_CDN_DATA_DIR;

            if (StringUtil.isEmpty(dataDir)) {
                dataDir = path.join(os.userInfo().homedir , '/crepen/cdn/data')
            }

            if (!fs.existsSync(dataDir)) {
                Logger.warn(` - ${dataDir} does not exist. Create new directory.`, 'PRE_INIT');
                try {
                    fs.mkdirSync(dataDir, { recursive: true });
                }
                catch (e) {
                    Logger.error(` - Failed create directory : ${dataDir}`, 'PRE_INIT');
                    throw e;
                }
            }

            this.configService.set('root.path.file', dataDir);


            Logger.log(' - Check Log Directory', 'PRE_INIT')
            let logDir = process.env.CREPEN_CDN_DATA_DIR;

            if (StringUtil.isEmpty(logDir)) {
                logDir = path.join(os.userInfo().homedir , '/crepen/cdn/log');
            }

            if (!fs.existsSync(logDir)) {
                Logger.warn(` - ${logDir} does not exist. Create new directory.`, 'PRE_INIT');
                try {
                    fs.mkdirSync(logDir, { recursive: true });
                }
                catch (e) {
                    Logger.error(` - Failed create directory : ${logDir}`, 'PRE_INIT');
                    throw e;
                }
            }

            this.configService.set('root.path.log', logDir);


            Logger.log(' - Check Config Directory', 'PRE_INIT')
            let configDir = process.env.CREPEN_CDN_DATA_DIR;

            if (StringUtil.isEmpty(configDir)) {
                configDir = path.join(os.userInfo().homedir , '/crepen/cdn/config')
            }

            if (!fs.existsSync(configDir)) {
                Logger.warn(` - ${configDir} does not exist. Create new directory.`, 'PRE_INIT');
                try {
                    fs.mkdirSync(configDir, { recursive: true });
                }
                catch (e) {
                    Logger.error(` - Failed create directory : ${configDir}`, 'PRE_INIT');
                    throw e;
                }
            }

            this.configService.set('root.path.config', configDir);


        }
        catch (e) {
            Logger.error('Configuration failed.', 'PRE_INIT')
            Logger.error(e, 'PRE_INIT');
            this.isError = true;
        }


        return this;
    }

    loadLocalDB = async () => {
        try {
            Logger.log('', 'PRE_INIT')
            Logger.log('Connect Local Database - SQLite', 'PRE_INIT')
            this.dataSource = await SQLiteDataSourceProvider
                .getDataSource()
                .initialize();

        }
        catch (e) {
            Logger.error('Connect failed.', 'PRE_INIT')
            Logger.error(e, 'PRE_INIT');
            this.isError = true;
        }

    }

    loadSaveConfigData = () => {
        // const load
    }


    applyJwtConfig = async () => {
        try {
            Logger.log('', 'PRE_INIT')
            Logger.log('Applying JWT configuration', 'PRE_INIT');


        }
        catch (e) {
            Logger.error("Failed to apply JWT configuration", "PRE_INIT");
            Logger.error(e, "PRE_INIT");
            this.isError = true;
        }

        return this;
    }



    destroy = async () => {
        await this.context.close();
    }



    getStatus = () => !this.isError;

}

@Module({})
export class PreAppModule implements OnModuleInit {
    onModuleInit() {
        Logger.log("ON MOUNT" , 'PRE_INIT')
        console.log(os.userInfo())
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
            super.log.apply(this , arguments)
        }
    }

}

//#endregion IGNORE_LOGGER