'use server'

import { CrepenFolderOperationService } from "../../../../../modules/crepen/explorer/folder/CrepenFolderOperationService";
import { MainAsideMenuLinkItem } from "./link.aside-item.main";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import urlJoin from "url-join";
import { CrepenCookieOperationService } from "@web/services/operation/cookie.operation.service";
import { StringUtil } from "@web/lib/util/string.util";

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