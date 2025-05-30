import { UserEntity } from "../entity/user.entity"

export interface AddUserDto {
    id : string,
    decreptPassword : string,
    email? : string
}

export interface UpdateUserDto {
    uid : string,
    updateEntity? : UserEntity
}