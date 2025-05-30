import { HttpStatus, Injectable } from "@nestjs/common";
import { UserEntity } from "./entity/user.entity";
import { CrepenUserRepository } from "./user.repository";
import { AddUserDto, UpdateUserDto } from "./dto/user.common.dto";
import { EncryptUtil } from "@web/lib/util/encrypt.util";
import { randomUUID } from "crypto";
import { CrepenLocaleHttpException } from "@web/lib/exception/crepen.http.exception";

@Injectable()
export class CrepenUserRouteService {
    constructor(
        private readonly userRepo: CrepenUserRepository,
    ) { }


    getUserDataByIdOrEmail = async (idOrEmail : string | undefined) : Promise<UserEntity | undefined> => {
        return this.userRepo.matchOne([{id : idOrEmail} , {email : idOrEmail}])
    }

    getUserDataById = async (id: string | undefined): Promise<UserEntity | undefined> => {
        return this.userRepo.matchOne([{id : id}]) ?? undefined;
    };

    getMatchUserByUid = async (uid: string) => {
        return await this.userRepo.matchOne([{ uid: uid }]);
    }


    addUser = async (userData: AddUserDto) => {

        const userEntity = new UserEntity();
        userEntity.id = userData.id;
        userEntity.password = await EncryptUtil.hashPassword(userData.decreptPassword);
        userEntity.email = userData.email;
        userEntity.uid = randomUUID();

        const findDuplicateUser: UserEntity[] = await this.userRepo.match([{ id: userEntity.id }, { email: userEntity.email }, { uid: userEntity.uid }])

        if (findDuplicateUser.length > 0) {
            throw new CrepenLocaleHttpException("cloud_user", 'USER_ADD_FAILED_DEPLECATE_INFO', HttpStatus.BAD_REQUEST)
        }

        return await this.userRepo.addOne(userEntity);
    }



    updateUser = async (updateUserData: UpdateUserDto) => {
        const userEntity = updateUserData.updateEntity ?? new UserEntity();
        userEntity.password = await EncryptUtil.hashPassword(updateUserData.updateEntity.password);

        return await this.userRepo.updateOne(updateUserData.uid, userEntity);
    }

   
}