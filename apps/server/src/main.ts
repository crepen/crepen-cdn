import { NestFactory, Reflector } from "@nestjs/core"
import { GlobalModule } from "./global.module"
import { ClassSerializerInterceptor, DynamicModule, Logger, Module, Type } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CrepenI18nValidationPipe } from "./config/i18n/i18n.validate.pipe";
import { CrepenI18nValidationExceptionFilter } from "./config/i18n/i18n.validate.filter";
import { ExceptionResponseFilter } from "./module/config/filter/ex.response.filter";
import { NestExpressApplication } from "@nestjs/platform-express";
import { CrepenSystemError } from "./lib/error/system/common.system.error";
import { CrepenSwaggerConfig } from "./module/config/swagger/swagger.config";
import { CrepenNestExpressConfig } from "./module/config/nest-express/express.config";
import { CrepenInitProvider } from "./module/config/provider/init-provider";
import { CheckConnDBInterceptor } from "./module/extension/chk-conn-db/chk-conn-db.interceptor";
import { CheckInitSystemInterceptor } from "./module/extension/chk-system-init/chk-system-init.interceptor";
import { ResponseSnakeCaseConvertInterceptor } from "./module/extension/response-snake-case/snake_case.interceptor";

const bootstrap = async () => {

    const preApp = await NestFactory.createApplicationContext(applyAppModule(PreAppModule) );
    const preConfig = preApp.get(ConfigService);

    try {
        void await CrepenInitProvider.init(preConfig);
    }
    catch (e) {
        if (e instanceof CrepenSystemError) {
            Logger.error(e.message, e.context);

            if (e.cause && process.env.NODE_ENV === 'dev') {
                Logger.error(e.cause)
            }
        }
        else if (e instanceof Error) {
            Logger.error(e.message, 'SYSTEM')
        }

        process.exit(1)
    }


    const configData = preConfig.get<object>('root');

    void preApp.close();

    console.log("=====================================================================")

    const app = await NestFactory.create(applyAppModule(GlobalModule, configData));
    const config = app.get(ConfigService);


    app.useGlobalPipes(new CrepenI18nValidationPipe());
    app.useGlobalFilters(new CrepenI18nValidationExceptionFilter());
    app.useGlobalFilters(new ExceptionResponseFilter());
    app.useGlobalInterceptors(new ResponseSnakeCaseConvertInterceptor());
    app.useGlobalInterceptors(new CheckConnDBInterceptor(app.get(Reflector)));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    app.useGlobalInterceptors(new CheckInitSystemInterceptor(config))

    CrepenSwaggerConfig.setup(app);
    CrepenNestExpressConfig.setup(app as NestExpressApplication);



    await app.listen(config.get("server.port") || 13332);
    Logger.log(`Run Server : ${config.get("server.port") || 13332}`, 'MAIN')
}


export const applyAppModule = (module: Type<any>, configData?: object): DynamicModule => {
    return {
        module: module,
        imports: [
            ConfigModule.forRoot({ isGlobal: true, load: [() => configData] })
        ]
    }
}

@Module({})
class PreAppModule { }


void bootstrap();