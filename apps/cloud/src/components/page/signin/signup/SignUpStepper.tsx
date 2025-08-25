import { CommonUtil } from "@web/lib/util/CommonUtil";
import { StringUtil } from "@web/lib/util/StringUtil";
import React, { PropsWithChildren, ReactElement, ReactNode, Children, isValidElement, useState, useEffect, Fragment, useRef, useMemo } from "react";

interface SignUpStepperProp {
    submit?: () => void,
    onChangeStep?: () => void
}

export const SignUpStepper = (prop: PropsWithChildren<SignUpStepperProp>) => {



    const [stepMaxCount, setStepMaxCount] = useState<number>(0)
    const [selectStep, setSelectStep] = useState<number>(1);
    const [stepItemElement, setStepItemElement] = useState<ReactElement<SignUpStepperItemProp>[]>(prop.children as ReactElement<SignUpStepperItemProp>[]);

    const stepperRef = useRef<HTMLDivElement>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);


    useEffect(() => {
        stepperRef.current?.style.setProperty('--stepper-width', `${stepperRef.current.offsetWidth}px`)
    }, [stepperRef])

    useEffect(() => {
        // stepperRef.current?.style.setProperty('--stepper-max', `${stepMaxCount}`)
        // stepperRef.current?.style.setProperty('--stepper-count', `${selectStep}`)
        stepperRef.current?.classList.add('cp-active');
    }, [stepMaxCount, selectStep])

    useEffect(() => {
        if (prop.onChangeStep) prop.onChangeStep();
    }, [selectStep])


    useEffect(() => {
        const validChildren = Children.toArray(prop.children).filter(child => {
            return isValidElement(child) && (child.type as any) === SignUpStepperItem
        }) as React.ReactElement<SignUpStepperItemProp>[];


        setStepMaxCount(validChildren.length)
    }, [])

    useEffect(() => {
        setStepItemElement(prop.children as ReactElement<SignUpStepperItemProp>[]);
        setStepMaxCount((prop.children as ReactElement<SignUpStepperItemProp>[]).length)
    }, [prop.children])


    return (
        <div className="cp-signup-stepper" ref={stepperRef}>
            <div className="cp-stepper-monitor">
                {
                    new Array(stepMaxCount).fill(undefined).map((x, idx) => (
                        <div key={idx} className={StringUtil.joinClassName("cp-step-dot", idx + 1 === selectStep ? "active" : '')} />
                    ))
                }
            </div>

            <div className="cp-step-wrapper">
                {stepItemElement.find(x => x.props.stepCount === selectStep)}
            </div>

            <button className={StringUtil.joinClassName("cp-signup-stepper-submit cp-secondary", selectStep <= 1 ? 'cp-hidden' : '')}
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    if (selectStep > 1) {
                        setSelectStep(selectStep - 1);
                    }

                }}
            >
                PREV
            </button>

            <button
                className={
                    StringUtil.joinClassName(
                        "cp-signup-stepper-submit",
                        "cp-primary",
                        isLoading ? 'cp-loading' : ''
                    )
                }
                type="button"
                onClick={async (e) => {
                    e.preventDefault();
                    setIsLoading(true)
                    const validEvent = stepItemElement.find(x => x.props.stepCount === selectStep)?.props.validate;

                    let isError = false;
                    if (validEvent instanceof Promise) {
                        isError = await validEvent();
                    }
                    else if (validEvent !== undefined && validEvent) {
                        isError = validEvent() as boolean;
                    }


                    if ((isError as unknown) instanceof Promise) {
                        isError = await isError;
                    }

                    if (!isError) {
                        if (selectStep === stepMaxCount) {
                            await CommonUtil.delay(500);
                            if (prop.submit) prop.submit();
                        }
                        else {
                            setSelectStep(selectStep + 1);
                        }

                    }
                    setIsLoading(false)

                }}
            >
                {
                    !isLoading &&
                    (
                        selectStep === stepMaxCount
                            ? 'APPLY'
                            : `NEXT`
                    )
                }
                {
                    isLoading &&
                    <div className="cp-loader" />
                }
            </button>


        </div>
    )
}

interface SignUpStepperItemProp {
    stepCount: number,
    validate?: () => Promise<boolean> | boolean
}

const SignUpStepperItem = (prop: PropsWithChildren<SignUpStepperItemProp>) => {
    return (
        <div className="cp-signup-stepper-item">
            {prop.children}
        </div>
    )
}


SignUpStepper.Item = SignUpStepperItem;