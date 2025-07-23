import { UserEntity } from "@crepen-nest/app/common-user/user/entity/user.default.entity";
import { CrepenDatabaseService } from "@crepen-nest/config/database/database.config.service";
import { Injectable } from "@nestjs/common";
import { DataSource, EntityTarget, ObjectLiteral, Repository } from "typeorm";

@Injectable()
export class CrepenBaseRepository {


    constructor(
        private readonly dbService: CrepenDatabaseService,
    ) { }

    getRepository = async <Entity extends ObjectLiteral>(dbType: 'default' | 'local', entity: EntityTarget<Entity>) => {

        if (dbType === 'local') {
            return (await this.dbService.getLocal()).getRepository(entity);
        }
        else {
            return (await this.dbService.getDefault()).getRepository(entity);
        }
    }



}