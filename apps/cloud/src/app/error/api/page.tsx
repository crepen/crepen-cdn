import Link from "next/link";
import { Fragment } from "react"

const ApiServerErrorPage = () => {
    return (
        <div className="cp-error">
            <p>서버와 통신할 수 없습니다</p>
            <p>관리자에게 문의 바랍니다.</p>
            <Link href={'/'}>Home</Link>
        </div>
    )
}

export default ApiServerErrorPage;