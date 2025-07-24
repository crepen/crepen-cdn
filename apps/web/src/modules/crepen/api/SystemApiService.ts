import { ApplySystemDataRequest, TryConnDatabaseDTO, TryConnDBRequest } from "../entity/service/SystemService";
import { CrepenFetchExtenstion } from "./CrepenFetchExtension";
import { FetchApi } from "./FetchApiService"

export class SystemApiService {
    static getServerHealth = () => {
        FetchApi.instance()
            .setMethod('GET')
            .setUrl('/system/health')
            .getResponse();
    }


    static tryConnectDatabase = async (prop: TryConnDBRequest) => {
        try {
            const result = await FetchApi.instance()
                .setMethod('POST')
                .setUrl('/system/install/chk-db')
                .setBody(prop)
                .getResponse();


            return CrepenFetchExtenstion.convertCrepenResult<TryConnDatabaseDTO>(result);
        }
        catch (e) {
            return CrepenFetchExtenstion.getDefaultErrorResult<TryConnDatabaseDTO>(e as Error);
        }

    }

    static applySystemData = async (prop: ApplySystemDataRequest) => {
        try {
            const result = await FetchApi.instance()
                .setMethod('POST')
                .setUrl('/system/install')
                .setBody(prop)
                .getResponse();


            return CrepenFetchExtenstion.convertCrepenResult<TryConnDatabaseDTO>(result);
        }
        catch (e) {
            return CrepenFetchExtenstion.getDefaultErrorResult<TryConnDatabaseDTO>(e as Error);
        }
    }
}