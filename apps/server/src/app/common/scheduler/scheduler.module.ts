import { Module } from "@nestjs/common";
import { ScheduleModule } from '@nestjs/schedule';
import { FileSchedulerService } from "./file.scheduler.service";

@Module({
    imports: [
        ScheduleModule.forRoot()
    ],
    providers: [
        FileSchedulerService
    ]
})
export class SchedulerModule { }