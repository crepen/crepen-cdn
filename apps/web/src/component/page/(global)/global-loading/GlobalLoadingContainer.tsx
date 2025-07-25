'use client'

import { Fragment } from 'react';
import { useGlobalLoading } from '../../../config/GlobalLoadingProvider';
import './GlobalLoadingContainer.scss';


export const GlobalLoadingContainer = () => {

    const globalLoading = useGlobalLoading();

    return globalLoading.isLoading === true
        ? (
            <div className="cp-global-loading" data-loading={globalLoading.isLoading}>
                <div className='cp-loading'>
                    LOADING
                </div>
            </div>
        )
        : <Fragment />
}