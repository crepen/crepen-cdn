import { Injectable } from "@nestjs/common";
import { DataSource, EntityManager, IsNull, Repository, TreeRepository } from "typeorm";
import { FolderEntity } from "./entity/folder.entity";
import { randomUUID } from "crypto";
import { FileEntity } from "../file/entity/file.entity";
import { CrepenFileRouteRepository } from "../file/file.repository";

@Injectable()
export class CrepenFolderRouteRepository {

    private repo: Repository<FolderEntity>;

    constructor(
        private readonly dataSource: DataSource,
        private readonly fileRepo: CrepenFileRouteRepository
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

    getChildFolders = (parentFolderUid: string, includeRemoveFile?: boolean) => {
        return this.repo.find({
            where: {
                parentFolderUid: parentFolderUid,
                isRemoved : includeRemoveFile === true ? undefined : false
            }
        })
    }


    getFolderInfoWithChildData = async (uid: string, includeRemoveFile?: boolean): Promise<FolderEntity> => {
 
        const folderData = await this.repo.findOne({
            where: {
                uid: uid
            },
            relations: ['parentFolder']
        })

        const fileData = await this.fileRepo.setManager(this.repo.manager).getFilesWithStoreFromFolder(uid , includeRemoveFile);

        const childFolderData = await this.getChildFolders(uid , includeRemoveFile);
        

        folderData.files = fileData;
        folderData.childFolder = childFolderData;

        return folderData;
    }

    editFolderData = (uid: string, entity: FolderEntity) => {
        return this.repo.update(uid, entity)
    }


    removeFolderData = async (entity: FolderEntity) => {
        entity.isRemoved = true;
        entity.updateDate = new Date();

        return this.repo.update(entity.uid , entity);
    }
}