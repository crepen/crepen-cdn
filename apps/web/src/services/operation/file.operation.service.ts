import { CrepenServiceError } from "@web/lib/common/service-error";
import { BaseServiceResult } from "../types/common.service";
import { CrepenFile } from "../types/object/file.object";
import { CrepenCookieOperationService } from "./cookie.operation.service";
import { CrepenFileApiService } from "../api/file.api.service";

export class CrepenFileOperationService {

    static getFiledata = async (fileUid: string): Promise<BaseServiceResult<CrepenFile | undefined>> => {
        try {
            const tokenGroup = await CrepenCookieOperationService.getTokenData();
            const getFileDataRequest = await CrepenFileApiService.getFileDataWithStore(tokenGroup.data?.accessToken, fileUid);

            return {
                success : getFileDataRequest.success,
                message : getFileDataRequest.message,
                data : getFileDataRequest.data,
                statusCode : getFileDataRequest.statusCode
            }
        }
        catch (e) {

            if (e instanceof CrepenServiceError) {
                return {
                    success: false,
                    message: e.message
                }
            }

            return {
                success: false,
                message: '알 수 없는 오류입니다',
                innerError: e as Error
            }
        }
    }

    static removeFile = async (fileUid: string): Promise<BaseServiceResult> => {
        try {
            const tokenGroup = await CrepenCookieOperationService.getTokenData();
            const getFileDataRequest = await CrepenFileApiService.removeFile(tokenGroup.data?.accessToken, fileUid);

            return {
                success : getFileDataRequest.success,
                message : getFileDataRequest.message,
                statusCode : getFileDataRequest.statusCode
            }
        }
        catch (e) {

            if (e instanceof CrepenServiceError) {
                return {
                    success: false,
                    message: e.message
                }
            }

            return {
                success: false,
                message: '알 수 없는 오류입니다',
                innerError: e as Error
            }
        }
    }
}