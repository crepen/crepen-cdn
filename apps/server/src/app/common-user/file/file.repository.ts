import { Injectable } from "@nestjs/common";
import { DataSource, EntityManager, Repository } from "typeorm";
import { FileEntity } from "./entity/file.entity";
import { ObjectUtil } from "@crepen-nest/lib/util/object.util";

@Injectable()
export class CrepenFileRouteRepository {
    private repo : Repository<FileEntity>;

    constructor(
        private readonly dataSource : DataSource
    ){
        this.repo = this.dataSource.getRepository(FileEntity);
    }


    setManager = (manager : EntityManager) => {
        this.repo = manager.getRepository(FileEntity);
        return this;
    }

    defaultManager = () => {
       this.repo = this.dataSource.getRepository(FileEntity);
       return this;
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


    addFile = (entity : FileEntity) => {
        return this.repo.save(entity , {
            reload : true
        })
    }

}