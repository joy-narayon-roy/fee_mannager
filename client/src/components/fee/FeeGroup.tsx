import { Fee } from "../../models"
import FeeGroupRow from "./FeeGroupRow"
type GroupFeeType = {
    year: number
    month: number
    fees: Fee[]
}
interface GroupFeeParams {
    info: GroupFeeType
}


export default function GroupFee(params: GroupFeeParams) {
    const { info = { month: 1, year: 2020, fees: [] } } = params
    const months = [
        'JAN', 'FAB', 'MAR', 'APR',
        'MAY', 'JUN', 'JUL', 'AUG',
        'SEP', 'OCT', 'NOV', 'DEC',
    ];

    const statusSortPoints = {
        'Unpaid': -1,
        'Partial': 0,
        'Paid': 1
    }
    const summery = info.fees.reduce((p, c) => {
        p.collected += c.paid_amount
        p.discount += c.discount
        p.total += c.total_amount
        return p
    }, {
        collected: 0,
        discount: 0,
        total: 0
    })

    return (
        <>
            <div className="mt-2 overflow-hidden ">
                <h1 className="px-3 py-2 text-center rounded-t-md text-lg bg-linear-to-r from-indigo-600 to-purple-600 text-white">{months[info.month - 1]}-{info.year}</h1>
                <div className="border-x-2 border-b-2 rounded-b-md overflow-hidden border-gray-200">
                    <div className="p-2 flex flex-col gap-3">
                        {info.fees.sort((a, b) => statusSortPoints[a.status] - statusSortPoints[b.status]).map(f => <FeeGroupRow key={f.id} fee={f} />)}
                    </div>
                    <div className="px-5 py-2 mt-1 flex gap-5 bg-gray-100 justify-end text-sm text-gray-600">
                        <span>Collected : {summery.collected}</span>
                        <span>Discount: {summery.discount}</span>
                        <span>Total: {summery.total}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export type { GroupFeeType, GroupFeeParams }