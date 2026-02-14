import { useMainContext } from "../contexts/MainContext/MainContext"
import SummaryCard from '../components/SummaryCard';
import { FaCalendar, FaDollarSign, FaGraduationCap } from "react-icons/fa";
export default function Summary() {
    const { profile } = useMainContext()
    const students = profile.students
    const totalAmount = students.filter(s=>s.status==='Active').reduce((pre, curr) => pre += curr.fee, 0)
    return (
        <>
            <div className="flex flex-wrap justify-around gap-2 w-fit">
                <SummaryCard bg="green" label="Student" amount={students.length} icone={<FaGraduationCap />} moreInfoUrl="/student" />
                <SummaryCard bg="blue" label="Tk/mon" amount={totalAmount} icone={<FaDollarSign />} />
                <SummaryCard bg="yellow" label="Schdule" amount={profile.totalSchedules} icone={<FaCalendar />} moreInfoUrl="/schedule"/>
            </div>
        </>
    )
    return (
        <div>Summary.page</div>
    )
}
