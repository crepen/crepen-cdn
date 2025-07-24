'use server'

import { CrepenFolderOperationService } from "@web/modules/crepen/service/explorer/folder/CrepenFolderOperationService";
import { CrepenHttpService } from "@web/services/common/http.service";
import { redirect } from "next/navigation";

const ExplorerDefaultFolderRoutePage = async () => {

    const ss = await CrepenFolderOperationService.getRootFolder();
    const baseUrl = await CrepenHttpService.getUrl();
    const pathname = new URL(baseUrl!).pathname;

    redirect(`${pathname}/${ss.data?.uid ?? 'not-found'}`);
}

export default ExplorerDefaultFolderRoutePage;