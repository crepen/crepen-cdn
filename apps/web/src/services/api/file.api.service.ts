import { CrepenApiResponse } from "../types/common.api"
import { CrepenFile } from "../types/object/file.object"
import { CrepenApiService } from "./base.api.service"

export class CrepenFileApiService {

    static getFileDataWithStore = async (token?: string, fileUid?: string): Promise<CrepenApiResponse<CrepenFile | undefined>> => {
        return CrepenApiService.fetch<CrepenFile>(
            'GET', `/explorer/file/${fileUid}`,
            undefined,
            { token: token }
        )
    }

    static removeFile = async (token? : string , fileUid? : string) : Promise<CrepenApiResponse> => {
        return CrepenApiService.fetch<CrepenFile>(
            'DELETE', `/explorer/file/${fileUid}`,
            undefined,
            { token: token }
        )
    }

}