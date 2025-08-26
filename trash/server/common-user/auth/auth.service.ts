import { Injectable } from "@nestjs/common";

@Injectable()
export class CrepenAuthRouteService {


    constructor(
      
    ) { }


    validatePassword = (password?: string): boolean => {
        const passwordRegex = new RegExp(/^(?=.*[a-zA-Z])(?=.*[0-9]).{12,16}$/g)

        if (!passwordRegex.test(password ?? '')) {
            return false;
        }
        else {
            return true;
        }
    }


    

}