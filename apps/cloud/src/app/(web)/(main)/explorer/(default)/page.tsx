import { redirect } from "next/navigation"

const MainExplorerDefaultPage = () => {
    redirect('/explorer/folder/root')
}

export default MainExplorerDefaultPage