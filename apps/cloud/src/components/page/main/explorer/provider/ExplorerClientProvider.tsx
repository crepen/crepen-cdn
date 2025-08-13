'use client'

import { PropsWithChildren } from "react"
import { ExplorerFilterProvider } from "./ExplorerFilterProvider"

export const ExplorerClientProvider = (prop : PropsWithChildren) => {
    return (
        <ExplorerFilterProvider
            sortOption={{
                activeSort : true,
                allowCategory : ['name'],
                defaultType : 'desc'
            }}
        >
            {prop.children}
        </ExplorerFilterProvider>
    )
}