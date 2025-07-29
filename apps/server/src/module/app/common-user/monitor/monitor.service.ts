import { Injectable } from "@nestjs/common";
import { CrepenUserMonitorRepository } from "./monitor.repository";

@Injectable()
export class CrepenUserMonitorService {

    constructor(
        private readonly repo: CrepenUserMonitorRepository,
    ) { }


    getCumulativeData = (targetUserUid : string) => {
        return this.repo.getCumulativeData(targetUserUid);
    }
}