import { Global, Module } from "@nestjs/common";
import { AcceptLanguageResolver, I18nJsonLoader, I18nModule, QueryResolver } from "nestjs-i18n";
import * as path from 'path';

@Global()
@Module({
    imports: [
        I18nModule.forRootAsync({
            useFactory: () => {

                return {
                    fallbackLanguage: 'en',
                    loaderOptions: {
                        path: path.join(__dirname, '../../public/i18n'),
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