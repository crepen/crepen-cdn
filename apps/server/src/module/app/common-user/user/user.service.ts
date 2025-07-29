import { HttpStatus, Injectable } from "@nestjs/common";
import { UserEntity } from "./entity/user.default.entity";
import { CrepenUserRepository } from "./user.repository";
import { AddUserDto, UpdateUserDto } from "./dto/user.common.dto";
import { randomUUID } from "crypto";
import { StringUtil } from "@crepen-nest/lib/util/string.util";
import { CryptoUtil } from "@crepen-nest/lib/util/crypto.util";
import { CrepenCommonHttpLocaleError } from "@crepen-nest/lib/error-bak/http/common.http.error";

@Injectable()
export class CrepenUserRouteService {
    constructor(
        private readonly userRepo: CrepenUserRepository,
    ) { }

    

    getUserDataByIdOrEmail = async (idOrEmail: string | undefined): Promise<UserEntity | undefined> => {
        return this.userRepo.matchOne([{ id: idOrEmail }, { email: idOrEmail }])
    }

    getUserDataById = async (id: string | undefined): Promise<UserEntity | undefined> => {
        return this.userRepo.matchOne([{ id: id }]) ?? undefined;
    };

    getMatchUserByUid = async (uid: string) => {
        return await this.userRepo.matchOne([{ uid: uid }]);
    }


    addUser = async (userData: AddUserDto) => {

        const userEntity = new UserEntity();
        userEntity.id = userData.id;
        userEntity.password = await CryptoUtil.Hash.encrypt(userData.password);
        userEntity.email = userData.email;
        userEntity.uid = randomUUID();
        userEntity.name = userData.name;

        const findDuplicateUser: UserEntity[] = await this.userRepo.match([{ id: userEntity.id }, { email: userEntity.email }, { uid: userEntity.uid }])

        if (findDuplicateUser.length > 0) {
            throw new CrepenCommonHttpLocaleError("cloud_user", 'USER_ADD_FAILED_DEPLECATE_INFO', HttpStatus.BAD_REQUEST)
        }

        return await this.userRepo.addOne(userEntity);
    }



    updateUser = async (updateUserUid: string, updateUserData: UpdateUserDto) => {

        const userEntity = new UserEntity();
        userEntity.uid = updateUserUid;
        if (!StringUtil.isEmpty(updateUserData.password)) {
            userEntity.password = await CryptoUtil.Hash.encrypt(updateUserData.password);
        }
        userEntity.name = updateUserData.name;
        userEntity.email = updateUserData.email;
        userEntity.updateDate = new Date(Date.now());
        userEntity.isLock = updateUserData.isLock;
        return await this.userRepo.updateOne(updateUserUid, userEntity);
    }


    lockUser = async (updateUserUid : string , lockable : boolean) => {
        const userEntity = new UserEntity();
        userEntity.uid = updateUserUid;
        userEntity.isLock = lockable;
        return await this.userRepo.updateOne(updateUserUid , userEntity);
    }


}