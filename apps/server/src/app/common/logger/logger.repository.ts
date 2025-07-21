import { Injectable } from "@nestjs/common";
import { DataSource, EntityManager, Repository } from "typeorm";
import { FileTrafficLoggerEntity } from "./entity/file-traffic-logger.entity";
import { randomUUID } from "crypto";

@Injectable()
export class CrepenLoggerRepository {



}


@Injectable()
export class CrepenFileTrafficLoggerRepository {
    private repo: Repository<FileTrafficLoggerEntity>

    constructor(
        private readonly dataSource: DataSource
    ) {
        this.repo = this.dataSource.getRepository(FileTrafficLoggerEntity);
    }

    setManager = (manager: EntityManager) => {
        this.repo = manager.getRepository(FileTrafficLoggerEntity);
        return this;
    }

    defaultManager = () => {
        this.repo = this.dataSource.getRepository(FileTrafficLoggerEntity);
        return this;
    }



    addFileTrafficLog = async (fileUid: string, accessUserUid: string, trafficSize: number) => {

        const loggerEntity = new FileTrafficLoggerEntity();
        loggerEntity.accessUserUid = accessUserUid;
        loggerEntity.fileUid = fileUid;
        loggerEntity.trafficSize = trafficSize;
        loggerEntity.uid = randomUUID();

        return this.repo.save(loggerEntity);
    }
}