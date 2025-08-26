import { redirect } from "next/navigation"
import { Fragment } from "react";

const DefaultPage = () => {
    redirect('/dashboard')

    return <Fragment />

}

export default DefaultPage;