'use server'

import { MainAsideMenuLinkItem } from "./link.aside-item.main";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { CrepenFolderOperationService } from "@web/modules/crepen/service/explorer/folder/CrepenFolderOperationService";
import urlJoin from "url-join";

export const ExplorerMainAsideLinkMenuItem = async () => {

    const rootMenuData = await CrepenFolderOperationService.getRootFolder();


    const explorerUrl = urlJoin('/explorer/folder', rootMenuData.data?.uid ?? '');

    return (
        <MainAsideMenuLinkItem
            link={explorerUrl}
            title='Explorer'
            icon={faFolder}
        />
    )
}