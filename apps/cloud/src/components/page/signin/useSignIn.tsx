import { SignInAction } from "@web/lib/actions/AuthActions";
import { useClientLocale } from "@web/lib/module/locale/ClientLocaleProvider";
import { CommonUtil } from "@web/lib/util/CommonUtil";
import { useState } from "react"

export const useSignIn = () => {

    const [isLoading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string | undefined>(undefined);
    const [resultState, setResultState] = useState<boolean>(false);

    const translateHook = useClientLocale();

    const activeHandler = async (id?: string, password?: string) => {

        setLoading(true);
        setMessage(undefined);


        try {
            const requestResult = await SignInAction(id, password);

            if (requestResult.state === false) {
                setMessage(translateHook.translate(requestResult.message) );
            }
            setResultState(requestResult.state);

        }
        catch (e) {
            setResultState(false);
            setMessage(translateHook.translate('common.system.UNKNOWN_ERROR'));
        }

        setLoading(false);
    }


    return {
        state: resultState,
        loading: isLoading,
        message: message,
        active: activeHandler
    }
}