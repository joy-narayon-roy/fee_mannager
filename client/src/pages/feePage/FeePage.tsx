import { useMainContext } from "../../contexts/MainContext/MainContext"
import type Fee from "../../models/fee"
import GroupFee, { type GroupFeeType } from "../../components/fee/FeeGroup"
import MainButton from "../../components/MainButton"
import { useNavigate } from "react-router-dom"

export default function FeePage() {
    const { profile } = useMainContext()
    const nav = useNavigate()

    const fees = profile.fees.reduce((p: { [key: string]: Fee[] }, c) => {
        const key = `${c.month}-${c.year}`
        if (p[key]) {
            p[key].push(c)
        } else {
            p[key] = [c]
        }
        return p
    }, {})

    const groupFees = Object.values(fees).reduce((p: GroupFeeType[], c) => {
        p.push({
            year: c[0].year,
            month: c[0].month,
            fees: c
        })
        return p
    }, [])

    return (
        <>
            <div className="mx-auto md:min-w-2xl min-w-full">
                <div className="flex gap-5 my-2 mb-5">
                    <MainButton onClick={()=>nav('create')} >+Fee</MainButton>
                    <MainButton onClick={()=>nav('bulkcreate')}>+Bulk fee</MainButton>
                </div>
                <h1 className="text-2xl text-center">Fees</h1>
                <div className="flex flex-col gap-2">
                    {groupFees.map(gf => <GroupFee key={`${gf.month}-${gf.year}`} info={gf} />)}
                </div>
            </div>
        </>
    )
}
