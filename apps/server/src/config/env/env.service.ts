import * as path from 'path';
import * as os from 'os';
import { ConfigService } from '@nestjs/config';
import { CrepenEnvConfigModule } from './env.module';
import * as fs from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import * as YAML from 'yaml';
import * as jsyaml from 'js-yaml';
import { CrepenConfig } from 'src/interface/config';
import { detect } from 'detect-port';
import { StringUtil } from 'src/lib/util/string.util';
import { CrepenSystemService } from '@web/app/system/system.service';

@Injectable()
export class CrepenEnvConfigService {

    constructor(
        private readonly configService: ConfigService,
        private readonly systemConfigService: CrepenSystemService,
    ) {

    }

    validConfigData = async (): Promise<boolean> => {

        const globalPath = this.systemConfigService.getGlobalPath('config');

        let errorMessageArray = [];


        // console.log(this.configService);

        //SERVER

        const configPort = this.configService.get<number>('server.port') ?? undefined;
        if (!configPort || typeof configPort !== 'number' || configPort === 0) {
            errorMessageArray.push('Server.port not defined.');
        }
        else {
            const changePort = await detect(configPort);
            if (changePort !== configPort) {
                errorMessageArray.push('Server.port is already open.');
            }
        }

        //DB

        const dbHost = this.configService.get<string>('db.host') ?? undefined;
        if (!dbHost || typeof dbHost !== 'string' || StringUtil.isEmpty(dbHost)) {
            errorMessageArray.push('Database.host not defined.');
        }

        const dbPort = this.configService.get<number>('db.port') ?? undefined;
        if (!dbPort || typeof dbPort !== 'number' || dbPort === 0) {
            errorMessageArray.push('Database.port not defined.');
        }

        const dbUsername = this.configService.get<string>('db.username') ?? undefined;
        if (!dbUsername || typeof dbUsername !== 'string' || StringUtil.isEmpty(dbUsername)) {
            errorMessageArray.push('Database.username not defined.');
        }

        const dbPassword = this.configService.get<string>('db.username') ?? undefined;
        if (!dbPassword || typeof dbPassword !== 'string' || StringUtil.isEmpty(dbPassword)) {
            errorMessageArray.push('Database.password not defined.');
        }

        const dbName = this.configService.get<string>('db.database') ?? undefined;
        if (!dbName || typeof dbName !== 'string' || StringUtil.isEmpty(dbName)) {
            errorMessageArray.push('Database.database not defined.');
        }


        //SECRET
        const secretJwt = this.configService.get<string>('secret.jwt') ?? undefined;
        if (!secretJwt || typeof secretJwt !== 'string' || StringUtil.isEmpty(secretJwt)) {
            errorMessageArray.push('Secret.jwt not defined.');
        }
 
        //JWT
        const jwtExpireTime = this.configService.get<string>('jwt.expireTime') ?? undefined;
        if (!jwtExpireTime || typeof jwtExpireTime !== 'string' || StringUtil.isEmpty(jwtExpireTime)) {
            errorMessageArray.push('Jwt.expireTime not defined.');
        }


        if (errorMessageArray.length > 0) {
            Logger.error('', undefined, 'CONFIG_VALIDATION');
            Logger.error(`Config is not valid.`, undefined, 'CONFIG_VALIDATION');
            Logger.error(`Check config.yaml (${path.join(globalPath, 'config.yaml')})`, undefined, 'CONFIG_VALIDATION');
            Logger.error('', undefined, 'CONFIG_VALIDATION');
            errorMessageArray.map(x => {
                Logger.error(` - ${x}`, undefined, 'CONFIG_VALIDATION');
            })
            Logger.error('', undefined, 'CONFIG_VALIDATION');

            return false;
            // process.exit();
            // Logger.error('retry read.. (3sec)', 'CONFIG_VALIDATION');
            // await new Promise((res) => setTimeout(res , 10))
            // // Logger.error('ret', 'CONFIG_VALIDATION')
            // // await CrepenEnvConfigModule.validConfig(config , globalPath);
        }

        return true;
    }


    static initConfigFile = (globalPath: string) => {
        const configPath = path.join(globalPath, 'config.yaml');

        if (!fs.existsSync(configPath)) {
            Logger.log('Not found config.yaml. Try Create..', 'ENV')

            const sampleConfigPath = path.join(__dirname, '../../public/sample/sample.config.yaml')
            const sampleJson = jsyaml.load(fs.readFileSync(sampleConfigPath, 'utf8')) as CrepenConfig;

            fs.writeFileSync(configPath, YAML.stringify(sampleJson))

            Logger.log(`Create Complete. (${configPath})`, 'ENV');

            // YAML.stringify()
        }
    }

    static loadConfigFile = (globalPath: string): CrepenConfig => {

        CrepenEnvConfigService.initConfigFile(globalPath);

        const configPaths = [path.join(globalPath, 'config.yaml')];

        const config = configPaths.reduce((acc, filename) => {
            const filePath = filename;
            try {
                const yamlData = jsyaml.load(fs.readFileSync(filePath, 'utf8')) as Record<string, any>;
                return { ...acc, ...yamlData };
            } catch (e) {
                // console.warn(`Failed to load ${filename}: ${e.message}`);
                return acc;
            }
        }, {});

        return config;
    }






}