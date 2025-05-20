import Link from "next/link";
import { Fragment } from 'react'

const HomePageRouter = () => {
    return (
        <Fragment>
            <div>HOMEPAGE</div>
            <Link href={'/cloud'}>Go to Cloud</Link>
        </Fragment>

    )
}

export default HomePageRouter;