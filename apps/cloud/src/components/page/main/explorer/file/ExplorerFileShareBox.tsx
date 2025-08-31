'use client'

import { ToggleButton } from "@web/component/global/control/toggle-button/ToggleButton"
import { UpdateFilePublishStateAction } from "@web/lib/actions/FileActions"
import { useClientBasePath } from "@web/lib/module/basepath/ClientBasePathProvider"
import { StringUtil } from "@web/lib/util/StringUtil"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaShareAlt } from "react-icons/fa"
import { LuLoaderCircle } from "react-icons/lu"
import urlJoin from "url-join"

interface ExplorerFileShareBoxProp {
    fileUid: string,
    defaultPublishedState: boolean,
    defaultPublishedLink: string,
    fileName: string
}

export const ExplorerFileShareBox = (prop: ExplorerFileShareBoxProp) => {

    const [isActiveShare, setActiveShare] = useState<boolean>(prop.defaultPublishedState);
    const [isLoading, setLoading] = useState<boolean>(false);
    const basePathHook = useClientBasePath();
    const route = useRouter();


    const requestFileActiveShare = async (changeState: boolean): Promise<boolean> => {
        const updateReq = await UpdateFilePublishStateAction(prop.fileUid, changeState);

        if (updateReq.success !== true) {
            alert(updateReq.message);
        }
        return updateReq.success;
    }



    return (
        <div className='cp-file-shared'>
            <div className='cp-section-header'>
                <div className='cp-title'>
                    <FaShareAlt size={14} />
                    <span>Publish File</span>
                </div>
                <div className='cp-action'>
                    <LuLoaderCircle
                        className="cp-action-loading-icon"
                        fontWeight='bold'
                        size={18}
                        aria-hidden={!isLoading}
                    />
                    <ToggleButton
                        width={30}
                        defaultActiveState={prop.defaultPublishedState}
                        onChange={async (state) => {
                            setLoading(true);
                            const isSuccess = await requestFileActiveShare(state);
                            if (isSuccess === true) {
                                setActiveShare(state);
                            }
                            setLoading(false);
                            return isSuccess;
                        }}
                        hidden={isLoading}
                    />
                </div>
            </div>
            <div
                className={StringUtil.joinClassName('cp-section-content', isActiveShare ? '' : 'cp-hidden')}
            >
                <input
                    type="text"
                    className="cp-share-link-input"
                    readOnly
                    defaultValue={
                        urlJoin(
                            location.origin,
                            basePathHook.getBasePath() === '/' ? '' : basePathHook.getBasePath(),
                            `/api/explorer/file/download/publish/${prop.fileName}`
                        )
                    }
                />
                <button className="cp-link-copy-button">COPY</button>
            </div>

        </div>
    )
}