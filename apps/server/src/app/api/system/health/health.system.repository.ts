import { DatabaseService } from "@crepen-nest/app/config/database/database.config.service";
import { LocalStateEntity } from "@crepen-nest/lib/types/entity/local/state.local.entity";
import { Injectable } from "@nestjs/common";
// import { CrepenSystemDatabaseService } from "../db/db.system.service";
import { ConfigService } from "@nestjs/config";
import { RepositoryOptions } from "src/interface/repo";
import { DataSource } from "typeorm";

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