import { Fragment, PropsWithChildren } from "react"
import { CrepenGlobalModalProvider } from "../global-modal/CrepenGlobalModalProvider"

export const CrepenGlobalProvider = (prop : PropsWithChildren) => {
    return (
        <Fragment>
            <CrepenGlobalModalProvider>
                {prop.children}
            </CrepenGlobalModalProvider>
        </Fragment>
    )
}