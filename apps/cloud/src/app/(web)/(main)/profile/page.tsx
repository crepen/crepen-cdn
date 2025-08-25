import { CommonPage } from "@web/component/global/CommonPage";
import { redirect } from "next/navigation";

const MainProfileDefaultPage = () => {
    redirect('/profile/dashboard')
}

export default MainProfileDefaultPage;