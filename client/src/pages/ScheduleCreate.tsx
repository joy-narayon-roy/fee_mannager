import React, { useReducer } from "react";
import api from '../tools/apiRequest';
import type { ScheduleDay, ScheduleType } from "../types/schedule";
import ScheduleDayInputRow from "../components/schedule/ScheduleDayInputRow";
import { useMainContext } from "../contexts/MainContext/MainContext";
import { Schedule } from "../models";
import { useNavigate } from "react-router-dom";

type DayKey = "sat" | "sun" | "mon" | "tue" | "wed" | "thu" | "fri";

const DAYS: { key: DayKey; label: string }[] = [
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
];

function scheduleReducer(state: ScheduleType, action: { name: string, value: string }) {
  const [day, type_str] = action.name.split("-")
  if (["sat", "sun", "mon", "tue", "wed", "thu", "fri"].includes(day)) {
    const mapFunc = (d: ScheduleDay) => {
      if (d.day === day) {
        const newDay = {
          ...d,
          [type_str]: action.value
        }
        return newDay
      }
      return d
    }
    return {
      ...state, days: state.days.map(mapFunc)
    }
  }

  switch (action.name) {
    case 'name':
      return { ...state, name: action.value }
    case 'is_active':
      return { ...state, is_active: action.value === 'true' }

    case '+days':
      if (state.days.filter(d => d.day === action.value).length > 0) {
        break
      }
      if (["sat", "sun", "mon", "tue", "wed", "thu", "fri"].includes(action.value)) {
        const day: ScheduleDay = {
          day: 'sat',
          start_time: "",
          end_time: ""
        }
        switch (action.value) {
          case "sun":
            day.day = 'sun'
            break;
          case "mon":
            day.day = 'mon'
            break;
          case "tue":
            day.day = 'tue'
            break;
          case "wed":
            day.day = 'wed'
            break;
          case "thu":
            day.day = 'thu'
            break;
          case "fri":
            day.day = 'fri'
            break;

          default:
            break;
        }
        if (state.days.length > 0) {
          day.start_time = state.days[0].start_time
          day.end_time = state.days[0].end_time
        }
        return { ...state, days: [...state.days, day] }
      }
      break

    case '-days':
      return { ...state, days: state.days.filter(d => d.day !== action.value) }
    case 'note':
      return { ...state, note: action.value }

    default:
      break;
  }
  return state
}


function ScheduleCreate() {
  const { profile } = useMainContext()
  const nav = useNavigate()
  const initialSchedule: ScheduleType = {
    days: [],
    is_active: false,
    name: "",
    note: "",
  }
  const [state, updateState] = useReducer(scheduleReducer, initialSchedule)

  const handleSubmit: React.FormEventHandler = async (ev) => {
    ev.preventDefault()
    try {
      const { data } = await api.post('/schedule', state)
      const schedule = new Schedule(data)
      profile.addSchedules([schedule])
      nav(`/schedule/${schedule.id}`)
    } catch (err) {
      alert("failed to save!")
      console.log(err)
    }

  };

  const handelInput = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = ev.currentTarget.name

    const action = {
      name,
      value: ""
    }
    //  name === 'is_active' ? `${ev.currentTarget.checked}` : ev.currentTarget.value
    if (name === 'is_active' && ev.currentTarget instanceof HTMLInputElement) {
      action.value = `${ev.currentTarget.checked}`
    } else {
      action.value = ev.currentTarget.value
    }

    updateState(action)
  }

  const addDay = (d: string) => {
    updateState({
      name: '+days',
      value: d
    })
  }
  const removeDay = (d: string) => {
    updateState({
      name: '-days',
      value: d
    })
  }
  const updateTime = (name: string, value: string) => {
    updateState({ name, value })
  }

  return (
    <form className="flex flex-col justify-center gap-2 mx-auto md:min-w-2xl pb-5" onSubmit={handleSubmit} >
      {/* <div className="mt-5 space-y-6 md:min-w-3xl"> */}
        {/* Page Header */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Create Schedule
          </h1>
          <p className="text-sm text-gray-500">
            Define weekly schedule and timings
          </p>
        </div>

        {/* Schedule Info */}
        <div className="bg-white border border-gray-200 rounded-xl py-2 px-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Schedule Name
            </label>
            <input
              type="text"
              name="name"
              value={state.name}
              onChange={handelInput}
              className="mt-1 w-full rounded-lg border outline-none border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Morning Batch"
            />
          </div>

          <div className="mt-2 flex items-center gap-3">
            <input
              type="checkbox"
              name="is_active"
              checked={state.is_active}
              onChange={handelInput}
              className="h-4 w-4 accent-indigo-600"
            />
            <span className="text-sm text-gray-700">
              Active schedule
            </span>
          </div>
        </div>

        {/* Days & Time */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-800">
            Days & Time
          </h2>

          <div className="mt-4 flex flex-col gap-2">
            {DAYS.map((d) => <ScheduleDayInputRow key={d.key} day={d} selectedDay={state.days.filter(da => da.day === d.key)[0]} addDay={addDay} updateTime={updateTime} removeDay={removeDay} />)}
          </div>
        </div>

        {/* Note */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <label className="text-sm font-medium text-gray-700">
            Note (optional)
          </label>
          <textarea
            name="note"
            value={state.note}
            onChange={e => handelInput(e)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 px-5">
          <button className="px-4 py-2 rounded-lg border border-gray-300 text-sm">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
          >
            Save Schedule
          </button>
        </div>
      {/* </div> */}
    </form>
  );
};

export default ScheduleCreate;
