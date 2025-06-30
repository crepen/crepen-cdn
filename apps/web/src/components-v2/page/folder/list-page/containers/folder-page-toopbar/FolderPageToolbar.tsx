import './FolderPageToolbar.scss'
import { FolderUploadFileButton } from '../../controls/toolbar/add-file-button/FolderUploadFileButton'
import { FolderAddChildFolderButton } from '../../controls/toolbar/add-folder-button/FolderAddChildFolderButton'
import { FolderRemoveItemButton } from '../../controls/toolbar/delete-select-item-button/FolderRemoveItemButton'


export const FolderPageToolbar = () => {
    return (
        <div className="cp-page-toolbar">
            {/* <FolderAllItemCheckButton /> */}
            <FolderAddChildFolderButton />
            <FolderUploadFileButton />
            <FolderRemoveItemButton />
        </div>
    )
}