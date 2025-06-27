import { CrepenApiResult } from "../../../common/result/CrepenApiResult";
import { CrepenServiceResult } from "../../../common/result/CrepenServiceResult";
import { CrepenFolder } from "./dto/CrepenFolder";
import { CrepenFolderApiService } from "./CrepenFolderApiService";
import { CrepenCookieOperationService } from "../../../../services/operation/cookie.operation.service";

export class CrepenFolderOperationService {
    static getRootFolder = async (): Promise<CrepenServiceResult<CrepenFolder | undefined>> => {
        try {
            const tokenGroup = await CrepenCookieOperationService.getTokenData();

            const getRootFolderRequest = await CrepenFolderApiService.getRootFolder(tokenGroup.data?.accessToken);

            return {
                success: getRootFolderRequest.success,
                data: getRootFolderRequest.data,
                message: getRootFolderRequest.message
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

    static getFolderData = async (targetFolderUid?: string, includeChild?: boolean): Promise<CrepenServiceResult<CrepenFolder | undefined>> => {

        const tokenGroup = await CrepenCookieOperationService.getTokenData();

        const folderData = await CrepenFolderApiService.getFolderData(tokenGroup.data?.accessToken, targetFolderUid, { includeChild: includeChild })

        return CrepenApiResult.toServiceResponse(folderData);
    }


    static addFolder = async (parentFolderUid?: string, folderTitle?: string) => {
        // const tokenGroup = await CrepenAuthOpereationService.getCookieStoreTokenGroup();
        const tokenGroup = await CrepenCookieOperationService.getTokenData();
        const addFolderRequest = await CrepenFolderApiService.addFolder(tokenGroup.data?.accessToken, parentFolderUid, folderTitle);

        return {
            success: addFolderRequest.success,
            data: addFolderRequest.data,
            message: addFolderRequest.message
        };
    }
}