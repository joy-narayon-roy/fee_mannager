import type React from "react"
import style from '../styles/components/form.module.css';
import MainButton, { ButtonLite } from './MainButton';
import { IoIosClose } from "react-icons/io";
type PropsType = {
    heading?: string
    children?: React.ReactNode
    method?: string | undefined
    action?: string | undefined
    onSubmit?: (even: React.FormEvent<HTMLFormElement>) => void | Promise<void> | undefined
    onCencel?: () => void | undefined
    disabled?: boolean | undefined
    errorMessage?: string | undefined
    closeError?: () => void
    submitBtnInnerHTML?: string | undefined
}
export default function Form(props: PropsType) {
    const {
        action, method,
        heading = 'Create Form', children = <></>,
        onSubmit = () => { },
        onCencel = () => { },
        closeError = () => { },
        disabled,
        errorMessage,
        submitBtnInnerHTML = 'Create'
    } = props
    return (
        <form action={action} method={method} className={style.form} onSubmit={onSubmit}>
            <h1 className={style.form_heading}>{heading}</h1>
            <div className="my-2 w-full">
                {errorMessage && <div className="bg-red-100 border-2 border-error p-1 text-error  rounded-md opacity-80 flex items-center">
                    <span className="w-full text-center text-md">
                        {errorMessage}
                    </span>
                    <button onClick={closeError}><IoIosClose size={30} /></button>
                </div>}
            </div>
            <div className={style.form_inputs}>{children}</div>
            <div className={style.form_controle}>
                <MainButton disabled={disabled} type="submit">{submitBtnInnerHTML}</MainButton>
                <ButtonLite disabled={disabled} onClick={onCencel}>Cancel</ButtonLite>
            </div>
        </form>
    )
}
