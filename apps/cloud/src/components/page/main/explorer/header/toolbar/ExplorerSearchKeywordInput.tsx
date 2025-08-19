'use client'

import { StringUtil } from "@web/lib/util/StringUtil"
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { FcSearch } from "react-icons/fc"

export const ExplorerSearchKeywordInput = () => {

    const searchParamHook = useSearchParams();
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    const searchEventHandler = () => {

        const params = new URLSearchParams(searchParamHook);

        if (StringUtil.isEmpty(inputRef.current?.value)) {
            if (params.has('keyword')) params.delete('keyword');
        }
        else {
            params.set('keyword', inputRef.current!.value.toString());
        }

        router.replace(`?${params.toString()}`);
    }

    return (
        <div className='cp-search-box'>

            <input className='cp-search-input' ref={inputRef} 
                onKeyDown={(evt) => {
                    if(evt.key.toLowerCase() === 'enter'){
                        searchEventHandler();
                    }
                }}
            />
            <div className='cp-search-icon' onClick={() => searchEventHandler()}>
                <FcSearch />
            </div>
        </div>
    )
}