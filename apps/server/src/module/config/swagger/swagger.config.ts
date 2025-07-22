import { INestApplication } from "@nestjs/common";
import { NestApplication } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export class CrepenSwaggerConfig {

    private app: INestApplication<any> | undefined = undefined;
    constructor(app: INestApplication<any>) {
        this.app = app;
    }


    private options = new DocumentBuilder()
        .setTitle('Crepen CDN API Server')
        .setVersion('1.0.0')
        .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'JWT Token',
            in: 'header'
        }, 'token')
        .build()


    static setup = (app : INestApplication<any>) => {
        const instance = new CrepenSwaggerConfig(app);
        instance.init();
    }


    private init = () => {
        const document = SwaggerModule.createDocument(this.app , this.options);
        SwaggerModule.setup('api-docs' , this.app , document);
    }
}