'use client'

import { useClientBasePath } from "@web/lib/module/basepath/ClientBasePathProvider"
import Image from "next/image";
import urlJoin from "url-join";

export const SignInLogo = () => {

    const basePath = useClientBasePath();

    return (
        <Image
            src={urlJoin(basePath.getBasePath() , '/resource/image/logo.png')}
            width={197}
            height={66}
            alt="Logo Image"
        />
    )
}