import FeesSummary, { type GroupedFee } from "../../components/summary/FeesSummary";
import MainContainer from "../../components/MainContainer";
import { useMainContext } from "../../contexts/MainContext/MainContext";


type GroupFees = {
    [year: number]: {
        [month: number]: GroupedFee
    }
}


export default function PaymentSummary() {
    const { profile } = useMainContext()

    const def_gf: GroupFees = {}
    const groupedFee: GroupFees = profile.fees.reduce((pre, curr) => {
        if (!pre[curr.year]) {
            pre[curr.year] = {}
        }
        if (!pre[curr.year][curr.month]) {
            pre[curr.year][curr.month] = {
                year: curr.year,
                month: curr.month,
                discount_amount: 0,
                paid_amount: 0,
                total_amount: 0,
                paid_fees: [],
                unpaid_fees: []
            }
        }

        pre[curr.year][curr.month].total_amount += curr.total_amount
        pre[curr.year][curr.month].discount_amount += curr.discount

        if (curr.status === 'Paid' || curr.status === 'Partial') {
            pre[curr.year][curr.month].paid_amount += curr.paid_amount
            pre[curr.year][curr.month].paid_fees = [...pre[curr.year][curr.month].paid_fees, curr]
        } else {
            pre[curr.year][curr.month].unpaid_fees = [...pre[curr.year][curr.month].unpaid_fees, curr]
        }

        return pre
    }, def_gf)

    const income_fees_by_year = Object.values(groupedFee)
    const income_fees: GroupedFee[] = []

    income_fees_by_year.forEach((inf) => {
        const yf = Object.values(inf).sort((a, b) => b.month - a.month)
        yf.forEach(mf => {
            income_fees.push(mf)
        })
    })

    return (
        <MainContainer className="mt-5">
            <h3 className="text-center text-2xl my-2">Paid</h3>
            <div className="flex flex-col gap-2">
                {income_fees.map(inc_fe => <FeesSummary key={inc_fe.month} info={inc_fe} />)}
            </div>
        </MainContainer>
    )
}
