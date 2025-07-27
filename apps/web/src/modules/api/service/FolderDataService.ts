import { CommonApiOptions } from "../entity/CommonApi";
import { FolderEntity } from "../entity/object/FolderEntity";
import { FolderRepository } from "../repository/FolderRepository";
import { AuthSessionProvider } from "@web/modules/server/service/AuthSessionProvider";
import { CommonServiceCookieOptions } from "../entity/CommonService";
import { FolderDataServiceError } from "@web/modules/common/error/data-service/FolderDataServiceError";

export class FolderDataService {
    static getUserRootFolder = async (options?: CommonApiOptions & CommonServiceCookieOptions): Promise<FolderEntity | undefined> => {

        const tokenData = options?.token ?? (await AuthSessionProvider.getSessionData({ cookie: options?.cookie })).token?.accessToken

        const request = await FolderRepository.getRootFolder({
            language: options?.language,
            token: tokenData
        });

        if (!request.success) {
            throw FolderDataServiceError.errorResult(request.message);
        }

        return FolderEntity.recordToEntity(request.data);;
    }

    static getFolderData = async (folderUid?: string, options?: CommonApiOptions & CommonServiceCookieOptions & { includeChild?: boolean }): Promise<FolderEntity | undefined> => {

        const tokenData = options?.token ?? (await AuthSessionProvider.getSessionData({ cookie: options?.cookie })).token?.accessToken

        const request = await FolderRepository.getFolderData(folderUid, {
            token: tokenData,
            includeChild: options?.includeChild,
            language: options?.language
        });

        if (!request.success) {
            throw FolderDataServiceError.errorResult(request.message);
        }

        return FolderEntity.recordToEntity(request.data);
    }

    static addFolder = async (parentFolderUid: string, folderTitle: string, options?: CommonApiOptions & CommonServiceCookieOptions) => {
        const tokenData = options?.token ?? (await AuthSessionProvider.getSessionData({ cookie: options?.cookie })).token?.accessToken

        const request = await FolderRepository.addFolder(parentFolderUid, folderTitle, {
            token: tokenData,
            language: options?.language
        });

        if (!request.success) {
            throw FolderDataServiceError.errorResult(request.message);
        }

        return FolderEntity.recordToEntity(request.data);
    }
}