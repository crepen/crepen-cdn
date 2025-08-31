import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { DatabaseService } from "@crepen-nest/module/config/database/database.config.service";
import { DynamicConfigService } from "@crepen-nest/module/config/dynamic-config/dynamic-config.service";
import { ExplorerFileQueueState } from "../../../explorer/enum/file-queue-state.enum";
import { ExplorerFileQueueType } from "../../../explorer/enum/file-queue-type.enum";
import { CryptFileSchedulerService } from "../services/crypt-file.scheduler.service";
import { CrepenExplorerFileEncryptQueueService } from "@crepen-nest/module/app/explorer/services/file-queue.service";
import { CrepenExplorerFileService } from "@crepen-nest/module/app/explorer/services/file.explorer.service";
import { ExplorerFileEncryptState } from "@crepen-nest/module/app/explorer/enum/file-encrypt-state.enum";

@Injectable()
export class FileScheduler {
    constructor(
        private readonly cryptFileQueueService: CrepenExplorerFileEncryptQueueService,
        private readonly databaseService: DatabaseService,
        private readonly dynamicConfig: DynamicConfigService,
        private readonly cryptFileScheduleService : CryptFileSchedulerService,
        private readonly fileService: CrepenExplorerFileService,
    ) { }

    private lockCryptFileSchedule: boolean = false;

    // @Cron('* */60 * * * *' , {
    //     name : 'clearExpireStoreFile',
    //     timeZone : 'utc'
    // })
    @Cron(CronExpression.EVERY_HOUR)
    async clearExpireStoreFile(

    ) {
        console.log('CLEAR EXPIRE STORE FILE');
    }


    @Cron(CronExpression.EVERY_SECOND)
    async cryptFileQueueExecutor() {
        try {
            if (this.lockCryptFileSchedule === false) {
                this.lockCryptFileSchedule = true;

                const globalSecret = this.dynamicConfig.get<string>('secret');
                const key = globalSecret.length < 32 ? globalSecret.padEnd(32, '-') : globalSecret.slice(0, 32);


                const nextQueue = await this.cryptFileQueueService.getWaitQueueList();

                for (const queue of nextQueue) {
                        try {
                            await this.cryptFileQueueService.updateQueueState([queue.uid], ExplorerFileQueueState.RUNNING);
                            await this.fileService.updateFileEncryptState(queue.fileUid , ExplorerFileEncryptState.ENCRYPTING)

                            if (queue.queueType === ExplorerFileQueueType.ENCRYPT) {
                                await this.cryptFileScheduleService.encryptFile(
                                    queue,
                                    key
                                )
                            }
                            else if (queue.queueType === ExplorerFileQueueType.DECRYPT) {
                                await this.cryptFileScheduleService.decryptFile(
                                    queue,
                                    key
                                )
                            }
                            else {
                                await this.cryptFileQueueService.updateQueueState([queue.uid], ExplorerFileQueueState.ERROR)
                            }
                        }
                        catch (e) {
                            await this.cryptFileQueueService.updateQueueState([queue.uid], ExplorerFileQueueState.ERROR);
                        }
                        finally {
                            await this.fileService.updateFileEncryptState(queue.fileUid , ExplorerFileEncryptState.STABLE)
                        }
                }

                this.lockCryptFileSchedule = false;
            }
        }
        catch (e) {
            this.lockCryptFileSchedule = false;
            Logger.error('RUN FALIED' ,e ,'FILE_CRYPT_SCHD - GLOBAL');
        }


    }



  


}