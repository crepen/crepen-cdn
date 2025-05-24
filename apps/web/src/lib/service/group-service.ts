import { CrepenLanguageService } from "../../services/common/language.service";
import { StringUtil } from "../util/string.util";
import { CrepenApiService } from "./api-service";
import { CrepenApiOptions, CrepenApiResponse } from "./types/api";
import { CrepenGroup } from "./types/group";


export class CrepenGroupService {

    public static getGroupList = async (parentGroupId?: string, options?: CrepenApiOptions): Promise<CrepenApiResponse<CrepenGroup[] | undefined>> => {
        return CrepenApiService.fetch<CrepenGroup[] | undefined>(
            'GET',
            `/group${StringUtil.isEmpty(parentGroupId) ? '' : `?id=${parentGroupId}`}`,
            undefined,
            options
        );
    }


    // public static login = async (id: string | undefined, password: string | undefined): Promise<CrepenApiResponse<CrepenToken | undefined>> => {
    //     const formData: FormData = new FormData();
    //     formData.set('id', id ?? '');
    //     formData.set('password', password ?? '');
    //     return CrepenApiService.fetch<CrepenToken | undefined>('POST', '/auth/login', formData);
    // }



}