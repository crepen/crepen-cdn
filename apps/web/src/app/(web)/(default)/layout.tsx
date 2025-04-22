import { Fragment, PropsWithChildren } from 'react'

const MainLayout = ({ children }: PropsWithChildren) => {
    return (
        <Fragment>
            {children}
        </Fragment>
    )
}

export default MainLayout; 