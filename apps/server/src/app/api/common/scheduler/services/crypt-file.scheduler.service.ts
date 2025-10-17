import { Injectable, Logger } from "@nestjs/common";
import { CrepenExplorerEncryptFileService } from "@crepen-nest/app/api/explorer/services/encrypt-file.explorer.service";
import { CrepenExplorerFileEncryptQueueService } from "@crepen-nest/app/api/explorer/services/file-queue.service";
import { CrepenExplorerFileService } from "@crepen-nest/app/api/explorer/services/file.explorer.service";
import { DatabaseService } from "@crepen-nest/app/config/database/database.config.service";
import { DynamicConfigService } from "@crepen-nest/app/config/dynamic-config/dynamic-config.service";

@Injectable()
export class CryptFileSchedulerService {

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly fileService: CrepenExplorerFileService,
        private readonly dynamicConfig: DynamicConfigService,
        private readonly cryptFileQueueService: CrepenExplorerFileEncryptQueueService,
        private readonly encryptFileService: CrepenExplorerEncryptFileService,
    ) { }


    // encryptFile = async (queue: ExplorerFileEncryptQueueEntity, key: string, options?: RepositoryOptions) => {



    //     try {

    //         const encryptFileUid = crypto.randomUUID();
    //         const iv = crypto.randomBytes(16);
    //         const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)

    //         //  Get File Info
    //         const fileInfo = await this.fileService.getFileData(queue.fileUid, undefined);


    //         //#region DIR_DEFINE
    //         const fileDirPath = path.join(
    //             this.dynamicConfig.get('path.data'),
    //             'file',
    //             fileInfo.filePath
    //         )

    //         const storeDecryptFilePath = path.join(
    //             fileDirPath,
    //             fileInfo.storeFileName
    //         );

    //         const saveEncryptFilePath = path.join(
    //             fileDirPath,
    //             path.format({
    //                 name: encryptFileUid,
    //                 ext: 'CPCDNENC'
    //             })
    //         )
    //         //#endregion DIR_DEFINE


    //         if (fs.existsSync(storeDecryptFilePath)) {
    //             const originFileStream = fs.createReadStream(storeDecryptFilePath);

    //             const encryptStream = () => new Promise<void>((resolve, reject) => {
    //                 originFileStream
    //                     .on('error', reject)
    //                     .pipe(cipher)
    //                     .pipe(fs.createWriteStream(saveEncryptFilePath))
    //                     .on('error', reject)
    //                     .on('finish', resolve)
    //                     .on('end', resolve)
    //             })


    //             await encryptStream();

    //             await (options?.manager ?? (await this.databaseService.getDefault())).transaction(async manager => {
    //                 await this.encryptFileService.addItem(encryptFileUid, fileInfo.uid, options);
    //                 await this.fileService.updateFileEncryptData(fileInfo.uid, iv, true, options);
    //                 await this.cryptFileQueueService.updateQueueState([queue.uid], ExplorerFileQueueState.COMPLETE, { manager: manager })
    //             })

    //             fs.rmSync(storeDecryptFilePath);
    //         }
    //         else {
    //             throw new Error(`File not found : ${fileInfo.uid}`);
    //         }


    //     }
    //     catch (e) {
    //         Logger.error(`File Encrypt Error : ${queue.uid}`, e, 'FILE_CRYPT_SCHD - ENCRYPT')
    //         throw e;
    //     }
    // }


    // decryptFile = async (queue: ExplorerFileEncryptQueueEntity, encryptKey: string, options?: RepositoryOptions) => {
    //     try {
    //         const fileInfo = await this.fileService.getFileData(queue.fileUid, undefined, options);
    //         const encryptFileInfo = await this.encryptFileService.getEncryptFileDataByLinkFileUid(fileInfo.uid);

    //         const decipher = crypto.createDecipheriv('aes-256-cbc', encryptKey, fileInfo.fileEncIv);

    //         //#region DIR_DEFINE
    //         const fileDirPath = path.join(
    //             this.dynamicConfig.get('path.data'),
    //             'file',
    //             fileInfo.filePath
    //         )

    //         const storeEncryptFilePath = path.join(
    //             fileDirPath,
    //             encryptFileInfo.fileName
    //         )

    //         const saveDecryptFilePath = path.join(
    //             fileDirPath,
    //             fileInfo.storeFileName
    //         );
    //         //#endregion DIR_DEFINE

    //         if (fs.existsSync(storeEncryptFilePath)) {
    //             const originFileStream = fs.createReadStream(storeEncryptFilePath);

    //             const decryptStream = () => new Promise<void>((resolve, reject) => {
    //                 originFileStream
    //                     .on('error', reject)
    //                     .pipe(decipher)
    //                     .pipe(fs.createWriteStream(saveDecryptFilePath))
    //                     .on('error', reject)
    //                     .on('finish', resolve)
    //                     .on('end', resolve)
    //             })

    //             await decryptStream();

    //             await (options?.manager ?? (await this.databaseService.getDefault())).transaction(async manager => {
    //                 await this.encryptFileService.removeItem(encryptFileInfo.uid, options);
    //                 await this.fileService.updateFileEncryptData(fileInfo.uid, undefined, false, options);
    //                 await this.cryptFileQueueService.updateQueueState([queue.uid], ExplorerFileQueueState.COMPLETE, { manager: manager })
    //             })


    //             fs.rmSync(storeEncryptFilePath);
    //         }
    //         else {
    //             throw new Error(`File not found. : ${fileInfo.uid}`);
    //         }
    //     }
    //     catch (e) {
    //         Logger.error(`File Decrypt Error : ${queue.uid}`, e, 'FILE_CRYPT_SCHD - DECRYPT');
    //         throw e;
    //     }
    // }
}