import { Module, OnModuleInit } from "@nestjs/common";
import { PlatformAppModule } from "./app/app.module";
import { PlatformConfigModule } from "./config/config.module";
import { ConfigService } from "@nestjs/config";
import { DynamicConfigService } from "./config/dynamic-config/dynamic-config.service";

@Module({
    imports: [
        PlatformConfigModule,
        PlatformAppModule,
    ],
    providers: []
})
export class GlobalModule implements OnModuleInit {

    constructor(
        private readonly configService: ConfigService,
        private readonly dynamicConfig: DynamicConfigService
    ) {}
   
    onModuleInit() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const allConfig = (this.configService as any).internalConfig;
        const convertTypeConfig = this.flattenConfig(allConfig);

        for (const item of convertTypeConfig) {
            this.dynamicConfig.set(item.key, item.value)
        }
    }


    flattenConfig = (obj: Record<string, any>, parentKey = '') => {
        let result: { key: string, value: any }[] = [];

        for (const [key, value] of Object.entries(obj)) {
            const newKey = parentKey ? `${parentKey}.${key}` : key;

            if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                result = result.concat(this.flattenConfig(value, newKey));
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                result.push({ key: newKey, value: value });
            }
        }

        return result;
    }
}