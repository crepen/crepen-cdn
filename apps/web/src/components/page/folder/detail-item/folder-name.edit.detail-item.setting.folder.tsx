'use client'

import { useGlobalBasePath } from "@web/lib/state/global.state"
import { EditDetialItem } from "./edit.detail-item.setting.folder"
import urlJoin from "url-join"
import { useRouter } from "next/navigation"
import { CrepenBaseError } from "@web/modules/common/error/CrepenBaseError"

interface EditFolderNameDetailItemProp {
    title : string,
    value? :string,
    folderUid? : string
}

export const EditFolderNameDetailItem = (prop : EditFolderNameDetailItemProp) => {

    const basePath = useGlobalBasePath();
    const route = useRouter();

    const edit = async (value?: string) : Promise<boolean>=> {

        console.log('FOLDER UID' , prop.folderUid);
        console.log("ORIGIN DATA" , prop.value);
        console.log("EDIT DATA" , value);

        if(prop.value?.trim() === value?.trim()){
            console.log('NOT EDIT')
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

            console.log(resultData);

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