import { Module } from "@nestjs/common";
// import { CrepenSystemHealthModule } from "./health/health.system.module";
import { SystemInstallModule } from "./install/install.system.module";
import { SystemHealthModule } from "./health/health.system.module";

@Module({
    imports : [
      SystemHealthModule,
      SystemInstallModule
    ]
})
export class SystemModule {}