import { useParams } from "react-router-dom"
import { useMainContext } from "../../contexts/MainContext/MainContext"
import FeeInfoTable from "../../components/fee/FeeInfoTable"

export default function FeeInfo() {
    const { id = '' } = useParams()
    const { profile } = useMainContext()
    const fee = profile.getFeeById(id)
    const student = fee?.student
    
    return (
        <>
            <FeeInfoTable fee={fee} student={student} />
            <div>

            </div>
        </>
    )
}
