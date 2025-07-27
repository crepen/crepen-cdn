import { FileDataServiceError } from "@web/modules/common/error/data-service/FileDataServiceError";
import { FileEntity } from "../entity/object/FileEntity";
import { FileRepository } from "../repository/FileRepository";
import { AuthSessionProvider } from "@web/modules/server/service/AuthSessionProvider";
import { CommonApiOptions } from "../entity/CommonApi";
import { CommonServiceCookieOptions } from "../entity/CommonService";

export class FileDataService {
    static getFileData = async (fileUid?: string, options?: CommonApiOptions & CommonServiceCookieOptions) => {

        const tokenData = options?.token ?? (await AuthSessionProvider.getSessionData({ cookie: options?.cookie })).token?.accessToken

        const request = await FileRepository.getFileInfo(fileUid, {
            language: options?.language,
            token: tokenData
        });

        if (!request.success) {
            throw FileDataServiceError.errorResult(request.message);
        }

        return FileEntity.recordToEntity(request.data);

    }

    static removeFile = async (fileUid?: string, options?: CommonApiOptions & CommonServiceCookieOptions) => {
        const tokenData = options?.token ?? (await AuthSessionProvider.getSessionData({ cookie: options?.cookie })).token?.accessToken

        const request = await FileRepository.removeFile(fileUid, {
            language: options?.language,
            token: tokenData
        });

        if (!request.success) {
            throw FileDataServiceError.errorResult(request.message);
        }

        return FileEntity.recordToEntity(request.data);

    }
}