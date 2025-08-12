import { redirect } from "next/navigation"

const GlobalNotFoundRedirector = () => {
    redirect('/error/not-found');
}

export default GlobalNotFoundRedirector;