import { useParams } from "react-router-dom"
import { useMainContext } from "../../contexts/MainContext/MainContext"
import DropDownItem from "../../components/summary/DropDownItem"
import FeeGroupRow from "../../components/fee/FeeGroupRow"
import type { Fee } from "../../models"
import PieChart from "./PieChart"

export default function StudentSummary() {
  const { id = '' } = useParams()
  const { profile } = useMainContext()
  const fees = profile.getFeeByStudentId(id)

  const def_info: {
    total_fee: number,
    total_discount: number,
    total_paid: number,
    paid_fees: Fee[],
    total_due: number,
    due_fees: Fee[]
  } = {
    total_fee: 0,
    total_discount: 0,
    total_paid: 0,
    paid_fees: [],
    total_due: 0,
    due_fees: []
  }

  const info = fees.reduce((pre, curr) => {
    pre.total_fee += curr.total_amount
    pre.total_discount += curr.discount
    pre.total_due += curr.due_amount
    pre.total_paid += curr.paid_amount
    if (curr.status === "Paid") {
      pre.paid_fees.push(curr)
    } else {
      pre.due_fees.push(curr)
    }
    return pre
  }, def_info)

  const chart_data = [
    {
      name: "Discount",
      color: "#eab308",
      value: info.total_discount
    },
    {
      name: "Paid",
      color: "#22c55e",
      value: info.total_paid
    },
    {
      name: "Due",
      color: "#ef4444",
      value: info.total_due
    },
  ]
  return (
    <div className="py-2 w-full md:min-w-xl bg-white">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl pl-5">Summary</h1>
      </div>
      <div className="mt-2 py-3 px-2 flex flex-col gap-2">
        <DropDownItem
          title={`Total Fees (${fees.length}) - ${info.total_fee} Tk.`}>
          <div className="flex flex-col gap-2 my-2">
            {fees.map(f => <FeeGroupRow key={f.id} mode="FEE" fee={f} />)}
          </div>
        </DropDownItem>
        <DropDownItem
          title={`Total Discount - ${info.total_discount} Tk.`}>
          <div className="flex flex-col gap-2 my-2">
            {fees.map(f => <FeeGroupRow key={f.id} mode="FEE" fee={f} />)}
          </div>
        </DropDownItem>
        <DropDownItem
          title={`Total Paid - ${info.total_paid} Tk.`}>
          <div className="flex flex-col gap-2 my-2">
            {info.paid_fees.map(f => <FeeGroupRow key={f.id} mode="FEE" fee={f} />)}
          </div>
        </DropDownItem>
        <DropDownItem
          title={`Total Due - ${info.total_due} Tk.`}>
          <div className="flex flex-col gap-2 my-2">
            {info.due_fees.map(f => <FeeGroupRow key={f.id} mode="FEE" fee={f} />)}
          </div>
        </DropDownItem>


        <PieChart data={chart_data} />

      </div>
    </div>
  )
}
