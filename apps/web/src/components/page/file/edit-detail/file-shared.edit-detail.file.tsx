'use client'

import { useGlobalBasePath } from "@web/lib/state/global.state"
import { CrepenDetailEditableItem } from "../../common/detail-list/detail-edit-item.common"
import { useRouter } from "next/navigation"
import { CrepenCommonError } from "@web/lib/common/common-error"
import { StringUtil } from "@web/lib/util/string.util"
import { CrepenDetailItem } from "../../common/detail-list/detail-item.common"
import { CrepenToggleButton } from "../../common/toggle-button/toggle-button.common"

interface FileSharedEditDetailItemProp {
    title: string,
    value?: boolean,
    fileUid?: string
}

export const FileSharedEditDetailItem = (prop: FileSharedEditDetailItemProp) => {

    const basePath = useGlobalBasePath();
    const route = useRouter();


    const onSubmitEventHandler = async (value?: boolean) => {

        try {

            console.log('VALUE : ', value)

            const fetchRequest = await fetch(`${basePath.value}/api/file/${prop.fileUid ?? 'ntf'}`, {
                method: 'POST',
                body: JSON.stringify({
                    isShared: value
                })
            })



            // if (!fetchRequest.ok) {
            //     throw new CrepenCommonError('Unknown Error');
            // }

            const data = await fetchRequest.json();

            console.log('RESPONSE', data);



            if (data.success !== true) {
                throw new CrepenCommonError(data.message);
            }

            route.refresh();

            return true;
        }
        catch (e) {
            let message = 'Unknown Error';
            if (e instanceof CrepenCommonError) {
                if (!StringUtil.isEmpty(e.message)) {
                    message = e.message;
                }
            }

            console.log(message);
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