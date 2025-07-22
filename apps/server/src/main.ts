import { NestFactory, Reflector } from "@nestjs/core"
import { GlobalModule } from "./global.module"
import { ClassSerializerInterceptor, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CrepenI18nValidationPipe } from "./config/i18n/i18n.validate.pipe";
import { CrepenI18nValidationExceptionFilter } from "./config/i18n/i18n.validate.filter";
import { ExceptionResponseFilter } from "./module/config/filter/ex.response.filter";
import { NestExpressApplication } from "@nestjs/platform-express";
import { CrepenSystemError } from "./lib/exception/crepen.system.exception";
import { CheckConnDBInterceptor } from "./module/decorator/chk-conn-db/chk-conn-db.interceptor";
import { CrepenSwaggerConfig } from "./module/config/swagger/swagger.config";
import { CrepenNestExpressConfig } from "./module/config/nest-express/express.config";
import { CrepenInitProvider } from "./module/config/provider/init-provider";

const bootstrap = async () => {
    // const loggerService = new CrepenLoggerConfigService(undefined, new CrepenSystemService())

    const app = await NestFactory.create(GlobalModule, {
        // logger: loggerService.getWinstonLogger(),
    });

    const config = app.get(ConfigService);
    // const envService = app.get(CrepenEnvConfigService);

    // console.log('CONFIG', envService)


    app.useGlobalPipes(new CrepenI18nValidationPipe());
    app.useGlobalFilters(new CrepenI18nValidationExceptionFilter());
    app.useGlobalFilters(new ExceptionResponseFilter());
    app.useGlobalInterceptors(new CheckConnDBInterceptor(app.get(Reflector)));


    CrepenSwaggerConfig.setup(app);


    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));




    CrepenNestExpressConfig.setup(app as NestExpressApplication);

    // await app.get(CrepenSystemService).initDatabase();




    // const validateConfigState = await envService.validConfigData();


    try {
        void await CrepenInitProvider.init(config);
    }
    catch (e) {
        if(e instanceof CrepenSystemError){
            Logger.error(e.message , e.context);

            if(e.cause){
                Logger.error(e.cause)
            }
        }
        else if(e instanceof Error){
            Logger.error(e.message , 'SYSTEM')
        }
        
        process.exit(1)
    }


    // console.log("CONFIG" , config);



    // if (validateConfigState === true) {
        await app.listen(config.get("server.port"));
        Logger.log(`Run Server : ${config.get("server.port")}`, undefined, 'MAIN')
    // }

}


void bootstrap();