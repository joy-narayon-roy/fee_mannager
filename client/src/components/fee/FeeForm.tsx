import React, { useState } from "react";
import Form from "../Form";
import InputGroup, { InputGroupSelect } from "../InputGroup";
import { useMainContext } from "../../contexts/MainContext/MainContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiReq from "../../tools/apiRequest"
import axios from "axios";
import { Fee } from "../../models";

const months = {
    JAN: 1,
    FAB: 2,
    MAR: 3,
    APR: 4,
    MAY: 5,
    JUN: 6,
    JUL: 7,
    AUG: 8,
    SEP: 9,
    OCT: 10,
    NOV: 11,
    DEC: 12,
} as const;

type MonthKey = keyof typeof months;


export default function FeeForm() {
    const date = new Date()
    const currentYear = date.getFullYear()
    const currentMonth = date.getMonth()
    const month_names = Object.keys(months)
    const { profile, addFee } = useMainContext()
    const [sp] = useSearchParams()
    const nav = useNavigate()
    const students = profile.students.filter(s => s.status === 'Active').reduce<Record<string, string>[]>(
        (p, c) => {
            p.push({ [c.id]: `${c.short_id}-${c.name}(${c.class})` })
            return p
        },
        [{ 'no': "Select student" }]
    )


    const [disableForm, setDisableForm] = useState(false)
    const [formError, setFormError] = useState('')
    const [year, setYear] = useState(currentYear || 2026)
    const [month, setMonth] = useState(currentMonth || 1)
    const [student, setStudent] = useState(sp.get('student') || 'no')
    const [discount, setDiscount] = useState(0)

    const option_months = year > date.getFullYear() ? [] : (year === date.getFullYear() ? month_names.splice(0, date.getMonth() + 1) : month_names)

    const updateMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMonth = e.target.value as MonthKey;
        setMonth(months[selectedMonth]);
    };

    const handelFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setDisableForm(p => !p)
        const feeInfo = {
            year, month, student, discount
        }
        apiReq.post('fee', feeInfo).then((res) => {
            setDisableForm(p => !p)
            const fee = new Fee(res.data)
            addFee(fee)
            nav('/fee')
        }).catch(err => {
            if (axios.isAxiosError(err)) {
                setFormError(err.response?.data?.message || 'Unkown axios error!')
            } else {
                setFormError('Failed to create Fee!')
                console.log(err)
            }
            setDisableForm(p => !p)

        })

    }
    const handelCancel = () => {
        nav(-1)
    }

    return (
        <>
            <Form
                errorMessage={formError}
                disabled={disableForm}
                action="none"
                heading="Create Fee"
                submitBtnInnerHTML="Create"
                onSubmit={handelFormSubmit}
                onCencel={handelCancel}
                closeError={() => setFormError('')}
            >

                <InputGroup
                    name="year"
                    label="Year"
                    value={year}
                    max={currentYear}
                    required
                    type="number"
                    onChange={e => setYear(parseInt(e.currentTarget.value))}
                />
                <InputGroupSelect
                    name="month"
                    label="Month"
                    options={option_months}
                    value={month_names[month - 2]}
                    onChange={updateMonth}
                    required
                />
                <InputGroupSelect
                    name="student"
                    label="Student" options={students} value={student} onChange={(e) => setStudent(e.target.value)} required />
                <InputGroup name="discount" type="number" label="Discount" min={0} value={discount} onChange={e => setDiscount(parseInt(e.target.value) || 0)} />
            </Form>
        </>
    )
}
