import { Module } from "@nestjs/common";
import { CrepenUserMonitorService } from "./monitor.service";
import { CrepenUserMonitorController } from "./monitor.controller";
import { CrepenUserMonitorRepository } from "./monitor.repository";

@Module({
    controllers : [CrepenUserMonitorController],
    providers : [CrepenUserMonitorService , CrepenUserMonitorRepository],
    exports : [CrepenUserMonitorService]
})
export class CrepenUserMonitorModule {}