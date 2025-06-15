export class CrepenCommonError extends Error {
    constructor(message?: string, opt?: ErrorOptions) {
        super(message, opt)
    }
}