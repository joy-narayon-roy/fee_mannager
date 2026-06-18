import { useMainContext } from "../../contexts/MainContext/MainContext"
import SummaryCard from '../../components/SummaryCard';
import { FaCalendar, FaDollarSign, FaGraduationCap } from "react-icons/fa";
import PaymentSummary from "./PaymentSummary";
import MainContainer from "../../components/MainContainer";

function formatNumber(value: number): string {
    if (value > 1000) {
        return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return value.toString();
}

export default function Summary() {
    const { profile } = useMainContext()
    const students = profile.students
    const totalAmount = students.filter(s => s.status === 'Active').reduce((pre, curr) => pre += curr.fee, 0)
    const totalAmount_formated = formatNumber(totalAmount)
    return (
        <>
            <MainContainer>
                <div className="flex flex-wrap justify-around w-full gap-2">
                    <SummaryCard bg="green" label="Student" amount={students.length} icone={<FaGraduationCap />} moreInfoUrl="/student" />
                    <SummaryCard bg="blue" label="Tk/mon" amount={totalAmount_formated} icone={<FaDollarSign />} />
                    <SummaryCard bg="yellow" label="Schdule" amount={profile.totalSchedules} icone={<FaCalendar />} moreInfoUrl="/schedule" />
                </div>
            </MainContainer>
            <PaymentSummary />
        </>
    )
}
