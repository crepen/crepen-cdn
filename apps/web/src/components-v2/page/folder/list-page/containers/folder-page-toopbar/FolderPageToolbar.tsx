import './FolderPageToolbar.scss'
import { FolderUploadFileButton } from '../../controls/toolbar/add-file-button/FolderUploadFileButton'
import { FolderAddChildFolderButton } from '../../controls/toolbar/add-folder-button/FolderAddChildFolderButton'
import { FolderRemoveItemButton } from '../../controls/toolbar/delete-select-item-button/FolderRemoveItemButton'
import { FolderAllItemCheckButton } from '../../controls/toolbar/all-item-check-button/FolderAllItemCheckButton'


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