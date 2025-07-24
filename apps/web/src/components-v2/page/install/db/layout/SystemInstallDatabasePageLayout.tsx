'use client'

import Link from 'next/link'
import './SystemInstallDatabasePageLayout.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong, faHome } from '@fortawesome/free-solid-svg-icons'
import { SystemInstallDatabaseForm, SystemInstallDatabaseFormRef } from '../containers/SystemInstallDatabaseForm'
import { FormEvent, useActionState, useEffect, useRef, useState } from 'react'
import { InstallAction } from '@web/lib/action'
import { useRouter } from 'next/navigation'

export interface SystemInstallDatabasePageLayoutProp {
    defaultValue?: {
        host?: string,
        port?: number | string,
        username?: string,
        password?: string,
        database?: string
    }
}

export const SystemInstallDatabasePageLayout = (prop: SystemInstallDatabasePageLayoutProp) => {

    const submitButtonRef = useRef<HTMLButtonElement>(null);
    const formRef = useRef<SystemInstallDatabaseFormRef>(null);



    const router = useRouter();

    const [formMessage, setFormMessage] = useState<string | undefined>();
    const [formPending, setFormPending] = useState<boolean>(false);


    const onSubmitHandler = (e: FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setFormPending(true);
        setFormMessage(undefined);
        const formData = formRef.current?.getFormData();
        InstallAction.testDatabaseConnect(formData ?? new FormData())
            .then(res => {
                if (res.isSuccess) {
                    router.push('/install/success')
                }
                else {
                    setFormMessage(res.message);
                }
            })
            .catch(e => {
                setFormMessage('서버 통신 간 오류가 발생했습니다.')
            })
            .finally(() => {
                setFormPending(false);
            })
    }



    return (
        <div className='cp-install-page cp-install-database'>
            <div className='cp-header'>
                <div className='cp-backword'>
                    <Link
                        href={'/install'}
                        className='cp-icon-bt'
                    >
                        <FontAwesomeIcon icon={faArrowLeftLong} />
                    </Link>

                </div>
                <div className='cp-reset'>
                    <Link
                        href={'/install'}
                        className='cp-icon-bt'
                    >
                        <FontAwesomeIcon icon={faHome} />
                    </Link>
                </div>
            </div>
            <div className='cp-content'>

                <div className='cp-title'>
                    Setup Database
                </div>
                <div className='cp-subtitle'>
                    <span>Database 설정.</span>
                </div>
                <SystemInstallDatabaseForm
                    className='cp-form'
                    submitButtonRef={submitButtonRef}
                    ref={formRef}
                    onSubmit={onSubmitHandler}
                    defaultValue={prop.defaultValue}
                />
            </div>
            <div className='cp-footer'>
                <div className='cp-footer-message-box'>
                    {formMessage}
                </div>
                <button
                    ref={submitButtonRef}
                    className='cp-footer-bt'
                    onClick={() => {
                        formRef.current?.submit();
                    }}
                    disabled={formPending}
                >
                    {
                        formPending
                            ? 'Loading'
                            : 'Next'
                    }
                </button>
            </div>
        </div>
    )
}


