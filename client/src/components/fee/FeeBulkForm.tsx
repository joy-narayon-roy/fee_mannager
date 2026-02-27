import type React from 'react';
import type { Student } from '../../models'
import Fee from '../../models/fee';
import type { FeeInfo, State } from '../../pages/feePage/FeeBulkCreate'
import InputGroup, { InputGroupSelect } from '../InputGroup';
import ButtonMain, { ButtonLite } from '../MainButton';
import MainContainer from '../MainContainer';
import style from './styles/selectedForm.module.css';

type StudentRowProps = {
    student: Student,
    feeInfo: FeeInfo,
    selected?: boolean
    onChange?: (sid: string, key: 'month' | 'year' | 'discount', value: number) => void
    onSeletct?: (student: Student) => void
}
function StudentRow(props: StudentRowProps) {
    const { student, feeInfo, selected = false, onSeletct = () => { }, onChange = () => { } } = props
    const date = new Date()
    const options = Object.entries(Fee.monthsWithIndex).filter(en => (feeInfo.year < date.getFullYear()) ? true : en[1] <= date.getMonth() + 1).map(([month, index]) => ({
        [index]: month
    }))

    return (
        <div className={style.studentRow}>
            <input type="checkbox" onChange={() => onSeletct(student)} checked={selected} />
            <div className='px-4'>
                <div className='flex flex-row justify-between font-semibold mt-2'>
                    <span>{student.short_id} - {student.name}({student.class})</span>
                    <span>{student.fee}</span>
                </div>
                <div className='grid grid-cols-3 grid-rows-1 gap-2'>
                    <InputGroupSelect
                        label='Month'
                        options={options}
                        value={`${feeInfo.month}`}
                        onChange={(e) => onChange(student.id, 'month', parseInt(e.target.value) || 0)}
                    />
                    <InputGroup
                        label='Year'
                        type='number'
                        placeholder='Enter year'
                        max={date.getFullYear()}
                        value={feeInfo.year}
                        onChange={(e) => onChange(student.id, 'year', parseInt(e.target.value) || 0)}
                    />
                    <InputGroup
                        label='Discount'
                        type='number'
                        placeholder='Enter year'
                        onChange={(e) => onChange(student.id, 'discount', parseInt(e.target.value) || 0)}
                        value={feeInfo.discount}
                    />
                </div>

            </div>
        </div>
    )
}
type PropsType = {
    selectedStudents?: State
    goBack?: () => void
    updateStudent?: (sid: string, key: 'month' | 'year' | 'discount', value: number) => void
    removeStudent?: (student: Student) => void
    onSubmit?: (ev: React.FormEvent<HTMLFormElement>) => void
}
export default function FeeBulkForm(props: PropsType) {
    const {
        selectedStudents = {},
        goBack = () => { },
        removeStudent = () => { },
        updateStudent = () => { },
        onSubmit = () => { }
    } = props

    const selectedCount = Object.keys(selectedStudents).length


    return (
        <MainContainer>
            <form className="max-w-2xl mx-auto" onSubmit={onSubmit}>
                <h1 className='mt-5 text-2xl text-center'>Create Bulk Fee</h1>
                <small>Total selected : {selectedCount}</small>
                <div className='flex flex-col gap-2 min-h-64 my-2'>
                    {Object.values(selectedStudents).map(s => (
                        <StudentRow
                            key={s.student.id}
                            feeInfo={s}
                            student={s.student}
                            selected={Boolean(selectedStudents[s.student.id])}
                            onSeletct={removeStudent}
                            onChange={updateStudent}
                        />
                    ))}
                </div>
                <ButtonMain type='submit' disabled={selectedCount === 0} >Create</ButtonMain>
                <ButtonLite type='button' onClick={goBack}>Go Back</ButtonLite>
            </form>
        </MainContainer>
    )
}
