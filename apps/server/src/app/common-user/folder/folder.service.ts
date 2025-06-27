import { HttpStatus, Injectable } from "@nestjs/common";
import { CrepenFolderRouteRepository as CrepenFolderRouteRepository } from "./folder.repository";
import { StringUtil } from "@crepen-nest/lib/util/string.util";
import { CrepenLocaleHttpException } from "@crepen-nest/lib/exception/crepen.http.exception";
import { FolderEntity } from "./entity/folder.entity";
import { randomUUID } from "crypto";
import { CrepenFileRouteService } from "../file/file.service";
import { ObjectUtil } from "@crepen-nest/lib/util/object.util";
import { DataSource } from "typeorm";
import { CrepenFolderError } from "./exception/folder.exception";

@Injectable()
export class CrepenFolderRouteService {
    constructor(
        private readonly repo: CrepenFolderRouteRepository,
        private readonly dataSource: DataSource,
    ) { }

    getRootFolder = async (userUid?: string): Promise<FolderEntity | null> => {
        // if(StringUtil.isEmpty(userUid)){
        //     throw new CrepenLocaleHttpException('')
        // }

        const userRootFolder = await this.repo.setDefaultManager().getRootFolder(userUid);


        if (userRootFolder === null) {
            // Root Folder를 찾을 수 없을 경우, 새로 생성

            const initRootFolder = await this.repo.setDefaultManager().initRootFolder(userUid);
            return this.getRootFolder();
        }

        return userRootFolder;
    }

    getFolderData = async (folderUid: string): Promise<FolderEntity | null> => {

        const targetFolder = await this.repo.setDefaultManager().getFolder(folderUid);
        if (!ObjectUtil.isNullOrUndefined(targetFolder)) {
            targetFolder.childFolder = undefined;
            targetFolder.files = undefined;
        }

        return targetFolder;
    }

    appendChildFolder = async (parentFolderUid: string, title: string, ownerUid: string): Promise<string> => {
        const parentFolder = await this.getFolderData(parentFolderUid);

        if (parentFolder === null) {
            throw new CrepenLocaleHttpException('cloud_folder', 'FOLDER_INSERT_VALIDATE_ERROR_PARENT_NOT_FOUND', HttpStatus.NOT_FOUND);
        }

        if (parentFolder.ownerUid !== ownerUid) {
            throw new CrepenLocaleHttpException('cloud_folder', 'FOLDER_LOAD_UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
        }

        // const matchTitleFolders = await this.repo.setDefaultManager().getDuplicateTitleFolders(title, parentFolder.uid);

        // if (matchTitleFolders.length > 0) {
        //     throw new CrepenLocaleHttpException('cloud_folder', 'FOLDER_INSERT_VALIDATE_ERROR_DUPLICATE_TITLE', HttpStatus.BAD_REQUEST);
        // }

        const insertFolderUUID = randomUUID();

        const insertFolderData = new FolderEntity();
        insertFolderData.uid = insertFolderUUID;
        insertFolderData.folderTitle = title;
        insertFolderData.parentFolderUid = parentFolder.uid;
        insertFolderData.ownerUid = ownerUid;

        await this.repo.setDefaultManager().addFolder(insertFolderData);

        return insertFolderUUID;
    }

    getChildFolder = async (parentFolderUid: string) => {
        const childFolders = this.repo.setDefaultManager().getChildFolders(parentFolderUid);

        return childFolders;
    }

    getFolderDataWithChild = async (uid: string) => {
        return this.repo.setDefaultManager().getFolderInfoWithChildData(uid)
    }



    editFolderData = async (uid: string, entity: FolderEntity) => {
        return this.dataSource.transaction(async (manager) => {

            entity.updateDate = new Date();

            const folderData = await this.getFolderData(uid);

            if (ObjectUtil.isNullOrUndefined(folderData)) {
                throw CrepenFolderError.FOLDER_NOT_FOUND;
            }

            await this.repo.setManager(manager).editFolderData(uid, entity);
        });
    }

    removeFolderData = async (uid: string , userUid : string) => {
         return this.dataSource.transaction(async (manager) => {

            const folderData = await this.getFolderData(uid);

            if (ObjectUtil.isNullOrUndefined(folderData)) {
                throw CrepenFolderError.FOLDER_NOT_FOUND;
            }

            if(userUid.trim() !== folderData.ownerUid){
                throw CrepenFolderError.FOLDER_ACCESS_DENIED;
            }

            await this.repo.setManager(manager).removeFolderData(uid);
        });
    }
}