import { IoMdClose } from 'react-icons/io';
import { Profile, Student } from '../../models';
import MainButton from '../MainButton';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
type StudentsTableProps = {
    students: Student[];
    profile: Profile;
    addStudnet?: (student_id: string) => void,
    removeStudent?: (ev: React.MouseEvent<HTMLButtonElement>, student_id: string) => (Promise<void> | void) | undefined
};

export default function StudentsTable({ students, removeStudent = () => { }, addStudnet = () => { }, profile }: StudentsTableProps) {
    const nav = useNavigate()
    const [showUserInput, setShowUserInput] = useState(false)
    const selectTagRef = useRef<HTMLSelectElement>(null)
    const addBtnClick = () => {
        setShowUserInput(true)

        if (selectTagRef.current) {
            console.log(selectTagRef.current.focus())
        }
    }
    const closeBtnClick = () => setShowUserInput(false)

    const handelUserInput = (e: React.FormEvent<HTMLSelectElement>) => {
        addStudnet(e.currentTarget.value)
        setShowUserInput(false)
    }

    const goToStudent = (sid: string) => {
        nav(`/student/${sid}`)
    }
    return (
        <div>

            <div className='flex items-center justify-between my-5'>
                <h1 className='text-xl font-bold'>Students</h1>
                <MainButton onClick={addBtnClick} className='inline max-w-fit'>+ADD</MainButton>
            </div>

            {showUserInput && <div className="flex gap-5">
                <select ref={selectTagRef} onChange={handelUserInput} className='w-full border-2 border-green-600'>
                    <option value={''}>Select Studnet</option>
                    {profile.students.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
                </select>
                <button onClick={closeBtnClick}><IoMdClose /></button>
            </div>}

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                                ID
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                                Name
                            </th>
                            {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                            Phone
                            </th> */}
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                                Status
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.map((s) => (
                            <tr
                                key={s.id}
                                className="border-b border-gray-100 hover:bg-gray-50"
                            >
                                <td className="px-4 py-3 text-sm text-gray-700" onClick={() => goToStudent(s.id)}
                                >
                                    {s.short_id}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-800" onClick={() => goToStudent(s.id)}
                                >
                                    {s.name}
                                </td>
                                {/* <td className="px-4 py-3 text-sm text-gray-600">
                                {s.phone || "—"}
                            </td> */}
                                <td className="px-4 py-3">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${s.status === "Active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {s.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={e => removeStudent(e, s.id)} className="text-red-600 hover:text-red-700 text-sm font-medium">
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {students.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-6 text-center text-sm text-gray-500"
                                >
                                    No students assigned to this schedule
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};