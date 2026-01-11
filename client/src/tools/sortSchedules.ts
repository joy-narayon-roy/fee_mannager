import { parse, isAfter, isBefore, compareAsc, compareDesc } from "date-fns";
import { Schedule } from "../models";

export default function sortSchedules(
  data: Schedule[],
  currentTime: string
): Schedule[] {
  const now = parse(currentTime, "h:mm a", new Date());

  // Find the "current" item → nearest past time
  let currentStart: Date | null = null;

  data.forEach((item) => {
    const time = parse(item.days[0].start_time, "h:mm a", new Date());
    if (isBefore(time, now)) {
      if (!currentStart || isAfter(time, currentStart)) {
        currentStart = time;
      }
    }
  });

  return data.sort((a, b) => {
    const timeA = parse(a.days[0].start_time, "h:mm a", new Date());
    const timeB = parse(b.days[0].start_time, "h:mm a", new Date());

    const getRank = (time: Date) => {
      if (currentStart && time.getTime() === currentStart.getTime()) return 0; // current
      if (isAfter(time, now)) return 1; // upcoming
      return 2; // gone
    };

    const rankA = getRank(timeA);
    const rankB = getRank(timeB);

    // 1️⃣ Rank priority
    if (rankA !== rankB) {
      return rankA - rankB;
    }

    // 2️⃣ Sorting inside groups
    if (rankA === 1) {
      // upcoming → nearest first
      return compareAsc(timeA, timeB);
    }

    if (rankA === 2) {
      // gone → most recent first
      return compareDesc(timeA, timeB);
    }

    return 0;
  });
}
