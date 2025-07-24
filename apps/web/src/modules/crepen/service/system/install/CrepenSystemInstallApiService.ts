import { CrepenApiService } from "@web/modules/common/CrepenApiService";
import { CrepenApiResult } from "@web/modules/common/result/CrepenApiResult";
import { SystemInstallStateResultDto } from "./dto/CrepenSystemInstallStateDto";
import { CheckDBConnRequestDto, CheckDBConnResultDto } from "./dto/CheckDatabaseConnDto";

export class CrepenSystemInstallApiService {


    static getSystemInstallState = (): Promise<CrepenApiResult<SystemInstallStateResultDto>> => {
        return CrepenApiService.fetch<SystemInstallStateResultDto>(
            'GET',
            '/system/install'
        )
    }

    static checkDatabase = (prop: CheckDBConnRequestDto): Promise<CrepenApiResult<CheckDBConnResultDto>> => {
        return CrepenApiService.fetch<CheckDBConnResultDto>(
            'POST',
            '/system/install/chk-db',
            prop,
            {language : 'ko'}
        )
    }

}