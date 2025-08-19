import Link from "next/link"

const NotFoundErrorPage = () => {
    return (
        <div className="cp-error">
            <p>Not Found page</p>
            <Link href={'/'}>Home</Link>
        </div>
    )
}


export default NotFoundErrorPage;