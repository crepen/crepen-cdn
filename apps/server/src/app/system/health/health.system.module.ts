import { forwardRef, Module } from "@nestjs/common";
import { SystemHealthController } from "./health.system.controller";
import { SystemHealthRepository } from "./health.system.repository";
import { SystemHealthService } from "./health.system.service";

@Module({
    controllers: [SystemHealthController],
    providers: [SystemHealthService, SystemHealthRepository],
    exports : [SystemHealthService]
})
export class SystemHealthModule { }