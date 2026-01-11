import type { Student } from "../../models";
import { FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


type Props = {
    student?: Student | undefined;
};

function StudentProfileCard({ student }: Props) {
    const nav = useNavigate()
    if (!student) {
        return <></>
    }
    const onEdit = () => {
        nav("/student/update/" + student.id)
    }
    return (
        <section className="bg-white border border-gray-200 rounded-xl p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 text-xl font-semibold">
                        {student.name.charAt(0)}
                    </span>
                </div>

                <div>
                    <div className=" flex flex-row items-center gap-8">
                        <h1 className="text-xl font-semibold text-gray-900">
                            {student.name}

                        </h1><span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
          ${student.status === "Active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                        >
                            {student.status}
                        </span>
                    </div>

                    <p className="text-sm text-gray-500 mt-1">
                        ID: <span className="font-medium">{student.id}</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1 flex justify-between items-center">
                        <span>
                            Short ID: <span className="font-medium">{student.short_id}</span>
                        </span>
                        <button onClick={onEdit} className="bg-gray-200 float-right rounded-full p-2 text-text-primary"><FaPen size={15} /></button>
                    </p>
                </div>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-gray-200" />

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <ProfileItem
                    label="Class"
                    value={`${student.class}` || "—"}
                />
                <ProfileItem
                    label="Fee"
                    value={`${student.fee}` || "—"}
                />

                {/* <ProfileItem
                    label="Phone"
                    value={student.phone || "—"}
                />
                <ProfileItem
                    label="Guardian"
                    value={student.guardian_name || "—"}
                />
                */}
                <ProfileItem
                    label="Statrt At"
                    value={formatDate(student.start_date)}
                />
                <ProfileItem
                    label="End Date"
                    value={formatDate(student.end_date)}
                />
            </div>
            <div className="mt-4">
                <ProfileItem label="Note" value={student.notes} />
            </div>
        </section>
    );
};

export default StudentProfileCard;

/* ---------------- Helpers ---------------- */

const ProfileItem = ({
    label,
    value,
}: {
    label: string;
    value: string;
}) => (
    <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-800 mt-1">{value}</p>
    </div>
);

const formatDate = (date: string) => {
    if (date === '' || !date) {
        return '-'
    }
    return new Date(date).toLocaleDateString();
}
