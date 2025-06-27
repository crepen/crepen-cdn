'use server'

import { Fragment } from "react"
import { DetectDeviceConfig } from "../device-detect/DetectDeviceConfig"
import { CrepenLoadingBox } from "../../loading/CrepenLoadingBox"

export const InitSiteConfig = async () => {

    

    return (
        <Fragment>
            <DetectDeviceConfig />


            <CrepenLoadingBox />
        </Fragment>
    )
}