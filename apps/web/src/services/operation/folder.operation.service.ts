import { CrepenAuthApiService } from "../api/auth.api.service";
import { CrepenFolderApiService } from "../api/folder.api.service";
import { CrepenSessionEdgeService } from "../edge-runtime/edge.session.service";
import { BaseServiceResult } from "../types/common.service";
import { CrepenFolder, CrepenFolderWithRelation } from "../types/object/folder.object";
import { CrepenAuthOpereationService } from "./auth.operation.service";
import { CrepenCookieOperationService } from "./cookie.operation.service";

export class CrepenFolderOperationService {
    static getRootFolder = async (): Promise<BaseServiceResult<CrepenFolder | undefined>> => {
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

    static getFolderData = async (targetFolderUid?: string, includeChild?: boolean): Promise<BaseServiceResult<CrepenFolderWithRelation | undefined>> => {

        const tokenGroup = await CrepenCookieOperationService.getTokenData();
        console.log("WWWW" , tokenGroup);

        const getFolderInfoRequest = await CrepenFolderApiService.getFolderData(tokenGroup.data?.accessToken, targetFolderUid, { includeChild: includeChild })

        return {
            success: getFolderInfoRequest.success,
            data: getFolderInfoRequest.data,
            message: getFolderInfoRequest.message
        };
    }

    static getFolderPath = async (targetFolderUid?: string): Promise<BaseServiceResult<String>> => {
        return {
            success: false,
            data: ''
        }
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