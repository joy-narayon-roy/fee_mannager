import type { PaymentType } from "../types/payment";
import type Profile from "./profile";
import type Student from "./student";

class PaymentFee {
  fee: string;
  amount_applied?: number;
  constructor(fee: string, amount: number) {
    this.fee = fee;
    this.amount_applied = amount;
  }
}

class Payment {
  #id: string;
  #student_ref: string;
  profile?: Profile;
  amount?: number;
  payment_method:
    | "Cash"
    | "UPI"
    | "Card"
    | "Bank Transfer"
    | "Cheque"
    | "Online"
    | "Other";
  #payment_date?: string;
  fees: PaymentFee[];
  note: string;
  createdAt: string;
  updatedAt: string;

  constructor(pay: PaymentType) {
    this.#id = pay._id || "";
    this.#student_ref = pay.student || "";
    this.amount = pay.amount || 0;
    this.payment_method = pay.payment_method || "Cash";
    this.#payment_date = pay.payment_date;
    this.fees = [];
    this.note = pay.notes || "";
    this.createdAt = pay.createdAt;
    this.updatedAt = pay.updatedAt;
    if (pay.fees) {
      for (const sf of pay.fees) {
        this.fees.push(new PaymentFee(sf.fee || "", sf.amount_applied || 0));
      }
    }
  }

  get id(): string {
    return this.#id;
  }

  get student(): Student | null {
    return this.profile?.getStudentByID(this.#student_ref) || null;
  }

  get date(): Date {
    return new Date(this.#payment_date || "");
  }
}
export default Payment;
