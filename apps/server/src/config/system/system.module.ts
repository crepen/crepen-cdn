import { Module } from "@nestjs/common";
import { CrepenSystemConfigService } from "./system.service";

@Module({
    providers : [CrepenSystemConfigService],
    exports : [CrepenSystemConfigService]
})
export class CrepenSystemConfigModule {}