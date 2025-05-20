import { AcceptLanguageResolver, I18nJsonLoader, I18nOptions, QueryResolver } from "nestjs-i18n";
import { join } from "path";

export const i18nConfig = (): I18nOptions => {

    console.log('I18n Dir : ', join(__dirname, '../../public/i18n/'));

    return {
        fallbackLanguage: 'en',
        loaderOptions: {
            path: join(__dirname, '../../public/i18n'),
            watch: true
        },
        resolvers: [
            { use: QueryResolver, options: ['lang'] },
            AcceptLanguageResolver,
            // {use : AcceptLanguageResolver , options : { matchType : 'strict'}},
            // { use: CrepenI18nResolver, options: {} }
        ],
        loader : I18nJsonLoader
    }
}