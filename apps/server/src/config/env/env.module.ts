import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CrepenEnvConfigService } from "./env.service";
import { CrepenSystemModule } from "@crepen-nest/app/system/system.module";
import { CrepenSystemService } from "@crepen-nest/app/system/system.service";
@Module({
    imports: [
        CrepenSystemModule,
        // CrepenSystemService,
        ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
            load: [
                async () => {
                    const globalPath = new CrepenSystemService().getGlobalPath('config');
                    return CrepenEnvConfigService.loadConfigFile(globalPath);
                }
            ]
        })
    ],
    providers: [CrepenEnvConfigService],
    exports : [CrepenEnvConfigService]
})
export class CrepenEnvConfigModule { }

