import { MouseEvent } from "react";
import { BaseFolderItem } from "./BaseFolderItem"
import { useRouter } from "next/navigation";

interface MoveParentFolderItemProp {
    parentFolderUid? : string
}

export const MoveParentFolderItem = (prop : MoveParentFolderItemProp) => {
  const router = useRouter();
    const eventHandler = {
        onDoubleClick: (e: MouseEvent<HTMLDivElement>) => {
            router.push(`/explorer/folder/${prop.parentFolderUid ?? 'ntf'}`)
        }
    }

    return (
        <BaseFolderItem
            className="cp-move-parent-folder"
            type="folder"
            value="상위 폴더"
            onDoubleClick={eventHandler.onDoubleClick}
            data-type='folder'
        />
    )
}