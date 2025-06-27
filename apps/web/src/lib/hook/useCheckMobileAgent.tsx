import { useEffect, useState } from "react"

export const useCheckMobileAgent = () => {

    const [isMobile , setIsMobile] = useState<boolean>();


    useEffect(() => {
        setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
    },[navigator])


    return {
        isMobile : isMobile
    }
}