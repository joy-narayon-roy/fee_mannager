import LiveDateTime from "../components/LiveDateTime";
import { useMainContext } from "../contexts/MainContext/MainContext";
import {  Schedule, } from "../models";
import { useEffect, useState } from "react";
import sortBySchedule from "../tools/sortSchedules";
import TodayScheduleTable from "../components/dashboard/TodayScheduleTable";

const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

// function getTodayStudentAndSchedule(profile: Profile) {
//     const current_schs = profile.students
//         .filter(s => s.status && s.current_schedule_ref)
//         .map(s => s.current_schedule_ref)
//         .filter((s): s is string => typeof s === 'string');
//     console.log(current_schs.map(s => profile.getScheduleByID(s)))
// }

export default function Dashboard() {
    const { profile } = useMainContext()
    const [date, setDate] = useState(new Date())
    const [showInfo, setShowInfo] = useState(false)
    const currentTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });


    const today_day = days[date.getDay()]

    // profile.todayStudentSchedule(today_day)

    const todaySchdules = sortBySchedule(profile.schedules.filter(s => {
        return s.days.filter(d => d.day === today_day).length > 0 && s.students.length > 0 && s.is_active
    }).map(s => {
        const stu = new Schedule({ ...s })
        stu.id = s.id
        stu.days = s.days.filter(d => d.day === today_day)
        stu.profile = s.profile
        return stu
    }), currentTime)

    useEffect(() => {
        const inter = setInterval(() => {
            setDate(new Date())
        }, 5000);

        return () => {
            clearInterval(inter)
        }
    }, [])


    return <>
        <h1 className="text-2xl">Deshboard</h1>
        {/* Today date section */}
        <LiveDateTime />

        <div className="w-full mx-auto mt-5 md:w-5xl">
            <div className="my-2 flex gap-2">
                <input type="checkbox" checked={showInfo} name="show_info" onChange={() => setShowInfo(p => !p)} />
                <label htmlFor="show_info">Show Info</label>
            </div>
            <TodayScheduleTable schedules={todaySchdules} currentTime={currentTime} className="max-w-4xl" showInfo={showInfo} />
        </div>
    </>
}
