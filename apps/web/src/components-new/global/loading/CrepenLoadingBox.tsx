'use client'

import { useEffect } from 'react';
import './CrepenLoadingBox.scss';

import { useGlobalLoadingState } from '@web/lib/state/global.state';

export const CrepenLoadingBox = () => {

    const globalLoading = useGlobalLoadingState();

    return (
        <div className="cp-global-loading" data-loading={globalLoading.isLoading}>
            <div className='cp-loading'>
                LOADING
            </div>
        </div>
    )
}