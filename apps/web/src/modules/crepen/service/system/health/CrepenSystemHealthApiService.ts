import { CrepenApiService } from "@web/modules/common-1/CrepenApiService";
import { CrepenApiResult } from "@web/modules/common-1/result/CrepenApiResult";
import { SystemHealthResultDto } from "./dto/SystemHealthDto";

export class CrepenSystemHealthApiService {


    static getSystemHealth = (): Promise<CrepenApiResult<SystemHealthResultDto>> => {
        return CrepenApiService.fetch<SystemHealthResultDto>(
            'GET',
            '/system/health'
        )
    }

    

}