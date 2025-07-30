import { Fragment } from "react";
import { FolderListPageLayout } from "@web/components-v2/page/folder/list-page/layout/FolderListPageLayout";
import { ObjectUtil } from "@web/lib/util/object.util";
import { FolderDataService } from "@web/lib/modules/api-server/service/FolderDataService";
import { FolderEntity } from "@web/lib/modules/api-server/entity/object/FolderEntity";

interface ExplorerFolderRoutePageProp {
    params: Promise<{
        uid?: string
    }>
}

export const metadata = {
    title: 'CrepenCDN | Explorer',
};

const ExplorerFolderRoutePage = async (prop: ExplorerFolderRoutePageProp) => {

    const targetFolderUid = (await prop.params).uid;

    // const folderData = await CrepenFolderOperationService.getFolderData(targetFolderUid, true);

    let folderData: FolderEntity | undefined = undefined;

    try {
        folderData = await FolderDataService.getFolderData(targetFolderUid, {
            includeChild: true
        })
    }
    catch (e) {/** empty */ }



    return (
        <Fragment>
            {
                folderData !== undefined
                    ?
                    <FolderListPageLayout
                        data={ObjectUtil.classToPlaneObject<FolderEntity>(folderData)}
                    />
                    :
                    <div
                        className="cp-error"
                        data-error-code={404}
                    >
                        {'Not Found'}
                    </div>
            }
        </Fragment>
    )
}

export default ExplorerFolderRoutePage;