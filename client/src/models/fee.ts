import type { FeeStatus, FeeType } from "../types/fee";
import type Profile from "./profile";
import type Student from "./student";

class Fee {
  #id: string;
  year: number;
  month: number;
  status: FeeStatus;
  total_amount: number;
  profile: Profile | undefined;
  due_amount: number;
  paid_amount: number;
  discount: number;
  #student_ref: string | undefined;
  constructor(fee: FeeType) {
    this.#id = fee._id || "";
    this.year = fee.year || 2025;
    this.month = fee.month || 1;
    this.status = fee.status || "Unpaid";
    this.total_amount = fee.total_amount || 0;
    this.due_amount = fee.due_amount || 0;
    this.paid_amount = fee.paid_amount || 0;
    this.discount = fee.discount || 0;
    this.#student_ref = fee.student;
  }

  get id() {
    return this.#id;
  }

  get student(): Student | null {
    if (!this.profile || !this.#student_ref) {
      return null;
    }
    return this.profile.getStudentByID(this.#student_ref);
  }

  get monthString(): string {
    const months = [
      "JAN",
      "FAB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    return months[this.month-1] || "Invalid month!";
  }
}

export default Fee;
