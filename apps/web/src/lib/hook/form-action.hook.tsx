import { useEffect, useState } from "react"
import { CommonUtil } from "../util/common.util"

interface FormActionState<T> {
    data?: T,
    state?: 'complete' | 'running'
}

interface FormActionProp<T> {
    action: (currentState: any, formData: FormData) => Promise<T>
}

export const useFormAction = <T,>(prop: FormActionProp<T>) => {

    const [hookState, setHookState] = useState<FormActionState<T>>({
        state : undefined
    })

    const action = async (formData: FormData) => {
        setHookState({
            data: undefined,
            state: 'running',
        })

        const data= await prop.action(undefined, formData)

        setHookState({
            data: data,
            state: 'complete',
        })
    }



    useEffect(() => {
        console.log('act');
    }, [prop.action])

    return {
        ...hookState,
        submit: action
    };
}