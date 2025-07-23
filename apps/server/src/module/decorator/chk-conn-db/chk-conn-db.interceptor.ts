import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { CHK_CONN_DB_DECO_KEY } from "./chk-conn-db.decorator";
import { CrepenSystemError } from "@crepen-nest/lib/error/system/common.system.error";
import { CrepenCommonHttpLocaleError } from "@crepen-nest/lib/error/http/common.http.error";

export class CheckConnDBInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector) { }


    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const checkDecorator = this.reflector.get<boolean>(
            CHK_CONN_DB_DECO_KEY,
            context.getHandler(),
        );

        if(!checkDecorator) return next.handle();


        throw new CrepenCommonHttpLocaleError('test' , '1' , 400);

        return next.handle();
    }


}