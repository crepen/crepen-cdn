import { CrepenBaseRepository } from "@crepen-nest/lib/common/base.repository";
import { DatabaseService } from "@crepen-nest/module/config/database/database.config.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CrepenUserRepository extends CrepenBaseRepository {
    constructor(
        private readonly databaseService: DatabaseService
    ) { super(databaseService) }


    
}