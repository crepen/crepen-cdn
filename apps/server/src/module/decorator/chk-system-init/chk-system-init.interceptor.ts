import { CrepenServerSystemHttpError } from "@crepen-nest/lib/error/http/system.server.http.error";
import { CrepenCommonHttpLocaleError } from "@crepen-nest/lib/error/http/common.http.error";
import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Observable } from "rxjs";
import { LocalStateEntity } from "src/module/entity/local/state.local.entity";
import { SQLiteDataSourceProvider } from "src/module/config/database/provider/sqlite.database.provider";
import { DataSource } from "typeorm";

export class CheckInitSystemInterceptor implements NestInterceptor {

    constructor(
        private config: ConfigService<unknown, boolean>
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        let dataSource: DataSource;

        try {
            const connProv = SQLiteDataSourceProvider.getDataSource()


            try {
                dataSource = await connProv.initialize();
            }
            catch (e) {
                throw CrepenServerSystemHttpError.SYSTEM_LOCAL_DB_CONNECT_FAILED;
            }


            const installState = await dataSource
                .getRepository(LocalStateEntity)
                .findOne({
                    where: {
                        key: 'install',
                        value: '1'
                    }
                })

            await dataSource.destroy();

            if (installState === null) {
                throw CrepenServerSystemHttpError.SYSTEM_UNINIT;
            }
        }
        catch (e) {
            if(dataSource.isInitialized){
                await dataSource.destroy();
            }

            if (e instanceof CrepenCommonHttpLocaleError) {
                throw e;
            }
            else {
                throw CrepenServerSystemHttpError.SYSTEM_LOCAL_DB_CONNECT_FAILED;
            }
        }

        return next.handle();
    }
}