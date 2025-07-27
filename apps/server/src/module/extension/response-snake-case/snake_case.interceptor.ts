import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import * as humps from 'humps'
import { Response } from "express";

export class ResponseSnakeCaseConvertInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {

        const res = context.switchToHttp().getResponse<Response>();

        return next.handle().pipe(

            map((data: unknown) => {
                if (res.getHeader('content-type') === 'application/json') {
                    if (typeof data === 'object' && data !== null) {
                        return humps.decamelizeKeys(data);
                    }
                }


                return data;
            })
        )
    }
}