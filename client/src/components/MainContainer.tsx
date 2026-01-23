import type React from "react";


export default function MainContainer({ children = <></> }: { children: React.ReactNode }) {
    return (
        <div className='flex flex-col justify-center gap-2 mx-auto min-w-full md:min-w-2xl pb-4'>{children}</div>
    )
}
