import { CrepenUser } from "@web/lib/service/types/user";
import { CrepenAuthOpereationService } from "./auth.operation.service";
import { CrepenSessionService } from "../common/session.service";
import { CrepenUserApiService } from "../api/user.api.service";

export class CrepenUserOperationService {

    static changePassword = async (password? : string) : Promise<{success: boolean , message? : string}> => {
        const renewalToken = await CrepenSessionService.renewalToken();
        if(renewalToken.success === false){
            return {
                success : false,
                message : renewalToken.message
            }
        }


        // const ss = await fetch('http://localhost:3332/user' , {
        //     body : JSON.stringify({
        //         password : 'qwer1234qwer'
        //     }),
        //     headers : {
        //         'Authorization' : `Bearer ${renewalToken.data?.accessToken}`,
        //         'Content-Type' : 'application/json'
        //     },
        //     method : 'PUT'
        // })

        // console.log(await ss.json())


        const changePasswordRequest = await CrepenUserApiService.changePassword(renewalToken.data?.accessToken,password);
        

        if(changePasswordRequest.success){
            return {
                success : true
            }
        }
        else {
            return {
                success : false,
                message : changePasswordRequest.message 
            }
        }
    }

    static getUserData = async (token? : string) : Promise<CrepenUser | undefined> => {
        return undefined;
    }
}