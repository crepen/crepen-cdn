'use client'

import { Fragment, useEffect } from "react"

export const GlobalScreenHeightProvider = () => {


    const applyHeight = () => {
        // console.log(window.innerHeight / 100)
        document.documentElement.style.setProperty('--vh' , `${window.innerHeight / 100}px`)
    }

    useEffect(() => {
        applyHeight();

        window.addEventListener('resize' , applyHeight);
        return(() => {
            window.removeEventListener('resize' , applyHeight);
        })
    },[])

    return (<Fragment />)
}