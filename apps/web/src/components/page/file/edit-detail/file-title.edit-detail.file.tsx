'use client'

import { useGlobalBasePath } from "@web/lib/state/global.state"
import { CrepenDetailEditableItem } from "../../common/detail-list/detail-edit-item.common"
import { useRouter } from "next/navigation"
import { CrepenCommonError } from "@web/lib/common/common-error"
import { StringUtil } from "@web/lib/util/string.util"

interface FileTitleEditDetailItemProp {
    title: string,
    value?: string,
    fileUid? : string
}

export const FileTitleEditDetailItem = (prop: FileTitleEditDetailItemProp) => {

    const basePath = useGlobalBasePath();
    const route = useRouter();


    const onSubmitEventHandler = async (value? : string) => {

        try {

            console.log('VALUE : ' , value)

            const fetchRequest = await fetch(`${basePath.value}/api/file/${prop.fileUid ?? 'ntf'}` , {
                method : 'POST',
                body : JSON.stringify({
                    fileTitle : value
                })
            })

            // if(!fetchRequest.ok){
            //     throw new CrepenCommonError('Unknown Error');
            // }

            const data = await fetchRequest.json();

            console.log('RESPONSE' , data);

            

            if(data.success !== true){
                throw new CrepenCommonError(data.message);
            }

            route.refresh();

            return true;
        }
        catch (e) {
            let message = 'Unknown Error';
            if(e instanceof CrepenCommonError){
                if(!StringUtil.isEmpty(e.message)){
                    message = e.message;
                }
            }

            console.log(message);
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