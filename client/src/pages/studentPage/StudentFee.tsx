import { Link, useParams } from "react-router-dom"
import { useMainContext } from "../../contexts/MainContext/MainContext"
import FeeGroupRow from "../../components/fee/FeeGroupRow"

export default function StudentFee() {
    const { id = '' } = useParams()
    const { profile } = useMainContext()
    const fees = profile.getFeeByStudentId(id)
    return (
        <div className="py-2 w-full md:min-w-xl bg-white">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl pl-5">Fees</h1>
                <Link className="bg-green-600 text-white px-4 py-2 rounded-md" to={`/fee/create?student=${id}`}>+Create</Link>
            </div>
            <div className="mt-2 py-3 flex flex-col gap-2">
                {fees.map(f => <FeeGroupRow key={f.id} fee={f} mode="STUDENT" />)}
            </div>
        </div>
    )
}
