export type FeeStatus = "Unpaid" | "Partial" | "Paid";

export type FeeType = {
  _id?: string;
  student?: string;
  month?: number;
  year?: number;
  total_amount?: number;
  discount?: number;
  paid_amount?: number;
  due_amount?: number;
  status?: FeeStatus;
};
