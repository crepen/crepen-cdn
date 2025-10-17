import { FcHighPriority } from "react-icons/fc";
import { LocaleProvider } from "../../../../modules/locale-module/LocaleProvider";
import Link from "next/link";

const AdminMainNotFoundPage = () => {

    const localeProv = LocaleProvider.getInstance();

    return (
        <div className="cp-notfound-page">
            <FcHighPriority />
            <span>
                {localeProv.translate('ADMIN.MAIN.COMMON.NOT_FOUND_PAGE')}
            </span>
            
        </div>
    )
}


export default AdminMainNotFoundPage;