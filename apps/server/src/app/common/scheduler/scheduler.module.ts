import { Module } from "@nestjs/common";
import { ScheduleModule } from '@nestjs/schedule';
import { CrepenFileSchedulerService } from "./file.scheduler.service";

@Module({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    imports: [
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        ScheduleModule.forRoot()
    ],
    providers: [
        CrepenFileSchedulerService
    ]
})
export class CrepenSchedulerModule { }