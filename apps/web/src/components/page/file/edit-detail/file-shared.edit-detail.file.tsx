'use client'

import { useRouter } from "next/navigation"
import { StringUtil } from "@web/lib/util/string.util"
import { CrepenDetailItem } from "../../common/detail-list/detail-item.common"
import { CommonToggleButton } from "../../common/toggle-button/toggle-button.common"
import { CrepenComponentError } from "@web/modules/common-1/error/CrepenComponentError"
import { FileAction } from "@web/modules/server/action"
import { useGlobalLoading } from "@web/component/config/GlobalLoadingProvider"
import { useGlobalLocale } from "@web/component/config/GlobalLocaleProvider"

interface FileSharedEditDetailItemProp {
    title: string,
    value?: boolean,
    fileUid?: string
}

export const FileSharedEditDetailItem = (prop: FileSharedEditDetailItemProp) => {

     const globalLoading = useGlobalLoading();
    const route = useRouter();
    const localeTranslate = useGlobalLocale();


    const onSubmitEventHandler = async (value?: boolean) => {

        try {

  globalLoading.setState(true);
            const requestAction = await FileAction.editFile({
                uid : prop.fileUid,
                isPubished : value
            })


            // const apiUrl = urlJoin(basePathHook.basePath, '/api/file', prop.fileUid ?? 'ntf')

            // const fetchRequest = await fetch(apiUrl, {
            //     method: 'POST',
            //     body: JSON.stringify({
            //         isPublished: value
            //     })
            // })



            // // if (!fetchRequest.ok) {
            // //     throw new CrepenCommonError('Unknown Error');
            // // }

            // const data = await fetchRequest.json();




            if (requestAction.success !== true) {
                throw new CrepenComponentError(requestAction.message);
            }

              globalLoading.setState(false);

            route.refresh();

            return true;
        }
        catch (e) {
            let message = localeTranslate.getTranslation('common.system.UNKNOWN_ERROR');
            
            if (e instanceof CrepenComponentError) {
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
            <CommonToggleButton
                defaultState={prop.value ?? false}
                onChange={async (value) => {
                    return await onSubmitEventHandler(value);
                }}
            />
        </CrepenDetailItem>

    )
}