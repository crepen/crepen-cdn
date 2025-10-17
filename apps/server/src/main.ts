import { ClassSerializerInterceptor, Logger } from "@nestjs/common";
import { ResponseSnakeCaseConvertInterceptor } from "./lib/extensions/interceptor/snake_case.interceptor";
import { CommonExceptionFilter } from "./lib/extensions/filter/common.exception.filter";
import { CheckConnDBInterceptor } from "./lib/extensions/interceptor/chk-conn-db.interceptor";
import { CommonInitializer } from "./config/initializer/common.initializer";
import { PreContextInitializer } from "./config/initializer/pre-context.initializer";
import { PlatformI18nValidationPipe } from "./app/config/i18n/i18n.validate.pipe";
import { PlayformI18nValidationExceptionFilter } from "./app/config/i18n/i18n.validate.filter";


const bootstrap = async () => {

    const preInit = await PreContextInitializer.setContext();
    await preInit.apply();

    const configData = await preInit.getConfigData();
    const isPreInitState = preInit.getStatus();

    await preInit.dispose();


    if (!isPreInitState) {
        await preInit.dispose();
        Logger.error('Exit Server.', 'PRE_INIT');
        process.exit(1);
    }
    else {
        Logger.log('', 'PRE_INIT')
        Logger.log('Pre init complete', 'PRE_INIT');
        await preInit.dispose();
        Logger.log('', 'PRE_INIT')
        Logger.log('Start common context process', 'PRE_INIT -> COMMON_INIT');
    }

    const appContext = await CommonInitializer.current(configData);

    appContext
        .usePipe((refl, conf) => [
            new PlatformI18nValidationPipe()
        ])
        .useFilter((refl, conf) => [
            new PlayformI18nValidationExceptionFilter(),
            new CommonExceptionFilter()
        ])
        .useInterceptor((refl, conf, db, dynamicConfig) => [
            new ResponseSnakeCaseConvertInterceptor(),
            // new CheckConnDBInterceptor(refl, db, dynamicConfig),
            new ClassSerializerInterceptor(refl),
            // new CheckInitSystemInterceptor(conf)
        ])

    await appContext.active();

    // await (await CommonInitializer.current(preConfigData)).active();
}





void bootstrap();