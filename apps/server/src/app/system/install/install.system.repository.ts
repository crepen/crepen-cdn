import { CrepenDatabaseService } from "@crepen-nest/config/database/database.config.service";
import { Injectable } from "@nestjs/common";
import { LocalConfigEntity } from "src/module/entity/local/config.local.entity";
import { LocalStateEntity } from "src/module/entity/local/state.local.entity";

@Injectable()
export class CrepenSystemInstallRepository {
    constructor(
        private readonly dbService : CrepenDatabaseService
    ){}


    getDatabaseConfig = async () => {
        const dataSource = await this.dbService.getLocal();
        return dataSource
                    .getRepository(LocalConfigEntity)
                    .findOne({
                        where: {
                            key: 'db'
                        }
                    })
    }

    getInstallConfig = async () : Promise<LocalStateEntity | null> => {
        const dataSource = await this.dbService.getLocal();
        return dataSource
            .getRepository(LocalStateEntity)
            .findOne({
                where : {
                    key : 'install'
                }
            })
    }
}