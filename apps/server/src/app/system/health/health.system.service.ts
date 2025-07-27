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
        try {
            return (await this.dbService.getDefault()).isInitialized;
        }
        catch (e) {
            return false;
        }

    }

    getLocalDatabaseHealth = async () => {
        try {
            return (await this.dbService.getLocal()).isInitialized;
        }
        catch (e) {
            return false;
        }
    }

    getInitState = async (): Promise<boolean> => {
        try {
            return (await this.healthRepo.getInitState())?.value === '1';
        }
        catch (e) {
            return false;
        }
    }
}