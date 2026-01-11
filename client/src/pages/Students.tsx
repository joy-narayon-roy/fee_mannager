import { useNavigate } from "react-router-dom";
import StudentTable from "../components/student/StudentTable";
import { useMainContext } from "../contexts/MainContext/MainContext";

export default function Students() {
    const nav = useNavigate()
    const mainCtx = useMainContext()
    const handelClick = (id: string) => {
        nav(id)
    }
    return (
        <div className="mt-5">
            <StudentTable data={Object.values(mainCtx.profile.students || {})} onRowClick={handelClick} />
        </div>
    )
}
