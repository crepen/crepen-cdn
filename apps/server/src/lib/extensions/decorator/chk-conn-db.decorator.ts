import { applyDecorators, SetMetadata } from "@nestjs/common"

export type DisableValidDBDecoMode = 'class' | 'method'

export class DisableValidDBDeco {
    static getClassDeco = (): ClassDecorator => {
        return applyDecorators(
            SetMetadata(this.getKey('class'), true)
        )
    }

    static getMethodDeco = (): MethodDecorator => {
        return applyDecorators(
            SetMetadata(this.getKey('method'), true)
        )
    }

    static getKey = (mode : DisableValidDBDecoMode) => {
        return `cp_conn_db_checker_${mode}`;
    }
}