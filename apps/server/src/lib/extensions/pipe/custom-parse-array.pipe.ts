import { StringUtil } from "@crepen-nest/lib/util";
import { ArgumentMetadata, Injectable, ParseArrayPipe, PipeTransform } from "@nestjs/common";

/**
 * Custom Parse Array Pipe
 * 
 * 들어오는 값이 빈 값일 경우 발생하는 오류 처리
 */
@Injectable()
export class CustomParseStringToArrayPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if(typeof value !== 'string' || StringUtil.isEmpty(value)){
            return []
        }

        // 기존 ParseArrayPipe의 동작을 유지
        const parseArrayPipe = new ParseArrayPipe({ items: String, separator: ',' });
        return parseArrayPipe.transform(value , metadata);
    }
}