import { DynamicModule, Global, InjectionToken, Module, OptionalFactoryDependency, Provider, Type } from "@nestjs/common";
import { CrepenDatabaseService } from "./database.config.service";
import { ConfigModule, ConfigService } from "@nestjs/config";

export const MODULE_OPTIONS_TOKEN = 'DATABASE_MODULE_OPTIONS';

export interface CrepenDatabaseModuleOptions {
  ttt : number
}

export interface CrepenDatabaseModuleAsyncOptions {
    imports?: Array<Type<any> | DynamicModule>;
    useFactory?: (...args: any[]) => Promise<CrepenDatabaseModuleOptions> | CrepenDatabaseModuleOptions;
    inject?: (InjectionToken | OptionalFactoryDependency)[];
    useClass?: Type<CrepenDatabaseModuleOptionFactory>;
    useExisting?: Type<CrepenDatabaseModuleOptionFactory>;
}

export interface CrepenDatabaseModuleOptionFactory {
  createDatabaseModuleOptions(): Promise<CrepenDatabaseModuleOptions> | CrepenDatabaseModuleOptions;
}


@Global()
@Module({
    imports : [ConfigModule],
    // providers : [
    //     {
    //         provide : CrepenDatabaseService,
    //         useFactory : (configService : ConfigService) : CrepenDatabaseModuleOptions => {
    //             return {
    //                 ttt : 1
    //             }
    //         },
    //         inject : [ConfigService]
    //     }
    // ],
    providers : [CrepenDatabaseService],
    exports : [CrepenDatabaseService]
})
export class CrepenDatabaseModule {
    // static forRootAsync(options: CrepenDatabaseModuleAsyncOptions = {}): DynamicModule {
    //     const providers: Provider[] = [CrepenDatabaseService];

    //     // useFactory 방식
    //     if (options.useFactory) {
    //         providers.push({
    //             provide: MODULE_OPTIONS_TOKEN,
    //             useFactory: options.useFactory,
    //             inject: options.inject || [],
    //         });
    //     }
    //     // useClass 방식
    //     else if (options.useClass) {
    //         providers.push(
    //             {
    //                 provide: MODULE_OPTIONS_TOKEN,
    //                 useFactory: async (optionsFactory: CrepenDatabaseModuleOptionFactory) =>
    //                     await optionsFactory.createDatabaseModuleOptions(),
    //                 inject: [options.useClass],
    //             },
    //             {
    //                 provide: options.useClass,
    //                 useClass: options.useClass,
    //             },
    //         );
    //     }
    //     // useExisting 방식 (useClass와 유사하지만 기존 프로바이더를 사용)
    //     else if (options.useExisting) {
    //         providers.push({
    //             provide: MODULE_OPTIONS_TOKEN,
    //             useFactory: async (optionsFactory: CrepenDatabaseModuleOptionFactory) =>
    //                 await optionsFactory.createDatabaseModuleOptions(),
    //             inject: [options.useExisting],
    //         });
    //     }

    //     console.log(providers , options.imports);

    //     return {
    //         module: CrepenDatabaseModule,
    //         imports: options.imports || [], // 비동기 설정을 위한 의존 모듈 임포트
    //         providers: providers,
    //         exports: providers,
    //         global: true, // 일반적으로 forRootAsync는 전역으로 많이 사용됩니다.
    //     };
    // }
}