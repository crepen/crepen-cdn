import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { CryptFileSchedulerService } from "../services/crypt-file.scheduler.service";
import { CrepenExplorerFileEncryptQueueService } from "@crepen-nest/app/api/explorer/services/file-queue.service";
import { CrepenExplorerFileService } from "@crepen-nest/app/api/explorer/services/file.explorer.service";
import { DatabaseService } from "@crepen-nest/app/config/database/database.config.service";
import { DynamicConfigService } from "@crepen-nest/app/config/dynamic-config/dynamic-config.service";

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


        


        // const globalSecret = this.dynamicConfig.get<string>('secret');
        // console.log(globalSecret);

        return;

        


    }



  


}