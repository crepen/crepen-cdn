'use server'

import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CrepenGroupService } from "@web/lib/service/group-service";
import { CrepenHttpService } from "@web/services/common/http.service";
import { CrepenLanguageService } from "@web/services/common/language.service";
import { CrepenSessionService } from "@web/services/common/session.service";
import { Params } from "next/dist/server/request/params";
import Link from "next/link";
import urlJoin from "url-join";

interface GroupListPageRouterProp {
    params: Params
}

const GroupListPageRouter = async (prop: GroupListPageRouterProp) => {


    const requestUrl = await CrepenHttpService.getUrl();

    const tokenData = await CrepenSessionService.getTokenData();
    const locale = await CrepenLanguageService.getSessionLocale() ?? CrepenLanguageService.getDefaultLanguage();

    const rootGroupList = await CrepenGroupService.getGroupList(undefined, {
        language: locale,
        token: tokenData?.accessToken
    })

    console.log('ROOT LIST', new URL(``, requestUrl).toString(), urlJoin(requestUrl ?? '/', '1'));

    return (
        <div className="cp-page cp-group-list-page">
            <div className="cp-group-list">
                {
                    (rootGroupList.data ?? []).map(x => (
                        <Link
                            key={x.idx}
                            href={urlJoin(requestUrl ?? '/', x.idx.toString())}
                            className="cp-group-item"
                        >
                            <FontAwesomeIcon icon={faFolder} className="cp-group-icon"/>
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

export async function generateStaticParams() {
    console.log('?')
}

export default GroupListPageRouter;