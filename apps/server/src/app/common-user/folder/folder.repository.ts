import { Injectable } from "@nestjs/common";
import { DataSource, EntityManager, IsNull, Repository, TreeRepository } from "typeorm";
import { FolderEntity } from "./entity/folder.default.entity";
import { randomUUID } from "crypto";
import { FileEntity } from "../file/entity/file.default.entity";
import { CrepenFileRouteRepository } from "../file/file.repository";
import { RepositoryOptions } from "@crepen-nest/interface/repo";
import { DatabaseService } from "@crepen-nest/config/database/database.config.service";
import { CrepenBaseRepository } from "src/module/common/base.repository";

@Injectable()
export class CrepenFolderRouteRepository extends CrepenBaseRepository {


    constructor(
        private readonly databaseService: DatabaseService,
        private readonly fileRepo: CrepenFileRouteRepository
    ) {
        super(databaseService);
    }




    getRootFolder = async (userUid: string, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(FolderEntity) ?? await this.getRepository('default', FolderEntity);
        return dataSource.findOne({
            where: {
                ownerUid: userUid,
                parentFolderUid: IsNull()
            }
        })
    }

    initRootFolder = async (userUid: string, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(FolderEntity) ?? await this.getRepository('default', FolderEntity);

        const entity = new FolderEntity();
        entity.ownerUid = userUid;
        entity.uid = randomUUID()
        entity.folderTitle = 'Home'

        return dataSource.save(entity);
    }

    getFolder = async (folderUid: string, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(FolderEntity) ?? await this.getRepository('default', FolderEntity);

        return dataSource.findOne({
            where: {
                uid: folderUid
            }
        })
    }

    addFolder = async (folderData: FolderEntity, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(FolderEntity) ?? await this.getRepository('default', FolderEntity);

        return dataSource.save(folderData);
    }

    getDuplicateTitleFolders = async (title: string, parentFolderUid: string, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(FolderEntity) ?? await this.getRepository('default', FolderEntity);

        return dataSource.find({
            where: {
                parentFolderUid: parentFolderUid,
                folderTitle: title
            }
        })
    }

    getChildFolders = async (parentFolderUid: string, options?: RepositoryOptions<{ includeRemoveFile?: boolean }>) => {
        const dataSource = options?.manager?.getRepository(FolderEntity) ?? await this.getRepository('default', FolderEntity);

        return dataSource.find({
            where: {
                parentFolderUid: parentFolderUid,
                isRemoved: options?.includeRemoveFile === true ? undefined : false
            }
        })
    }


    getFolderInfoWithChildData = async (uid: string, options?: RepositoryOptions<{ includeRemoveFile?: boolean }>): Promise<FolderEntity> => {

        const dataSource = options?.manager?.getRepository(FolderEntity) ?? await this.getRepository('default', FolderEntity);

        const folderData = await dataSource.findOne({
            where: {
                uid: uid
            },
            relations: ['parentFolder']
        })

        const fileData = await this.fileRepo.getFilesWithStoreFromFolder(uid, { manager: options?.manager, includeRemoveFile: options?.includeRemoveFile });

        const childFolderData = await this.getChildFolders(uid, { includeRemoveFile: options?.includeRemoveFile });


        folderData.files = fileData;
        folderData.childFolder = childFolderData;

        return folderData;
    }

    editFolderData = async (uid: string, entity: FolderEntity, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(FolderEntity) ?? await this.getRepository('default', FolderEntity);
        return dataSource.update(uid, entity)
    }


    removeFolderData = async (entity: FolderEntity, options?: RepositoryOptions) => {
        const dataSource = options?.manager?.getRepository(FolderEntity) ?? await this.getRepository('default', FolderEntity);

        entity.isRemoved = true;
        entity.updateDate = new Date();

        return dataSource.update(entity.uid, entity);
    }
}