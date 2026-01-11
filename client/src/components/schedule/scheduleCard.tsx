import { Link, useNavigate } from "react-router-dom";
import Schedule from "../../models/schedule";
import { FaCheck, FaTrash } from "react-icons/fa";


type Props = {
    schedule: Schedule;
};

function ScheduleCard({ schedule }: Props) {
    const nav = useNavigate()
    const goToSchedule = () => {
        nav(`${schedule.id}`)
    }
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 max-w-3xl">
            {/* Header */}
            <div className="flex items-start justify-between" onClick={goToSchedule}>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        {schedule.name} ({schedule.days.length} Day's)
                    </h2>

                    <p className="text-sm text-gray-500 mt-1 min-h-8">
                        {schedule.note && schedule.note}
                    </p>
                </div>

                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${schedule.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                >
                    {schedule.is_active ? "Active" : "Inactive"}
                </span>
            </div>


            {/* Days Cards */}
            <div className="flex gap-2 flex-wrap">
                {schedule.days.map((d, index) => (
                    <div
                        key={d.day}
                        className={`border border-gray-200 rounded-lg py-2 px-3 max-w-30 text-center
        ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                    >
                        <p className="text-lg font-semibold text-gray-700 uppercase">
                            {d.day}
                        </p>

                        <p className="text-sm font-medium text-gray-900 mt-2">
                            {d.start_time}
                        </p>

                        <p className="text-[0.5rem] text-gray-400 my-1">
                            to
                        </p>

                        <p className="text-sm font-medium text-gray-900">
                            {d.end_time}
                        </p>
                    </div>
                ))}
            </div>


            {/* Days */}
            {/*<div className="space-y-2">
                {schedule.days.map((d) => (
                    <div
                        key={d.day}
                        className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                    >
                        <span className="text-sm font-medium text-gray-700 uppercase">
                            {d.day}
                        </span>
                        <span className="text-sm text-gray-600">
                            {d.start_time} – {d.end_time}
                        </span>
                    </div>
                ))}
            </div>*/}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex gap-5">
                    <p className="text-sm text-gray-500">
                        Students:{" "}
                        <span className="font-medium text-gray-800">
                            {schedule.students?.length ?? 0}
                        </span>
                    </p>
                    <p className="text-sm text-gray-500">
                        Days in week:{" "}
                        <span className="font-medium text-gray-800">
                            {schedule.days.length ?? 0}
                        </span>
                    </p>
                </div>


                <div className="flex gap-3 text-sm">
                    <Link to={`${schedule.id}`} className="text-indigo-600 hover:text-indigo-700 font-medium">
                        View
                    </Link>
                    <button className="text-gray-600 hover:text-gray-800">
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
};

interface RowsProps extends Props {
    active?: boolean
    handelSelectClicked?: (schedule_id: string) => void | Promise<void>
    handelRemoveClicked?: (schedule_id: string) => void | Promise<void>
}

export function ScheduleCardRow({ schedule, active, handelRemoveClicked = () => { }, handelSelectClicked = () => { } }: RowsProps) {
    return (
        <div className={`flex md:flex-row flex-col border-2 border-gray-300 my-2 px-4 py-2 rounded-md items-center ${active && 'bg-green-50 border-green-300'}`}>
            <div className="w-full">
                <Link to={`/schedule/${schedule.id}`} className="text-lg">{schedule.name}</Link>
                <div className="mt-2 flex gap-2 flex-wrap">
                    {schedule.days.map(d => <div key={d.day} className="flex flex-col justify-center text-center px-2 py-1 rounded-md border-2 border-blue-100 bg-gray-50">
                        <span className="text-lg">{d.day.toUpperCase()}</span>
                        <span>{d.start_time}</span>
                    </div>)}
                </div>
            </div>
            <div className="flex flex-row mt-1 md:flex-col gap-2">
                <button disabled={active} className="bg-blue-100 px-4 py-2 rounded text-blue-500" onClick={() => handelSelectClicked(schedule.id)}><FaCheck /></button>
                <button disabled={active} onClick={() => handelRemoveClicked(schedule.id)} className="w-full md:w-fit bg-red-100 px-4 py-2 rounded text-red-500"><FaTrash /></button>
            </div>
        </div>
    )
}

export default ScheduleCard;
