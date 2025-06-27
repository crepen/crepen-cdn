import { Injectable } from "@nestjs/common";
import { DataSource, EntityManager, IsNull, Repository, TreeRepository } from "typeorm";
import { FolderEntity } from "./entity/folder.entity";
import { randomUUID } from "crypto";

@Injectable()
export class CrepenFolderRouteRepository {

    private repo: Repository<FolderEntity>;

    constructor(
        private readonly dataSource: DataSource
    ) {
        this.repo = this.dataSource.getRepository(FolderEntity);
    }

    setManager = (manager: EntityManager) => {
        this.repo = manager.getRepository(FolderEntity);
        return this;
    }

    setDefaultManager = () => {
        this.repo = this.dataSource.getRepository(FolderEntity);
        return this;
    }


    getRootFolder = (userUid: string) => {
        return this.repo.findOne({
            where: {
                ownerUid: userUid,
                parentFolderUid: IsNull()
            }
        })
    }

    initRootFolder = (userUid: string) => {
        const entity = new FolderEntity();
        entity.ownerUid = userUid;
        entity.uid = randomUUID()
        entity.folderTitle = 'Home'

        return this.repo.save(entity);
    }

    getFolder = (folderUid: string) => {
        return this.repo.findOne({
            where: {
                uid: folderUid
            }
        })
    }

    addFolder = (folderData: FolderEntity) => {
        return this.repo.save(folderData);
    }

    getDuplicateTitleFolders = (title: string, parentFolderUid: string) => {
        return this.repo.find({
            where: {
                parentFolderUid: parentFolderUid,
                folderTitle: title
            }
        })
    }

    getChildFolders = (parentFolderUid: string) => {
        return this.repo.find({
            where: {
                parentFolderUid: parentFolderUid
            }
        })
    }


    getFolderInfoWithChildData = (uid : string) => {
        return this.repo.findOne({
            where : {
                uid : uid
            },
            relations : ['files' , 'files.fileStore' , 'parentFolder' , 'childFolder']
        })
    }

    editFolderData = (uid : string , entity : FolderEntity) => {
        return this.repo.update(uid , entity)
    }


    removeFolderData = async (uid : string) : Promise<FolderEntity> => {
        const entity = new FolderEntity();
        entity.uid = uid;

        return this.repo.remove(entity);
    }
}