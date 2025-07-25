import { CrepenApiService } from "@web/modules/common-1/CrepenApiService"
import { CrepenApiResult } from "@web/modules/common-1/result/CrepenApiResult"
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