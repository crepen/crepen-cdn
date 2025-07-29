import { forwardRef, Module } from "@nestjs/common";
import { SystemInstallController } from "./install.system.controller";
import { SystemInstallService } from "./install.system.service";
import { SystemInstallRepository } from "./install.system.repository";
import { SystemHealthService } from "../health/health.system.service";
import { SystemHealthModule } from "../health/health.system.module";

@Module({
    // imports : [CrepenDatabaseModule],
    imports : [
        forwardRef(() => SystemHealthModule)
    ],
    controllers : [SystemInstallController],
    providers : [SystemInstallService , SystemInstallRepository]
})
export class SystemInstallModule {}