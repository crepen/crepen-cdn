import { CrepenServiceResult } from "@web/modules/common/result/CrepenServiceResult";
import { SystemHealthResultDto } from "./dto/SystemHealthDto";
import { CrepenSystemHealthApiService } from "./CrepenSystemHealthApiService";
import { CommonOperationService } from "@web/modules/crepen/common/CommonOperationService";

export class CrepenSystemHealthOperationService extends CommonOperationService {

    static getSystemHealth = async (): Promise<CrepenServiceResult<SystemHealthResultDto>> => {
        try {
            const request = await CrepenSystemHealthApiService.getSystemHealth();

            return CrepenServiceResult.applyApiResult(request);
        }
        catch (e) {
            return this.getDefaultUnkownResult<SystemHealthResultDto>(e as Error);
        }
    }
}