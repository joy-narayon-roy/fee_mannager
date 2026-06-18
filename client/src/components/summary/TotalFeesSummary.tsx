
type TotalFees = {
    year: number,
    total_amount: number,
    discount_amount: number,
    paid_amount: number,
}
type Props = {
    info: TotalFees
}

export default function TotalFeesSummary(props: Props) {
    const { info } = props
    const net_amount = info.total_amount - info.discount_amount
    const due_amount = net_amount - info.paid_amount
    return (
        <>
            <div className="mt-2 overflow-hidden ">
                <h1 className="px-3 py-2 text-center rounded-t-md text-lg bg-linear-to-r from-indigo-600 to-purple-600 text-white">Total - {info.year}</h1>
                <div className="border-x-2 border-b-2 rounded-b-md overflow-hidden border-gray-200">
                    <div className="m-2 flex flex-col gap-2">
                        <h3 className="text-base font-medium text-gray-800 px-5">Total: {info.total_amount} ৳</h3>
                        <h3 className="text-base font-medium text-red-400 px-5">Discount: {info.discount_amount} ৳</h3>
                        <h3 className="text-base font-medium text-gray-800 px-5">Net: {net_amount} ৳</h3>
                        <h3 className="text-base font-medium text-gray-800 px-5">Paid: {info.paid_amount} ৳</h3>
                        <h3 className="text-base font-medium text-gray-800 px-5">Due: {due_amount} ৳</h3>
                    </div>
                    <div className="px-5 py-2 mt-1 flex gap-5 bg-gray-100 justify-end text-sm text-gray-600">
                        <span>Total: {info.total_amount || 0}</span>
                        <span>Discount: {info.discount_amount}</span>
                        <span>Paid : {info.paid_amount || 0}</span>
                    </div>
                </div>
            </div>
        </>
    )
}


export { type TotalFees }