'use server'

import { CrepenHttpService } from "@web/services/common/http.service";
import { redirect } from "next/navigation";
import { Fragment } from "react";

export const ExplorerRoutePage =  async () => {

    const baseUrl = await CrepenHttpService.getUrl();
    const redirectUrl = new URL(`folder`, baseUrl + '/').toString();
    redirect(redirectUrl)

    return (<Fragment />)
}

export default ExplorerRoutePage;