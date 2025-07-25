'use server'

import { CommonPageError } from "@web/components/page/common/error-page.common";
import { StringUtil } from "@web/lib/util/string.util";
import { Params } from "next/dist/server/request/params";
import '@web/assets/style/cloud/page/file/add.file.scss'
import { AddFilePageContext } from "@web/components/page/file/add-context.file";


interface ExplorerDefaultAddFileRoutePageProp {
    params: Params,
    searchParams: Promise<{ [key: string]: string | undefined }>;
}

const ExplorerDefaultAddFileRoutePage = async (prop: ExplorerDefaultAddFileRoutePageProp) => {

    const errorState: { state?: boolean, message?: string } = { state: true };
    const folderUid = (await prop.searchParams).folder;

    if (StringUtil.isEmpty((folderUid))) {
        errorState.state = false;
        errorState.message = '잘못된 접근입니다.'
    }

    return (
        <div className="cp-common-page cp-file-add-page">
            {
                errorState.state !== true
                    ? <CommonPageError />
                    // : <AddFileForm folderUid={folderUid!} />
                    : <AddFilePageContext />
            }
        </div>
    )
}



export default ExplorerDefaultAddFileRoutePage;