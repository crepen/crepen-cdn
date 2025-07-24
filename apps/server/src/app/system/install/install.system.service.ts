import { CrepenDatabaseService } from "@crepen-nest/config/database/database.config.service";
import { CrepenApiSystemInstallHttpError } from "@crepen-nest/lib/error/http/install.system.api.http.error";
import { CryptoUtil } from "@crepen-nest/lib/util/crypto.util";
import { StringUtil } from "@crepen-nest/lib/util/string.util";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LocalConfigEntity } from "src/module/entity/local/config.local.entity";
import { DataSource, EntityManager } from "typeorm";
import { CrepenSystemInstallRepository } from "./install.system.repository";
import { SystemInstallDatabaseRequestDto, SystemInstallRequestDto } from "./dto/install.system.dto";

@Injectable()
export class CrepenSystemInstallService {
    constructor(
        private readonly configService: ConfigService,
        private readonly databaseService: CrepenDatabaseService,
        private readonly repo: CrepenSystemInstallRepository
    ) { }



    applySystemInit = async (prop: SystemInstallRequestDto) => {

        const localDatabase = await this.databaseService.getLocal();

        await localDatabase.transaction(async (manager: EntityManager) => {
            // INIT STATE CHECK
            const initDBData = await this.repo.getInstallState({ manager: manager });

            if (initDBData?.value === '1') {
                throw CrepenApiSystemInstallHttpError.INIT_DB_ALREADY_COMPLETE;
            }



            // TEST CONNECT

            const checkConnDB = await this.checkDatabaseConnection(prop.database);
            if (!checkConnDB) {
                throw CrepenApiSystemInstallHttpError.TEST_DB_CONN_FAILED;
            }



            // APPLY DATABASE DATA
            const data = { host: prop.database.host, port: prop.database.port, username: prop.database.username, password: prop.database.password, database: prop.database.database };
            const dataStr = JSON.stringify(data)
            const encryptDataStr = CryptoUtil.Symmentic.encrypt(dataStr)

            await this.repo.applyDatabase(encryptDataStr, { manager: manager });
            // await localDatabase.getRepository(LocalConfigEntity)
            //     .save(
            //         LocalConfigEntity.data(
            //             'db',
            //             encryptDataStr
            //         )
            //     )

            for (const key of Object.keys(data)) {
                this.configService.set(`database.default.${key}`, data[key])
            }


            await this.repo.changeInstallState(true, { manager: manager })
        })


    }

    getInstallState = async () => {
        const data = await this.repo.getInstallState();
        
        return data?.value === '1';
    }

    checkDatabaseConnection = async (data: SystemInstallDatabaseRequestDto): Promise<boolean> => {
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