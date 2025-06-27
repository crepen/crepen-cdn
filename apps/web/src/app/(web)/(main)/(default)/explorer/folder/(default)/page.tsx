'use server'

import { CrepenHttpService } from "@web/services/common/http.service";
import { CrepenFolderOperationService } from "../../../../../../../modules/crepen/explorer/folder/CrepenFolderOperationService";
import { redirect } from "next/navigation";

const ExplorerDefaultFolderRoutePage = async () => {

    const ss = await CrepenFolderOperationService.getRootFolder();
    const baseUrl = await CrepenHttpService.getUrl();
    const pathname = new URL(baseUrl!).pathname;

    redirect(`${pathname}/${ss.data?.uid ?? 'not-found'}`);
}

export default ExplorerDefaultFolderRoutePage;