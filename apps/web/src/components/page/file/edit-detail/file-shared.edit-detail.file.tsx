'use client'

import { useRouter } from "next/navigation"
import { StringUtil } from "@web/lib/util/string.util"
import { CrepenDetailItem } from "../../common/detail-list/detail-item.common"
import { CrepenToggleButton } from "../../common/toggle-button/toggle-button.common"
import { CrepenComponentError } from "@web/modules/common-1/error/CrepenComponentError"
import { CrepenBaseError } from "@web/modules/common-1/error/CrepenBaseError"
import urlJoin from "url-join"
import { useGlobalBasePath } from "@web/component/config/GlobalBasePathProvider"

interface FileSharedEditDetailItemProp {
    title: string,
    value?: boolean,
    fileUid?: string
}

export const FileSharedEditDetailItem = (prop: FileSharedEditDetailItemProp) => {

    const basePathHook = useGlobalBasePath();
    const route = useRouter();


    const onSubmitEventHandler = async (value?: boolean) => {

        try {


            const apiUrl = urlJoin(basePathHook.basePath, '/api/file', prop.fileUid ?? 'ntf')

            const fetchRequest = await fetch(apiUrl, {
                method: 'POST',
                body: JSON.stringify({
                    isPublished: value
                })
            })



            // if (!fetchRequest.ok) {
            //     throw new CrepenCommonError('Unknown Error');
            // }

            const data = await fetchRequest.json();




            if (data.success !== true) {
                throw new CrepenComponentError(data.message);
            }

            route.refresh();

            return true;
        }
        catch (e) {
            let message = 'Unknown Error';
            if (e instanceof CrepenBaseError) {
                if (!StringUtil.isEmpty(e.message)) {
                    message = e.message;
                }
            }

            alert(message);

            return false;
        }


    }

    return (
        <CrepenDetailItem
            title={prop.title}
        >
            <CrepenToggleButton
                defaultState={prop.value ?? false}
                onChange={async (value) => {
                    return await onSubmitEventHandler(value);
                }}
            />
        </CrepenDetailItem>

    )
}