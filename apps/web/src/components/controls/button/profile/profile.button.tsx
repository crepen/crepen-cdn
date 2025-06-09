'use client'

import { AvartarIconButton } from "../avartar/avartar.button"
import { Fragment } from 'react'
import './profile.button.scss';
import { useRouter } from "next/navigation";
import { CrepenUser } from "@crepen-cdn/core/service";

interface ProfileButtonProp {
    userInfo : CrepenUser
}


export const ProfileButton = (prop: ProfileButtonProp) => {

    const router = useRouter();



    return (
        <Fragment>
            <AvartarIconButton
                className="cp-profile-bt"
            />

            <div className="cp-profile-box">
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
                    <li className="cp-profile-item cp-profile-menu" onClick={() => router.push('/cloud/profile')}>
                        Profile
                    </li>
                    <li className="cp-profile-item cp-profile-menu">
                        Logout
                    </li>
                </ul>
            </div>
        </Fragment>

    )
}