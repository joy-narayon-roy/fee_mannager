export type ShortFee = {
  fee?: string;
  amount_applied?: number;
};
export type PaymentType = {
  _id?: string;
  student?: string;
  fees?: ShortFee[];
  amount?: number;
  payment_method:
    | "Cash"
    | "UPI"
    | "Card"
    | "Bank Transfer"
    | "Cheque"
    | "Online"
    | "Other";
  payment_date?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};
