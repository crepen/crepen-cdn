import { PlatformAlreadyInstallError } from "@crepen-nest/lib/error/api/system/already_init.db.error";
import { DatabaseTestConnectError } from "@crepen-nest/lib/error/api/system/test_conn.db.error";
import { CryptoUtil } from "@crepen-nest/lib/util";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DatabaseConnectData } from "@crepen-nest/lib/types/interface/database";
import { DatabaseService } from "src/module/config/database/database.config.service";
import { EntityManager, DataSource } from "typeorm";
import { SystemHealthService } from "../health/health.system.service";
import { SystemInstallRequestDto } from "./dto/install.system.dto";
import { SystemInstallRepository } from "./install.system.repository";

@Injectable()
export class SystemInstallService {
    constructor(
        private readonly configService: ConfigService,
        private readonly databaseService: DatabaseService,
        private readonly repo: SystemInstallRepository,
        private readonly systemHealthService : SystemHealthService
    ) { }



    applySystemInit = async (prop: SystemInstallRequestDto) => {

        const localDatabase = await this.databaseService.getLocal();

        await localDatabase.transaction(async (manager: EntityManager) => {
            // INIT STATE CHECK
            const initDBData = await this.systemHealthService.isPlatformInstalled();

            if (initDBData) {
                throw new PlatformAlreadyInstallError();
            }



            // TEST CONNECT

            const checkConnDB = await this.tryConnectDB({
                host : prop.dbHost,
                port : prop.dbPort,
                database : prop.dbDatabase,
                password : prop.dbPassword,
                username : prop.dbUsername
            });
            if (!checkConnDB) {
                throw new DatabaseTestConnectError();
            }



            // APPLY DATABASE DATA
            const data = { host: prop.dbHost, port: prop.dbPort, username: prop.dbUsername, password: prop.dbPassword, database: prop.dbDatabase };
            const dataStr = JSON.stringify(data)
            const encryptDataStr = CryptoUtil.Symmentic.encrypt(dataStr)

            await this.repo.applyDatabase(encryptDataStr, { manager: manager });
        
            for (const key of Object.keys(data)) {
                this.configService.set(`database.default.${key}`, data[key])
            }


            await this.repo.changeInstallState(true, { manager: manager })
        })


    }

   

    tryConnectDB = async (data: DatabaseConnectData): Promise<boolean> => {
        const dataSource = new DataSource({
            type: 'mysql',
            host: data.host,
            port: data.port,
            username: data.username,
            password: data.password,
            database: data.database,
            synchronize: false
        })

        try {
            const db = await dataSource.initialize();
            await db.destroy();
            return true;
        }
        catch (e) {
            return false;
        }
    }
}