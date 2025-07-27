import '@web/assets/styles/install/install.success.scss';
import Link from 'next/link';

const InstallSuccessRoutePage = () => {
    return (
        <div className="cp-install-page cp-install-success">
            <div className="cp-content">
                <div className="cp-title">
                    설정이 완료되었습니다.
                </div>
                <div className="cp-subtitle">
                    시스템을 이용할 수 있습니다.
                </div>

                <div className='cp-action'>

                    <Link href={'/'} className='cp-move-home-bt'>
                        메인으로 이동
                    </Link>
                </div>
            </div>
        </div>
    )
}


export default InstallSuccessRoutePage;