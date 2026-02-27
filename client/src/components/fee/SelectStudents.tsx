import MainContainer from '../MainContainer'
import type { Student } from '../../models'
import type { State } from '../../pages/feePage/FeeBulkCreate'
import style from './styles/selectStudents.module.css';
import ButtonMain, { ButtonLite } from '../MainButton';

type StudentRowProps = {
    student: Student,
    selected?: boolean
    onSeletct?: (student: Student) => void
}
function StudentRow(props: StudentRowProps) {
    const { student, selected = false, onSeletct = () => { } } = props
    return (
        <div className={`${style['student-row']} ${selected ? style.selected : ""}`}>
            <input type="checkbox" onChange={() => onSeletct(student)} checked={selected} />
            <span onClick={() => onSeletct(student)}>{student.short_id} - {student.name}({student.class})</span>
            <span onClick={() => onSeletct(student)}>{student.fee}</span>
        </div>
    )
}

type PropsType = {
    students?: Student[]
    selectedStudents?: State
    next?: () => void
    goBack?: () => void
    onSelectStudent?: (student: Student) => void
}
export default function SelectStudents(props: PropsType) {
    const {
        students = [],
        selectedStudents = {},
        goBack = () => { },
        next = () => { },
        onSelectStudent = () => { }
    } = props

    const selectedCount = Object.keys(selectedStudents).length

    const selectAll = () => {
        students.forEach(s => {
            onSelectStudent(s)
        })
    }
    return (
        <MainContainer>
            <h1 className='mt-5 text-2xl text-center'>Select Studnts</h1>
            <div className='flex gap-2 px-2'>
                <input type="checkbox" onChange={selectAll} checked={selectedCount === students.length} />
                <label htmlFor="">Select All</label>
            </div>
            <div className='flex flex-col gap-2 min-h-48'>
                {students.map(s => (
                    <StudentRow
                        key={s.id}
                        student={s}
                        selected={Boolean(selectedStudents[s.id])}
                        onSeletct={onSelectStudent}
                    />
                ))}
            </div>
            <ButtonMain disabled={selectedCount === 0} onClick={next}>Next</ButtonMain>
            <ButtonLite onClick={goBack}>Cancel</ButtonLite>
        </MainContainer>
    )
}
