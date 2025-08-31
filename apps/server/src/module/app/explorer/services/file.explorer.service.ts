import { Injectable } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { CrepenExplorerRepository } from "../repository/explorer.repository";
import { FileNotUploadedError } from "@crepen-nest/lib/error/api/explorer/file_not_uploaded.file.error";
import * as path from "path";
import * as fs from 'fs';
import { ExplorerFileEntity } from "../entity/file.explorer.default.entity";
import { DatabaseService } from "@crepen-nest/module/config/database/database.config.service";
import { ExplorerLogEntity } from "../entity/log.explorer.default.entity";
import { ExplorerLogTypeEnum } from "../enum/log-type.explorer.enum";
import { ExplorerItemType } from "../enum/item-type.explorer.enum";
import { ConfigService } from "@nestjs/config";
import { ExplorerFileStateEnum } from "../enum/file-state.explorer.enum";
import { UserEntity } from "../../user/entity/user.default.entity";
import { DynamicConfigService } from "@crepen-nest/module/config/dynamic-config/dynamic-config.service";
import { RepositoryOptions } from "@crepen-nest/interface/repo";
import { FileNotFoundError } from "@crepen-nest/lib/error/api/explorer/not_found_file.error";
import * as crypto from "crypto";
import * as express from 'express';
import { CrepenExplorerFileEncryptQueueService } from "./file-queue.service";
import { ExplorerFileQueueType } from "../enum/file-queue-type.enum";
import { CrepenExplorerFileRepository } from "../repository/file.explorer.repository";
import { CrepenExplorerDefaultService } from "./explorer.service";
import { ExplorerFileEncryptState } from "../enum/file-encrypt-state.enum";

@Injectable()
export class CrepenExplorerFileService {
    constructor(
        private readonly explorerRepo: CrepenExplorerRepository,
        private readonly databaseService: DatabaseService,
        private readonly dynamicConfig: DynamicConfigService,
        private readonly explorerService: CrepenExplorerDefaultService,
        private readonly i18n: I18nService,
        private readonly encryptFileQueueService: CrepenExplorerFileEncryptQueueService,
        private readonly fileRepo : CrepenExplorerFileRepository
    ) { }



    addFile = async (originFileName: string, uuid: string,mimeType: string, fileSize: number, parentFolderUid: string, user: UserEntity): Promise<ExplorerFileEntity> => {

        return (await this.databaseService.getDefault()).transaction(async (manager) => {

            const saveTempStreamDir = path.join(
                this.dynamicConfig.get('path.data'),
                'file/temp'
            )

            if (!fs.existsSync(path.join(saveTempStreamDir, uuid + '.CPCDN'))) {
                throw new FileNotUploadedError();
            }

            // const fileBuffer = fs.readFileSync(path.join(saveTempStreamDir , uuid + 'CPCDN'));



            const catalog = await this.explorerService.getCatalog(user.uid, { manager: manager });


            const pathExt = path.extname(originFileName);

            const fileExt = pathExt.startsWith('.')
                ? pathExt.slice(1, pathExt.length)
                : pathExt;


            // const encryptFile = await CryptoUtil.File.encrypt(file.buffer);

            const saveFileDir = path.join(
                catalog,
                user.uid
            )

            const fileObj = new ExplorerFileEntity();
            fileObj.uid = uuid;
            fileObj.title = originFileName;
            fileObj.storeFileName = path.format({
                name: uuid,
                ext: 'CPCDN'
            });
            fileObj.fileExtension = fileExt;
            fileObj.fileMimeType = mimeType;
            fileObj.fileSize = fileSize;
            fileObj.fileOwnerUid = user.uid;
            fileObj.fileState = ExplorerFileStateEnum.STABLE;
            fileObj.fileName = path.format({
                name: uuid,
                ext: fileExt
            })
            fileObj.filePath = saveFileDir;
            fileObj.isFileEncrypt = false;




            const saveDirPath = path.join(
                this.dynamicConfig.get('path.data'),
                'file',
                saveFileDir
            );


            let addFolder = false;

            if (!fs.existsSync(saveDirPath)) {
                fs.mkdirSync(saveDirPath, { recursive: true })
                addFolder = true;
            }

            const saveFilePath = path.join(saveDirPath, path.format({
                ext: 'CPCDN',
                name: fileObj.storeFileName.replace(path.extname(fileObj.storeFileName), '')
            }));

            try {
                fs.renameSync(
                    path.join(saveTempStreamDir, path.format({
                        ext: 'CPCDN',
                        name: uuid
                    })),
                    saveFilePath
                )

            }
            catch (e) {
                try {
                    if (addFolder) {
                        fs.rmdirSync(saveDirPath);
                    }
                }
                catch (e) {

                }

                throw e;
            }


            const saveFileEntity = await this.explorerRepo.addFile(fileObj, { manager: manager });



            // Link Tree
            void await this.explorerRepo.linkTree(
                user.uid,
                parentFolderUid,
                saveFileEntity.uid,
                ExplorerItemType.FILE,
                { manager: manager }
            )







            const logObj = new ExplorerLogEntity();
            logObj.action = ExplorerLogTypeEnum.ADD;
            logObj.actionUserUid = user.uid;
            logObj.type = ExplorerItemType.FILE;
            logObj.itemUid = saveFileEntity.uid;


            // Add File Log
            void await this.explorerRepo.addLog(logObj, { manager: manager });

            void await this.encryptFileQueueService.addQueue(
                fileObj.uid,
                ExplorerFileQueueType.ENCRYPT,
                user.uid,
                { manager: manager }
            )



            return saveFileEntity
        })


    }


    getFileData = async (fileUid: string, userUid?: string, options?: RepositoryOptions): Promise<ExplorerFileEntity | undefined> => {

        const fileInfo = await this.explorerRepo.getFileData(fileUid, options);

        return fileInfo;
    }

    getFileDataByFileName = async (fileName?: string, options?: RepositoryOptions) => {
        const fileInfo = await this.explorerRepo.getFileDataByFileName(fileName, options);
        return fileInfo;
    }




    updateFileEncryptData = async (fileUid : string , iv: Buffer | undefined , state : boolean , options?: RepositoryOptions) => {
        const entity = await this.getFileData(fileUid , undefined , options);
        entity.isFileEncrypt = state;
        entity.fileEncIv = iv;

        return this.fileRepo.updateFileEntity(entity , options);
    }
 
    updateFileEncryptState = async (fileUid : string , state : ExplorerFileEncryptState , options?: RepositoryOptions) => {
        const entity = await this.getFileData(fileUid , undefined , options);
        entity.encryptState = state;

        return this.fileRepo.updateFileEntity(entity , options);
    }

    updateFilePublished = async (fileUid : string , state : boolean , options? : RepositoryOptions) => {
        const entity = await this.getFileData(fileUid , undefined , options);
        return this.updateFileEntityPublished(entity , state , options);
    }

    updateFileEntityPublished = async (fileEntity : ExplorerFileEntity , state : boolean , options?: RepositoryOptions) => {
        fileEntity.isPublished = state;
        return this.fileRepo.updateFileEntity(fileEntity , options);
    }
}