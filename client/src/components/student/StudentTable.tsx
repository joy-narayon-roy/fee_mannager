import { useMemo, useState } from "react";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import { Student } from "../../models";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";


type SortKey = keyof Student;
type SortOrder = "asc" | "desc";

type Props = {
    data: Student[];
    onRowClick?: (id: string) => void;
};

function Status(props: { status: 'Active' | "Pending" | "Inactive" }) {
    let status_class = 'bg-gray-500 outline-gray-100'
    switch (props.status) {
        case 'Active':
            status_class = 'bg-green-500 outline-green-100'
            break;
        case 'Pending':
            status_class = 'bg-amber-500 outline-amber-100'
            break;
        case 'Inactive':
            status_class = 'bg-gray-500 outline-gray-100'
            break;

        default:
            status_class = 'bg-gray-500 outline-gray-100'
            break;
    }
    return <div className={`w-4 h-4 outline-3 ${status_class} rounded-sm`}></div>
}

export default function StudentTable({ data, onRowClick = () => { } }: Props) {
    const [sortConfig, setSortConfig] = useState<{
        key: SortKey;
        order: SortOrder;
    } | null>(null);

    const sortedData = useMemo(() => {
        if (!sortConfig) return data;

        const { key = "id" as keyof typeof data[number], order } = sortConfig;

        return [...data].sort((a, b) => {
            const aValue = a[key];
            const bValue = b[key];

            if (aValue && bValue) {
                if (aValue < bValue) return order === "asc" ? -1 : 1;
                if (aValue > bValue) return order === "asc" ? 1 : -1;
            }

            return 0;
        });
    }, [data, sortConfig]);

    const onSort = (key: SortKey) => {
        setSortConfig((prev) => ({
            key,
            order:
                prev?.key === key && prev.order === "asc" ? "desc" : "asc",
        }));
    };

    const SortIcon = ({ column }: { column: SortKey }) => {

        return sortConfig?.key === column ? (
            sortConfig.order === "asc" ? (
                <FiArrowUp className="text-indigo-600" />
            ) : (
                <FiArrowDown className="text-indigo-600" />
            )
        ) : (
            <FiArrowUp className="opacity-30" />
        );
    }

    return (
        <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl">
            <div className="p-4 pt-6 flex flex-row gap-5">
                <h1 className="text-3xl">Students</h1>
                <Link to={'create'} className="flex items-center gap-2 outline-0 bg-primary text-white px-4 py-2 rounded-md"><FaPlus size={20} />ADD</Link>
            </div>
            <div className="overflow-x-auto px-6 py-2">
                <table className="w-full border-separate border-spacing-y-3">
                    <thead>
                        <tr className="bg-linear-to-r from-indigo-600 to-purple-600 text-white">
                            {(["id", "name", "status", "class", "fee"] as SortKey[]).map(
                                (key) => (
                                    <th
                                        key={key}
                                        scope="col"
                                        className={`px-6 py-4 text-left font-semibold first:rounded-l-lg last:rounded-r-lg`}
                                    >
                                        <button
                                            onClick={() => onSort(key)}
                                            className="flex items-center gap-2 hover:opacity-90"
                                        >
                                            {key.toUpperCase()}
                                            <SortIcon column={key} />
                                        </button>
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {sortedData.map((student) => (
                            <tr
                                key={student.id}
                                className="bg-white shadow-md rounded-lg hover:shadow-lg transition"
                                onClick={() => onRowClick(student.id)}
                            >
                                <td className="px-6 py-4 font-semibold rounded-l-lg">
                                    {student.short_id}
                                </td>
                                <td className="px-6 py-4">{student.name}</td>
                                <td className="px-6 py-4 flex items-center gap-1 justify-start"><Status status={student.status} />{student.status}</td>
                                <td className="px-6 py-4">{student.class}</td>
                                <td className="px-6 py-4 rounded-r-lg">
                                    {student.fee}
                                </td>
                            </tr>
                        ))}

                        <tr className="bg-white shadow-md rounded-lg hover:shadow-lg transition"
                        >
                            <td className='px-6 py-4 font-semibold rounded-l-lg'>{" "}</td>
                            <td className='px-6 py-4'>{" "}</td>
                            <td className='px-6 py-4'>{" "}</td>
                            <td className='px-6 py-4'>{" "}</td>
                            <td className='px-6 py-4 font-semibold rounded-r-lg'>{sortedData.reduce((p, s) => p + s.fee, 0)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
