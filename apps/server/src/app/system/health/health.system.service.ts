import { Injectable } from "@nestjs/common";
import { CrepenSystemHealthRepository } from "./health.system.repository";

@Injectable()
export class CrepenSystemHealthService {
    constructor(
        private readonly healthRepo  : CrepenSystemHealthRepository
    ){}

    getDefaultDatabaseHealth = async () => {
        return this.healthRepo.getDefaultDatabaseHealth();
    }

    getInitState = async () : Promise<boolean> => {
        return (await this.healthRepo.getInitState())?.value === '1';
    }
}