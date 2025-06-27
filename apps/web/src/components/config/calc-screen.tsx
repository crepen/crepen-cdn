'use client'

import { useEffect } from "react";

/** @deprecated */
export const useScreenSize = () => {

    const getScreenHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    useEffect(() => {
        getScreenHeight();
        window.addEventListener('resize' , getScreenHeight);
    },[]);

}