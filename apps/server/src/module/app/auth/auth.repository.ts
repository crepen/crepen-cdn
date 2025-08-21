import { RepositoryOptions } from "@crepen-nest/interface/repo";
import { CrepenBaseRepository } from "@crepen-nest/lib/common/base.repository";
import { DatabaseService } from "@crepen-nest/module/config/database/database.config.service";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "../user/entity/user.default.entity";

@Injectable()
export class CrepenAuthRepository extends CrepenBaseRepository {
    constructor(
        private readonly databaseService: DatabaseService
    ) { super(databaseService) }


    // getUserData = (userId: string, options?: RepositoryOptions) => {
    //     const dataSource = options?.manager?.getRepository(UserEntity) ?? await this.getRepository('default', UserEntity);
    // }
}