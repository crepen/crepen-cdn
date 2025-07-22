import { ConfigService } from "@nestjs/config";
import * as fs from 'fs';
import * as os from 'os';
import { CrepenDataPath } from "@crepen-nest/lib/enum/os-path.enum";
import { join } from "path";
import { Logger } from "@nestjs/common";
import * as YAML from 'yaml';
import * as jsyaml from 'js-yaml';
import { CrepenSystemError } from "@crepen-nest/lib/exception/crepen.system.exception";

export class CrepenConfigProvider {
    constructor(config: ConfigService<unknown, boolean>) {
        this.config = config;
    }

    config: ConfigService<unknown, boolean>;

    static init = async (config: ConfigService<unknown, boolean>) => {
        const instance = new CrepenConfigProvider(config);
        await instance.initConfig(config);
    }



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