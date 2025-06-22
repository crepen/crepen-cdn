import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class CrepenFileSchedulerService {
    constructor(

    ){}

    // @Cron('* */60 * * * *' , {
    //     name : 'clearExpireStoreFile',
    //     timeZone : 'utc'
    // })
    @Cron(CronExpression.EVERY_HOUR)
    async clearExpireStoreFile(

    ){
        console.log('CLEAR EXPIRE STORE FILE');
    }   
}