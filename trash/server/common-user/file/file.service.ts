
import { CrepenCommonHttpLocaleError } from '@crepen-nest/lib/error-bak/http/common.http.error';
import { FilePermissionType } from '@crepen-nest/lib/types/enum/file-permission-type.enum';
import { ObjectUtil, StringUtil } from '@crepen-nest/lib/util';
import { DatabaseService } from '@crepen-nest/module/config/database/database.config.service';
import { Injectable, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import { extname, join } from 'path';
import { CrepenCryptoService } from '../../common/crypto/crypto.service';
import { CrepenLoggerService } from '../../common/logger/logger.service';
import { CrepenFolderRouteService } from '../folder/folder.service';
import { FileStoreEntity } from './entity/file-store';
import { FileEntity } from './entity/file';
import { CrepenFileError } from './exception/file.exception';
import { CrepenFileRouteRepository } from './file.repository';
import { FileNotFoundError } from '@crepen-nest/lib/error/api/file/not_found_file.error';

@Injectable()
export class CrepenFileRouteService {
    constructor(
        private readonly repo: CrepenFileRouteRepository,
        private readonly folderService: CrepenFolderRouteService,
        private readonly databaseService: DatabaseService,
        private readonly cryptoService: CrepenCryptoService,
        private readonly configService: ConfigService,
        private readonly loggerService: CrepenLoggerService
    ) { }




    getFileInfo = async (uid: string): Promise<FileEntity | undefined> => {
        const fileData = await this.repo.getFileInfo(uid);


        return fileData;
    }


    getFolderFiles = async (parentFolderUid: string): Promise<FileEntity[]> => {
        const files = await this.repo.getFolderFiles(parentFolderUid);

        return files;
    }




    /**
     * 
     * @param file 
     * @param uploadUserUid 
     * @throws {CrepenCommonHttpLocaleError}
     * @returns 
     */
    saveFile = async (file: Express.Multer.File, uploadUserUid: string): Promise<FileStoreEntity> => {
        return (await this.databaseService.getDefault()).transaction(async (manager) => {
            try {

                const fileStoreEntity = new FileStoreEntity();
                fileStoreEntity.uid = randomUUID();
                fileStoreEntity.fileName = randomUUID();
                fileStoreEntity.uploaderUid = uploadUserUid;
                fileStoreEntity.hash = this.cryptoService.getFileHash(file.buffer);
                fileStoreEntity.fileType = decodeURIComponent(file.mimetype);
                fileStoreEntity.fileSize = file.size;
                fileStoreEntity.fileExt = extname(file.originalname).slice(1);

                const encryptFile = await this.cryptoService.encryptFile(file, fileStoreEntity.fileName);

                fileStoreEntity.originFileMine = encryptFile.encryptMime;

                const addFileData = await this.repo.addFileStore(fileStoreEntity, { manager: manager });

                const savePath = join(
                    this.configService.get('path.fileStore'),
                    encryptFile.file.originalname
                );

                fs.writeFileSync(savePath, encryptFile.file.buffer);



                return addFileData;
            }
            catch (e) {
                if (e instanceof CrepenCommonHttpLocaleError) {
                    throw e;
                }
                else {
                    throw new CrepenCommonHttpLocaleError('cloud_file', 'FILE_ADD_FAILED_FILE_SAVE_FAILED', HttpStatus.INTERNAL_SERVER_ERROR, {
                        innerError: e
                    });
                }
            }



            // throw new CrepenLocaleHttpException('cloud_test' , 'test' , HttpStatus.BAD_REQUEST);
        })
    }


    relationFile = async (fileUid: string, fileTitle: string, folderUid: string, uploadUserUid: string) => {
        try {
            const fileEntity = new FileEntity();
            fileEntity.fileTitle = fileTitle;
            fileEntity.fileUid = fileUid;
            fileEntity.ownerUid = uploadUserUid;
            fileEntity.parentFolderUid = folderUid;
            fileEntity.uid = randomUUID();

            const addFile = await this.repo.addFile(fileEntity);
            return addFile;
        }
        catch (e) {
            if (e instanceof CrepenCommonHttpLocaleError) {
                throw e;
            }
            else {
                throw new CrepenCommonHttpLocaleError('cloud_file', 'FILE_ADD_FAILED_FILE_SAVE_FAILED', HttpStatus.INTERNAL_SERVER_ERROR, {
                    innerError: e
                });
            }
        }

    }


    getFileInfoWithStore = async (uid: string) => {
        return await this.repo.getFileWithStore(uid);
    }


    getPublishedFileInfo = async (fileUid: string, includeStore?: boolean) => {
        return this.repo.getPublishedFile(fileUid, { includeStore: includeStore });
    }

    getPublishedFile = async (fileUid: string): Promise<Express.Multer.File | undefined> => {
        const fileInfo = await this.repo.getPublishedFile(fileUid);
        return this.getLocalFile(fileInfo);
    }


    getFileDataWithStoreAndLocalFile = async (fileUid: string): Promise<FileEntity | undefined> => {
        const fileInfo = await this.getFileInfoWithStore(fileUid);
        return fileInfo;
    }



    getLocalFile = (fileInfo?: FileEntity) => {
        if (ObjectUtil.isNullOrUndefined(fileInfo)) {
            throw CrepenFileError.FILE_NOT_FOUND;
        }

        const savePath = join(
            this.configService.get('path.fileStore'),
            fileInfo.fileStore.fileName
        );

        const fileBuffer = fs.readFileSync(savePath);

        const decryptFile = this.cryptoService.decryptFile(fileBuffer, fileInfo.fileStore.originFileMine);


        decryptFile.file.filename = `${fileInfo.fileStore.fileName}.${fileInfo.fileStore.fileExt}`;

        return decryptFile.file;
    }


    removeFile = async (fileUid?: string, requestUserUid?: string) => {
        return (await this.databaseService.getDefault()).transaction(async (manager) => {
            if (StringUtil.isEmpty(fileUid)) {
                throw CrepenFileError.FILE_UID_UNDEFINED
            }

            const fileData = await this.getFileInfoWithStore(fileUid);

            if (ObjectUtil.isNullOrUndefined(fileData)) {
                throw CrepenFileError.FILE_NOT_FOUND;
            }

            if (fileData.ownerUid !== requestUserUid) {
                throw CrepenFileError.FILE_ACCESS_UNAUTHORIZED;
            }

            try {
                const removeFile = await this.repo.removeFile(fileData, { manager: manager })
            }
            catch (e) {
                throw CrepenFileError.FILE_REMOVE_FAILED;
            }
        })
    }

    editFile = async (fileUid?: string, editFileEntity?: FileEntity, requestUserUid?: string) => {
        if (StringUtil.isEmpty(fileUid)) {
            throw CrepenFileError.FILE_UID_UNDEFINED
        }

        const fileData = await this.getFileInfo(fileUid);

        if (ObjectUtil.isNullOrUndefined(fileData)) {
            throw new FileNotFoundError();
        }

        if (fileData.ownerUid !== requestUserUid) {
            throw CrepenFileError.FILE_ACCESS_UNAUTHORIZED;
        }


        try {
            editFileEntity.updateDate = new Date();

            const editFile = await this.repo.editFile(fileUid, editFileEntity);
        }
        catch (e) {
            throw CrepenFileError.FILE_REMOVE_FAILED;
        }

    }

    /**
     * 
     * FILE UPLOAD
     * 
     * @param file upload file
     * @param title file object title
     * @param userUid create file user uid
     * @param folderUid file save folder uid
     * 
     * @since 2025.07.21
     */
    uploadFile = async (file: Express.Multer.File, title: string, userUid: string, folderUid: string) => {
        return (await this.databaseService.getDefault()).transaction(async (manager) => {
            try {
                // INSERT FILE STORE
                const fileStoreEntity = new FileStoreEntity();
                fileStoreEntity.uid = randomUUID();
                fileStoreEntity.fileName = randomUUID();
                fileStoreEntity.uploaderUid = userUid;
                fileStoreEntity.hash = this.cryptoService.getFileHash(file.buffer);
                fileStoreEntity.fileType = decodeURIComponent(file.mimetype);
                fileStoreEntity.fileSize = file.size;
                fileStoreEntity.fileExt = extname(file.originalname).slice(1);

                const encryptFile = await this.cryptoService.encryptFile(file, fileStoreEntity.fileName);

                fileStoreEntity.originFileMine = encryptFile.encryptMime;

                const addFileData = await this.repo.addFileStore(fileStoreEntity, { manager: manager });



                // INSERT FILE
                const fileEntity = new FileEntity();
                fileEntity.fileTitle = title;
                fileEntity.fileUid = fileStoreEntity.uid;
                fileEntity.ownerUid = userUid;
                fileEntity.parentFolderUid = folderUid;
                fileEntity.uid = randomUUID();

                const addFile = await this.repo.addFile(fileEntity, { manager: manager });



                // SAVE FILE
                const savePath = join(
                    this.configService.get('path.fileStore'),
                    encryptFile.file.originalname
                );

                fs.writeFileSync(savePath, encryptFile.file.buffer);



                // ADD PERMISSION
                await this.repo.addFilePermission({
                    fileUid: fileEntity.uid,
                    permissionArray: [
                        FilePermissionType.READ,
                        FilePermissionType.WRITE
                    ],
                    userUid: userUid
                }, { manager: manager })

                // LOGGING


                return addFile;
            }
            catch (e) {
                if (e instanceof CrepenCommonHttpLocaleError) {
                    throw e;
                }
                else {
                    throw new CrepenCommonHttpLocaleError('cloud_file', 'FILE_ADD_FAILED_FILE_SAVE_FAILED', HttpStatus.INTERNAL_SERVER_ERROR, {
                        innerError: e
                    });
                }
            }
        })
    }


    getFileInfoWithPermission = async (fileUid: string, userUid: string, permissionType: FilePermissionType, includeStore?: boolean) => {
        const filePermission =
            await this.repo
                .getFileInfo(fileUid, {
                    includeStore: includeStore,
                    permission: {
                        userUid: userUid,
                        permissionType: permissionType
                    }
                })
        return filePermission;
    }


    getDetailFileInfo = async (fileUid: string, userUid: string) => {
        return this.repo
            .getFileInfo(fileUid, {
                includeStore: true,
                includeTrafficSize: true,
                permission: {
                    permissionType: FilePermissionType.READ,
                    userUid: userUid
                }
            })
    }


}