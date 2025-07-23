import { ConfigService } from "@nestjs/config";
import * as fs from 'fs';
import * as os from 'os';
import { CrepenDataPath } from "@crepen-nest/lib/enum/os-path.enum";
import { join } from "path";
import { Logger } from "@nestjs/common";
import * as jsyaml from 'js-yaml';
import { CrepenSystemError } from "@crepen-nest/lib/error/system/common.system.error";
import { LocalConfigEntity } from "src/module/entity/local/config.local.entity";
import { DataSource } from "typeorm";
import { CryptoUtil } from "@crepen-nest/lib/util/crypto.util";
import { SQLiteDataSourceProvider } from "../database/provider/sqlite.database.provider";
import { StringUtil } from "@crepen-nest/lib/util/string.util";
import { instanceToInstance } from "class-transformer";

export class CrepenConfigProvider {
    constructor(config: ConfigService<unknown, boolean>) {
        this.config = config;
    }

    config: ConfigService<unknown, boolean>;

    static init = async (config: ConfigService<unknown, boolean>) => {
        const instance = new CrepenConfigProvider(config);
        await instance.loadDatabaseConfig(config);
        await instance.loadJwtConfig(config);
        await instance.loadPathConfig(config);
        await instance.loadSecretConfig(config);
    }

    loadDatabaseConfig = async (config: ConfigService<unknown, boolean>) => {
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
                        config.set(`root.database.default.${key}`, connData[key])
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

            throw new CrepenSystemError('Config Load Error', 'CONFIG', {
                cause: e
            })
        }
    }



    loadJwtConfig = async (config: ConfigService<unknown, boolean>) => {

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

                config.set(`root.jwt`, data);
            }
            else {
                try {
                    const jwtConfigObj = JSON.parse(CryptoUtil.Symmentic.decrypt(jwtSecretData.value)) as object;
                    config.set(`root.jwt`, jwtConfigObj);
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

            throw new CrepenSystemError('Config Load Error', 'CONFIG', {
                cause: e
            })
        }

    }


    ////path.fileStore
    loadPathConfig = async (config: ConfigService<unknown, boolean>) => {
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
                if (os.type() === 'Linux') {
                    dataPath = CrepenDataPath.DATA_DIR_PATH_LINUX;
                }
                else if (os.type() === 'Windows_NT') {
                    dataPath = CrepenDataPath.DATA_DIR_PATH_WIN;
                }
                else if (os.type() === 'Darwin') {
                    dataPath = CrepenDataPath.DATA_DIR_PATH_MAC;
                }

                const data = {
                    fileStore: join(dataPath, 'data')
                }

                await dataSource.getRepository(LocalConfigEntity)
                    .save(LocalConfigEntity.data('path', CryptoUtil.Symmentic.encrypt(JSON.stringify(data))))

                config.set(`root.path`, data);
            }
            else {
                try {
                    const pathConfigObj = JSON.parse(CryptoUtil.Symmentic.decrypt(pathData.value)) as object;
                    config.set(`root.path`, pathConfigObj);
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

            throw new CrepenSystemError('Config Load Error', 'CONFIG', {
                cause: e
            })
        }
    }


    loadSecretConfig = async (config: ConfigService<unknown, boolean>) => {
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

                config.set(`root.secret`, data);
            }
            else {
                try {
                    const configObj = JSON.parse(CryptoUtil.Symmentic.decrypt(pathData.value)) as object;
                    config.set(`root.secret`, configObj);
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

            throw new CrepenSystemError('Config Load Error', 'CONFIG', {
                cause: e
            })
        }
    }


    /** @deprecated */
    initConfig = async (config: ConfigService<unknown, boolean>) => {

        try {
            let dataPath = '/';

            if (os.type() === 'Linux') {
                dataPath = CrepenDataPath.DATA_DIR_PATH_LINUX;
            }
            else if (os.type() === 'Windows_NT') {
                dataPath = CrepenDataPath.DATA_DIR_PATH_WIN;
            }
            else if (os.type() === 'Darwin') {
                dataPath = CrepenDataPath.DATA_DIR_PATH_MAC;
            }

            const configFilePath = join(dataPath, 'config', 'config.yaml');

            if (fs.existsSync(configFilePath)) {



                const yamlData = jsyaml.load(fs.readFileSync(configFilePath, 'utf8')) as Record<string, any>;

                for (const [key, value] of Object.entries(yamlData)) {
                    config.set(key, value);
                }


                Logger.log('Load config.', 'CONFIG');
            }
            else {
                Logger.warn('Config data not found.', 'CONFIG');
            }
        }
        catch (e) {
            throw new CrepenSystemError('Config Load Error', 'CONFIG', {
                cause: e
            })
        }


    }
}