'use client'

import { useEffect } from "react";

export const useScreenSize = () => {

    const getScreenHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    useEffect(() => {
        console.log('active screen size')
        getScreenHeight();
        window.addEventListener('resize' , getScreenHeight);
    },[]);

}