import { DefaultDataSourceProvider } from "@crepen-nest/config/provider/database/default.database.provider";
import { SQLiteDataSourceProvider } from "@crepen-nest/config/provider/database/sqlite.database.provider";
import { Injectable, Logger, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import { DynamicConfigService } from "../dynamic-config/dynamic-config.service";


@Injectable()
export class DatabaseService {
    private activeDefault: DataSource = undefined;
    private activeLocal: DataSource = undefined;

    constructor(
        private configService: ConfigService,
        private readonly dynamicConfig : DynamicConfigService
    ) {
        void this.getLocal();
    }


    getDefault = async (): Promise<DataSource> => {
        


        if (!this.activeDefault?.isInitialized) {
            this.activeDefault = await DefaultDataSourceProvider.getDataSource(this.dynamicConfig).initialize();

            const checkFullTextSetting = await this.activeDefault.query<{Variable_name : string , Value : string}[]>(`SHOW VARIABLES LIKE 'ft_min_word_len'`);
            const data = checkFullTextSetting.find(x=>x.Variable_name === 'ft_min_word_len');
            if(!isNaN(Number(data.Value))){
                const settingValue = Number(data.Value);
                if(settingValue > 1){
                    Logger.warn(`The MariaDB 'ft_min_word_len' value is ${settingValue}. For smooth searching, it should be set to 1 or 2.` , 'FULLTEXT SETUP');
                }
            }

            const checkKoreanPlugin = await this.activeDefault.query<{Name : string , Status : string}[]>('SHOW PLUGINS');
            const pluginData = checkKoreanPlugin.find(x=>x.Name === 'ngram');

            if(!pluginData){
                Logger.warn(`The 'ngram' plugin is not installed. This plugin is required for smooth Korean search.` , 'FULLTEXT SETUP');
            }
        }

        return this.activeDefault;
    }

    getLocal = async (): Promise<DataSource> => {
        if (!this.activeLocal?.isInitialized) {
            this.activeLocal = await SQLiteDataSourceProvider.getDataSource().initialize();
        }

        return this.activeLocal;
    }
}