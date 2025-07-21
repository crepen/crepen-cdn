import { CrepenServiceResult } from "@web/modules/common/result/CrepenServiceResult";
import { CrepenCumulativeTrafficDto } from "./dto/CrepenCumulativeTrafficDto";
import { CrepenCookieOperationService } from "@web/services/operation/cookie.operation.service";
import { CrepenMonitorApiService } from "./CrepenMonitorApiService";

export class CrepenMonitorOperationService {
    static getCumulativeTrafficMonitorData = async (): Promise<CrepenServiceResult<CrepenCumulativeTrafficDto[] | undefined>> => {
        try {
            const tokenGroup = await CrepenCookieOperationService.getTokenData();

            const getRootFolderRequest = await CrepenMonitorApiService.getCumulativeTrafficMonitorData(tokenGroup.data?.accessToken);

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
}