import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'isFormDataValueBoolean', async: false })
export class IsFormDataValueBooleanConstraint implements ValidatorConstraintInterface {
    validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        return this.isValid(value);
    }

    private isValid(value: string): boolean {
        if (typeof value === 'string') {
            return true;
        }

        return false;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return `${validationArguments.value} is not boolean type.`;
    }
}


export const IsFormDataValueBoolean = (validationOptions: ValidationOptions) => {
    return (object: unknown, propertyName: string) => {
        registerDecorator({
            name: 'isFormDataValueBoolean',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: string, args: ValidationArguments) {
                    if(typeof value === 'boolean'){
                        return true;
                    }

                    if(typeof value !== 'string'){
                        return false;
                    }
                    else if(!(value === 'true' || value === 'false')){
                        return false;
                    }
                    

                    return true;
                },
                defaultMessage(args: ValidationArguments) {
                    return `${propertyName} value is not boolean type.`;
                }
            }
        })
    }
}