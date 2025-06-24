'use server'

import { CrepenFolderOperationService } from "@web/services/operation/folder.operation.service";
import { MainAsideMenuLinkItem } from "./link.aside-item.main";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import urlJoin from "url-join";
import { CrepenCookieOperationService } from "@web/services/operation/cookie.operation.service";
import { StringUtil } from "@web/lib/util/string.util";

export const ExplorerMainAsideLinkMenuItem = async () => {

    // let uid = undefined;
    const rootMenuData = await CrepenFolderOperationService.getRootFolder();
    // const rootFolderUidResult = await CrepenCookieOperationService.getRootFolderUid();

    // if (rootFolderUidResult.success && !StringUtil.isEmpty(rootFolderUidResult.data)) {
        
    //     uid = rootFolderUidResult.data ?? '';

    //     console.log("ROOT FOLDER UID : (COOKIE) " , uid)
    // }
    // else {
        
    //     const rootMenuData = await CrepenFolderOperationService.getRootFolder();
    //     uid = rootMenuData.data?.uid ?? '';

    //     console.log("ROOT FOLDER UID : (API) " , uid)
    //     await CrepenCookieOperationService.setRootFolderUid(uid);
    // }


    const explorerUrl = urlJoin('/explorer/folder', rootMenuData.data?.uid ?? '');

    return (
        <MainAsideMenuLinkItem
            link={explorerUrl}
            title='Explorer'
            icon={faFolder}
        />
    )
}