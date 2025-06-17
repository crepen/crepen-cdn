import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { FileEntity } from "./entity/file.entity";

@Injectable()
export class CrepenFileRouteRepository {
    private repo : Repository<FileEntity>;

    constructor(private readonly dataSource : DataSource){
        this.repo = this.dataSource.getRepository(FileEntity);
    }


    getFile = (uid : string ) => {
        return this.repo.findOne({
            where : {
                uid : uid
            }
        })
    }

    getFolderFiles = (parentFolderUid : string) => {
        return this.repo.find({
            where : {
                parentFolderUid : parentFolderUid
            }
        })
    }

}