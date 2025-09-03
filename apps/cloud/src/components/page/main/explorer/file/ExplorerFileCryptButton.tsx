'use client'

import { UpdateFileCryptAction } from "@web/lib/actions/FileActions"
import { CommonUtil } from "@web/lib/util/CommonUtil"
import { StringUtil } from "@web/lib/util/StringUtil"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { FcUnlock, FcLock } from "react-icons/fc"
import { LuLoaderCircle } from "react-icons/lu"

interface ExplorerFileCryptButtonProp {
    isFileEncrypt: boolean,
    fileUid: string,
    isRunningCrypt: boolean
}

export const ExplorerFileCryptButton = (prop: ExplorerFileCryptButtonProp) => {

    const [isLoading, setLoading] = useState<boolean>(false);

    const route = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const updateCryptEventHandler = async () => {
        setLoading(true);

        const updateFileCryptResult = await UpdateFileCryptAction(prop.fileUid, !prop.isFileEncrypt);

        if (updateFileCryptResult.success) {
            await CommonUtil.delay(1000)
            const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
            route.replace(url);
        }
        else {
            alert(updateFileCryptResult.message);
        }

        setLoading(false);
    }

    return (
        <button
            className={StringUtil.joinClassName(
                'cp-action-button',
                isLoading ? 'cp-loading' : '',
                prop.isRunningCrypt === true ? 'cp-disable' : ''
            )}
            onClick={() => (!isLoading && prop.isRunningCrypt === false) && updateCryptEventHandler()}
        >
            <div className='cp-button-icon'>
                {
                    prop.isFileEncrypt === true
                        ? <FcUnlock fontSize={20} />
                        : <FcLock fontSize={20} />
                }
            </div>
            <div className='cp-button-text'>
                {
                    prop.isRunningCrypt === true
                        ? 'Running Encryption/Decryption..'
                        :
                        prop.isFileEncrypt === true
                            ? 'Decrypt File'
                            : 'Encrypt File'
                }
            </div>


            <div className="cp-loading-box">
                <LuLoaderCircle
                    className="cp-spinner"
                    size={20}
                />
            </div>
        </button>
    )
}