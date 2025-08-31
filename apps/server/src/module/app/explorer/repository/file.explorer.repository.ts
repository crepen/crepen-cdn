import { CrepenBaseRepository } from "@crepen-nest/lib/common/base.repository";
import { DatabaseService } from "@crepen-nest/module/config/database/database.config.service";
import { Injectable } from "@nestjs/common";
import { ExplorerFileEntity } from "../entity/file.explorer.default.entity";
import { RepositoryOptions } from "@crepen-nest/interface/repo";

@Injectable()
export class CrepenExplorerFileRepository extends CrepenBaseRepository {
    constructor(
        private readonly databaseService: DatabaseService
    ) { super(databaseService) }





    updateFileEntity = async (entity: ExplorerFileEntity, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(ExplorerFileEntity) ?? await this.getRepository('default', ExplorerFileEntity);

        return dataSource.update(entity.uid, entity);
    }
}