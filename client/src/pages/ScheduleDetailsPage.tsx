import { Link, useNavigate, useParams } from "react-router-dom";
import { useMainContext } from "../contexts/MainContext/MainContext";
import SchduleStudentTable from '../components/schedule/SchduleStudentTable';
import { FaPen, FaTrash } from "react-icons/fa";
import type React from "react";
import req from "../tools/apiRequest";

export type StudentMini = {
    _id: string;
    name: string;
    short_id: string;
    phone?: string;
    status: "active" | "inactive";
};

export type ScheduleDetails = {
    _id: string;
    name: string;
    is_active: boolean;
    note?: string;
    days: {
        day: string;
        start_time: string;
        end_time: string;
    }[];
    students: StudentMini[];
};

function ScheduleDetailsPage() {
    const nav = useNavigate()
    const { id = "" } = useParams()
    const { profile, addStudentToSchedule, removeStudentToSchedule, deleteSchedule } = useMainContext()
    const schedule = profile.getScheduleByID(id)
    if (!schedule) {
        return <></>
    }

    const addScheduleStudent = (stdId: string) => {
        addStudentToSchedule(stdId, id)
    }

    const removeScheduleStudent = async (_e: React.MouseEvent<HTMLButtonElement>, student_id: string) => {
        const student = profile.getStudentByID(student_id)
        if (!student) {
            return
        }

        const confirmed = window.confirm("Want to remove " + id + "?")
        if (!confirmed) {
            return
        }
        try {
            await removeStudentToSchedule(student_id, id)
        } catch (err) {
            if (err instanceof Error) {
                alert("ERROR: " + err.message)
            }
            alert("Failed to remove")
            console.log(err)
        }
    }

    const deleteClick = () => {
        const is_ok = prompt("Want to delete? Type: ok", "")
        if (is_ok !== 'ok') {
            return
        }


        req.delete(`/schedule/${id}`).then(() => {
            deleteSchedule(schedule)
            nav(-1)
        }).catch(err => {
            alert("Failed to delete schedule!")
            console.log("ERROR", err)
        })
    }

    return (
        <div className="space-y-6 md:min-w-4xl my-10 mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                        {schedule.name}
                    </h1>
                    <p className="text-sm text-gray-500">
                        <b className="font-bold">{schedule.days.length}</b> days in week.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link className="bg-gray-200 rounded-full p-2 text-text-primary" to={`/schedule/update/${id}`}><FaPen size={20} /></Link>
                    <button onClick={deleteClick} className="p-2 text-red-400 hover:bg-red-100 rounded-full"><FaTrash size={20} /></button>
                </div>
            </div>

            {/* Schedule Summary */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Weekly Schedule
                    </p>

                    <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${schedule.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                    >
                        {schedule.is_active ? "Active" : "Inactive"}
                    </span>
                </div>

                {/* Days */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {schedule.days.map((d, i) => (
                        <div
                            key={d.day}
                            className={`border border-gray-200 rounded-lg p-3 text-center
                ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                        >
                            <p className="text-sm font-semibold text-gray-700 uppercase">
                                {d.day}
                            </p>
                            <p className="text-sm font-medium text-gray-900 mt-2">
                                {d.start_time}
                            </p>
                            <p className="text-xs text-gray-400 my-1">to</p>
                            <p className="text-sm font-medium text-gray-900">
                                {d.end_time}
                            </p>
                        </div>
                    ))}
                </div>

                {schedule.note && (
                    <p className="text-sm text-gray-500">{schedule.note}</p>
                )}
            </div>

            {/* Assigned Students */}
            <SchduleStudentTable students={schedule.students || []} addStudnet={addScheduleStudent} removeStudent={removeScheduleStudent} profile={profile} />
        </div>
    );
};

export default ScheduleDetailsPage;
