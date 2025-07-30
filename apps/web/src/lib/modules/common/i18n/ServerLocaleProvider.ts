import * as path from "path";
import * as fs from 'fs/promises'
import { ServerLocaleConfig } from "./ServerLocaleConfig";
import { StringUtil } from "@web/lib/util/string.util";

export class ServerLocaleProvider {

    static current = (config: ServerLocaleConfig) => {
        return new ServerLocaleProvider(config);
    }


    constructor(config: ServerLocaleConfig) {
        this.config = config;
    }

    config: ServerLocaleConfig;





    getLocaleFileData = async (locale: string) => new Promise(async (resolve, reject) => {
        try {
            const localePath = path.join('./config/i18n/locale');

            let targetLocale = this.config.defaultLocale.toLowerCase();
            if (!StringUtil.isEmpty(locale) && this.config.supportLocales.map(x => x.toLowerCase()).find(x => x === locale.toLowerCase())) {
                targetLocale = locale;
            }

            const targetLocaleJsonFilePath = path.join(localePath, `${targetLocale}.json`);
            // const importFile = await import(targetLocaleJsonFilePath);
            // const ss = require(targetLocaleJsonFilePath);

            console.log(targetLocaleJsonFilePath);

            (globalThis as any)._server = '';
            // if (!globalThis.myStore) {
            //     globalThis.myStore = {
            //         items: [],
            //     };
            // }

            // const ss = await fs.readFile(targetLocaleJsonFilePath)
            console.log('TEST',(globalThis as Record<string,unknown>).test);

            // ss
            //     .then(res => {
            //         resolve(res as object);
            //     })
            //     .catch(err => {
            //         reject(err);
            //     })


            resolve('');
        }
        catch (e) {
            reject(e);
        }
    })

    getDD = () => {

    }


}