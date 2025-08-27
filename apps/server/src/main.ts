import { ClassSerializerInterceptor } from "@nestjs/common";
import { CheckInitSystemInterceptor } from "./lib/extensions/interceptor/chk-system-init.interceptor";
import { ResponseSnakeCaseConvertInterceptor } from "./lib/extensions/interceptor/snake_case.interceptor";
import { CommonExceptionFilter } from "./lib/extensions/filter/common.exception.filter";
import { CheckConnDBInterceptor } from "./lib/extensions/interceptor/chk-conn-db.interceptor";
import { PlatformI18nValidationPipe } from "./module/config/i18n/i18n.validate.pipe";
import { PlayformI18nValidationExceptionFilter } from "./module/config/i18n/i18n.validate.filter";
import { PreInitializer } from "./config/initializer/pre.initializer";
import { CommonInitializer } from "./config/initializer/common.initializer";

const bootstrap = async () => {

    console.log("=====================================================================")
    console.log("CREPEN_CDN_NEST_PORT : ",  process.env.CREPEN_CDN_NEST_PORT);
    console.log("=====================================================================")

    // throw new Error(process.env.CREPEN_CDN_NEST_PORT);

    const preInitAppContext = (await (await PreInitializer.current()).active());
   
    const preConfigData = preInitAppContext.getPreConfig();
      
    await preInitAppContext.destroy();


    console.log("=====================================================================")

    const appContext = await CommonInitializer.current(preConfigData);

    appContext
        .usePipe((refl, conf) => [
            new PlatformI18nValidationPipe()
        ])
        .useFilter((refl, conf) => [
            new PlayformI18nValidationExceptionFilter(),
            new CommonExceptionFilter()
        ])
        .useInterceptor((refl, conf , db) => [
            new ResponseSnakeCaseConvertInterceptor(),
            new CheckConnDBInterceptor(refl, conf , db),
            new ClassSerializerInterceptor(refl),
            new CheckInitSystemInterceptor(conf)
        ])

    await appContext.active();

    // await (await CommonInitializer.current(preConfigData)).active();
}





void bootstrap();