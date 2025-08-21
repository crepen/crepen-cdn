import { Injectable } from "@nestjs/common";
import { CrepenUserRepository } from "./user.repository";
import { UserDuplicateIdError } from "@crepen-nest/lib/error/api/user/duplicate_id.user.error";
import { UserDuplicateEmailError } from "@crepen-nest/lib/error/api/user/duplicate_email.user.error";
import { StringUtil } from "@crepen-nest/lib/util";
import { UserUnvalidatePasswordError } from "@crepen-nest/lib/error/api/user/validate_password.user.error";
import { UserUnvalidateIdError } from "@crepen-nest/lib/error/api/user/validate_id.user.error";
import { randomUUID } from "crypto";
import { UserStateEnum } from "./enum/user-state.enum";
import { UserRoleEnum } from "./enum/user-role.enum";
import { RepositoryOptions } from "@crepen-nest/interface/repo";

@Injectable()
export class CrepenUserService {
    constructor(
        private readonly userRepo : CrepenUserRepository
    ){}

    addUser = async (userId : string , userPassword : string , userName: string , userEmail :string , options? : RepositoryOptions) => {

        const duplicateUser = await this.userRepo.getUserList([{accountId : userId.trim()} , {email : userEmail.trim()}] , options);
        
        if(duplicateUser.find(x=>x.accountId === userId.trim())){
            throw new UserDuplicateIdError();
        }
        else if(duplicateUser.find(x=>x.email === userEmail.trim())){
            throw new UserDuplicateEmailError();
        }
          else if(!/^(?=.*[A-Za-z])[A-Za-z\d]{6,}$/.test(userId)){
            throw new UserUnvalidateIdError();
        }
        else if(!/^(?=.*[a-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+={}\\[\]:;"'<>,.?/|\\-]{8,}$/.test(userPassword.trim())){
            throw new UserUnvalidatePasswordError();
        }
        
        const addUser = await this.userRepo.addUser({
            accountId : userId,
            accountPassword : userPassword,
            email : userEmail,
            name : userName,
            uid : randomUUID(),
            isLock :false,
            accountState : UserStateEnum.UNAPPROVED
        } , options)

        const addUserRole = await this.userRepo.addUserRole(addUser.uid , UserRoleEnum.ROLE_USER , options);

        return addUser;
    }


    getUserById = async (userId : string) => {
        return this.userRepo.getOneUser({
            accountId : userId
        })
    }
}