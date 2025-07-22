import { applyDecorators, SetMetadata } from "@nestjs/common"

export const CHK_CONN_DB_DECO_KEY = 'conn_db_checker'

export const CheckConnDB = (): MethodDecorator => {

    console.log('sss');

    return applyDecorators(
        SetMetadata(CHK_CONN_DB_DECO_KEY, true)
    )
}