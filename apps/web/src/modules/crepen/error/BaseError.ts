

export class BaseError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options)
    }
}