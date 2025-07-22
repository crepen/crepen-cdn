import { Injectable } from "@nestjs/common";
import { CrepenSystemDatabaseService } from "../db/db.system.service";
import { ConfigService } from "@nestjs/config";
import { SystemConfigEntity } from "../common/entity/config.system.entity.ce";
import { DataSource } from "typeorm";
import { RepositoryOptions } from "@crepen-nest/interface/repo";

@Injectable()
export class CrepenSystemHealthRepository {



    constructor(
        private readonly dbService: CrepenSystemDatabaseService,
        private readonly configService: ConfigService
    ) { }

    configDataSource: DataSource = undefined;

    private instanceDataSource = async () => {
        if (!this.configDataSource) {
            this.configDataSource = await this.dbService.getConfigDataSource(this.configService);
        }
    }

    getDefaultDatabaseHealth = async (options?: RepositoryOptions) => {
        return this.dbService.testDefaultDatabaseConnect(this.configService);
    }

    getInitState = async (options?: RepositoryOptions): Promise<SystemConfigEntity | null> => {
        await this.instanceDataSource();
        const dataSource = options.manager ?? this.configDataSource;


        return dataSource
            .getRepository(SystemConfigEntity)
            .findOne({
                where: {
                    key: 'db'
                }
            })
    }
}