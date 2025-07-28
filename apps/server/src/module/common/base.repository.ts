import { UserEntity } from "@crepen-nest/app/common-user/user/entity/user.default.entity";
import { DatabaseService } from "@crepen-nest/config/database/database.config.service";
import { Injectable } from "@nestjs/common";
import { DataSource, EntityTarget, ObjectLiteral, Repository } from "typeorm";

@Injectable()
export class CrepenBaseRepository {


    constructor(
        private readonly dbService: DatabaseService,
    ) { }

    getRepository = async <Entity extends ObjectLiteral>(dbType: 'default' | 'local', entity: EntityTarget<Entity>) => {
                
        let dataSource : DataSource;

        if (dbType === 'local') {
            dataSource = await this.dbService.getLocal();
        }
        else {
            dataSource =await this.dbService.getDefault()
        }

       

        return dataSource.getRepository(entity);
    }



}