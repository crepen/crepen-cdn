'use server'

import '@web/assets/style/home/system/notfound.scss'

const NotFoundPageRouter = () => {
    return (
        <div className='cp-page cp-error cp-not-found'>
            <div className='cp-error-box'>
                <span className='cp-error-title'>404</span>
                <span className='cp-error-title-reflect'>404</span>
                <span className='cp-error-desc'>페이지를 찾을 수 없습니다.</span>
            </div>

        </div>
    )
}

export default NotFoundPageRouter;