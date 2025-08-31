import { Injectable } from "@nestjs/common";
import { RepositoryOptions } from "@crepen-nest/interface/repo";
import { ExplorerFileQueueType } from "../enum/file-queue-type.enum";
import { ExplorerFileQueueState } from "../enum/file-queue-state.enum";
import { CrepenExplorerFileEncryptQueueRepository } from "../repository/file-queue.explorer.repository";

@Injectable()
export class CrepenExplorerFileEncryptQueueService {
    constructor(
        private readonly repo : CrepenExplorerFileEncryptQueueRepository
    ){}


    addQueue = async (fileUid :string , type : ExplorerFileQueueType, userUid : string , options?: RepositoryOptions ) => {
        return await this.repo.addQueue(fileUid , type, userUid , options);
    }

    getWaitQueueList = async (options?: RepositoryOptions) => {
        const queueList = await this.repo.getQueueList(ExplorerFileQueueState.WAIT, options);
        return queueList;
    }

    updateQueueState = async (queueUid : string[] , state : ExplorerFileQueueState , options? :RepositoryOptions) => {
        return this.repo.upateQueueState(queueUid , state , options);
    }
}