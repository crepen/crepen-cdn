import { Injectable } from "@nestjs/common";
import { DataSource, EntityManager, Repository } from "typeorm";
import { FileEntity } from "./entity/file.entity";
import { ObjectUtil } from "@crepen-nest/lib/util/object.util";
import { FileStoreEntity } from "./entity/file-store.entity";

@Injectable()
export class CrepenFileRouteRepository {
    private repo : Repository<FileEntity>;
    private fileStoreRepo : Repository<FileStoreEntity>

    constructor(
        private readonly dataSource : DataSource
    ){
        this.repo = this.dataSource.getRepository(FileEntity);
        this.fileStoreRepo = this.dataSource.getRepository(FileStoreEntity);
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

    addFileStore = (entity : FileStoreEntity) => {
        return this.fileStoreRepo.save(entity , {
            reload : true
        })
    }

    getFileWithStore = (uid : string) => {
        return this.repo.findOne({
            where : {
                uid : uid
            },
            relations : ['fileStore']
        })
    }

    getSharedFileWithStore = (uid : string) => {
        return this.repo.findOne({
            where : {
                uid : uid,
                isShared : true
            },
            relations : ['fileStore']
        })
    }


    removeFile = (fileEntity : FileEntity) => {
        return this.repo.remove(fileEntity);
    }


    editFile = (fileUid : string , fileEntity : FileEntity) => {
        return this.repo.update(fileUid , fileEntity);
    }
}