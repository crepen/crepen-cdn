import { CrepenApiService } from "@web/modules/common/CrepenApiService"
import { CrepenFile } from "./dto/CrepenFile"
import { CrepenApiResult } from "@web/modules/common/result/CrepenApiResult"

export class CrepenFileApiService {

    static getFileDataWithStore = async (token?: string, fileUid?: string): Promise<CrepenApiResult<CrepenFile | undefined>> => {
        return CrepenApiService.fetch<CrepenFile>(
            'GET', `/explorer/file/${fileUid}`,
            undefined,
            { token: token }
        )
    }

    static removeFile = async (token? : string , fileUid? : string) : Promise<CrepenApiResult> => {
        return CrepenApiService.fetch<CrepenFile>(
            'DELETE', `/explorer/file/${fileUid}`,
            undefined,
            { token: token }
        )
    }

}