import { Global, Logger, Module } from "@nestjs/common";
import { AcceptLanguageResolver, I18nJsonLoader, I18nModule, QueryResolver } from "nestjs-i18n";
import * as path from 'path';

@Global()
@Module({
    imports: [
        I18nModule.forRootAsync({
            useFactory: () => {

                const filePath  =path.join(__dirname, '../../../public/i18n');
                Logger.log(`Load I18n File : ${filePath}`,'APP_INIT')

                return {
                    fallbackLanguage: 'en',
                    loaderOptions: {
                        path: filePath,
                        watch: true
                    },
                    loader: I18nJsonLoader
                }
            },
            resolvers: [
                { use: QueryResolver, options: ['lang'] },
                AcceptLanguageResolver,
            ]
        })
    ],
    exports: []
})
export class PlatformI18nConfigModule { } 