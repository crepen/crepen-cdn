import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import * as humps from 'humps'

export class ResponseSnakeCaseConvertInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {

        console.log('INTERCEPTT');

        return next.handle().pipe(
            map((data: unknown) => {
                console.log('EEEE',data);
                if (typeof data === 'object' && data !== null) {
                    console.log("CAMEL CASE INTERCEPTOR" , humps.decamelizeKeys(data));
                    return humps.decamelizeKeys(data);
                }

                return data;
            })
        )
    }
}