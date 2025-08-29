import { CheckDatabaseConnectionError } from "@crepen-nest/lib/error/api/admin/setup/chk_conn_failed.setup.admin.error";
import { InitDatabaseNotEmpty } from "@crepen-nest/lib/error/api/admin/setup/init_db_not_empty.setup.admin.error";
import { CommonError } from "@crepen-nest/lib/error/common.error";
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import * as path from 'path';
import { CrepenAdminSetupRepository } from "./setup.admin.repository";
import { DynamicConfigService } from "@crepen-nest/module/config/dynamic-config/dynamic-config.service";
import { CryptoUtil } from "@crepen-nest/lib/util";

@Injectable()
export class CrepenAdminSetupService {

    constructor(
        private readonly repo: CrepenAdminSetupRepository,
        private readonly dynamicConfig: DynamicConfigService
    ) { }

    checkDatabase = async (host?: string, port?: number, userName?: string, password?: string, database?: string, isOnlyApply?: boolean): Promise<DataSource> => {
        const dataSource = new DataSource({
            type: 'mariadb',
            url: `mariadb://${userName}:${password}@${host}:${port}/${database}`,
            synchronize: false,
            logging: false,
            timezone: '+00:00'
        })

        try {
            await dataSource.initialize();

            if (isOnlyApply !== true) {
                const checkTables = await dataSource.createQueryBuilder()
                    .select('table_item.TABLE_NAME as table_name')
                    .from('INFORMATION_SCHEMA.TABLES', 'table_item')
                    .where('table_item.TABLE_TYPE = :tableName', { tableName: 'BASE TABLE' })
                    .andWhere('table_item.TABLE_SCHEMA <> :ignoreTableSchema', { ignoreTableSchema: 'performance_schema' })
                    .getRawMany<{ table_name: string }[]>();

                if (checkTables.length > 0) {
                    throw new InitDatabaseNotEmpty();
                }
            }




        }
        catch (e) {
            if (dataSource.isInitialized) {
                await dataSource.destroy()
            }

            if (e instanceof CommonError) {
                throw e;
            }
            else {
                throw new CheckDatabaseConnectionError();
            }
        }
        return dataSource;
    }

    syncronizeTable = async (dataSource: DataSource) => {
        try {



            const entityDir = path.join(__dirname, '/../../../../module/**/entity/*.default.entity{.ts,.js}')

            dataSource.setOptions({
                entities: [entityDir],
                synchronize: true
            })

            await dataSource.destroy()
            await dataSource.initialize();
        }
        catch (e) {
            if (dataSource.isInitialized) {
                await dataSource.destroy()
            }

            if (e instanceof CommonError) {
                throw e;
            }
            else {
                throw new CheckDatabaseConnectionError();
            }
        }
    }

    addDBConnConfig = async (connStr: string) => {
        const decryptConnString = CryptoUtil.Symmentic.encrypt(connStr, this.dynamicConfig.get('secret'));
        await this.repo.insertDatabaseConnString(decryptConnString);
    }
}