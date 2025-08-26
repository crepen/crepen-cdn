import { CrepenBaseRepository } from "@crepen-nest/lib/common/base.repository";
import { DatabaseService } from "@crepen-nest/module/config/database/database.config.service";
import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { RepositoryOptions } from "src/interface/repo";
import { IsNull, Repository } from "typeorm";
import { CrepenFileRouteRepository } from "../file/file.repository";
import { FolderEntity } from "./entity/folder.entity";


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

    initRootFolder = async (userUid: string, options?: RepositoryOptions) :Promise<FolderEntity> => {
        const dataSource :Repository<FolderEntity> = options?.manager?.getRepository(FolderEntity) ?? (await this.getRepository('default', FolderEntity));

        const entity = new FolderEntity();
        entity.ownerUid = userUid;
        entity.uid = randomUUID()
        entity.folderTitle = 'Home'

        return await dataSource.save(entity);
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