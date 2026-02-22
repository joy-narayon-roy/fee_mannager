import { Link, useNavigate, useParams } from "react-router-dom"
import { useMainContext } from "../../contexts/MainContext/MainContext"
import type { Payment } from "../../models"
import { format } from "date-fns"

function PaymentRow({ payment }: { payment: Payment }) {
    const nav = useNavigate()
    const goToPayment = () => nav(`/payment/${payment.id}`)
    return (<>
        <div onClick={goToPayment} className="flex flex-wrap justify-between px-4 py-2 border border-gray-200 rounded-md">
            <span>{format(payment.date, 'dd/MM/yy - hh:mm a')}</span>
            <span>{payment.amount} ৳</span>
        </div>
    </>)
}

export default function StudentPayment() {
    const { id = '' } = useParams()
    const { profile } = useMainContext()
    const payments = profile.getPaymentByStudentId(id)
    const total = payments.reduce((p, c) => p + (c.amount || 0), 0)
    return (
        <div className="py-2 px-2">
            <div className="flex items-center justify-between">
                <h1 className="text-lg">Payments ({payments.length}) - Total: {total}৳</h1>
                <Link className="bg-green-600 text-white px-4 py-2 rounded-md" to={`/payment/pay?student=${id}`}>+Pay</Link>
            </div>
            <div className="mt-4 flex flex-col gap-1">
                {payments.map(pay => <PaymentRow key={pay.id} payment={pay} />)}
            </div>
        </div>
    )
}

