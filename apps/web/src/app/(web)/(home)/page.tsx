import Link from "next/link";
import { Fragment } from 'react'

import '@web/assets/style/home/main/home.main.scss';

const HomePageRouter = () => {
    return (
        <div className="cp-page cp-home">
            <div className="cp-box">
                <div>HOMEPAGE</div>
                <Link href={'/cloud'}>Go to Cloud</Link>
                <span>API_URL : {process.env.API_URL}</span>
            </div>
        </div>

    )
}

export default HomePageRouter;