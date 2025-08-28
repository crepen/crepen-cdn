import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { DisableValidDBDeco, DisableValidDBDecoMode } from "../../../lib/extensions/decorator/chk-conn-db.decorator";
import { DatabaseConnectError } from "@crepen-nest/lib/error/api/common/conn.db.error";
import { DefaultDataSourceProvider } from "@crepen-nest/config/provider/database/default.database.provider";
import { DatabaseService } from "@crepen-nest/module/config/database/database.config.service";


@Injectable()
export class CheckConnDBInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector,
        private configService : ConfigService,
        private databaseService : DatabaseService
    ) { }

    getDecorator = (context : ExecutionContext , mode : DisableValidDBDecoMode) => {
        return this.reflector.get<boolean>(
            DisableValidDBDeco.getKey(mode),
            context.getHandler()
        )
    }

    intercept = async (context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> => {


        if(this.getDecorator(context , 'class') || this.getDecorator(context , 'method')) {
            return next.handle();
        }

        try{
            const dataSource = (await this.databaseService.getDefault());

            if(!dataSource.isInitialized){
                throw new DatabaseConnectError();
            }

            
                

            // await dataSource.destroy();
                
        }
        catch(e){
            Logger.error(e , 'MAIN > CHK_CONN_DB_ERR')
            if(e instanceof DatabaseConnectError){
                throw e;
            }
            else{
                throw new DatabaseConnectError();
            }
        }
        

        return next.handle();
    }


}