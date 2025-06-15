'use client'

import { AvartarIconButton } from "../avartar/avartar.button"
import { Fragment, useEffect, useRef, useState } from 'react'
import './profile.button.scss';
import { useRouter } from "next/navigation";
import { CrepenUser } from "@web/services/types/object/user.object";
import { useGlobalBasePath } from "@web/lib/state/global.state";

interface ProfileButtonProp {
    userInfo: CrepenUser
}


export const ProfileButton = (prop: ProfileButtonProp) => {

    const router = useRouter();
    const [isOpen, setOpenState] = useState<boolean>(false);
    const profileBoxRef = useRef<HTMLDivElement>(null);
    const profileButtonRef = useRef<HTMLButtonElement>(null);

    const globalBasePathState = useGlobalBasePath();

    const clickHiddenHandler = (e: MouseEvent) => {
        if (profileBoxRef.current?.getAttribute('data-open') === 'true') {
            if (profileBoxRef.current && !profileBoxRef.current.contains(e.target as Node) && !profileButtonRef.current?.contains(e.target as Node)) {
                setOpenState(false);
            }
        }
    }

    const logoutHandler = () => {
        setOpenState(false);

        fetch(`${globalBasePathState.join('/api/signout')}` , {method : 'DELETE'})
            .then(res => {
                location.reload();
            })
            .catch(e => {
                console.log('로그아웃 실패' , e );
                alert('로그아웃에 실패했습니다.')
            }) 
    }

    useEffect(() => {
        window.addEventListener('click', clickHiddenHandler);
        return (() => window.removeEventListener('click', clickHiddenHandler))
    }, [])


    return (
        <Fragment>
            <AvartarIconButton
                className="cp-profile-bt"
                onClick={() => {
                    setOpenState(!isOpen);
                }}
                ref={profileButtonRef}
            />

            <div
                className="cp-profile-box"
                data-open={isOpen ? 'true' : 'false'}
                ref={profileBoxRef}
            >
                <ul>
                    <li className="cp-profile-item cp-profile-header">
                        <div className="cp-profile-avartar">

                        </div>
                        <div className="cp-profile-name">
                            <span>
                                NAME1
                            </span>
                        </div>
                    </li>
                    <li className="cp-profile-item cp-profile-menu" onClick={() => {
                        router.push('/profile')
                        setOpenState(false)
                    }}>
                        Profile
                    </li>
                    <li className="cp-profile-item cp-profile-menu" onClick={logoutHandler}>
                        Logout
                    </li>
                </ul>
            </div>
        </Fragment>

    )
}