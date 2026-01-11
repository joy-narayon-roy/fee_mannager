import apiRequest from "../tools/apiRequest";
import { type StudentInterface } from "../types/student";
import type Profile from "./profile";
import api from "../tools/apiRequest";
// import type Schedule from "./schedule";

class Student {
  #id: string;
  name: string;
  class: number;
  short_id: string;
  fee: number;
  status: "Active" | "Inactive" | "Pending";
  start_date: string;
  end_date: string;
  notes: string;
  current_schedule_ref?: string | null;
  #schedule_ref: { [key: string]: string };
  profile: Profile | undefined;

  constructor(info: StudentInterface) {
    const {
      id,
      name,
      class: study_class,
      fee,
      short_id,
      status,
      notes,
      start_date,
      end_date,
    } = info;
    this.#id = id || "";
    this.name = name || "";
    this.class = parseInt(`${study_class}`, 10);

    this.short_id = short_id;
    this.fee = fee;
    this.status = status || "Pending";
    this.notes = notes;
    this.start_date = start_date;
    this.end_date = end_date;

    this.#schedule_ref = {};
    if (info.schedules) {
      this.#schedule_ref = info.schedules?.reduce((pre, curr: string) => {
        return { ...pre, [curr]: curr };
      }, {});
    }
    this.profile = undefined;
    if (info.current_schedule) {
      this.current_schedule_ref = info.current_schedule || null;
    }
  }
  get id(): string {
    return this.#id;
  }

  set schedule_ref(s: { [key: string]: string }) {
    this.#schedule_ref = { ...this.#schedule_ref, ...s };
  }

  getSchedules(): string[] {
    return Object.values(this.#schedule_ref);
  }

  hasSchedule(id: string): boolean {
    return Object.hasOwn(this.#schedule_ref, id);
  }

  static async createStudent(info: StudentInterface) {
    const { data } = await apiRequest.post("/student", info);
    return new Student(data);
  }

  async removeSchedule(schedule_id: string): Promise<boolean> {
    if (!this.#schedule_ref[schedule_id]) {
      return true;
    }
    const res = await api.put(`/student/${this.#id}`, {
      remove: {
        schedules: schedule_id,
      },
    });

    if (res.status == 200) {
      delete this.#schedule_ref[schedule_id];
      return true;
    }
    return false;
  }

  async addSchedule(schedule_id: string): Promise<boolean> {
    if (this.#schedule_ref[schedule_id]) {
      return true;
    }
    const res = await api.put(`/student/${this.#id}`, {
      add: {
        schedules: schedule_id,
      },
    });

    if (res.status == 200) {
      this.#schedule_ref[schedule_id] = schedule_id;
      return true;
    }
    return false;
  }
}

export default Student;
