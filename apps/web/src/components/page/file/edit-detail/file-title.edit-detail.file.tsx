'use client'

import { CrepenDetailEditableItem } from "../../common/detail-list/detail-edit-item.common"
import { useRouter } from "next/navigation"
import { StringUtil } from "@web/lib/util/string.util"
import { CrepenComponentError } from "@web/modules/common-1/error/CrepenComponentError"
import { FileAction } from "@web/modules/server/action"
import { useGlobalLoading } from "@web/component/config/GlobalLoadingProvider"
import { useGlobalLocale } from "@web/component/config/GlobalLocaleProvider"

interface FileTitleEditDetailItemProp {
    title: string,
    value?: string,
    fileUid?: string
}

export const FileTitleEditDetailItem = (prop: FileTitleEditDetailItemProp) => {

    const globalLoading = useGlobalLoading();
    const route = useRouter();
        const localeTranslate = useGlobalLocale();


    const onSubmitEventHandler = async (value?: string) => {

        try {

            globalLoading.setState(true);

            const editRequest = await FileAction.editFile({
                uid : prop.fileUid,
                fileTitle : value
            })

            // const fetchRequest = await fetch(basePath.join(`/api/file/${prop.fileUid ?? 'ntf'}`), {
            //     method: 'POST',
            //     body: JSON.stringify({
            //         fileTitle: value
            //     })
            // })

            // // if(!fetchRequest.ok){
            // //     throw new CrepenCommonError('Unknown Error');
            // // }

            // const data = await fetchRequest.json();




            if (editRequest.success !== true) {
                throw new CrepenComponentError(editRequest.message);
            }

            route.refresh();

            globalLoading.setState(false);

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
        <CrepenDetailEditableItem
            title={prop.title}
            value={prop.value}
            onSubmit={onSubmitEventHandler}
        />
    )
}