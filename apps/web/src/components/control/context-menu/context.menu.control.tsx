'use client'

import {  useEffect, useRef } from 'react'
import './context.menu.control.scss'

export const CrepenContextMenu = () => {

    const contextMenuRef = useRef<HTMLDivElement>(null);

    const followMouseEvent = (e : MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if(contextMenuRef.current){
            contextMenuRef.current.style.top = `${e.clientY}px`;
            contextMenuRef.current.style.left = `${e.clientX}px`;
        }
        
    }

    useEffect(() => {
        window.addEventListener('mousemove' , followMouseEvent)

        return (() => window.removeEventListener('mousemove' , followMouseEvent));
    },[])

    
    return (
        <div className="cp-context-menu" ref={contextMenuRef}>

        </div>
    )
}