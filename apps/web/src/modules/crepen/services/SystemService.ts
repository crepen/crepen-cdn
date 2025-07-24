import { SystemApiService } from "../api/SystemApiService"
import { TryConnDBRequest, ApplySystemDataRequest } from "../entity/service/SystemService";

export class SystemService {
    static tryConnectDB = async (prop: TryConnDBRequest): Promise<{ state: boolean, message?: string }> => {

        const request = await SystemApiService.tryConnectDatabase(prop);

        return {
            state: request.success,
            message: request.message
        };
    }

    static applySystemData = async (prop: ApplySystemDataRequest): Promise<{ state: boolean, message?: string }> => {
        const request = await SystemApiService.applySystemData(prop);

        return {
            state: request.success,
            message: request.message
        };

    }
}