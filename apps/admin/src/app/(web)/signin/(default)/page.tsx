import '@web/assets/styles/signin/signin.page.scss';
import { SignInForm } from "@web/component/signin/SignInForm";

const AdminSignInPage = () => {
    return (
        <div className='cp-page cp-signin-page'>
            <div className='cp-signin-container'>
                <div className='cp-container-header'>
                    <div className='cp-container-title'>
                        <span>Crepen CDN</span>
                    </div>
                    <div className='cp-container-subtitle'>
                        <span>Administrator Console</span>
                    </div>

                </div>
                <div className='cp-container-content'>
                    <SignInForm />
                </div>
                <div className='cp-container-footer'>
                    
                </div>
            </div>

        </div>
    )
}

export default AdminSignInPage;