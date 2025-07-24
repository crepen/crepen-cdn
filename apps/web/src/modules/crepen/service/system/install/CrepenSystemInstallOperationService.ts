import { CrepenServiceResult } from "@web/modules/common/result/CrepenServiceResult";
import { SystemInstallStateResultDto } from "./dto/CrepenSystemInstallStateDto";
import { CrepenSystemInstallApiService } from "./CrepenSystemInstallApiService";
import { CheckDBConnRequestDto, CheckDBConnResultDto } from "./dto/CheckDatabaseConnDto";
import { CrepenApiResult } from "@web/modules/common/result/CrepenApiResult";
import { CommonOperationService } from "@web/modules/crepen/common/CommonOperationService";

export class CrepenSystemInstallOperationService extends CommonOperationService {

    static getInstallState = async (): Promise<CrepenServiceResult<SystemInstallStateResultDto>> => {
        try {
            const request = await CrepenSystemInstallApiService.getSystemInstallState();

            return CrepenServiceResult.applyApiResult(request);
        }
        catch (e) {
            return this.getDefaultUnkownResult<SystemInstallStateResultDto>(e as Error);
        }
    }

    static getDBConnState = async (prop: CheckDBConnRequestDto): Promise<CrepenApiResult<CheckDBConnResultDto>> => {
        try {
            const request = await CrepenSystemInstallApiService.checkDatabase(prop);

            return CrepenServiceResult.applyApiResult(request);
        }
        catch (e) {
            return this.getDefaultUnkownResult<CheckDBConnResultDto>(e as Error);
        }
    }

}