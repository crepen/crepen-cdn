import { HttpStatus, Injectable } from "@nestjs/common";
import { CrepenFileRouteRepository } from "./file.repository";
import { FileEntity } from "./entity/file.entity";
import { DataSource } from "typeorm";
import { CrepenFolderRouteService } from "../folder/folder.service";
import { randomUUID } from "crypto";
import { CrepenLocaleHttpException } from "@crepen-nest/lib/exception/crepen.http.exception";
import { ObjectUtil } from "@crepen-nest/lib/util/object.util";
import * as fs from 'fs';
import * as crypto from 'crypto';
import { CrepenCryptoService } from "@crepen-nest/app/common/crypto/crypto.service";
import { join } from "path";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CrepenFileRouteService {
    constructor(
        private readonly repo: CrepenFileRouteRepository,
        private readonly folderService: CrepenFolderRouteService,
        private readonly dataSource: DataSource,
        private readonly cryptoService: CrepenCryptoService,
        private readonly configService: ConfigService,
    ) { }




    getFileInfo = async (uid: string): Promise<FileEntity | undefined> => {

        const fileData = await this.repo.defaultManager().getFile(uid);

        return fileData;
    }


    getFolderFiles = async (parentFolderUid: string): Promise<FileEntity[]> => {
        const files = await this.repo.defaultManager().getFolderFiles(parentFolderUid);

        return files;
    }

    addFile = async (title: string, file: Express.Multer.File, folderUid: string, ownerUid: string, options: CrepenAddFileOptions) => {
        return this.dataSource.transaction(async (manager) => {
            try {
                const fileEntity = new FileEntity();
                fileEntity.uid = randomUUID();
                fileEntity.fileTitle = title;
                fileEntity.ownerUid = ownerUid;
                fileEntity.parentFolderUid = folderUid;
                fileEntity.isShared = options.shared;
                fileEntity.fileName = randomUUID();
                fileEntity.createDate = new Date();
                fileEntity.updateDate = new Date();

                const parentFolderInfo = this.folderService.getFolderData(folderUid);

                if (ObjectUtil.isNullOrUndefined(parentFolderInfo)) {
                    throw new CrepenLocaleHttpException('cloud_folder', 'FOLDER_LOAD_FOLDER_TARGET_NOT_FOUND', HttpStatus.BAD_REQUEST);
                }

                const encryptFile = await this.cryptoService.encryptFile(file, fileEntity.fileName);

                fileEntity.originFileMine = encryptFile.encryptMime;

                const addFileData = await this.repo.setManager(manager).addFile(fileEntity);

                const savePath = join(
                    this.configService.get('path.fileStore'),
                    encryptFile.file.originalname
                );

                fs.writeFileSync(savePath, encryptFile.file.buffer);

                return addFileData;
            }
            catch (e) {
                if (e instanceof CrepenLocaleHttpException) {
                    throw e;
                }
                else {
                    throw new CrepenLocaleHttpException('cloud_file', 'FILE_ADD_FAILED_FILE_SAVE_FAILED', HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }



            // throw new CrepenLocaleHttpException('cloud_test' , 'test' , HttpStatus.BAD_REQUEST);
        })
    }

    getFileData = async (fileUid: string, ownerUid: string): Promise<Express.Multer.File> => {
        try {
            const targetFileData = await this.getFileInfo(fileUid);

            if (ObjectUtil.isNullOrUndefined(targetFileData)) {
                throw new CrepenLocaleHttpException('cloud_file', 'FILE_NOT_FOUND', HttpStatus.NOT_FOUND);
            }
            else if (targetFileData.ownerUid !== ownerUid) {
                throw new CrepenLocaleHttpException('cloud_file', 'FILE_UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
            }

            const fileStoreName = await this.cryptoService.hashText(targetFileData.fileName);

            const savePath = join(
                this.configService.get('path.fileStore'),
                fileStoreName
            );

            const fileBuffer = fs.readFileSync(savePath);

            const decrpytFile = this.cryptoService.decryptFile(fileBuffer, targetFileData.originFileMine)

            return decrpytFile.file;
        }
        catch (e) {
            throw new CrepenLocaleHttpException('cloud_file', 'FILE_LOAD_ERROR', HttpStatus.INTERNAL_SERVER_ERROR , {
                innerError : e
            });
        }
    }
}