import { FindOptionsWhere } from "typeorm";
import { UserEntity } from "./entity/user.entity";
import { DatabaseService } from "@crepen-nest/module/config/database/database.config.service";
import { CrepenBaseRepository } from "@crepen-nest/lib/common/base.repository";



// @Injectable()
export class CrepenUserRepository extends CrepenBaseRepository {

    constructor(databaseService: DatabaseService) {
        super(databaseService);
    }

    addOne = async (userData: UserEntity) => {
        const dataSource = await this.getRepository('default', UserEntity);
        return dataSource.save(userData);
    }

    updateOne = async (uid: string, userData: UserEntity) => {
        const dataSource = await this.getRepository('default', UserEntity);
        return dataSource.update({ uid: uid }, userData)
    }

    match = async (matchData: FindOptionsWhere<UserEntity>[]) => {
        const dataSource = await this.getRepository('default', UserEntity);
        return dataSource.find({
            where: matchData
        })
    }

    matchOne = async (matchData: FindOptionsWhere<UserEntity>[]) => {

        const dataSource = await this.getRepository('default', UserEntity);
        return dataSource.findOne({
            where: matchData
        })
    }

}