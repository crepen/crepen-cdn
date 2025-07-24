import { CrepenApiResult } from "@web/modules/common/result/CrepenApiResult"
import { CrepenFolder } from "./dto/CrepenFolder"
import { CrepenApiService } from "@web/modules/common/CrepenApiService"

export class CrepenFolderApiService {
    static getRootFolder = (token?: string): Promise<CrepenApiResult<CrepenFolder | undefined>> => {
        return CrepenApiService.fetch<CrepenFolder>(
            'GET', '/explorer/folder/root',
            undefined,
            { token: token }
        )
    }


    static getFolderData = (token: string | undefined, folderUid?: string, option?: { includeChild?: boolean }): Promise<CrepenApiResult<CrepenFolder | undefined>> => {
        return CrepenApiService.fetch<CrepenFolder>(
            'GET', `/explorer/folder/${folderUid}${option?.includeChild === true ? '?child=true' : ''}`,
            undefined,
            { token: token }
        )
    }

    static addFolder = (token: string | undefined, parentFolderUid?: string, folderTitle?: string): Promise<CrepenApiResult> => {
        return CrepenApiService.fetch(
            'PUT', '/explorer/folder',
            {
                folderTitle: folderTitle,
                parentFolderUid: parentFolderUid
            },
            { token: token }
        )
    }
}