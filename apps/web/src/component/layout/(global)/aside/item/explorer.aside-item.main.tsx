'use server'

import { MainAsideMenuLinkItem } from "./link.aside-item.main";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { AuthSessionProvider } from "@web/modules/server/service/AuthSessionProvider";
import urlJoin from "url-join";

export const ExplorerMainAsideLinkMenuItem = async () => {

    const sessionData = await AuthSessionProvider.getSessionData();


    const explorerUrl = urlJoin('/explorer/folder', sessionData.rootFolder?.uid ?? 'ntf');

    return (
        <MainAsideMenuLinkItem
            link={explorerUrl}
            title='Explorer'
            icon={faFolder}
        />
    )
}