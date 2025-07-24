import { CrepenApiService } from "@web/modules/common/CrepenApiService";
import { CrepenApiResult } from "@web/modules/common/result/CrepenApiResult";
import { CrepenSystemInstallStateDto } from "./dto/CrepenSystemInstallStateDto";
import { CheckDatabaseConnRequestDto, CheckDatabaseConnResultDto } from "./dto/CheckDatabaseConnDto";

export class CrepenSystemInstallApiService {


    static getSystemInstallState = (): Promise<CrepenApiResult<CrepenSystemInstallStateDto | undefined>> => {
        return CrepenApiService.fetch<CrepenSystemInstallStateDto>(
            'GET',
            '/system/install'
        )
    }

    static checkDatabase = (prop: CheckDatabaseConnRequestDto): Promise<CrepenApiResult<CheckDatabaseConnResultDto | undefined>> => {
        return CrepenApiService.fetch<CheckDatabaseConnResultDto>(
            'POST',
            '/system/install/chk-db',
            prop,
            {language : 'ko'}
        )
    }

}