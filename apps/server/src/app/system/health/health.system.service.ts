import { Injectable } from "@nestjs/common";
import { CrepenSystemHealthRepository } from "./health.system.repository";
import { CrepenDatabaseService } from "@crepen-nest/config/database/database.config.service";

@Injectable()
export class CrepenSystemHealthService {
    constructor(
        private readonly healthRepo: CrepenSystemHealthRepository,
        private readonly dbService: CrepenDatabaseService,
    ) { }

    getDefaultDatabaseHealth = async () => {
        return (await this.dbService.getDefault()).isInitialized;
    }

    getLocalDatabaseHealth = async () => {
        return (await this.dbService.getLocal()).isInitialized;
    }

    getInitState = async (): Promise<boolean> => {
        return (await this.healthRepo.getInitState())?.value === '1';
    }
}