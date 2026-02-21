import { Link, useNavigate } from "react-router-dom"
import { Fee } from "../../models"
import style from './styles/feeGroup.module.css';

export default function FeeGroupRow({ fee, mode = 'FEE' }: { fee: Fee, mode?: 'STUDENT' | 'FEE' }) {
    const nav = useNavigate()
    const student = fee.student
    const { paid_amount, total_amount, discount, status } = fee
    const goToFee = () => {
        nav(`/fee/${fee.id}`)
    }
    const content = mode === 'FEE' ? student?.name || '-' : `${fee.monthString}-${fee.year}`
    return (
        <div className={style.fee_row}>
            <span className="text-center" onClick={goToFee}>{student?.short_id || 'NO'}</span>
            <span onClick={goToFee}><span className={`${style['status']} ${`${style['status']} ${style['status-' + status.toLowerCase()]}`}`}> </span> {' '}{content}</span>
            <span className="text-center" onClick={goToFee}>{student?.class}</span>
            <span className="text-center" onClick={goToFee}>{paid_amount}/{total_amount - discount}</span>
            <span>
                <Link to={`/payment/pay?fee=${fee.id}&student=${student?.id || ''}`} className={style['pay-btn']}>Pay</Link>
            </span>
        </div>
    )
}