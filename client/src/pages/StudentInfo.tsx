import { Link, useParams } from "react-router-dom"
import api from "../tools/apiRequest"
import { useMainContext } from "../contexts/MainContext/MainContext"
import StudentProfileCard from "../components/student/StudentProfileCard"
import { ScheduleCardRow } from "../components/schedule/scheduleCard"
import { Student } from "../models"


export default function StudentInfo() {
    const { id = '' } = useParams()
    const { profile, addStudent, removeStudentToSchedule } = useMainContext()

    const student = profile.getStudentByID(id)
    const schedule_ids = student?.getSchedules() || []
    const schedules = schedule_ids.map(id => profile.getScheduleByID(id))

    const handelSetCurrent = async (id: string) => {
        if (!student) {
            return
        }
        try {
            const { data } = await api.patch(`/student/${student.id}`, {
                current_schedule: id
            })
            addStudent(new Student(data))

        } catch (err) {
            console.log("Failed", err)
        }
    }
    const handelRemoveSchedule = async (schedule_id: string) => {
        if (!student) {
            return
        }
        try {
            await removeStudentToSchedule(student.id, schedule_id)
        } catch (err) {
            console.log(err)
        }
    }

    console.log(student)
    return (
        <>
            <div className="mx-auto my-2 md:min-w-3xl ">
                {
                    student ?
                        <StudentProfileCard student={student} />
                        :
                        <h1>Not found</h1>
                }

                <div className="p-2 mt-5">
                    <div className="flex justify-between">
                        <h1 className="text-lg">Schedules</h1>
                        <Link className="bg-green-600 text-white px-4 py-2 rounded-md" to={"/schedule"}>+Add</Link>
                    </div>

                    <div className="">
                        {schedules.map(schedule => schedule ?
                            <ScheduleCardRow key={schedule.id} schedule={schedule} active={student?.current_schedule_ref === schedule.id} handelSelectClicked={handelSetCurrent} handelRemoveClicked={handelRemoveSchedule} />
                            : <></>)}

                    </div>
                </div>
                {/* {schedules.map(schedule => schedule ? <ScheduleCard schedule={schedule} /> : <></>)} */}
            </div>
        </>
    )
}
