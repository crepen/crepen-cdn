import { LocaleConfig } from "@web/lib/config/LocaleConfig";
import { ServerLocaleProvider } from "@web/lib/module/locale/ServerLocaleProvider";
import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const generateMetadata = async () : Promise<Metadata> => {
     const localeProv = ServerLocaleProvider.current(LocaleConfig);

    return {
        title : await localeProv.translate('title.profile')
    }
}



const MainProfileLayout = (prop : PropsWithChildren) => {
    return (
        <div>
            {prop.children}
        </div>
    )
}

export default MainProfileLayout;