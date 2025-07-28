import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { DefaultDataSourceProvider } from "src/module/config/database/provider/default.database.provider";
import { ConfigService } from "@nestjs/config";
import { DatabaseConnectError } from "src/module/error/conn.db.error";
import { DisableValidDBDeco, DisableValidDBDecoMode } from "./chk-conn-db.decorator";


@Injectable()
export class CheckConnDBInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector,
        private configService : ConfigService
    ) { }

    getDecorator = (context : ExecutionContext , mode : DisableValidDBDecoMode) => {
        return this.reflector.get<boolean>(
            DisableValidDBDeco.getKey(mode),
            context.getHandler()
        )
    }

    intercept = async (context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> => {

        console.log(`CLASS : ${this.getDecorator(context , 'class') ? 'true' : 'false'} / METHOD : ${this.getDecorator(context , 'method') ? 'true' : 'false'}`)

        if(this.getDecorator(context , 'class') || this.getDecorator(context , 'method')) {
            console.log("PASS");
            return next.handle();
        }

        try{
            
            const dataSource = await DefaultDataSourceProvider.getDataSource(this.configService).initialize();

            if(!dataSource.isInitialized){
                throw new DatabaseConnectError();
            }

            await dataSource.destroy();
                
        }
        catch(e){
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