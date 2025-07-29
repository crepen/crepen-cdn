import { Injectable } from "@nestjs/common";
import { SystemHealthRepository } from "./health.system.repository";
import { DatabaseService } from "@crepen-nest/module/config/database/database.config.service";

@Injectable()
export class SystemHealthService {
    constructor(
        private readonly healthRepo: SystemHealthRepository,
        private readonly dbService: DatabaseService,
    ) { }

    isDefaultDatabaseConnect = async () => {
        try {
            return (await this.dbService.getDefault()).isInitialized;
        }
        catch (e) {
            return false;
        }

    }

    isLocalDatabaseConnect = async () => {
        try {
            return (await this.dbService.getLocal()).isInitialized;
        }
        catch (e) {
            return false;
        }
    }

    isPlatformInstalled = async (): Promise<boolean> => {
        try {
            return (await this.healthRepo.getInitState())?.value === '1';
        }
        catch (e) {
            return false;
        }
    }
}