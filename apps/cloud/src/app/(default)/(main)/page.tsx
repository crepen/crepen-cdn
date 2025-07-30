'use client'

import { Fragment } from 'react'
import { useClientLocale } from '../../../lib/module/locale/ClientLocaleProvider';

const DefaultPage = () => {

    const ss = useClientLocale();



    return (
        <Fragment>
            <p>{ss.translate('common.system.SUCCESS', 'ko') ?? 'UNDEFINED'}</p>
            <p>{ss.translate('common.system.SUCCESS', 'en') ?? 'UNDEFINED'}</p>
            <p>{ss.translate('common.system.SUCCESS') ?? 'UNDEFINED'}</p>
            <p>{ss.translate('common.system.API_CONN_FAILED', 'ko') ?? 'UNDEFINED'}</p>
            <p>{ss.translate('common.system.API_CONN_FAILED', 'en') ?? 'UNDEFINED'}</p>
            <p>{ss.translate('common.system.DD', 'ko') ?? 'UNDEFINED'}</p>
            <p>{ss.translate('common.system.DD', 'en') ?? 'UNDEFINED'}</p>
        </Fragment>
    )
}

export default DefaultPage;