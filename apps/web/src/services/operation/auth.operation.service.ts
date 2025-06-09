import { cookies } from "next/headers";
import { CrepenAuthApiService } from "../api/auth.api.service";
import { CrepenSessionService } from "../common/session.service"
import { CrepenUserOperationService } from "./user.operation.service";

export class CrepenAuthOpereationService {
    static rewriteToken = async () => {
        const tokenGroup = await CrepenSessionService.getTokenData();

        const accessTokenState = await CrepenAuthApiService.checkTokenExpired('access_token' , tokenGroup?.accessToken);

        if(accessTokenState.statusCode === 200){
            return tokenGroup;
        }

        const refreshTokenState = await CrepenAuthApiService.refreshToken(tokenGroup?.refreshToken);

        if(refreshTokenState.statusCode === 401){
            return undefined;
        }
        else {
            const cookie = await cookies();
            

            return refreshTokenState.data;
        }
    }

    static checkTokenExpired = async () : Promise<boolean> => {
        return false;
    }

}