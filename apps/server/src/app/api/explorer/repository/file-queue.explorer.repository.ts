import { RepositoryOptions } from "@crepen-nest/interface/repo";
import { CrepenBaseRepository } from "@crepen-nest/lib/common/base.repository";
import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { ExplorerFileEncryptQueueEntity } from "../entity/encrypt-queue.file.explorer.default.entity";
import { ExplorerFileQueueState } from "../enum/file-queue-state.enum";
import { ExplorerFileQueueType } from "../enum/file-queue-type.enum";
import { isArray } from "class-validator";
import { DatabaseService } from "@crepen-nest/app/config/database/database.config.service";

@Injectable()
export class CrepenExplorerFileEncryptQueueRepository extends CrepenBaseRepository {
    constructor(
        private readonly databaseService: DatabaseService
    ) { super(databaseService) }



    addQueue = async (fileUid: string, type: ExplorerFileQueueType, userUid: string, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(ExplorerFileEncryptQueueEntity) ?? await this.getRepository('default', ExplorerFileEncryptQueueEntity);

        const entity = new ExplorerFileEncryptQueueEntity();
        entity.uid = randomUUID();
        entity.fileUid = fileUid;
        entity.queueState = ExplorerFileQueueState.WAIT;
        entity.queueType = type;
        entity.createDate = new Date();
        entity.userUid = userUid;


        return dataSource.save(entity, { data: false });
    }

    getQueueList = async (state?: ExplorerFileQueueState | ExplorerFileQueueState[], options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(ExplorerFileEncryptQueueEntity) ?? await this.getRepository('default', ExplorerFileEncryptQueueEntity);

        const stateList: ExplorerFileQueueState[] = [];

        if (isArray(state)) {
            stateList.push(...state);
        }
        else {
            stateList.push(state)
        }

        if (state === undefined || (isArray(state) ? state.length === 0 : false)) {
            return [];
        }

        return dataSource.find({
            where: stateList.map(x => ({ queueState: x })),
            order: {
                createDate: 'ASC'
            }
        })
    }

    getFileQueue = async (fileUid: string, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(ExplorerFileEncryptQueueEntity) ?? await this.getRepository('default', ExplorerFileEncryptQueueEntity);


        return dataSource.findOne({
            where: {
                fileUid: fileUid
            }
        })
    }

    upateQueueState = async (uidList: string[], state: ExplorerFileQueueState, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(ExplorerFileEncryptQueueEntity) ?? await this.getRepository('default', ExplorerFileEncryptQueueEntity);

        return dataSource.createQueryBuilder()
            .update(ExplorerFileEncryptQueueEntity)
            .set({ queueState: state })
            .where('uid in (:...uid)', { uid: uidList })
            .execute();
    }
}