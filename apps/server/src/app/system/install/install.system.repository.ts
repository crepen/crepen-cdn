import { DatabaseService } from "@crepen-nest/config/database/database.config.service";
import { RepositoryOptions } from "@crepen-nest/interface/repo";
import { CryptoUtil } from "@crepen-nest/lib/util";
import { Injectable } from "@nestjs/common";
import { LocalConfigEntity } from "src/module/entity/local/config.local.entity";
import { LocalStateEntity } from "src/module/entity/local/state.local.entity";

@Injectable()
export class SystemInstallRepository {
    constructor(
        private readonly dbService: DatabaseService
    ) { }


    getDatabaseConfig = async (options?: RepositoryOptions) => {
        const dataSource = options?.manager ?? await this.dbService.getLocal();
        return dataSource
            .getRepository(LocalConfigEntity)
            .findOne({
                where: {
                    key: 'db'
                }
            })
    }

   


    applyDatabase = async (encryptDatabaseConfigStr: string, options?: RepositoryOptions): Promise<LocalConfigEntity | null> => {
        const dataSource = options?.manager ?? await this.dbService.getLocal();

        return dataSource
            .getRepository(LocalConfigEntity)
            .save(
                LocalConfigEntity.data(
                    'db',
                    encryptDatabaseConfigStr

                )
            )
    }

    changeInstallState = async (state: boolean, options?: RepositoryOptions) => {
        const dataSource = options?.manager ?? await this.dbService.getLocal();

        return dataSource
            .getRepository(LocalStateEntity)
            .save(
                LocalConfigEntity.data(
                    'install',
                    state ? "1" : '0'
                )
            )
    }

    getInstallState  = async (options?: RepositoryOptions) => {
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