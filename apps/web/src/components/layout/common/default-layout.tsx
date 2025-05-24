'use client'

import './default-layout.scss';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { PropsWithChildren } from 'react';

interface DefaultSidePageLayoutProp extends PropsWithChildren {

}

export const DefaultSidePageLayout = (prop: DefaultSidePageLayoutProp) => {

    const router = useRouter();



    return (
        <div className="cp-default-layout">
            <div className='cp-top-action'>
                <FontAwesomeIcon
                    icon={faArrowLeft}
                    className='cp-backword-icon'
                    onClick={() => router.back()}
                />

            </div>
            <div className='cp-main'>
                {prop.children}
            </div>
        </div>
    )
}