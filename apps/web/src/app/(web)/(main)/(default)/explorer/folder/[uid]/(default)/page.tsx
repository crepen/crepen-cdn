import { FolderDefaultPageContainer } from "@web/components-new/page/folder/default/FolderDefaultPageContainer";
import { CrepenFolderOperationService } from "../../../../../../../../modules/crepen/explorer/folder/CrepenFolderOperationService";
import Head from "next/head";
import { Fragment } from "react";

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
                folderData.success === true &&
                <FolderDefaultPageContainer
                    data={folderData.data}
                />
            }
            {
                folderData.success !== true &&
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