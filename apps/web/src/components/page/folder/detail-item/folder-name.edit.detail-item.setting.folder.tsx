'use client'

import { EditDetialItem } from "./edit.detail-item.setting.folder"
import urlJoin from "url-join"
import { useRouter } from "next/navigation"
import { CrepenBaseError } from "@web/modules/common-1/error/CrepenBaseError"
import { useGlobalBasePath } from "@web/modules/client/state/global.state"

interface EditFolderNameDetailItemProp {
    title : string,
    value? :string,
    folderUid? : string
}

export const EditFolderNameDetailItem = (prop : EditFolderNameDetailItemProp) => {

    const basePath = useGlobalBasePath();
    const route = useRouter();

    const edit = async (value?: string) : Promise<boolean>=> {


        if(prop.value?.trim() === value?.trim()){
         
            return true;
        }

        try{
            const url = urlJoin(basePath.value , '/api/folder' , `?uid=${prop.folderUid}`);
            const fetchResult = await fetch(url , {
                method : "POST",
                body : JSON.stringify(
                    {
                        folderTitle : value
                    }
                )
            })

            const resultData = await fetchResult.json();

         

            route.refresh();
            return true;
        }
        catch(e){
            if(e instanceof CrepenBaseError){
                alert(e.message);
                return false;
            }
            else{
                alert('서버와 연결이 원활하지 않습니다.');
                return false;
            }
        }

        

        return false;
    }

    

    return (
        <EditDetialItem
            title={prop.title}
            value={prop.value}
            onEdit={edit}
        />
    )
}