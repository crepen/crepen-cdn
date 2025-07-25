import { TryConnDBRequest, ApplySystemDataRequest, ServerHealthStateDTO } from "../../crepen/entity/service/SystemService";
import { CommonStateDTO } from "../entity/CommonService";
import { SystemRepository } from "../repository/SystemRepository";

export class SystemDataService {
    static tryConnectDB = async (prop: TryConnDBRequest): Promise<CommonStateDTO> => {

        const request = await SystemRepository.tryConnectDatabase(prop);

        return {
            state: request.success,
            message: request.message
        };
    }

    static applySystemData = async (prop: ApplySystemDataRequest): Promise<CommonStateDTO> => {
        const request = await SystemRepository.applySystemData(prop);

        return {
            state: request.success,
            message: request.message
        };

    }

    static getServerHealth = async () : Promise<ServerHealthStateDTO> => {
        const request = await SystemRepository.getServerHealth();

        return {
            install : request.data?.install ?? false,
            database : {
                default : request.data?.database?.default ?? false,
                local : request.data?.database?.local ?? false
            }
        };
    }
}