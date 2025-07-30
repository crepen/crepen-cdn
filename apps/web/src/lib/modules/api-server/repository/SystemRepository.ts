import { ServerHealthStateDTO, TryConnDBRequest, TryConnDatabaseDTO, ApplySystemDataRequest } from '@web/modules/crepen/entity/service/SystemService';
import humps from 'humps';
import { CrepenFetchExtenstion } from '../common/api/CrepenFetchExtension';
import { FetchApi } from '../common/api/FetchApiService';


export class SystemRepository {
    static getServerHealth = async () => {
        try {
            const result = await FetchApi.instance()
                .setMethod('GET')
                .setUrl('/system/health')
                .getResponse();


            return CrepenFetchExtenstion.convertCrepenResult<ServerHealthStateDTO>(result);
        }
        catch (e) {
            return CrepenFetchExtenstion.getDefaultErrorResult<ServerHealthStateDTO>(e as Error);
        }

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

        const snakeCaseBody = humps.decamelizeKeys(prop);

        try {
            const result = await FetchApi.instance()
                .setMethod('POST')
                .setUrl('/system/install')
                .setBody(snakeCaseBody)
                .getResponse();


            return CrepenFetchExtenstion.convertCrepenResult<TryConnDatabaseDTO>(result);
        }
        catch (e) {
            return CrepenFetchExtenstion.getDefaultErrorResult<TryConnDatabaseDTO>(e as Error);
        }
    }
}