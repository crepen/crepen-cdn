import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import LoadYamlConfigFactory from "./load-yaml.factory";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [
                process.env.NODE_ENV === 'prod' ? '.env.prod' : '',
                process.env.NODE_ENV === 'dev' ? '.env.development' : '',
                '.env',
            ],
            isGlobal: true,
            load: [LoadYamlConfigFactory]
        }),
    ]
})
export class CrepenEnvModule { }