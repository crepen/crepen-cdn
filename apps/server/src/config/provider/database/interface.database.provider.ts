import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm"

export class DataSourceProviderInterface {
    // private dataSource : DataSource;
    static getDataSource = (config?: ConfigService<unknown, boolean>) => DataSource
}