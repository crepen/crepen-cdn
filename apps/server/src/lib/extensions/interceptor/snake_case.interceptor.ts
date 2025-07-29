import { CallHandler, ExecutionContext, NestInterceptor, StreamableFile } from "@nestjs/common";
import { map, Observable } from "rxjs";
import * as humps from 'humps'
import { Response } from "express";

export class ResponseSnakeCaseConvertInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {

        const res = context.switchToHttp().getResponse<Response>();

        

        return next.handle().pipe(

            map((data: unknown) => {
              
              
                if (!(data instanceof StreamableFile || data instanceof File )) {
                    if (typeof data === 'object' && data !== null) {
                        return humps.decamelizeKeys(data);
                    }
                }


                return data;
            })
        )
    }
}