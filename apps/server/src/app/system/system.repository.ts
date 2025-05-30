import { Injectable } from "@nestjs/common";
import { DataSource, FindOptionsWhere, Repository } from "typeorm";
import { CrepenSystemEntity } from "./entity/system.entity";



@Injectable()
export class CrepenSystemRepository {

    private repo: Repository<CrepenSystemEntity>;


    constructor(private readonly dataSource: DataSource) {
        this.repo = this.dataSource.getRepository(CrepenSystemEntity);
    }


    get = async (key: string): Promise<CrepenSystemEntity | undefined> => {
        return this.repo.findOne({
            where: {
                key: key
            }
        }) ?? undefined
    }


    set = async (key : string , value : string) => {
        return this.repo.save({
            key : key,
            value : value
        })
    }
}