export type ScheduleDay = {
  day: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
  start_time: string;
  end_time: string;
};

export type ScheduleType = {
  _id?: string;
  name: string;
  is_active: boolean;
  days: ScheduleDay[];
  note?: string;
  createdAt?: string;
  updatedAt?: string;
  students?: { _id: string }[];
};
