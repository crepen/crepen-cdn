import { Injectable } from "@nestjs/common";
import { CrepenFileTrafficLoggerRepository, CrepenLoggerRepository } from "./logger.repository";
import { DataSource } from "typeorm";

@Injectable()
export class CrepenLoggerService {
    constructor(
        private readonly trafficLoggerRepo : CrepenFileTrafficLoggerRepository
    ){}

    logFileTraffic = async (fileUid : string , accessUserUid : string, trafficSize : number) => {
        return await this.trafficLoggerRepo.addFileTrafficLog(fileUid , accessUserUid , trafficSize)
    }

    logPublishedFileTraffic = async (fileUid : string , trafficSize : number) => {
        return this.logFileTraffic(fileUid , '' , trafficSize);
    }
}   