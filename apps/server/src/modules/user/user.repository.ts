import { Injectable } from "@nestjs/common";
import { DataSource, FindOptionsWhere, Repository } from "typeorm";
import { UserEntity } from "./entity/user.entity";



@Injectable()
export class UserRepository {

    private userRepo: Repository<UserEntity>;


    constructor(private readonly dataSource: DataSource) {
        this.userRepo = this.dataSource.getRepository(UserEntity);
    }

    findOneById = async (id: string) => {
        return await this.userRepo.findOne({
            where: {
                id: id
            }
        });
    }


    addOne = async (userData: UserEntity) => {
        return await this.userRepo.save(userData);
    }

    updateOne = async (userData: UserEntity) => {
        return await this.userRepo.update({ uid: userData.uid }, userData)
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