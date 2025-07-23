import { Module } from "@nestjs/common";
// import { CrepenSystemHealthModule } from "./health/health.system.module";
import { CrepenSystemInstallModule } from "./install/install.system.module";
import { CrepenSystemHealthModule } from "./health/health.system.module";

@Module({
    imports : [
      CrepenSystemHealthModule,
      CrepenSystemInstallModule
    ]
})
export class CrepenSystemModule {}