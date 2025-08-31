import { Catch, ExceptionFilter, ArgumentsHost } from "@nestjs/common";

@Catch()
export class IgnorePrematureCloseFilter implements ExceptionFilter {
  catch(exception: Error & {code?: string}, host: ArgumentsHost) {
    if (
      exception?.code === 'ERR_STREAM_PREMATURE_CLOSE' ||
      exception?.message?.includes('Premature close')
    ) {
      // 그냥 무시 (로그도 안 남김)
      return;
    }

    // 기본 동작 수행
    throw exception;
  }
}