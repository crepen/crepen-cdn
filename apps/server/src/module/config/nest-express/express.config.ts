import { NestExpressApplication } from "@nestjs/platform-express";

export class CrepenNestExpressConfig {
    private app : NestExpressApplication | undefined = undefined;


    constructor(app : NestExpressApplication) {
        this.app = app;
    }


    static setup = (app : NestExpressApplication) => {
        const instance = new CrepenNestExpressConfig(app);

        instance.disableXPoweredHeader();
    }




    disableXPoweredHeader = () => {
        this.app.disable('x-powered-by');
    }
}