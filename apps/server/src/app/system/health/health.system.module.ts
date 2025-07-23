import { forwardRef, Module } from "@nestjs/common";
import { CrepenSystemHealthController } from "./health.system.controller";
import { CrepenSystemHealthRepository } from "./health.system.repository";
import { CrepenSystemHealthService } from "./health.system.service";

@Module({
    controllers: [CrepenSystemHealthController],
    providers: [CrepenSystemHealthService, CrepenSystemHealthRepository]
})
export class CrepenSystemHealthModule { }