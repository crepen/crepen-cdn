import { RepositoryOptions } from "@crepen-nest/interface/repo";
import { CrepenBaseRepository } from "@crepen-nest/lib/common/base.repository";
import { DatabaseService } from "@crepen-nest/module/config/database/database.config.service";

export class CrepenAdminSetupRepository extends CrepenBaseRepository {

    constructor(
        private readonly databaseService: DatabaseService
    ) { super(databaseService) }


    insertDatabaseConnString = async (connStr: string, options?: RepositoryOptions) => {
        const queryBuilder = options?.manager?.createQueryBuilder()
            ?? (await this.databaseService.getLocal()).createQueryBuilder();

        const match = await queryBuilder
            .select('*')
            .from('config', 'config')
            .where('key = :key', { key: 'DB_CS' })
            .getRawMany();

        if (match.length > 0) {
            void await queryBuilder
                .update()
                .set({ value: connStr })
                .where("key = :key", { key: 'DB_CS' })
                .execute();
        }
        else {
            void await queryBuilder
                .insert()
                .into<{ key: string, value: string }>('config')
                .values([
                    { key: 'DB_CS', value: connStr }
                ])
                .execute();
        }


    }


}