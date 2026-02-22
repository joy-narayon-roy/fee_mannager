import Schedule from "./schedule";
import Student from "./student";
import Fee from "./fee";
import type Payment from "./payment";
import { compareDesc } from "date-fns";

type Students = {
  [key: string]: Student;
};
type Schedules = {
  [key: string]: Schedule;
};
type Fees = {
  [key: string]: Fee;
};
type Payments = {
  [key: string]: Payment;
};

interface InitialProfileInterface {
  students: Student[];
  schedules: Schedule[];
  fees: Fee[];
  payments: Payment[];
}

class Profile {
  #students: Students;
  #schedules: Schedules;
  #fees: Fees;
  #payments: Payments;
  constructor(info?: InitialProfileInterface) {
    this.#students = {};
    this.#schedules = {};
    this.#fees = {};
    this.#payments = {};
    if (info) {
      for (const stu of info.students) {
        this.#students[stu.id] = stu;
      }
      for (const sch of info.schedules) {
        this.#schedules[sch.id] = sch;
      }
      for (const fe of info.fees) {
        this.#fees[fe.id] = fe;
      }
      for (const pa of info.payments) {
        this.#payments[pa.id] = pa;
      }
    }
  }

  get students(): Student[] {
    return Object.values(this.#students);
  }
  get totalStudents(): number {
    return Object.keys(this.#students).length;
  }
  get schedules(): Schedule[] {
    return Object.values(this.#schedules);
  }
  get totalSchedules(): number {
    return Object.keys(this.#schedules).length;
  }

  get fees(): Fee[] {
    return Object.values(this.#fees);
  }

  get payments(): Payment[] {
    return Object.values(this.#payments);
  }

  addStudnets(stds: Student[]) {
    for (const std of stds) {
      if (std instanceof Student) {
        std.profile = this;
        this.#students[std.id] = std;
      } else {
        throw new Error("failed to add student! invalid student instance");
      }
    }
  }

  addSchedules(schs: Schedule[]) {
    for (const sch of schs) {
      sch.profile = this;
      this.#schedules[sch.id] = sch;
    }
  }

  addFees(fees: Fee[]) {
    fees = fees.sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year; // sort by year
      }
      return -(a.month - b.month); // same year → sort by month
    });
    for (const fee of fees) {
      fee.profile = this;
      this.#fees[fee.id] = fee;
    }
  }

  addPayments(pas: Payment[]) {
    for (const pa of pas) {
      this.#payments[pa.id] = pa;
      pa.profile = this;
      // pa.fees.forEach((f) => {
      //   if (this.#fees[f.fee]) {
      //     this.#fees[f.fee].paid_amount += f.amount_applied || 0;
      //     this.#fees[f.fee].due_amount -= f.amount_applied || 0;
      //     if (this.#fees[f.fee].due_amount <= 0) {
      //       this.#fees[f.fee].status = "Paid";
      //     } else if (this.#fees[f.fee].due_amount > 0) {
      //       this.#fees[f.fee].status = "Partial";
      //     }
      //   }
      // });
    }
  }

  getStudentByID(id: string): Student | null {
    return this.#students[id] || null;
  }

  getScheduleByID(id: string): Schedule | null {
    return this.#schedules[id] || null;
  }

  getFeeById(id: string): Fee | null {
    return this.#fees[id];
  }

  getFeeByStudentId(sid: string): Fee[] {
    return this.fees.filter((f) => f.student?.id === sid);
  }

  getPaymentsById(pids: string[]): Payment[] {
    const ps: Payment[] = [];
    for (const pid of pids) {
      const tmp = this.#payments[pid];
      if (tmp) {
        ps.push(tmp);
      }
    }
    return ps;
  }

  getPaymentsByFeeId(fid: string): Payment[] {
    return Object.values(this.#payments).filter(
      (p) => p.fees.map((f) => f.fee === fid)[0],
    );
  }

  getPaymentByStudentId(sid: string): Payment[] {
    return Object.values(this.#payments)
      .filter((p) => {
        return p.student?.id === sid;
      })
      .sort((a, b) => compareDesc(a.date, b.date));
  }

  updateFeeById(fid: string, paid_amount?: number) {
    const exists = this.#fees[fid];
    if (exists && paid_amount) {
      this.#fees[fid].paid_amount += paid_amount;
      this.#fees[fid].due_amount -= paid_amount;
      if (this.#fees[fid].due_amount <= 0) {
        this.#fees[fid].status = "Paid";
      } else if (this.#fees[fid].due_amount > 0) {
        this.#fees[fid].status = "Partial";
      }
    }
  }

  deleteSchedule(schedule_id: string) {
    delete this.#schedules[schedule_id];
  }

  todayStudentSchedule(day: string | undefined) {
    if (!day) {
      return Object.values(this.#schedules);
    }
    const schdule_ids = [];
    for (const sid in this.#students) {
      const student = this.#students[sid];
      if (student.status === "Active") {
        schdule_ids.push(student.current_schedule_ref);
      }
    }

    for (const sch_id of schdule_ids) {
      if (!sch_id) {
        continue;
      }
      const sch = this.#schedules[sch_id];
      console.log(sch);
    }
  }
}

export default Profile;
