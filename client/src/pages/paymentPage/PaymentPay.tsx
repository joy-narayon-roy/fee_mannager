import { useSearchParams } from "react-router-dom"
import InputGroup, { InputGroupSelect } from "../../components/InputGroup"
import { useMainContext } from "../../contexts/MainContext/MainContext"
import type React from "react"
import { useState } from "react"
import MainButton from "../../components/MainButton"
import api from '../../tools/apiRequest';
export default function PaymentPay() {
    const [sp, setSp] = useSearchParams()
    const student_id = sp.get('student') || ''
    const fee_id = sp.get('fee') || ''
    const { profile } = useMainContext()
    const students = profile.students.map(s => ({ [s.id]: `${s.short_id}-${s.name}(${s.class})` }))
    const student = profile.getStudentByID(student_id)
    const fee_info = profile.getFeeById(fee_id)
    const [amount, setAmount] = useState(fee_info?.due_amount || 1000)

    const onSelectHandel = (ev: React.ChangeEvent<HTMLSelectElement>) => {
        const sid = ev.target.value
        setSp((pre) => {
            pre.set('student', sid)
            return pre
        })
    }

    const onFormSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault()
        const payload = {
            student: student_id,
            amount
        }
        api.post('/payment', payload).then(res => {
            console.log(res.data)
        }).catch(err => {
            console.log(err)
        })
    }
    return (
        <form onSubmit={onFormSubmit} className="mx-auto w-full md:max-w-md">
            <InputGroupSelect
                name="student"
                label="Student"
                onChange={onSelectHandel}
                options={[{ '': "Select student" }, ...students]}
                value={student?.id}
                required
            />
            <InputGroup
                name="amount"
                label="Amount"
                type="number"
                min={1}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                value={amount}
                required
            />
            <MainButton type="submit" disabled={student ? false : true} >Pay</MainButton>
        </form>
    )
}
