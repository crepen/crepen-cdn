export interface SystemHealthResponse {
    api: boolean,
    install: boolean,
    database: {
        default: boolean,
        local: boolean
    }
}