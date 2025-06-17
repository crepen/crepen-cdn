'use server'

import { CommonPageError } from "@web/components/page/common/error-page.common";
import { StringUtil } from "@web/lib/util/string.util";
import { Params } from "next/dist/server/request/params";
import { SearchParams } from "next/dist/server/request/search-params";


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
                    : <AddFileForm folderUid={folderUid!} />
            }
        </div>
    )
}

interface AddFileFormProp {
    folderUid: string
}

const AddFileForm = (prop: AddFileFormProp) => {
    return (
        <div>{prop.folderUid}</div>
    )
    
}

export default ExplorerDefaultAddFileRoutePage;