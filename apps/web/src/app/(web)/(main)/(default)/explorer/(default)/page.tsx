'use server'

import { CrepenHttpService } from "@web/services/common/http.service";
import { redirect } from "next/navigation";

export const ExplorerRoutePage =  async () => {
    const baseUrl = await CrepenHttpService.getUrl();
    const pathname = new URL(baseUrl!).pathname;
    redirect(`${pathname!}/folder`)
}

export default ExplorerRoutePage;