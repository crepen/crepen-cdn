import { CrepenApiService } from "@web/modules/common/CrepenApiService"
import { CrepenApiResult } from "@web/modules/common/result/CrepenApiResult"
import { CrepenCumulativeTrafficDto } from "./dto/CrepenCumulativeTrafficDto"

export class CrepenMonitorApiService {
    static getCumulativeTrafficMonitorData = (token?: string): Promise<CrepenApiResult<CrepenCumulativeTrafficDto[] | undefined>> => {
        return CrepenApiService.fetch<CrepenCumulativeTrafficDto[]>(
            'GET', '/monitor/traffic/cumulative',
            undefined,
            { token: token }
        )
    }


}