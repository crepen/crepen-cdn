import { forwardRef, Module } from "@nestjs/common";
import { SystemInstallController } from "./install.system.controller";
import { SystemInstallService } from "./install.system.service";
import { DatabaseService } from "@crepen-nest/config/database/database.config.service";
import { DatabaseModule } from "@crepen-nest/config/database/database.config.module";
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