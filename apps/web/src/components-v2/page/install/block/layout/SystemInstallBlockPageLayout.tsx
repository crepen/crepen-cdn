import Link from 'next/link'
import './SystemInstallBlockPageLayout.scss'

export const SystemInstallBlockPageLayout = () => {
    return (
        <div className='cp-install-page cp-install-block'>
            <div className='cp-content'>
                <div className='cp-title'>
                    CREPEN CDN
                </div>
                <div className='cp-subtitle'>
                    <span>서비스 초기 설정이 완료되지 않았습니다.</span>
                    <span>초기 설정은 localhost로 접속 시 진행할 수 있습니다.</span>
                </div>
            </div>
        </div>
    )
}


