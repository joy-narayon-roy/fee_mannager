import React, { useReducer, useState } from "react";
import { useMainContext } from "../../contexts/MainContext/MainContext";
import SelectStudents from "../../components/fee/SelectStudents";
import { useNavigate } from "react-router-dom";
import FeeBulkForm from "../../components/fee/FeeBulkForm";
import { Fee, type Student } from "../../models";
import apiRequest from "../../tools/apiRequest";
import type { FeeType } from "../../types/fee";


export type FeeInfo = {
  student: Student;
  month: number;
  year: number;
  discount: number;

}

type ErrorFee = {
  err: unknown,
}


export type State = {
  [key: string]: FeeInfo;
};

type Action =
  | { type: "ADD_OR_UPDATE"; payload: FeeInfo }
  | { type: "TOGGLE"; payload: FeeInfo }
  | { type: "REMOVE"; payload: string }
  | { type: "REMOVE_BULK"; payload: string[] }
  | { type: "CLEAR" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_OR_UPDATE":
      return {
        ...state,
        [action.payload.student.id]: action.payload,
      };


    case "REMOVE": {
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    }
    case "REMOVE_BULK": {
      const newState = { ...state };
      for (const f of action.payload) {
        delete newState[f]
      }
      return newState;
    }

    case "TOGGLE": {
      const exists = state[action.payload.student.id]
      if (exists) {
        const newState = { ...state };
        delete newState[action.payload.student.id];
        return newState;
      } else {
        return {
          ...state,
          [action.payload.student.id]: action.payload,
        };
      }
    }
    case "CLEAR":
      return {};

    default:
      return state;
  }
}


export default function FeeBulkCreate() {
  const nav = useNavigate()
  const date = new Date()

  const currentMonth = date.getMonth() === 0 ? 12 : date.getMonth()
  const currentYear = date.getMonth() === 0 ? date.getFullYear() - 1 : date.getFullYear()
  const { profile, addFeeBulk } = useMainContext()
  const [step, setStep] = useState<'select' | 'create'>('select')
  const defaultSelectedStudents: State = {};
  const [state, updateState] = useReducer(reducer, defaultSelectedStudents);

  const next = () => {
    setStep('create')
  }
  const goSelect = () => {
    setStep('select')
  }
  const goBack = () => {
    nav(-1)
  }


  const selectStudent = (student: Student) => {
    updateState({
      type: "TOGGLE",
      payload: {
        student: student,
        discount: 0,
        year: currentYear,
        month: currentMonth
      }
    })
  }

  const removeStudent = (student: Student) => {
    updateState({
      type: "REMOVE",
      payload: student.id
    })
  }

  const updateFeeInfo = (sid: string, key: 'month' | 'year' | 'discount', value: number) => {
    const exists = state[sid]
    if (!exists) {
      return
    }
    updateState({
      type: "ADD_OR_UPDATE",
      payload: {
        ...exists,
        [key]: value
      }
    })
  }

  const isErrorFee = (item: ErrorFee | FeeType): item is ErrorFee => {
    return (item as ErrorFee).err !== undefined;
  };

  const handelSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const formData = Object.values(state).map(r => ({ ...r, id: r.student.id }))
    try {
      const res = await apiRequest.post('/fee/bulk', { students: formData })
      const datas: (ErrorFee | FeeType)[] = res.data;

      const errorFees: ErrorFee[] = datas.filter(isErrorFee);
      const feeTypes: FeeType[] = datas.filter(
        (item): item is FeeType => !isErrorFee(item)
      );

      addFeeBulk(feeTypes.map(f => new Fee(f)))

      const successStudents = feeTypes
        .map(f => f.student)
        .filter((student): student is string => student !== undefined);

      updateState({
        type: 'REMOVE_BULK',
        payload: successStudents
      })
      if (errorFees.length > 0) {
        alert(`Failed to create ${errorFees.length} fee!`)
        console.log(errorFees)
      }
      nav('/fee', {
      })

    } catch (err) {
      console.log("ERROR", err)
    }
  }

  return (
    <>
      {step === 'select' && (
        <SelectStudents
          next={next}
          goBack={goBack}
          students={profile.students.filter(s => s.status === 'Active')}
          selectedStudents={state}
          onSelectStudent={selectStudent}
        />
      )}
      {step === 'create' && (
        <FeeBulkForm
          selectedStudents={state}
          goBack={goSelect}
          removeStudent={removeStudent}
          updateStudent={updateFeeInfo}
          onSubmit={handelSubmit}
        />
      )}
    </>)
}
