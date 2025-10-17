import { Injectable } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { CrepenExplorerRepository } from "../repository/explorer.repository";
import { FileNotUploadedError } from "@crepen-nest/lib/error/api/explorer/file_not_uploaded.file.error";
import * as path from "path";
import * as fs from 'fs';
import { ExplorerFileEntity } from "../entity/file.explorer.default.entity";
import { ExplorerLogEntity } from "../entity/log.explorer.default.entity";
import { ExplorerLogTypeEnum } from "../enum/log-type.explorer.enum";
import { ExplorerItemType } from "../enum/item-type.explorer.enum";
import { ExplorerFileStateEnum } from "../enum/file-state.explorer.enum";
import { UserEntity } from "../../user/entity/user.default.entity";
import { RepositoryOptions } from "@crepen-nest/interface/repo";
import * as crypto from "crypto";
import { CrepenExplorerFileEncryptQueueService } from "./file-queue.service";
import { ExplorerFileQueueType } from "../enum/file-queue-type.enum";
import { CrepenExplorerFileRepository } from "../repository/file.explorer.repository";
import { CrepenExplorerDefaultService } from "./explorer.service";
import { Readable } from "stream";
import { DatabaseService } from "@crepen-nest/app/config/database/database.config.service";
import { DynamicConfigService } from "@crepen-nest/app/config/dynamic-config/dynamic-config.service";

@Injectable()
export class CrepenExplorerFileService {
    constructor(
        private readonly explorerRepo: CrepenExplorerRepository,
        private readonly databaseService: DatabaseService,
        private readonly dynamicConfig: DynamicConfigService,
        private readonly explorerService: CrepenExplorerDefaultService,
        private readonly i18n: I18nService,
        private readonly encryptFileQueueService: CrepenExplorerFileEncryptQueueService,
        private readonly fileRepo: CrepenExplorerFileRepository,
    ) { }



    addFile = async (originFileName: string, uuid: string, mimeType: string, fileSize: number, parentFolderUid: string, user: UserEntity): Promise<ExplorerFileEntity> => {

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

    getFileDataFromFileName = async (fileName?: string, options?: RepositoryOptions) => {
        const fileInfo = await this.explorerRepo.getFileDataByFileName(fileName, options);
        return fileInfo;
    }




    // updateFileEncryptData = async (fileUid: string, iv: Buffer | undefined, state: boolean, options?: RepositoryOptions) => {
    //     const entity = await this.getFileData(fileUid, undefined, options);
    //     entity.isFileEncrypt = state;
    //     entity.fileEncIv = iv;

    //     return this.fileRepo.updateFileEntity(entity, options);
    // }

    // updateFileEncryptState = async (fileUid: string, state: ExplorerFileEncryptState, options?: RepositoryOptions) => {
    //     const entity = await this.getFileData(fileUid, undefined, options);
    //     entity.encryptState = state;

    //     return this.fileRepo.updateFileEntity(entity, options);
    // }

    updateFilePublished = async (fileUid: string, state: boolean, options?: RepositoryOptions) => {
        const entity = await this.getFileData(fileUid, undefined, options);
        return this.updateFileEntityPublished(entity, state, options);
    }

    updateFileEntityPublished = async (fileEntity: ExplorerFileEntity, state: boolean, options?: RepositoryOptions) => {
        fileEntity.isPublished = state;
        return this.fileRepo.updateFileEntity(fileEntity, options);
    }




    getFileDataByUid = async (fileUid: string, options?: RepositoryOptions) => {
        return this.fileRepo.getFileData({
            uid: fileUid
        }, options);
    }

    getFileDataByFileName = async (fileName: string, options?: RepositoryOptions) => {
        return this.fileRepo.getFileData({
            fileName: fileName
        }, options)
    }







    public getDecryptFileStream = async (originFilePath: string, secret: string): Promise<Readable> => {
        // 1. 입력 유효성 검사
        // if (!secret) {
        //     throw new BadRequestException("Secret code is not defined.");
        // }

        // try {
        //     await fs.promises.access(originFilePath, fs.constants.R_OK);
        // } catch (error) {
        //     throw new BadRequestException("Origin file is not found or is not readable.");
        // }

        // 키 생성 (SHA256)
        const keyBuffer = crypto.createHash('sha256').update(secret).digest();
        if (keyBuffer.length !== 32) {
            throw new Error("Key must be 32 bytes (AES-256)");
        }

        // 상수 정의
        const CHUNK_SIZE = 1024 * 1024; // 1MB chunk
        const TAG_SIZE = 16;
        const IV_SIZE = 12;

        let fileHandle: fs.promises.FileHandle | null = null;
        
        try {
            fileHandle = await fs.promises.open(originFilePath, 'r');
            const stat = await fileHandle.stat();
            const inputFileSize = stat.size;

            // if (inputFileSize < IV_SIZE + TAG_SIZE) {
            //     throw new BadRequestException("File is too small to be a valid encrypted file.");
            // }

            const masterIv = Buffer.alloc(IV_SIZE);
            await fileHandle.read(masterIv, 0, IV_SIZE, 0);

            let currentOffset = IV_SIZE;
            let chunkIndex = 0;

            // 비동기 제너레이터 함수를 사용하여 복호화 로직 구현
            async function* generateDecryptedChunks() {
                while (currentOffset < inputFileSize) {
                    const remaining = inputFileSize - currentOffset;
                    const remainingPayload = remaining - TAG_SIZE;
                    if (remainingPayload <= 0) break;

                    const chunkSize = Math.min(CHUNK_SIZE, remainingPayload);
                    const encryptedBuffer = Buffer.alloc(chunkSize);
                    const tagBuffer = Buffer.alloc(TAG_SIZE);

                    await fileHandle.read(encryptedBuffer, 0, chunkSize, currentOffset);
                    await fileHandle.read(tagBuffer, 0, TAG_SIZE, currentOffset + chunkSize);

                    // 청크별 고유 IV 재생성
                    const chunkIv = Buffer.from(masterIv);
                    const indexBytes = Buffer.alloc(4);
                    indexBytes.writeUInt32LE(chunkIndex);
                    for (let i = 0; i < 4 && i < IV_SIZE; i++) {
                        chunkIv[IV_SIZE - 4 + i] ^= indexBytes[i];
                    }

                    // GCM 복호화 및 인증
                    const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, chunkIv);
                    decipher.setAuthTag(tagBuffer);

                    let decryptedBuffer: Buffer;
                    try {
                        decryptedBuffer = Buffer.concat([
                            decipher.update(encryptedBuffer),
                            decipher.final()
                        ]);
                    } catch (e) {
                        if (e instanceof Error &&  e.message.includes('authentication failed')) {
                            console.error(`Authentication failed: Error during chunk ${chunkIndex} decryption`);
                        }
                        throw e;
                    }

                    currentOffset += chunkSize + TAG_SIZE;
                    chunkIndex++;
                    yield decryptedBuffer;
                }
            }

            // 제너레이터에서 Readable 스트림 생성
            const readableStream = Readable.from(generateDecryptedChunks());

            // 스트림 종료 및 에러 시 파일 핸들 닫기
            readableStream.on('close', () => {
                if (fileHandle) {
                    fileHandle.close()
                        .then(res => {
                            fileHandle = null;
                        })
                        .catch(e => {
                            throw e;
                        })
                    
                }
            });

            readableStream.on('error', () => {
                if (fileHandle) {
                    fileHandle.close()
                        .then(res => {
                            fileHandle = null;
                        })
                        .catch(e => {
                            throw e;
                        })
                    
                }
            });

            return readableStream;
            
        } catch (error) {
            if (fileHandle) {
                await fileHandle.close();
            }
            throw error;
        }
    }
}