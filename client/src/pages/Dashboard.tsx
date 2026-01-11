import LiveDateTime from "../components/LiveDateTime";
import { useMainContext } from "../contexts/MainContext/MainContext";
import { Schedule, } from "../models";
import { useEffect, useState } from "react";
import sortBySchedule from "../tools/sortSchedules";
import TodayScheduleTable from "../components/dashboard/TodayScheduleTable";

const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export default function Dashboard() {
    const { profile } = useMainContext()
    const [date, setDate] = useState(new Date())
    const currentTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });


    const today_day = days[date.getDay()]
    const todaySchdules = sortBySchedule(profile.schedules.filter(s => {
        return s.days.filter(d => d.day === today_day).length > 0
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

        <div className="mx-auto md:w-5xl">

            <TodayScheduleTable schedules={todaySchdules} currentTime={currentTime} className="max-w-4xl" />
        </div>
        {/* <div className="">
            <h1 className="text-3xl">Today</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
                            <th className="px-4 py-2 font-semibold text-gray-700 text-center">Class</th>
                            <th className="px-4 py-2 font-semibold text-gray-700 text-center">Amount</th>
                            <th className="px-4 py-2 font-semibold text-gray-700 text-center">Start</th>
                            <th className="px-4 py-2 font-semibold text-gray-700 text-center">End</th>
                        </tr>
                    </thead>
                    <tbody className="space-y-2">
                        {todaySchdules.map(ts => <ScheduleRow
                            key={ts.id}
                            schedule={ts}
                            bg={currentStatus(currentTime, ts.days[0].start_time, ts.days[0].end_time)}
                        />)}
                    </tbody>
                </table>
            </div>
        </div> */}
    </>
}
