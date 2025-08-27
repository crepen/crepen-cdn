'use client'

import { ToggleButton, ToggleButtonRef } from "@web/component/global/control/toggle-button/ToggleButton"
import { CommonUtil } from "@web/lib/util/CommonUtil"
import { StringUtil } from "@web/lib/util/StringUtil"
import { useRef, useState } from "react"
import { AiOutlineLoading, AiOutlineLoading3Quarters } from "react-icons/ai"
import { FaShareAlt, FaTruckLoading } from "react-icons/fa"
import { LuLoaderCircle } from "react-icons/lu"

interface ExplorerFileShareBoxProp {
    fileUid: string,
    defaultPublishedState: boolean,
    defaultPublishedLink: string
}

export const ExplorerFileShareBox = (prop: ExplorerFileShareBoxProp) => {

    const [isActiveShare, setActiveShare] = useState<boolean>(prop.defaultPublishedState);
    const [isLoading ,setLoading] = useState<boolean>(false);

    const requestFileActiveShare = async () : Promise<boolean> => {
        // await CommonUtil.delay(4000)

        return false;
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
                            
                            const isSuccess = await requestFileActiveShare();

                            if(isSuccess === true){
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
                <input type="text" className="cp-share-link-input" readOnly defaultValue={prop.defaultPublishedLink} />
                <button className="cp-link-copy-button">COPY</button>
            </div>

        </div>
    )
}