import { CommonLayout } from "@web/component/global/CommonLayout";
import { LocaleConfig } from "@web/lib/config/LocaleConfig";
import { ServerLocaleProvider } from "@web/lib/module/locale/ServerLocaleProvider";
import { Metadata } from "next";
import { PropsWithChildren } from "react"


export const generateMetadata = async (): Promise<Metadata> => {
    const localeProv = ServerLocaleProvider.current(LocaleConfig);

    return {
        title: await localeProv.translate('title.explorer')
    }
}


const MainExplorerDefaultLayout = (prop: PropsWithChildren) => {
    return (
        <CommonLayout className="cp-explorer-layout">
            {prop.children}
        </CommonLayout>
    )
}

export default MainExplorerDefaultLayout;