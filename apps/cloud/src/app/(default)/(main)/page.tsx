'use client'

import { Fragment } from 'react'
import { useClientLocale } from '../../../lib/module/locale/ClientLocaleProvider';

const DefaultPage = () => {

    const ss = useClientLocale();



    return (
        <div className='cp-article-page'>
            <header>
                {ss.translate('common.system.UNKNOWN_ERROR')}
            </header>
            <article>

            </article>
        </div>
    )
}

export default DefaultPage;