import Link from 'next/link'
import './SystemInstallDefaultPageLayout.scss'

export const SystemInstallDefaultPageLayout = () => {
    return (
        <div className='cp-install-page cp-install-start'>
            <div className='cp-content'>
                <div className='cp-title'>
                    CREPEN CDN
                </div>
                <div className='cp-subtitle'>
                    System Install
                </div>

                <Link
                    href={'/install/db'}
                    className='cp-next-bt'
                >
                    <span className='cp-bt-text'>NEXT</span>
                </Link>
            </div>
        </div>
    )
}


