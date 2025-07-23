import { CrepenDatabaseService } from "@crepen-nest/config/database/database.config.service";
import { CrepenApiSystemInstallHttpError } from "@crepen-nest/lib/error/http/install.system.api.http.error";
import { CryptoUtil } from "@crepen-nest/lib/util/crypto.util";
import { StringUtil } from "@crepen-nest/lib/util/string.util";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LocalConfigEntity } from "src/module/entity/local/config.local.entity";
import { DataSource } from "typeorm";
import { CrepenSystemInstallRepository } from "./install.system.repository";

@Injectable()
export class CrepenSystemInstallService {
    constructor(
        private readonly configService: ConfigService,
        private readonly databaseService : CrepenDatabaseService,
        private readonly repo : CrepenSystemInstallRepository
    ) {  }

 

    applySystemInit = async (host: string, port: number, user: string, password: string, database: string) => {

        const localDatabase = await this.databaseService.getDefault();

        // INIT STATE CHECK
        const initDBData = await this.repo.getDatabaseConfig();

        if (initDBData !== null && !StringUtil.isEmpty(initDBData.value)) {
            throw CrepenApiSystemInstallHttpError.INIT_DB_ALREADY_COMPLETE;
        }



        // TEST CONNECT

        const connectionString = `mysql://${user}:${password}@${host}:${port}/${database}`;

        try {
            const dataSource = new DataSource({
                type: 'mysql',
                url: connectionString,
                synchronize: false,
            })



            const conn = await dataSource.initialize();

            await conn.destroy();
        }
        catch (e) {
            throw CrepenApiSystemInstallHttpError.INIT_DATABASE_CONNECT_TEST_FAILED;
        }




        // APPLY DATABASE DATA
        const data = { host: host, port: port, username: user, password: password, database: database };
        const dataStr = JSON.stringify(data)


        await localDatabase.getRepository(LocalConfigEntity)
            .save(
                LocalConfigEntity.data(
                    'db',
                    CryptoUtil.Symmentic.encrypt(dataStr)
                )
            )

        for (const key of Object.keys(data)) {
            this.configService.set(`database.default.${key}`, data[key])
        }
    }

    getInstallState = async () => {
        const data = await this.repo.getInstallConfig();
        console.log(data);
        return data?.value === '1';
    }
}