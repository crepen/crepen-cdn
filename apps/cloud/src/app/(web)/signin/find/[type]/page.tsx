import '@web/assets/styles/page/signin/find.page.scss';
import { CommonPage } from "@web/component/global/CommonPage";
import { TextHr } from "@web/component/global/control/text-hr/TextHr";
import { FindAccountForm } from '@web/component/page/signin/find/FindAccountForm';
import { SignInLogo } from "@web/component/page/signin/SignInLogo";
import Link from "next/link";
import { redirect } from 'next/navigation';

interface SignInFindTypePageProp {
    params?: Promise<{ type: string }>
}

const SignInFindTypePage = async (prop: SignInFindTypePageProp) => {

    const param = await prop.params;

    if (param?.type !== 'id' && param?.type !== 'password') {
        redirect('/signin/find/id');
    }

    return (
        <CommonPage className="cp-find-info-page cp-find-id-page">
            <CommonPage.Wrapper
                noPadding
                size='full'
                template
            >
                <CommonPage.Header>
                    <SignInLogo />
                </CommonPage.Header>
                <CommonPage.Content>
                    <FindAccountForm
                        activeFindType={param.type}
                    />
                </CommonPage.Content>
                <CommonPage.Footer>
                    <TextHr
                        text='OR'
                    />
                    <Link href={'/signin'} className='cp-move-signin-button'>
                        Return Sign In
                    </Link>
                </CommonPage.Footer>
            </CommonPage.Wrapper>


        </CommonPage>
    )
}


export default SignInFindTypePage;