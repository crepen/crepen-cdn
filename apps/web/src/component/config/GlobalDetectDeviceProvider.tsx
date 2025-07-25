'use client'

import { useCheckMobileAgent } from "@web/lib/hook/useCheckMobileAgent";
import { Fragment, useEffect, useState } from "react"

type DeviceType = 'mobile' | 'tablet' | 'labtop' | 'desktop' | 'big-screen';

export const GlobalDetectDeviceProvider = () => {

    const screenData = {
        MOBILE: 576,
        TABLET: 768,
        LABTOP: 992,
        DESKTOP: 1200
    }

    const screenType = ['mobile', 'tablet', 'labtop', 'desktop', 'big-screen'];

    const [device, setDevice] = useState<DeviceType>('mobile');
    const agentHook = useCheckMobileAgent();


    const detectDevice = () => {


        const screenWidth = window.innerWidth;

        const detectDeviceType: DeviceType =
            screenWidth <= screenData.MOBILE ? 'mobile' :
                screenWidth <= screenData.TABLET ? 'tablet' :
                    screenWidth <= screenData.LABTOP ? 'labtop' :
                        screenWidth <= screenData.DESKTOP ? 'desktop' :
                            'big-screen';



        setDevice(detectDeviceType)

    }

    useEffect(() => {
        document.body.setAttribute('data-device', device);
        document.body.setAttribute('data-device-type', screenType.indexOf(device).toString());

    }, [device])

    useEffect(() => {
        document.body.setAttribute('data-mobile-agent', agentHook.isMobile ? 'true' : 'false');
    }, [agentHook])

    useEffect(() => {
        detectDevice();
        window.addEventListener('resize', detectDevice)
        return (() => window.removeEventListener('resize', detectDevice))
    }, [])

    return <Fragment />
}