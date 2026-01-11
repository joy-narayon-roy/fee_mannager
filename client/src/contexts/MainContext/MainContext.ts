import { createContext, useContext } from "react";
import { Profile, Schedule, Student } from "../../models";

export interface MainContextType {
  loading?: boolean;
  error?: Error | null | undefined;
  profile: Profile;
  addStudent: (student: Student) => void;
  deleteSchedule: (sch: Schedule) => void;
  addStudentToSchedule: (
    student_id: string,
    schedule_id: string
  ) => Promise<boolean>;
  removeStudentToSchedule: (
    student_id: string,
    schedule_id: string
  ) => Promise<boolean>;
  // students: { [key: string]: Student };
  // schedules: { [key: string]: Schedule };
  // addStudent: (Student: Student) => void;
  // addSchedule: (schedule: Schedule) => void;
}

const defaultCtx: MainContextType = {
  loading: false,
  error: null,
  profile: new Profile(),
  addStudent: () => {},
  addStudentToSchedule: async () => false,
  removeStudentToSchedule: async () => false,
  deleteSchedule: () => {},
  // students: {},
  // schedules: {},
  // addStudent: () => {},
  // addSchedule: () => {},
};
export const MainContext = createContext<MainContextType>(defaultCtx);

export const useMainContext = (): MainContextType => useContext(MainContext);
