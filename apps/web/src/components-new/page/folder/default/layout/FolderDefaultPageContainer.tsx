'use server'

import { CommonDefaultPageLayout } from '../../../common/CommonDefaultPageLayout'
import './FolderDefaultPageContainer.scss'
import { Fragment } from 'react'
import { FolderFileListContainer } from '../containers/FolderFileListContainer'
import { CrepenFolder } from '@web/modules/crepen/explorer/folder/dto/CrepenFolder'
import { FolderActionBarContainer } from '../containers/FolderActionBarContainer'
import { CommonDefaultPageHeader } from '../../../common/CommonDefaultPageHeader'
import { CommonDefaultPageTitle } from '../../../common/CommonDefaultPageTitle'
import { CommonDefaultPageContent } from '../../../common/CommonDefaultPageContent'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder } from '@fortawesome/free-regular-svg-icons'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { CrepenContentGroupBox } from '@web/components-new/common/controls/content-box/CrepenContentGroupBox'

interface FolderDefaultPageContainerProp {
    data?: CrepenFolder
}

export const FolderDefaultPageContainer = async (prop: FolderDefaultPageContainerProp) => {

    return (
        <Fragment>
            <CommonDefaultPageLayout
                className='cp-folder-default-page'
            >
                <CrepenContentGroupBox>



                    {/* <CommonDefaultPageHeader>
                        <CommonDefaultPageTitle>
                            <FontAwesomeIcon
                                icon={faFolder}
                                className='cp-page-title-folder-icon'
                            />
                            {prop.data?.folderTitle}
                            <Link
                                href={`/explorer/folder/${prop.data?.uid}/setting`}
                                prefetch={false}
                            >
                                <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    className='cp-page-title-info-icon'
                                />
                            </Link>
                        </CommonDefaultPageTitle>
                        <FolderActionBarContainer
                            data={prop.data}
                        />
                        <hr />
                    </CommonDefaultPageHeader>
                    <CommonDefaultPageContent>
                        <FolderFileListContainer
                            data={prop.data}
                        />
                    </CommonDefaultPageContent> */}



                </CrepenContentGroupBox>

            </CommonDefaultPageLayout>


        </Fragment>

    )
}