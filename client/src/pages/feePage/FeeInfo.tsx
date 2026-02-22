import { useParams } from "react-router-dom"
import { useMainContext } from "../../contexts/MainContext/MainContext"
import FeeInfoTable from "../../components/fee/FeeInfoTable"
import type { Payment } from "../../models"
import { formatDate } from "date-fns"

function PaymentCard({ payment }: { payment: Payment }) {
    return (<>
        <div className="p-2 border border-gray-400 rounded-md">
            <table>
                <tbody>
                    <tr>
                        <td>Amount</td>
                        <td>:</td>
                        <td className="pl-1">{payment.amount}৳</td>
                    </tr>
                    <tr>
                        <td>Date</td>
                        <td>:</td>
                        <td className="pl-1">{formatDate(payment.date, 'dd/MM/yy')}</td>
                    </tr>
                    <tr>
                        <td>Fees</td>
                        <td>:</td>
                        <td className="pl-1">{payment.fees.length}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </>)
}

export default function FeeInfo() {
    const { id = '' } = useParams()
    const { profile } = useMainContext()
    const fee = profile.getFeeById(id)
    const student = fee?.student
    const payments = profile.getPaymentsByFeeId(fee?.id || '')

    return (
        <>
            <FeeInfoTable fee={fee} student={student} />
            <div className="mt-5 mx-auto w-full md:max-w-2xl">
                <h1 className="text-center text-3xl">Payments</h1>
                <div className="mt-2 flex flex-col md:flex-row flex-wrap gap-2 justify-center">
                    {payments.map(p => <PaymentCard key={p.id} payment={p} />)}
                </div>
            </div>
        </>
    )
}
