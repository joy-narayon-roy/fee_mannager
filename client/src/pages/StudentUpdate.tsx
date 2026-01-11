import { useNavigate, useParams } from 'react-router-dom'
import { useMainContext } from '../contexts/MainContext/MainContext'
import Form from '../components/Form'
import InputGroup, { InputGroupSelect } from '../components/InputGroup'
import { Student } from '../models'
import React, { useReducer, } from 'react'
import type { StudentInterface } from '../types/student'
import req from '../tools/apiRequest'

type Status = 'Active' | 'Inactive' | 'Pending';




function updateStateReducer(state: StudentInterface, action: { name: string, value: string }): StudentInterface {
  switch (action.name) {
    case 'name':
      state.name = action.value
      return { ...state }

    case 'class':
      state.class = parseInt(action.value)
      return { ...state }
    case 'fee':
      state.fee = parseInt(action.value)
      return { ...state }
    case 'status':
      if (['Active', 'Inactive', 'Pending'].includes(action.value as Status)) {
        state.status = action.value as Status
        if (action.value == 'Inactive') {
          state.end_date = (new Date()).toISOString().split("T")[0]
        }
      }
      return { ...state }
    case 'start_date':
      state.start_date = action.value
      return { ...state }
    case 'end_date':
      state.end_date = action.value
      return { ...state }
    case 'notes':
      state.notes = action.value
      return { ...state }
    case 'current_schedule':
      state.current_schedule = action.value
      return { ...state }

    default:
      return { ...state }
  }
}

function UpdateForm({ student: initialInfo, updatedStudent = () => { } }: { student: Student, updatedStudent?: (std: Student) => void }) {
  const nav = useNavigate()
  const [student, updateStudent] = useReducer(updateStateReducer, initialInfo)



  const onChange: React.ChangeEventHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
    updateStudent({
      name: ev.target.name,
      value: ev.target.value
    })
  }

  const disableForm = false
  const errorMessage = undefined
  const status_options = ['Active', 'Inactive', 'Pending']

  const onFormCencel = () => { nav(`/student/${student.id}`) }
  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    req.patch('/student/' + initialInfo.id, student).then(({ data }) => {
      updatedStudent(new Student(data))
      nav('/student')
    }).catch(err => {
      console.log("Failed to update!", String(err))
      console.log(err
      )
    })
  }

  return <>
    <Form
      onCencel={onFormCencel}
      onSubmit={onSubmit}
      disabled={disableForm}
      errorMessage={errorMessage}
      submitBtnInnerHTML='Update'
    >
      <InputGroup name="name" label="Name" placeholder="Enter stundent name" required onChange={onChange} value={student.name} />
      <InputGroup name="class" type="number" max={12} min={1} label="Class" placeholder="Enter stundent class" required onChange={onChange} value={student.class} />
      <InputGroup name="short_id" label="Short ID" placeholder="Enter stundent short id" required onChange={onChange} value={student.short_id} />
      <InputGroup name="fee" label="Fee" placeholder="Enter stundent fee amount" type="number" required step={100} max={20000} onChange={onChange} value={student.fee} />
      <InputGroupSelect name="status" label="Status" options={status_options} onChange={onChange} value={student.status} />
      <InputGroupSelect
        name="current_schedule"
        label="Schedules"
        // disabled={true}
        options={
          initialInfo.profile?.schedules.map(s => ({
            [s.id]: s.toShortString()
          })) || []
        }
        onChange={onChange}
        value={student.current_schedule || ''} />

      <InputGroup
        name="start_date"
        label="Start Date"
        placeholder="Enter start date"
        type="date"
        required
        onChange={onChange}
        value={student.start_date.split("T")[0]} />
      <InputGroup name="end_date" label="End Date" placeholder="Enter stundent fee amount" type="date" onChange={onChange} value={student?.end_date?.split("T")[0]} />
      <InputGroup name="notes" label="Note" placeholder="Take some notes." onChange={onChange} value={student.notes} />
    </Form>

  </>
}

export default function UpdateStudent() {
  const { id = '' } = useParams()
  const { profile } = useMainContext()
  const student = profile.getStudentByID(id)
  console.log(student)
  const updatedStudent = (std: Student) => {
    profile.addStudnets([std])
  }

  return student ? <UpdateForm student={student} updatedStudent={updatedStudent} /> : <></>
}
