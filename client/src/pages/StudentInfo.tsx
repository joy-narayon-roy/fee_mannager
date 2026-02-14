import { NavLink, Outlet, useParams } from "react-router-dom"
import { useMainContext } from "../contexts/MainContext/MainContext"
import StudentProfileCard from "../components/student/StudentProfileCard"

function StudentTabs() {
    const tabBase =
        "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200";

    const tabInactive =
        "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

    const tabActive =
        "bg-blue-500 text-white shadow";

    return (
        <div className="flex gap-2 pb-2 mt-10">
            <NavLink
                to=""
                end
                className={({ isActive }) =>
                    `${tabBase} ${isActive ? tabActive : tabInactive}`
                }
            >
                Schedule
            </NavLink>

            <NavLink
                to="fee"
                className={({ isActive }) =>
                    `${tabBase} ${isActive ? tabActive : tabInactive}`
                }
            >
                Fee
            </NavLink>

            <NavLink
                to="payment"
                className={({ isActive }) =>
                    `${tabBase} ${isActive ? tabActive : tabInactive}`
                }
            >
                Payment
            </NavLink>
        </div>
    );
};



export default function StudentInfo() {
    const { id = '' } = useParams()
    const { profile } = useMainContext()
    const student = profile.getStudentByID(id)

    return (
        <>
            <div className="mx-auto my-2 md:min-w-3xl ">
                {
                    student ?
                        <StudentProfileCard student={student} />
                        :
                        <h1>Not found</h1>
                }

                {/* Student navigation */}
                {/* TODO: Add navigation */}
                <StudentTabs />
                {/* <div className="py-2 flex gap-2">
                    <NavLink
                        to=""
                        end
                        className={({ isActive }) => (isActive ? "bg-red-300" : "")}
                    >
                        Schedule
                    </NavLink>

                    <NavLink
                        to="fee"
                        className={({ isActive }) => (isActive ? "bg-red-300" : "")}
                    >
                        Fee
                    </NavLink>

                    <NavLink
                        to="payment"
                        className={({ isActive }) => (isActive ? "bg-red-300" : "")}
                    >
                        Payment
                    </NavLink>
                </div> */}
                <div className="py-2">
                    <Outlet />
                </div>
                {/* <div className="py-2">
                    <div className="flex justify-between">
                        <h1 className="text-lg">Schedules</h1>
                        <Link className="bg-green-600 text-white px-4 py-2 rounded-md" to={"/schedule"}>+Add</Link>
                    </div>

                    <div className="">
                        {schedules.map(schedule => schedule ?
                            <ScheduleCardRow key={schedule.id} schedule={schedule} active={student?.current_schedule_ref === schedule.id} handelSelectClicked={handelSetCurrent} handelRemoveClicked={handelRemoveSchedule} />
                            : <></>)}

                    </div>
                </div> */}
                {/* {schedules.map(schedule => schedule ? <ScheduleCard schedule={schedule} /> : <></>)} */}
            </div>
        </>
    )
}
