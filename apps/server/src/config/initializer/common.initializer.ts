import { DatabaseService } from "@crepen-nest/module/config/database/database.config.service";
import { ExceptionFilter, INestApplication, Logger, NestInterceptor, PipeTransform } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { NestFactory, Reflector } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { GlobalModule } from "src/module/global.module";

export class CommonInitializer {

    constructor(
        private context: INestApplication
    ) {
        this.configService = context.get(ConfigService);
        this.databaseService = context.get(DatabaseService);
    }

    configService: ConfigService;
    databaseService : DatabaseService;
    filterList: ExceptionFilter[] = [];
    pipeList: PipeTransform<any>[] = [];
    interceptorList: NestInterceptor[] = [];



    static current = async (initConfig: object) => {
        return new CommonInitializer(await NestFactory.create({
            module: GlobalModule,
            imports: [
                ConfigModule.forRoot({ isGlobal: true, load: [() => initConfig] })
            ]
        }));
    }


    active = async () => {
        try {

            for (const item of this.interceptorList) {
                this.context.useGlobalInterceptors(item);
            }
            for (const item of this.filterList) {
                this.context.useGlobalFilters(item);
            }
            for (const item of this.pipeList) {
                this.context.useGlobalPipes(item);
            }

            this.initSwagger();
            this.initNextExpressConfig();

            await this.context.listen(this.configService.get("port") || 13332);
            Logger.log(`Run Server : ${this.configService.get("port") || 13332}`, 'MAIN');

            return this;
        }
        catch (e) {
            Logger.error('Failed Initialization.', 'COMMON_INIT');
            Logger.error((e as Error).stack, 'COMMON_INIT');
        }
    }





    
    usePipe = (func: (reflector: Reflector, configService: ConfigService , databaseService : DatabaseService) => PipeTransform<any>[]) => {
        const list = func(this.getReflector(), this.configService , this.databaseService);
        for (const item of list) {
            this.pipeList.push(item);
        }

        return this;
    }

    useInterceptor = (func: (reflector: Reflector, configService: ConfigService, databaseService : DatabaseService) => NestInterceptor[]) => {
        const list = func(this.getReflector(), this.configService, this.databaseService);
        for (const item of list) {
            this.interceptorList.push(item);
        }

        return this;
    }

    useFilter = (func: (reflector: Reflector, configService: ConfigService, databaseService : DatabaseService) => ExceptionFilter[]) => {
        const list = func(this.getReflector(), this.configService, this.databaseService);
        for (const item of list) {
            this.filterList.push(item);
        }

        return this;
    }









    initSwagger = () => {

        const document = SwaggerModule.createDocument(
            this.context,
            new DocumentBuilder()
                .setTitle('Crepen CDN API Server')
                .setVersion('1.0.0')
                .addBearerAuth({
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT Token',
                    in: 'header'
                }, 'token')
                .build());

        SwaggerModule.setup('api-docs', this.context, document);
    }

    initNextExpressConfig = () => {
        const nestExpressContext = this.context as NestExpressApplication;

        nestExpressContext.disable('x-powered-by');
    }






    getReflector = () => {
        return this.context.get(Reflector);
    }

    getConfigService = () => {
        return this.configService;
    }

    getContext = () => {
        return this.context;
    }
}