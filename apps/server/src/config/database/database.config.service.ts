import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import { DefaultDataSourceProvider } from "src/module/config/database/provider/default.database.provider";
import { SQLiteDataSourceProvider } from "src/module/config/database/provider/sqlite.database.provider";

@Injectable()
export class CrepenDatabaseService {
    private activeDefault: DataSource = undefined;
    private activeLocal: DataSource = undefined;

    constructor(
        private configService: ConfigService
    ) {
        void this.getLocal();
    }


    getDefault = async () => {
        const dataSource = this.activeDefault ?? DefaultDataSourceProvider.getDataSource(this.configService);
 
        if (!dataSource?.isInitialized) {
            console.log("EE" );
            this.activeDefault = await DefaultDataSourceProvider.getDataSource(this.configService).initialize();
        }

        return this.activeDefault;
    }

    getLocal = async () => {
        const dataSource = this.activeLocal ?? SQLiteDataSourceProvider.getDataSource();

        if (!dataSource.isInitialized) {
            console.log("EE1" );
            this.activeLocal = await SQLiteDataSourceProvider.getDataSource().initialize();
        }

        return this.activeLocal;
    }
}