import './folder.link-button.folder.scss';

import { BaseLinkButton } from "./base.link-button.folder"
import { CrepenFolder } from "@web/services/types/object/folder.object"

interface FolderLinkButtonProp {
    link : string,
    className? : string,
    folder : CrepenFolder,
}

export const FolderLinkButton = (prop : FolderLinkButtonProp) => {
    return (
        <BaseLinkButton
            link={`/explorer/folder/${prop.folder.uid}`}
            className={'cp-folder-link-bt'}
            value={prop.folder.folderTitle}
        />
    )
}