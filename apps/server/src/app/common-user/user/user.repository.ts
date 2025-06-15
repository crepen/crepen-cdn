import { Injectable } from "@nestjs/common";
import { DataSource, FindOptionsWhere, Repository } from "typeorm";
import { UserEntity } from "./entity/user.entity";



@Injectable()
export class CrepenUserRepository {

    private userRepo: Repository<UserEntity>;


    constructor(private readonly dataSource: DataSource) {
        this.userRepo = this.dataSource.getRepository(UserEntity);
    }

    addOne = async (userData: UserEntity) => {
        return await this.userRepo.save(userData);
    }

    updateOne = async (uid: string , userData: UserEntity) => {
        return await this.userRepo.update({ uid: uid }, userData)
    }


    

    match = async (matchData : FindOptionsWhere<UserEntity>[]) => {
        return await this.userRepo.find({
            where : matchData
        })
    }

    matchOne = async (matchData : FindOptionsWhere<UserEntity>[]) => {
        return await this.userRepo.findOne({
            where : matchData
        })
    }

}