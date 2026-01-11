import React, { useReducer, useState } from "react";
import Form from "../components/Form";
import InputGroup, { InputGroupSelect } from "../components/InputGroup";
import type { StudentInterface } from "../types/student";
import { useNavigate } from "react-router-dom";
import { Student } from "../models";
import axios from "axios";
import { useMainContext } from "../contexts/MainContext/MainContext";


type ReducerAction = { name: string; value: string }

function userFormReducer(state: StudentInterface, action: ReducerAction): StudentInterface {
  switch (action.name) {
    case "name":
      state.name = action.value
      state.short_id = state.name.trim().toUpperCase().replaceAll(" ", "_")
      if (state.short_id.length > 3) {
        state.short_id = state.short_id.substring(0, 3)

      }
      return { ...state }
    case "class":
      state.class = parseInt(action.value)
      return { ...state }
    case "short_id":
      state.short_id = action.value.trim()
      return { ...state }
    case "fee":
      state.fee = parseInt(action.value)
      return { ...state }
    case 'status':
      if (action.value.toUpperCase() === 'Active'.toUpperCase()) {
        state.status = 'Active'
      } else if (action.value.toUpperCase() === 'Pending'.toUpperCase()) {
        state.status = 'Pending'
      } else if (action.value.toUpperCase() === 'Inactive'.toUpperCase()) {
        state.status = 'Inactive'
      }
      return { ...state }

    case 'start_date':
      state.start_date = action.value
      return { ...state }
      
    case 'current_schedule':
      state.current_schedule = action.value
      return { ...state }
    default:
      return state;
  }
}


export default function CreateStudent() {
  const nav = useNavigate()
  const mainCtx = useMainContext()
  const defStudent: StudentInterface = {
    class: 5,
    end_date: "",
    fee: 1000,
    name: "",
    notes: "",
    short_id: "",
    status: "Pending",
    start_date: (new Date()).toISOString().split("T")[0]
  }
  const [state, updateState] = useReducer(userFormReducer, defStudent);
  const [disableForm, setDisableForm] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const status_options = ["Active", "Inactive", "Pending"]
  // const schedules = [""]

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateState({ name: e.target.name, value: e.target.value })
  }
  const { name, class: s_class, short_id, fee, start_date, notes, status, current_schedule } = state

  const onFormCencel = () => {
    nav(-1)
  }
  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    setDisableForm(true)
    try {
      const student = await Student.createStudent(state)
      mainCtx.profile.addStudnets([student])
      nav(-1)
    } catch (err) {

      if (axios.isAxiosError(err)) {
        setErrorMessage(err?.response?.data?.message || 'Failed to create student')
      } else {

        setErrorMessage('Failed to create student')
      }
    }
    setDisableForm(false)
  }

  if (errorMessage) {
    setTimeout(() => {
      setErrorMessage(undefined)
    }, 3000);
  }


  return (
    <Form onCencel={onFormCencel} onSubmit={onSubmit} disabled={disableForm} errorMessage={errorMessage}>
      <InputGroup name="name" label="Name" placeholder="Enter stundent name" required onChange={onChange} value={name} />
      <InputGroup name="class" type="number" max={12} min={1} label="Class" placeholder="Enter stundent class" required onChange={onChange} value={s_class} />
      <InputGroup name="short_id" label="Short ID" placeholder="Enter stundent short id" required onChange={onChange} value={short_id} />
      <InputGroup name="fee" label="Fee" placeholder="Enter stundent fee amount" type="number" required step={100} max={20000} onChange={onChange} value={fee} />
      <InputGroupSelect name="status" label="Status" options={status_options} defaultValue="Pending" onChange={onChange} value={status} />
      <InputGroupSelect
        name="current_schedule"
        label="Schedules"
        // disabled={true}
        options={
          mainCtx.profile?.schedules.map(s => ({
            [s.id]: s.toShortString()
          })) || []
        }
        onChange={onChange}
        value={current_schedule || ''} />
      {/*<InputGroupSelect name="current_schedule" label="Schedules" options={schedules} defaultValue="" />*/}
      <InputGroup name="start_date" label="Start Date" placeholder="Enter stundent fee amount" type="date" required onChange={onChange} value={start_date} />
      <InputGroup name="notes" label="Note" placeholder="Take some notes." onChange={onChange} value={notes} />
    </Form>
  )
}
