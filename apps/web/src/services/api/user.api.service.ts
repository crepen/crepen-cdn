import { CrepenApiService } from "@web/lib/service/api-service";
import { CrepenApiResponse } from "@web/lib/service/types/api";

export class CrepenUserApiService {
    public static changePassword = async (token? : string , password?: string): Promise<CrepenApiResponse<unknown>> => {
        return CrepenApiService.fetch<unknown>('PUT', '/user', {password : password ?? ''} , {
            token : token
        });
    }

}