import { CrepenFileApiService } from "./CrepenFileApiService";
import { CrepenCookieOperationService } from "@web/services/operation/cookie.operation.service";
import { CrepenFile } from "./dto/CrepenFile";
import { CrepenBaseError } from "@web/modules/common/error/CrepenBaseError";
import { CrepenServiceResult } from "@web/modules/common/result/CrepenServiceResult";
import { CrepenApiResult } from "@web/modules/common/result/CrepenApiResult";


export class CrepenFileOperationService {

    static getFiledata = async (fileUid: string): Promise<CrepenServiceResult<CrepenFile | undefined>> => {
        try {
            const tokenGroup = await CrepenCookieOperationService.getTokenData();
            const fileData = await CrepenFileApiService.getFileDataWithStore(tokenGroup.data?.accessToken, fileUid);

            return CrepenApiResult.toServiceResponse(fileData)
        }
        catch (e) {


            let err = new CrepenServiceResult<CrepenFile | undefined>({
                success: false,
                message: '알 수 없는 오류입니다.',
                innerError: e as Error
            })

            if (e instanceof CrepenBaseError) {
                err = new CrepenServiceResult<CrepenFile | undefined>({
                    ...e.toResult()
                })
            }

            return err;
        }
    }

    static removeFile = async (fileUid: string): Promise<CrepenServiceResult> => {
        try {
            const tokenGroup = await CrepenCookieOperationService.getTokenData();
            const fileData = await CrepenFileApiService.removeFile(tokenGroup.data?.accessToken, fileUid);

            return CrepenApiResult.toServiceResponse(fileData);
        }
        catch (e) {

            let err = new CrepenServiceResult({
                success: false,
                message: '알 수 없는 오류입니다.',
                innerError: e as Error
            })

            if (e instanceof CrepenBaseError) {
                err = new CrepenServiceResult({
                    ...e.toResult()
                })
            }

            return err;
        }
    }
}