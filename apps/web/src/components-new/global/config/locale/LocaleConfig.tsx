'use client'

import { useGlobalLanguage } from "@web/lib/state/global.state"
import { Fragment, useEffect } from "react"

interface LocaleConfigProp {
    locale : string
}

export const LocaleConfig = (prop : LocaleConfigProp) => {

    const localeHook = useGlobalLanguage();

    useEffect(() => {
        localeHook.update(prop.locale);
    },[])

    return <Fragment />
}