'use client'

import { FcAbout, FcApproval, FcHighPriority, FcLinux, FcSafe, FcUnlock } from "react-icons/fc"
import { SignCommonForm, SignToggleButtonItem } from "../common/SignCommonForm"
import { useClientLocale } from "@web/lib/module/locale/ClientLocaleProvider"
import { useRouter } from "next/navigation"
import urlJoin from "url-join"
import { Fragment, useRef, useState } from "react"
import { CommonUtil } from "@web/lib/util/CommonUtil"
import { StringUtil } from "@web/lib/util/StringUtil"
import { FindIdAndPasswordAction } from "@web/lib/actions/UserActions"


interface FindAccountSubmitState {
    state: boolean,
    message?: string
}


interface FindAccountIdFormProp {
    activeFindType: 'id' | 'password'
}

export const FindAccountForm = (prop: FindAccountIdFormProp) => {

    const [submitState, setSuccessState] = useState<FindAccountSubmitState | undefined>(undefined);
    const [isSubmitLoading, setSubmitLoader] = useState<boolean>(false);

    const translateHook = useClientLocale();
    const route = useRouter();

    const findIdEmailInputRef = useRef<HTMLInputElement>(null);
    const findPasswordEmailInputRef = useRef<HTMLInputElement>(null);

    const toggleItems: SignToggleButtonItem[] = [
        {
            key: 'id',
            title: translateHook.translate('page.find.common.toggle.find-id'),
            icon: <FcLinux size={20} className="cp-find-id-icon" />
        },
        {
            key: 'password',
            title: translateHook.translate('page.find.common.toggle.find-password'),
            icon: <FcUnlock size={20} className="cp-find-password-icon" />
        }
    ]

    const findSubmitHandler = async () => {
        setSuccessState(undefined);
        setSubmitLoader(true);


        const res = await FindIdAndPasswordAction(
            prop.activeFindType,
            prop.activeFindType === 'id'
                ? findIdEmailInputRef.current?.value
                : findPasswordEmailInputRef.current?.value
        )

        // await CommonUtil.delay(3000);

        setSuccessState({ state: res.success, message: res.message });
        setSubmitLoader(false);
    }

    return (
        <SignCommonForm
            className="cp-find-form"
            disableSubmit
        >

            <SignCommonForm.ToggleButton
                className="cp-find-type-toggle"
                item={toggleItems}
                activeToggle={toggleItems.find(x => x.key === prop.activeFindType)}
                onChangeToggle={(item) => {
                    if (item && item.key !== prop.activeFindType) {
                        route.push(urlJoin('/signin/find', item.key));
                    }
                }}
            />

            {
                prop.activeFindType === 'id' &&
                <Fragment>
                    <SignCommonForm.Input
                        inputId="id"
                        className="cp-find-input"
                        inputType="text"
                        labelText="Email"
                        inputRef={findIdEmailInputRef}
                        onChange={() => setSuccessState(undefined)}
                    />
                </Fragment>
            }

            {
                prop.activeFindType === 'password' &&
                <Fragment>
                    <SignCommonForm.Input
                        inputId="idOrEmail"
                        className="cp-find-input"
                        inputType="text"
                        labelText="ID or Email"
                        inputRef={findPasswordEmailInputRef}
                        onChange={() => setSuccessState(undefined)}
                    />
                </Fragment>
            }


            <SignCommonForm.Submit
                className="cp-find-submit"
                onClick={findSubmitHandler}
                activeLoading={isSubmitLoading}
                buttonType="button"
            >
                Find {prop.activeFindType === 'id' ? "ID" : "Password"}
            </SignCommonForm.Submit>


            {
                submitState &&
                <div className={
                    StringUtil.joinClassName(
                        "cp-find-result-message-box",
                        submitState.state === true
                            ? 'cp-success'
                            : submitState.state === false
                                ? 'cp-error'
                                : ''
                    )
                }
                >
                    {
                        submitState.state === true
                            ? <Fragment>
                                <FcApproval size={40} />
                                <span>{translateHook.translate(`page.find.result-message.success.${prop.activeFindType}`)}</span>
                            </Fragment>
                            : <Fragment>
                                <FcHighPriority size={40} />
                                <span>{submitState.message}</span>
                            </Fragment>
                    }


                </div>
            }



        </SignCommonForm>
    )
}