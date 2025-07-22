import { forwardRef, Module } from "@nestjs/common";
import { CrepenSystemHealthController } from "./health.system.controller";
import { CrepenSystemHealthRepository } from "./health.system.repository";
import { CrepenSystemDatabaseModule } from "../db/db.system.module";
import { CrepenSystemHealthService } from "./health.system.service";

@Module({
    imports: [
        forwardRef(() => CrepenSystemDatabaseModule),
    ],
    controllers: [CrepenSystemHealthController],
    providers: [CrepenSystemHealthService, CrepenSystemHealthRepository]
})
export class CrepenSystemHealthModule { }