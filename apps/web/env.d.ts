namespace NodeJS {
    interface ProcessEnv {
        readonly BASE_PATH: string;
        readonly AUTH_SECRET: string;
        readonly DB_HOST: string | undefined;
        readonly DB_PORT: string | undefined;
        readonly DB_USER: string | undefined;
        readonly DB_PASSWORD: string | undefined;
        readonly DB_NAME: string | undefined;
        readonly API_URL: string | undefined;
    }
}
