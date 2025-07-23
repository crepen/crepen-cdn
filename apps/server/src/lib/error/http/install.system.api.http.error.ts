import { CrepenCommonHttpLocaleError, CrepenCommonHttpLocaleErrorOption } from "@crepen-nest/lib/error/http/common.http.error";

export class CrepenApiSystemInstallHttpError extends CrepenCommonHttpLocaleError {
    constructor(message: string, status: number, options?: CrepenCommonHttpLocaleErrorOption) {
        super('api_system', message, status, options)
    }

    static INIT_DATABASE_CONNECT_TEST_FAILED = new CrepenApiSystemInstallHttpError('INIT_DATABASE_CONNECT_TEST_FAILED', 403);
    static INIT_DB_ALREADY_COMPLETE = new CrepenApiSystemInstallHttpError('INIT_DB_ALREADY_COMPLETE', 403);
}