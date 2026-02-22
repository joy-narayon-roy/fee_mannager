import { NavLink, Outlet, useParams } from "react-router-dom"
import { useMainContext } from "../contexts/MainContext/MainContext"
import StudentProfileCard from "../components/student/StudentProfileCard"
import MainContainer from "../components/MainContainer";

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
            <MainContainer>

                {/* <div className="mx-auto my-2 w-full md:max-w-xl "> */}
                {
                    student ?
                        <StudentProfileCard student={student} />
                        :
                        <h1>Not found</h1>
                }

                <StudentTabs />
                <div className="py-2 px-1 bg-white border border-gray-200 rounded-xl">
                    <Outlet />
                </div>
            </MainContainer>
        </>
    )
}
