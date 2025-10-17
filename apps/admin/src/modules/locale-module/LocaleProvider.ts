import * as fs from 'fs-extra';
import * as path from 'path';
import * as process from 'process';
import { LocaleConfig } from './LocaleConfig';

export class LocaleProvider {

    private static readonly _instance: LocaleProvider = new LocaleProvider();

    constructor() {
        this._setupLocale = LocaleConfig.defaultLocale;
    }

    private _loadState: boolean = false;
    private _localeData: Record<string, Record<string, string> | undefined> = {}
    private _setupLocale: string;

    static getInstance = () => {
        return LocaleProvider._instance;
    }

    loadLocaleData = async (force?: boolean) => {

        if (this._loadState === true && force !== true) {
            return;
        }

        // const localeFilePath = path.join(__dirname , './locale-data');
        const localeDirPath = path.join(process.cwd(), 'public', 'locale');

        if (fs.existsSync(localeDirPath)) {
            const localeDataList = fs.readdirSync(localeDirPath);

            const fileRegex = new RegExp(/^locale\.[a-z]{2}\.json$/g);

            const fileList: string[] = [];

            for (const localeItem of localeDataList) {
                if (fileRegex.test(localeItem)) {
                    fileList.push(localeItem);
                }
            }



            for (const item of fileList) {
                const localeFilePath = path.join(localeDirPath, item);



                const localeTypeRegex = new RegExp(/\.([a-z]{2})\.json$/);
                const matchType = item.match(localeTypeRegex) ?? [];

                if (matchType.length > 0) {
                    const type = matchType[1]?.toLowerCase() ?? '';
                    const localeData = fs.readFileSync(localeFilePath, 'utf8');
                    this._localeData[type] = JSON.parse(localeData);
                }
            }


        }
        else {
            console.error('Locale Dir Not Found');
        }


        this._loadState = true;
    }

    translate = (path: string, locale?: string) => {

        const localeData = this._localeData[locale ?? this._setupLocale];
        if (!!localeData && localeData[path]) {
            return localeData[path];
        }
        else {
            return path;
        }
    }

    setLocale = (locale: string) => {
        if (LocaleConfig.supportLocales.map(x => x.toLowerCase()).indexOf(locale.toLowerCase()) > -1) {
            this._setupLocale = locale.toLowerCase();
        }

    }


    isLoad = () => this._loadState;

}   