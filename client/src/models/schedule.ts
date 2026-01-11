import { type ScheduleType, type ScheduleDay } from "../types/schedule";
import type Profile from "./profile";
import type Student from "./student";

class Schedule {
  #id: string;
  name: string;
  days: ScheduleDay[];
  is_active: boolean;
  note?: string;
  updatedAt: string;
  createdAt: string;
  profile: Profile | undefined;
  constructor(sch: ScheduleType) {
    this.#id = sch._id || "";
    this.days = sch.days || [];
    this.is_active = sch.is_active;
    this.note = sch.note || "";
    this.name = sch.name;
    this.createdAt = sch.createdAt || new Date().toISOString();
    this.updatedAt = sch.updatedAt || new Date().toISOString();
  }
  get id(): string {
    return this.#id;
  }
  get students(): Student[] {
    if (!this.profile) {
      return [];
    }

    const rt = Object.values(this.profile.students).filter((s) =>
      s.hasSchedule(this.id)
    );
    return rt || [];
  }
  set id(id: string) {
    if (this.#id === "") {
      this.#id = id;
    }
  }

  toShortString(): string {
    const days_str = this.days.map((d) => d.day.toUpperCase()).join(",");
    const time_uniqe = this.days
      .map((d) => d.start_time)
      .every((t) => t === this.days[0].start_time);
    const time =
      time_uniqe && this.days.length > 0 ? this.days[0].start_time : "MIXED";
    const stmnt = `${this.name}(${days_str}:${time})`;
    return stmnt;
  }
}

export default Schedule;
