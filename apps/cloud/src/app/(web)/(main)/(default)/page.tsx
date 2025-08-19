import { redirect } from "next/navigation"

const DefaultPage = () => {
    redirect('/dashboard')
}

export default DefaultPage;