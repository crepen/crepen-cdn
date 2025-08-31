import { forwardRef, Module } from "@nestjs/common";
import { ScheduleModule } from '@nestjs/schedule';
import { FileScheduler } from "./scheduler/file.scheduler";
import { CrepenUserModule } from "../../user/user.module";
import { CrepenExplorerModule } from "../../explorer/explorer.module";
import { CryptFileSchedulerService } from "./services/crypt-file.scheduler.service";

@Module({
    imports: [
        forwardRef(() => CrepenUserModule),
        forwardRef(() => CrepenExplorerModule),
        ScheduleModule.forRoot()
    ],
    providers: [
        FileScheduler,
        CryptFileSchedulerService
    ]
})
export class SchedulerModule { }