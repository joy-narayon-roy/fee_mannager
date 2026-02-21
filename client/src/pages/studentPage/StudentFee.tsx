import { Link, useParams } from "react-router-dom"
import { useMainContext } from "../../contexts/MainContext/MainContext"
import FeeGroupRow from "../../components/fee/FeeGroupRow"

export default function StudentFee() {
    const { id = '' } = useParams()
    const { profile } = useMainContext()
    const fees = profile.getFeeByStudentId(id)
    return (
        <div className="py-2 min-w-xl">
            <div className="flex justify-between">
                <h1 className="text-lg">Fee</h1>
                <Link className="bg-green-600 text-white px-4 py-2 rounded-md" to={`/fee/create?student=${id}`}>+Create</Link>
            </div>
            <div className="py-3 flex flex-col gap-2">
                {fees.map(f => <FeeGroupRow key={f.id} fee={f} mode="STUDENT" />)}
            </div>
        </div>
    )
}
