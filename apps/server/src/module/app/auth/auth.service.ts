import { Injectable } from "@nestjs/common";
import { CrepenUserService } from "../user/user.service";
import { FileNotFoundError } from "@crepen-nest/lib/error/api/file/not_found_file.error";
import { UserNotFoundError } from "@crepen-nest/lib/error/api/user/not_found.user.error";
import { UserStateEnum } from "../user/enum/user-state.enum";
import { UserUnapprovalError } from "@crepen-nest/lib/error/api/user/unapproval.user.error";

@Injectable()
export class CrepenAuthService {

    constructor(
        private readonly userService: CrepenUserService
    ) { }


    signIn = async (userId: string, userPassword?: string) => {
        const userData = await this.userService.getUserById(userId);

        if (!userData || userData.accountState === UserStateEnum.DELETE) {
            throw new UserNotFoundError()
        }
        else if(userData.accountState === UserStateEnum.UNAPPROVED){
            throw new UserUnapprovalError();
        }

        
    }
}