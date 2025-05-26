import { Injectable } from "@nestjs/common";
import { SetupEntity } from "./entity/setup.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class SystemSetupRepository {

private setupRepo: Repository<SetupEntity>;

    constructor(private readonly dataSource: DataSource) { 
        this.setupRepo = this.dataSource.getRepository(SetupEntity);
    }
}