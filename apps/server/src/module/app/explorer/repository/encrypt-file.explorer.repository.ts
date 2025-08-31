import { CrepenBaseRepository } from "@crepen-nest/lib/common/base.repository";
import { DatabaseService } from "@crepen-nest/module/config/database/database.config.service";
import { Injectable } from "@nestjs/common";
import { ExplorerEncryptFileEntity } from "../entity/encrypt-file.explorer.default.entity";
import { RepositoryOptions } from "@crepen-nest/interface/repo";
import { FindOptionsWhere } from "typeorm";

@Injectable()
export class CrepenExplorerEncryptFileRepository extends CrepenBaseRepository {
    constructor(
        private readonly databaseService: DatabaseService
    ) { super(databaseService) }


    addItem = async (entity: ExplorerEncryptFileEntity, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(ExplorerEncryptFileEntity) ?? await this.getRepository('default', ExplorerEncryptFileEntity);

        return dataSource.save(entity);
    }

    getItem = async (whereObj: FindOptionsWhere<ExplorerEncryptFileEntity> | FindOptionsWhere<ExplorerEncryptFileEntity>[], options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(ExplorerEncryptFileEntity) ?? await this.getRepository('default', ExplorerEncryptFileEntity);
        return dataSource.findOne({
            where: whereObj
        })
    }

    removeItem = async (uid: string, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(ExplorerEncryptFileEntity) ?? await this.getRepository('default', ExplorerEncryptFileEntity);
        return dataSource.createQueryBuilder()
            .delete()
            .from(ExplorerEncryptFileEntity)
            .where('uid = :uid', { uid: uid })
            .execute();
    }
}