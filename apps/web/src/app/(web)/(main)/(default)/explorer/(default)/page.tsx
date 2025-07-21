'use server'

import { CrepenHttpService } from "@web/services/common/http.service";
import { redirect } from "next/navigation";
import { Fragment } from "react";

export const ExplorerRoutePage =  async () => {
    const baseUrl = await CrepenHttpService.getUrl();
    const pathname = new URL(baseUrl!).pathname;
    redirect(`${pathname!}/folder`)

    return (
        <Fragment>
            {`${pathname!}/folder`}
        </Fragment>
    )
}

export default ExplorerRoutePage;