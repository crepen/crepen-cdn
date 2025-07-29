import { Injectable } from "@nestjs/common";
import { DataSource, EntityManager, Repository } from "typeorm";
import { FileTrafficLoggerEntity } from "./entity/file-traffic-logger.default.entity";
import { randomUUID } from "crypto";
import { CrepenBaseRepository } from "@crepen-nest/lib/common/base.repository";
import { DatabaseService } from "@crepen-nest/module/config/database/database.config.service";
import { RepositoryOptions } from "src/interface/repo";

@Injectable()
export class CrepenLoggerRepository {



}


@Injectable()
export class CrepenFileTrafficLoggerRepository extends CrepenBaseRepository{
    // private repo: Repository<FileTrafficLoggerEntity>

    constructor(
        private readonly databaseService: DatabaseService
    ) {
        super(databaseService);
        // this.repo = this.dataSource.getRepository(FileTrafficLoggerEntity);
    }

    // setManager = (manager: EntityManager) => {
    //     this.repo = manager.getRepository(FileTrafficLoggerEntity);
    //     return this;
    // }

    // defaultManager = () => {
    //     this.repo = this.dataSource.getRepository(FileTrafficLoggerEntity);
    //     return this;
    // }



    addFileTrafficLog = async (fileUid: string, accessUserUid: string, trafficSize: number , options? : RepositoryOptions) => {

        const dataSource = options?.manager?.getRepository(FileTrafficLoggerEntity) ?? await this.getRepository('default' , FileTrafficLoggerEntity);

        const loggerEntity = new FileTrafficLoggerEntity();
        loggerEntity.accessUserUid = accessUserUid;
        loggerEntity.fileUid = fileUid;
        loggerEntity.trafficSize = trafficSize;
        loggerEntity.uid = randomUUID();

        return dataSource.save(loggerEntity);
    }
}