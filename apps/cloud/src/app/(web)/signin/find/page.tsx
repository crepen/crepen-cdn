import '@web/assets/styles/page/signin/find.page.scss';
import { CommonPage } from "@web/component/global/CommonPage";
import { TextHr } from "@web/component/global/control/text-hr/TextHr";
import { FindAccountForm } from "@web/component/page/signin/find/FindAccountForm";
import { SignInLogo } from "@web/component/page/signin/SignInLogo";
import Link from "next/link";
import { redirect } from "next/navigation"

const SignInFindDefaultPage = () => {
    return (
        <CommonPage className="cp-find-info-page cp-find-id-page">
            <CommonPage.Header>
                <SignInLogo />
            </CommonPage.Header>
            <CommonPage.Content>
                {/* <FindAccountIdForm /> */}
            </CommonPage.Content>
            <CommonPage.Footer>
                <TextHr
                    text='OR'
                />
                <Link href={'/signin'} className='cp-move-signin-button'>
                    Return Sign In
                </Link>
            </CommonPage.Footer>

        </CommonPage>
    )
}


export default SignInFindDefaultPage;