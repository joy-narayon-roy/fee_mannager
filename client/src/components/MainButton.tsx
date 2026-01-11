
import type React from 'react';
import style from './styles/mainbutton.module.css';
import { useRef } from 'react';

type PropsType = {
    children?: React.ReactNode
    className?: string
    disabled?: boolean
    type?: "submit" | "reset" | "button"
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
    ref?: React.RefObject<HTMLButtonElement> | undefined

}

export function ButtonLite(props: PropsType) {
    const { children = <>Button</>, className = "", disabled = false,
        type = 'button',
        onClick = () => { }
    } = props
    const btnRef = useRef(null)
    return (
        <button ref={btnRef} type={type} disabled={disabled} onClick={onClick} className={`${style.btn} ${className}`}>
            {children}
        </button>
    )
}
export default function ButtonMain(props: PropsType) {
    const { children = <>Button</>, className = "", disabled = false,
        type = 'button',
        onClick = () => { },
        ref
    } = props
    return (
        <button ref={ref} type={type} disabled={disabled} onClick={onClick} className={`${style.btn} ${style.btn_main} ${className}`}>
            {children}
        </button>
    )
}
