import { StringUtil } from "@crepen-nest/lib/util/string.util";
import { applyDecorators } from "@nestjs/common";
import { Type } from "class-transformer";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'isNotEmptyNumber', async: false })
export class IsDBPortConstraint implements ValidatorConstraintInterface {
    validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        return this.isValid(value);
    }

    private isValid(value: any): boolean {

        if(isNaN(value)){
            return false;
        }

        if(value <= 0){
            return false;
        }

        return true;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return `${validationArguments.value} is not boolean type.`;
    }
}


export const IsDBPort = (validationOptions: ValidationOptions) => {
    return applyDecorators(
        Type(() => Number),
        (object: unknown, propertyName: string) => {
            registerDecorator({
                name: 'isNotEmptyNumber',
                target: object.constructor,
                propertyName: propertyName,
                constraints: [],
                options: validationOptions,
                validator: IsDBPortConstraint
            })
        },
        
    )
}