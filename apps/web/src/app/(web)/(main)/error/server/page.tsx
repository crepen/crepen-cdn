import { ServerLocaleProvider } from "@web/lib/modules/common/i18n/ServerLocaleProvider";
import Link from "next/link";
import { LocaleConfig } from "../../../../../config/locale/locale.config";

const ServerConnectErrorRoutePage = async () => {

    const ee= await ServerLocaleProvider.current(LocaleConfig).getLocaleFileData('ko');

    return (
        <div className="cp-error-page">
            SERVER CONNECT ERROR


            <Link href={'/'} >Home</Link>
        </div>
    )
}

export default ServerConnectErrorRoutePage;