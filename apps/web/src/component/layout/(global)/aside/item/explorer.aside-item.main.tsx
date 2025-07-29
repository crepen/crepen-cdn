'use server'

import { MainAsideMenuLinkItem } from "./link.aside-item.main";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { ServerI18nProvider } from "@web/modules/server/i18n/ServerI18nProvider";
import { AuthSessionProvider } from "@web/modules/server/service/AuthSessionProvider";
import urlJoin from "url-join";

export const ExplorerMainAsideLinkMenuItem = async () => {

    const sessionData = await AuthSessionProvider.getSessionData();


    const explorerUrl = urlJoin('/explorer/folder', sessionData.rootFolder?.uid ?? 'ntf');

    return (
        <MainAsideMenuLinkItem
            link={explorerUrl}
            title={await ServerI18nProvider.getSystemTranslationText('layout.aside.MENU_LABEL_EXPLORER') ?? "Explorer"}
            icon={faFolder}
        />
    )
}