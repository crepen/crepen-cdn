'use server'

import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CrepenGroupService } from "@web/lib/service/group-service";
import { CrepenHttpService } from "@web/services/common/http.service";
import { CrepenLanguageService } from "@web/services/common/language.service";
import { CrepenSessionService } from "@web/services/common/session.service";
import Link from "next/link";
import urlJoin from "url-join";
import { PageProps } from "../../../../../../../.next/types/app/(web)/layout";

interface GroupListPageRouterProp {
    params?: Promise<any>
    searchParams?: Promise<any>
}

const GroupListPageRouter = async (prop: GroupListPageRouterProp) => {

    // console.log(prop);

    const requestPathname = await CrepenHttpService.getPathname();

    const tokenData = await CrepenSessionService.getTokenData();
    const locale = await CrepenLanguageService.getSessionLocale() ?? CrepenLanguageService.getDefaultLanguage();

    const rootGroupList = await CrepenGroupService.getGroupList(undefined, {
        language: locale,
        token: tokenData?.accessToken
    })

    return (
        <div className="cp-page cp-group-list-page">
            <div className="cp-group-list">
                {
                    (rootGroupList.data ?? []).map(x => (
                        <Link
                            key={x.idx}
                            href={urlJoin(requestPathname ?? '/', x.idx.toString())}
                            className="cp-group-item"
                        >
                            <FontAwesomeIcon icon={faFolder} className="cp-group-icon" />
                            <span>
                                {x.groupName}
                            </span>

                        </Link>
                    ))
                }
            </div>
        </div>
    )
}



export default GroupListPageRouter;