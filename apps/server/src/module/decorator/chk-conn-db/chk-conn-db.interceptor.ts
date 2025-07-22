import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { CHK_CONN_DB_DECO_KEY } from "./chk-conn-db.decorator";
import { CrepenSystemError } from "@crepen-nest/lib/exception/crepen.system.exception";
import { CrepenLocaleHttpException } from "@crepen-nest/lib/exception/crepen.http.exception";

export class CheckConnDBInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector) { }


    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const checkDecorator = this.reflector.get<boolean>(
            CHK_CONN_DB_DECO_KEY,
            context.getHandler(),
        );

        if(!checkDecorator) return next.handle();


        throw new CrepenLocaleHttpException('test' , '1' , 400);

        return next.handle();
    }


}