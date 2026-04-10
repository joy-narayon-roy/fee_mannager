import type React from "react";


export default function MainContainer({ children = <></>, className = "" }: { children: React.ReactNode,className?: string }) {
    const style_classnames = `flex flex-col justify-center mx-auto min-w-full md:min-w-3xl ${className}`
    return (
        <div className={style_classnames}>{children}</div>
    )
}
