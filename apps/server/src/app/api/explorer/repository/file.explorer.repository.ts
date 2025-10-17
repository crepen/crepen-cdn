import { CrepenBaseRepository } from "@crepen-nest/lib/common/base.repository";
import { Injectable } from "@nestjs/common";
import { ExplorerFileEntity } from "../entity/file.explorer.default.entity";
import { RepositoryOptions } from "@crepen-nest/interface/repo";
import { FindOptionsWhere } from "typeorm";
import { DatabaseService } from "@crepen-nest/app/config/database/database.config.service";

@Injectable()
export class CrepenExplorerFileRepository extends CrepenBaseRepository {
    constructor(
        private readonly databaseService: DatabaseService
    ) { super(databaseService) }





    updateFileEntity = async (entity: ExplorerFileEntity, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(ExplorerFileEntity) ?? await this.getRepository('default', ExplorerFileEntity);

        return dataSource.update(entity.uid, entity);
    }



    getFileData = async (where : FindOptionsWhere<ExplorerFileEntity> | FindOptionsWhere<ExplorerFileEntity>[] , options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(ExplorerFileEntity) ?? await this.getRepository('default', ExplorerFileEntity);

        return dataSource.findOne({
            where : where,
            relations : [
                'encryptedFiles',
                'cryptQueueList'
            ]
        })
    }
}