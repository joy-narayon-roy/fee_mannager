import { parse, isBefore, isAfter, isEqual } from "date-fns";
import type { Schedule } from "../../models"
import style from './styles/todayscheduletable.module.css';
import { calculateDuration, calculateDurationMinutes } from "../../tools/calculateDuration";
import { useNavigate } from "react-router-dom";

type Status = 'success' | 'pending' | 'done'
interface Props {
    className?: string | undefined
    schedules?: Schedule[]
    currentTime?: string
    showInfo?: boolean
}
interface RowProps {
    schedule: Schedule
    bg?: Status
    showInfo?: boolean
}

function parseTime(time: string): Date {
    // Uses today’s date + provided time
    return parse(time, "hh:mm a", new Date());
}
function currentStatus(
    curr_time?: string,
    start_time?: string,
    end_time?: string
): Status {
    if (!curr_time || !start_time || !end_time) {
        return "done";
    }

    const current = parseTime(curr_time);
    const start = parseTime(start_time);
    const end = parseTime(end_time);

    if (isBefore(current, start)) {
        return "success";
    }

    if (
        (isAfter(current, start) || isEqual(current, start)) &&
        isBefore(current, end)
    ) {
        return "pending";
    }

    return "done";
}

function Row(props: RowProps) {
    const nav = useNavigate()
    const { schedule, bg = "success", showInfo = false } = props
    const amount = schedule.students.reduce((pre, curr) => pre + curr.fee, 0)
    const total_students = schedule.students.length
    const duration = calculateDuration(props.schedule.days[0].start_time, props.schedule.days[0].end_time)


    let row_class = "border-2 overflow-hidden "
    switch (bg) {
        case 'success':
            row_class += 'bg-green-50  border-green-400'
            break;
        case 'pending':
            row_class += 'bg-amber-50  border-amber-400'
            break;
        case 'done':
            row_class += 'bg-blue-50  border-blue-400'
            break;

        default:
            break;
    }

    return <div className={`${style.table_row} ${row_class}`} onClick={() => nav(`/schedule/${props.schedule.id}`)}>
        <span>{showInfo ? (schedule.students[0]?.name || 'No Student') : schedule.students[0]?.short_id || 'No Student'} {total_students > 1 && `(+${total_students - 1})`}<br /><span className="text-gray-400" style={{ fontSize: '0.75rem' }}>{duration}</span></span>
        <span>{schedule.students[0]?.class || '-'}</span>
        <span>{showInfo ? (amount || '-') : (amount ? parseFloat(`${amount / 1000}`).toFixed(2) : '-')}</span>
        <span>{schedule.days[0]?.start_time || '-'}</span>
        <span>{schedule.days[0]?.end_time || '-'}</span>
    </div>
}

export default function TodayScheduleTable(props: Props) {
    const { schedules = [], className = '', currentTime = '', showInfo = false } = props
    const total_minutes = schedules.reduce((p, c) => p + calculateDurationMinutes(c.days[0].start_time, c.days[0].end_time), 0)

    const remain_minutes = total_minutes % 60
    const total_hours = (total_minutes - remain_minutes) / 60
    return (
        <div className={`${style.table} ${className}`}>
            <div className={style.table_head}>
                <span>Name</span>
                <span>Class</span>
                <span>Grade</span>
                <span>Start</span>
                <span>Finish</span>
            </div>
            <div className={style.table_body}>
                {schedules.map(s => <Row key={s.id} schedule={s} bg={currentStatus(currentTime, s.days[0].start_time, s.days[0].end_time)} showInfo={showInfo} />)}
            </div>
            <div className={style.table_footer}>
                <span>{" "}</span>
                <span>{" "}</span>
                <span>{" "}</span>
                <span>{" "}</span>
                <span>{total_hours}h {remain_minutes}m</span>
            </div>
        </div>
    )
}
