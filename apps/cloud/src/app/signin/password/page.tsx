'use server'

import Link from "next/link";

import '@web/assets/styles/page/signin/findpassword.page.scss'


const FindPasswordPage = async () => {
    return (
        <div className="cp-page cp-find-password-page">
            <div className='cp-section cp-header'>
                SIGN IN
            </div>
            <div className='cp-section cp-content'>
                <div className='cp-form'>
                    <div className='cp-input-item' data-label="ID or Email" >

                        <input type='text' name='id' placeholder=''></input>
                    </div>
                    <div className='cp-input-item' data-label="Password">
                        <input type='password' name='password' placeholder=''></input>
                    </div>
                </div>

                <div className='cp-submit'>
                    <div className='cp-button'>
                        <span>SIGN IN</span>
                    </div>
                </div>
            </div>
            <div className='cp-section cp-footer'>
                <Link href={'/signin/password'}>Find Password</Link>
            </div>


        </div>
    )
}

export default FindPasswordPage;