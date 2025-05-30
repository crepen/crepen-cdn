import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CrepenSystemConfigService } from "../system/system.service";
import { CrepenSystemConfigModule } from "../system/system.module";
import { CrepenEnvConfigService } from "./env.service";
@Module({
    imports: [
        CrepenSystemConfigModule,
        ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
            load: [
                async () => {
                    const globalPath = new CrepenSystemConfigService().getGlobalPath('config');
                    return CrepenEnvConfigService.loadConfigFile(globalPath);
                }
            ]
        })
    ],
    providers: [CrepenEnvConfigService],
    exports : [CrepenEnvConfigService]
})
export class CrepenEnvConfigModule { }

