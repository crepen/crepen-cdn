'use server'

import { CrepenHttpService } from "@web/services/common/http.service";
import { CrepenFolderOperationService } from "@web/services/operation/folder.operation.service";
import { redirect } from "next/navigation";
import { Fragment } from "react";

const ExplorerDefaultFolderRoutePage = async () => {

    const ss = await CrepenFolderOperationService.getRootFolder();
    const baseUrl = await CrepenHttpService.getUrl();
    const redirectUrl = new URL(`${ss.data?.uid ?? 'not-found'}`, baseUrl + '/').toString();
    redirect(redirectUrl);

    return (
        <Fragment>
            {baseUrl} <br />
            {redirectUrl}
        </Fragment>
    )
}

export default ExplorerDefaultFolderRoutePage;