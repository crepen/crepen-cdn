import { UserEntity } from "../entity/user.entity";

export class UserDataDto {

    constructor(userEntity? : UserEntity){
        this.id = userEntity.id;
        this.email = userEntity.email;
    }

    id : string;
    email : string;
}