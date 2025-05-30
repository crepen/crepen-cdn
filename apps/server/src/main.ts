import { NestFactory, Reflector } from "@nestjs/core"
import { GlobalModule } from "./global.module"
import { CrepenEnvConfigService } from "./config/env/env.service";
import { ClassSerializerInterceptor, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CrepenLoggerConfigService } from "./config/logger/logger.service";
import { CrepenI18nValidationPipe } from "./config/i18n/i18n.validate.pipe";
import { CrepenI18nValidationExceptionFilter } from "./config/i18n/i18n.validate.filter";
import { CrepenSwaggerConfig } from "./config/swagger/swagger.config";
import { ExceptionResponseFilter } from "./config/common/ex.response.filter";
import { NestExpressApplication } from "@nestjs/platform-express";
import { CrepenNestExpressConfig } from "./config/nest-express/express.config";
import { CrepenSystemService } from "./app/system/system.service";

const bootstrap = async () => {
    const loggerService = new CrepenLoggerConfigService(undefined, new CrepenSystemService())

    const app = await NestFactory.create(GlobalModule, {
        logger: loggerService.getWinstonLogger(),
    });

    const config = app.get(ConfigService);
    const envService = app.get(CrepenEnvConfigService);


    app.useGlobalPipes(new CrepenI18nValidationPipe());
    app.useGlobalFilters(new CrepenI18nValidationExceptionFilter());
    app.useGlobalFilters(new ExceptionResponseFilter());


    CrepenSwaggerConfig.setup(app);


    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));




    CrepenNestExpressConfig.setup(app as NestExpressApplication);

    await app.get(CrepenSystemService).initDatabase();




    const validateConfigState = await envService.validConfigData();

    if (validateConfigState === true) {
        await app.listen(config.get("server.port"));
        Logger.log(`Run Server : ${config.get("server.port")}`, undefined, 'MAIN')
    }

}


void bootstrap();