import type React from "react"
import style from '../styles/components/form.module.css';
import MainButton, { ButtonLite } from './MainButton';
type PropsType = {
    heading?: string
    children?: React.ReactNode
    method?: string | undefined
    action?: string | undefined
    onSubmit?: (even: React.FormEvent<HTMLFormElement>) => void | Promise<void> | undefined
    onCencel?: () => void | undefined
    disabled?: boolean | undefined
    errorMessage?: string | undefined
    submitBtnInnerHTML?: string | undefined
}
export default function Form(props: PropsType) {
    const {
        action, method,
        heading = 'Create Form', children = <></>,
        onSubmit = () => { },
        onCencel = () => { },
        disabled,
        errorMessage,
        submitBtnInnerHTML = 'Create'
    } = props
    return (
        <form action={action} method={method} className={style.form} onSubmit={onSubmit}>
            <h1 className={style.form_heading}>{heading}</h1>
            <div className="my-2 w-full">
                {errorMessage && <div className="bg-red-100 border-2 border-error p-1 text-center text-error  rounded-md opacity-80">{errorMessage}</div>}
            </div>
            <div className={style.form_inputs}>{children}</div>
            <div className={style.form_controle}>
                <MainButton disabled={disabled} type="submit">{submitBtnInnerHTML}</MainButton>
                <ButtonLite disabled={disabled} onClick={onCencel}>Cancel</ButtonLite>
            </div>
        </form>
    )
}
