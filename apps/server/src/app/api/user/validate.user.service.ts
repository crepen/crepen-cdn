import { Injectable } from "@nestjs/common";
import { CrepenUserRepository } from "./user.repository";
import { isEmail } from "class-validator";

@Injectable()
export class CrepenUserValidateService {
    constructor(
        private readonly userRepo: CrepenUserRepository
    ) { }


    isValidateUserName = (name?: string): boolean => {
        const regex = new RegExp(/^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣぁ-んァ-ン一-龯]{2,10}$/g)
        return this.validateValue(regex, name);
    }

    isValidateUserId = (id?: string): boolean => {
        const regex = new RegExp(/^(?=.*[A-Za-z])[A-Za-z\d]{6,}$/);
        return this.validateValue(regex, id);
    }

    isValidateUserEmail = (email?: string): boolean => {
        return isEmail((email??'NTF').trim());
    }

    isValidateUserPassword = (password?: string): boolean => {
        const regex = new RegExp(/^(?=.*[a-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+={}\\[\]:;"'<>,.?/|\\-]{8,}$/);
        return this.validateValue(regex, password);
    }

    isDuplicateUserId = async (id?: string) => {
        const duplicateUser = await this.userRepo.getUserList({ accountId: (id ?? 'NFD').trim() });

        return duplicateUser.length > 0;
    }

    isDuplicateUserEmail = async (email?: string) => {
        const duplicateUser = await this.userRepo.getUserList({ email: (email ?? 'NFD').trim() });

        return duplicateUser.length > 0;
    }


    private validateValue = (regex: RegExp, value?: string) => {
        return regex.test((value ?? '').trim());
    }
}