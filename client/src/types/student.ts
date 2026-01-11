export interface StudentInterface {
  id?: string;
  name: string;
  class: number | string;
  short_id: string;
  fee: number;
  status?: "Active" | "Inactive" | "Pending";
  start_date: string;
  end_date: string;
  notes: string;
  schedules?: string[];
  current_schedule?: string;
  // NEW: Multiple schedules (only one active)
}
