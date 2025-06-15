import { Injectable } from "@nestjs/common";
import { DataSource, IsNull, Repository, TreeRepository } from "typeorm";
import { FolderEntity } from "./entity/folder.entity";
import { randomUUID } from "crypto";
import { FolderTreeEntity } from "./entity/folder-tree.entity";

@Injectable()
export class CrepenFolderRouteRepository {

    private repo: Repository<FolderEntity>;

    constructor(private readonly dataSource: DataSource) {
        this.repo = this.dataSource.getRepository(FolderEntity);
    }


    getRootFolder = (userUid: string) => {
        return this.repo.findOne({
            where: {
                ownerUid: userUid,
                parentFolderUid : IsNull()
            }
        })
    }

    initRootFolder = (userUid : string) => {
        const entity = new FolderEntity();
        entity.ownerUid = userUid;
        entity.uid = randomUUID()
        entity.folderTitle = 'Home'

        return this.repo.save(entity);
    }

    getFolder = (folderUid : string) => {
        return this.repo.findOne({
            where : {
                uid : folderUid
            }
        })
    }

    addFolder = (folderData : FolderEntity) => {
        return this.repo.save(folderData);
    }

    getDuplicateTitleFolders = (title: string , parentFolderUid : string) => {
        return this.repo.find({
            where : {
                parentFolderUid : parentFolderUid,
                folderTitle : title
            }
        })
    }

    getChildFolders = (parentFolderUid : string) => {
        return this.repo.find({
            where : {
                parentFolderUid : parentFolderUid
            }
        })
    }

}