import { Injectable } from "@nestjs/common";
// import { CrepenSystemDatabaseService } from "../db/db.system.service";
import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import { RepositoryOptions } from "@crepen-nest/interface/repo";
import { LocalStateEntity } from "src/module/entity/local/state.local.entity";
import { DatabaseService } from "@crepen-nest/config/database/database.config.service";
import { SQLiteDataSourceProvider } from "src/module/config/database/provider/sqlite.database.provider";

@Injectable()
export class SystemHealthRepository {



    constructor(
        private readonly dbService: DatabaseService,
        private readonly configService: ConfigService
    ) { }

    configDataSource: DataSource = undefined;

    getInitState = async (options?: RepositoryOptions): Promise<LocalStateEntity | null> => {
        const dataSource = options?.manager ?? await this.dbService.getLocal();


        return dataSource
            .getRepository(LocalStateEntity)
            .findOne({
                where: {
                    key: 'install'
                }
            })
    }
}