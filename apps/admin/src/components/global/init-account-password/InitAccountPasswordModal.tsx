'use client'

import { CommonModal } from "@web/component/common/CommonModal"
import { useRef, useState } from "react"
import { RestAdminAuthData } from "../../../modules/server-data/RestAdminAuthData"
import { ChangeInitAccountPasswordAction } from "../../../libs/action/AdminAuthAction"
import { useRouter } from "next/navigation"
import { InputGroup } from "@web/component/common/input-group/InputGroup"

interface InitAccountPasswordModalProp {
    isOpen: boolean
}

export const InitAccountPasswordModal = (prop: InitAccountPasswordModalProp) => {
    const [isOpen, setOpenState] = useState<boolean>(prop.isOpen);
    const [isLoading , setLoadState] = useState<boolean>(false);

    const passwordRef = useRef<HTMLInputElement>(null);
    const route = useRouter();

    const updatePassword = async () => {
        setLoadState(true)
        const res = await ChangeInitAccountPasswordAction(passwordRef.current?.value);

        if(res.success){
            alert('변경이 완료되었습니다. 다시 로그인해주시길 바랍니다.')
            route.refresh();
        }
        else{
            alert(res.message)
            
        }

        setLoadState(false)
    }


    return (
        <CommonModal
            className="cp-init-account-password-modal"
            isOpen={isOpen}
        >
            <CommonModal.Header>
                <span>Initializer Account Password</span>
            </CommonModal.Header>
            <CommonModal.Content>
                <p>사이트 설정 전 기본 계정 비밀번호 설정이 필요합니다.</p>
                <p>비밀번호 설정 이후, 로그에 표시된 비밀번호로는 로그인 할 수 없습니다.</p>

                <InputGroup
                    inputType="password"
                    inputDefaultValue="cp-change-password"
                    inputRef={passwordRef}
                    inputAutoComplete="new-password"
                >
                    Change Password
                </InputGroup>
               
            </CommonModal.Content>
            <CommonModal.Footer>
                <CommonModal.Button
                    type="secondary"
                >
                    <span>CANCEL</span>
                </CommonModal.Button>
                <CommonModal.Button
                    type="submit"
                    onClick={updatePassword}
                    isLoading={isLoading}
                >
                    <span>SUBMIT</span>
                </CommonModal.Button>
            </CommonModal.Footer>
        </CommonModal>
    )
}