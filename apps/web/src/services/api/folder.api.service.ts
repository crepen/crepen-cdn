import { CrepenApiResponse } from "../types/common.api"
import { CrepenFolder } from "../types/object/folder.object"
import { CrepenApiService } from "./base.api.service"

export class CrepenFolderApiService {
    static getRootFolder = (token?: string): Promise<CrepenApiResponse<CrepenFolder | undefined>> => {
        return CrepenApiService.fetch<CrepenFolder>(
            'GET', '/explorer/folder/root',
            undefined,
            { token: token }
        )
    }


    static getFolderData = (token: string | undefined, folderUid?: string, option?: { includeChild?: boolean }): Promise<CrepenApiResponse<CrepenFolder | undefined>> => {
        return CrepenApiService.fetch<CrepenFolder>(
            'GET', `/explorer/folder?uid=${folderUid}${option?.includeChild === true ? '&child=true' : ''}`,
            undefined,
            { token: token }
        )
    }

    static addFolder = (token: string | undefined , parentFolderUid? : string, folderTitle? : string) => {
        return CrepenApiService.fetch(
            'PUT' , '/explorer/folder',
            {
                folderTitle : folderTitle,
                parentFolderUid : parentFolderUid
            },
            {token : token}
        )
    }
}