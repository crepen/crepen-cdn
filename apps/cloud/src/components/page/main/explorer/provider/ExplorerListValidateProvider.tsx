'use client'

import { RestListResult } from "@web/lib/types/api/dto/RestCommonDto"
import { ExplorerTreeEntity, ExplorerFilterData } from "@web/lib/types/api/dto/RestExplorerDto"
import { useRouter, useSearchParams } from "next/navigation"
import { Fragment, useEffect } from "react"

interface ExplorerListValidateProviderProp {
    treeData: RestListResult<ExplorerTreeEntity>,
    defaultFilterData: ExplorerFilterData
}

export const ExplorerListValidateProvider = (prop: ExplorerListValidateProviderProp) => {

    const router = useRouter();
    const searchParamHook = useSearchParams();

    useEffect(() => {
        if (prop.treeData.totalPage < prop.treeData.page && prop.treeData.totalPage !== 0) {
            const params = new URLSearchParams(searchParamHook);

            params.set('page', prop.treeData.totalPage.toString());

            router.replace(`?${params.toString()}`);
        }
    }, [searchParamHook])

    return <Fragment />
}