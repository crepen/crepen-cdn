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

    getFileWithStore = (uid : string , includeRemoveFile? : boolean) => {
        return this.repo.findOne({
            where : {
                uid : uid,
                isRemoved : includeRemoveFile === true ? undefined : false
            },
            relations : ['fileStore']
        })
    }

    getSharedFileWithStore = (uid : string) => {
        return this.repo.findOne({
            where : {
                uid : uid,
                isPublished : true,
                isRemoved : false
            },
            relations : ['fileStore']
        })
    }


    removeFile = (fileEntity : FileEntity) => {
        fileEntity.isRemoved = true;
        fileEntity.updateDate = new Date();

        return this.repo.update(fileEntity.uid,fileEntity);
    }


    editFile = (fileUid : string , fileEntity : FileEntity) => {
        return this.repo.update(fileUid , fileEntity);
    }


    getFilesWithStoreFromFolder = (folderUid : string , includeRemoveFile? :boolean) => {
         return this.repo.find({
            where : {
                parentFolderUid : folderUid,
                isRemoved : includeRemoveFile === true ? undefined : false
            },
            relations : ['fileStore']
        })
    }
}