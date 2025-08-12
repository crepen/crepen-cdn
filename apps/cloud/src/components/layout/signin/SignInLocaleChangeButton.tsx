'use client'

import { ChangeLocaleAction } from "@web/lib/actions/LocaleActions"
import { useClientLocale } from "@web/lib/module/locale/ClientLocaleProvider"
import { useRouter } from "next/navigation"
import { useState } from "react"

export const SignInLocaleChangeButton = () => {

    const router = useRouter();
    const localeHook = useClientLocale();

    const [locale , setLocale] = useState<string>(localeHook.getDefaultLocale());

    const clickEventHandler = async () => {

        const localeList=  localeHook.getSupportLocale();
        const systemLocale = localeHook.getLocale();

        const unmathcLocale = localeList.filter(x=>x.trim().toLowerCase() !== systemLocale);
        const changeLocale = unmathcLocale.length > 0 ? unmathcLocale[0] : localeHook.getDefaultLocale();
        await ChangeLocaleAction(changeLocale ?? localeHook.getDefaultLocale());

        setLocale(systemLocale);

        router.refresh();
    }

    return (
        <button className="cp-change-locale-button" onClick={clickEventHandler}>
            <span>{locale.toUpperCase()}</span>
        </button>
    )
}