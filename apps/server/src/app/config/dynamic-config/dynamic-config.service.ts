import { CrepenConfig } from "@crepen-nest/interface/config";
import { Injectable } from "@nestjs/common";
import * as path from 'path';
import * as fs from 'fs-extra';
import { StoreConfigExtension } from "@crepen-nest/lib/extensions/module/config-encrypt/store.config.extension";

@Injectable()
export class DynamicConfigService {
    private _config: CrepenConfig = { init: false };
    
    getConfig = () => this._config;

    set = (path: string, value: unknown) => {
        const pathArray = path.split('.');

        const lastKey = pathArray.pop();

        let current = this._config as object;
        for (const key of pathArray) {
            if (typeof current[key] !== 'object' || current[key] === null) {
                current[key] = {};
            }
            current = current[key] as object;
        }

        current[lastKey] = value;
    }

    get = <T>(path: string) : T => {
        const pathArray = path.split('.');

        let current = this._config as object;

        for (const key of pathArray) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key] as object;
            } else {
                return undefined;
            }
        }

        return current as T;
    }


    saveStore = () => {
        const configPath = path.join(this._config.path?.config , 'crepen_cdn.conf.enc');
        const configBuffer = StoreConfigExtension.encrypt(this._config);

        fs.accessSync(configPath);
        fs.writeFileSync(configPath , configBuffer , {
            encoding : 'utf8',
            mode : 644,
        })
    }

}