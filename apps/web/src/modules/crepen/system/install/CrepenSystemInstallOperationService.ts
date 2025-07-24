import { CrepenServiceResult } from "@web/modules/common/result/CrepenServiceResult";
import { CrepenSystemInstallStateDto } from "./dto/CrepenSystemInstallStateDto";
import { CrepenSystemInstallApiService } from "./CrepenSystemInstallApiService";
import { CheckDatabaseConnRequestDto, CheckDatabaseConnResultDto } from "./dto/CheckDatabaseConnDto";
import { CrepenApiResult } from "@web/modules/common/result/CrepenApiResult";
import { cookies } from "next/headers";

export class CrepenSystemInstallOperationService {

    static getInstallState = async (): Promise<CrepenServiceResult<CrepenSystemInstallStateDto | undefined>> => {
        try {
            const stateRequest = await CrepenSystemInstallApiService.getSystemInstallState();

            return {
                success: stateRequest.success,
                data: stateRequest.data,
                message: stateRequest.message
            };
        }
        catch (e) {
            return {
                success: false,
                message: '알 수 없는 오류입니다',
                innerError: e as Error
            }
        }
    }

    static checkDatabase = async (prop: CheckDatabaseConnRequestDto): Promise<CrepenApiResult<CheckDatabaseConnResultDto | undefined>> => {
        try {
            const stateRequest = await CrepenSystemInstallApiService.checkDatabase(prop);






            return {
                success: stateRequest.success,
                data: stateRequest.data,
                message: stateRequest.message
            };
        }
        catch (e) {
            return {
                success: false,
                message: '알 수 없는 오류입니다',
                innerError: e as Error
            }
        }
    }

}