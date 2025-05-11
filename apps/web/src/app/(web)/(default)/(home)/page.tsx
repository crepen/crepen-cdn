'use client'

import { Fragment } from 'react'
import { LoginAction } from '../../../../lib/action'



const HomePage = () => {



    const blackBt = () => {
        LoginAction.logoutUser()
            .then(res => {
                location.reload();
            })

    }

    return (
        <Fragment>
            <div style={{ fontFamily: 'Pretendard Variable' }}>
                <TestText />
            </div>

            <form action={LoginAction.logoutUser}>
                <button onClick={blackBt}>Logout</button>
            </form>

        </Fragment>
    )
}


const TestText = () => {
    return (
        <div className='www'>
            Pretendard
        </div>
    )
}

export default HomePage;