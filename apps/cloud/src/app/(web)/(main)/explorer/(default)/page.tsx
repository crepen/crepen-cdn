import { redirect } from "next/navigation"
import { Fragment } from "react"

const MainExplorerDefaultPage = () => {
    redirect('/explorer/folder/root')

    return (<Fragment />)
}

export default MainExplorerDefaultPage