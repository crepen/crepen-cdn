import { Fragment } from "react";
import { FolderListPageLayout } from "@web/components-v2/page/folder/list-page/layout/FolderListPageLayout";
import { CrepenFolderOperationService } from "@web/modules/crepen/service/explorer/folder/CrepenFolderOperationService";

interface ExplorerFolderRoutePageProp {
    params: Promise<{
        uid?: string
    }>
}

export const metadata = {
    title: 'CrepenCDN | Explorer',
};

export const ExplorerFolderRoutePage = async (prop: ExplorerFolderRoutePageProp) => {

    const targetFolderUid = (await prop.params).uid;

    const folderData = await CrepenFolderOperationService.getFolderData(targetFolderUid, true);


    return (
        <Fragment>
            {
                (folderData.success === true && folderData.data) &&
                <FolderListPageLayout
                    data={folderData.data!}
                />
            }
            {
                (folderData.success !== true || folderData.data === undefined || folderData.data === null) &&
                <div
                    className="cp-error"
                    data-error-code={folderData.errorCode}
                >
                    {folderData.message}
                </div>
            }

        </Fragment>
    )
}

export default ExplorerFolderRoutePage;