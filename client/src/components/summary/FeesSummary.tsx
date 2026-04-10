import type { Fee } from "../../models"
import FeeGroupRow from "../fee/FeeGroupRow"
import DropDownItem from "./DropDownItem"

type GroupedFee = {
    month: number,
    year: number,
    total_amount: number,
    paid_amount: number,
    discount_amount: number,
    paid_fees: Fee[],
    unpaid_fees: Fee[]
}
type Props = {
    info: GroupedFee
}
const months = [
    'JAN', 'FAB', 'MAR', 'APR',
    'MAY', 'JUN', 'JUL', 'AUG',
    'SEP', 'OCT', 'NOV', 'DEC',
];
export default function FeesSummary(props: Props) {
    const { info } = props
    const net_amount = info.total_amount - info.discount_amount
    return (
        <>
            <div className="mt-2 overflow-hidden ">
                <h1 className="px-3 py-2 text-center rounded-t-md text-lg bg-linear-to-r from-indigo-600 to-purple-600 text-white">{months[info.month - 1]}-{info.year}</h1>
                <div className="border-x-2 border-b-2 rounded-b-md overflow-hidden border-gray-200">
                    <div className="m-2 flex flex-col gap-2">
                        <h3 className="text-base font-medium text-gray-800 px-5">Total: {info.total_amount} ৳</h3>
                        <h3 className="text-base font-medium text-red-400 px-5">Discount: {info.discount_amount} ৳</h3>
                        <h3 className="text-base font-medium text-gray-800 px-5">Net: {net_amount} ৳</h3>
                        <DropDownItem title={`Paid Amount: ${info.paid_amount} ৳`}>
                            <div className="flex flex-col gap-2 my-2">
                                {info.paid_fees.map(f => <FeeGroupRow key={f.id} mode="FEE" fee={f} />)}
                            </div>
                        </DropDownItem>
                        <DropDownItem title={`Due  Amount: ${net_amount - info.paid_amount} ৳`}>
                            <div className="flex flex-col gap-2 my-2">
                                {info.unpaid_fees.map(f => <FeeGroupRow key={f.id} mode="FEE" fee={f} />)}
                            </div>
                        </DropDownItem>
                    </div>
                    <div className="px-5 py-2 mt-1 flex gap-5 bg-gray-100 justify-end text-sm text-gray-600">
                        <span>Total: {info.total_amount || 0}</span>
                        <span>Discount: {info.discount_amount}</span>
                        <span>Collected : {info.paid_amount || 0}</span>
                    </div>
                </div>
            </div>
        </>
    )
}


export { type GroupedFee }