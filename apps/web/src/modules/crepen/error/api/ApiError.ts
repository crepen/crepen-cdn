import { BaseError } from "../BaseError";

export type BaseErrorCategory = 'SYSTEM' | 'AUTH' | 'USER';

export class ApiError extends BaseError {
    constructor(category: BaseErrorCategory, message: string, options?: ErrorOptions) {
        super(message, options)
        this.category = category;
    }

    category: BaseErrorCategory;
}