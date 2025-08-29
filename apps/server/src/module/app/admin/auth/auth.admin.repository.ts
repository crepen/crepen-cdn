import { RepositoryOptions } from "@crepen-nest/interface/repo";
import { CrepenBaseRepository } from "@crepen-nest/lib/common/base.repository";
import { DatabaseService } from "@crepen-nest/module/config/database/database.config.service";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";

@Injectable()
export class CrepenAdminAuthRepository extends CrepenBaseRepository {

    constructor(
        private readonly configService: ConfigService,
        private readonly databaseService: DatabaseService,
    ) { super(databaseService) }

    createAuthTable = async (options?: RepositoryOptions) => {
        const queryRunner = options.manager.queryRunner
            ?? (await this.databaseService.getLocal()).createQueryRunner();

        await queryRunner.query(`
            CREATE TABLE auth (
                idx INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                password TEXT NOT NULL,
                timestamp NUMERIC DEFAULT (strftime('%s', 'now'))
            ) 
        `)
    }

    isAuthTableExist = async (options?: RepositoryOptions) => {
        const queryBuilder = options?.manager?.createQueryBuilder()
            ?? (await this.databaseService.getLocal()).createQueryBuilder()

        const tableRes = await queryBuilder
            .select(['name'])
            .from('sqlite_master', 'mst')
            .where('name= :tableName', {tableName : 'auth'})
            .getRawMany<{ name: string }[]>();

        return tableRes.length > 0
    }

    addPasswordItem = async (password?: string, options?: RepositoryOptions) => {
         const queryBuilder = options?.manager?.createQueryBuilder()
            ?? (await this.databaseService.getLocal()).createQueryBuilder()

        void await queryBuilder
            .insert()
            .into<{password : string}>('auth')
            .values([
                {password : password}
            ]).execute();
    }
    
    getPassword = async (password?: string, options?: RepositoryOptions) => {
                 const queryBuilder = options?.manager?.createQueryBuilder()
            ?? (await this.databaseService.getLocal()).createQueryBuilder()

            return queryBuilder
                .select(['password' , 'timestamp'])
                .from('auth' , 'auth')
                .where('password = :password' , {password : password})
                .getRawOne<{password : string , timestamp : number} | null>();
    }
}