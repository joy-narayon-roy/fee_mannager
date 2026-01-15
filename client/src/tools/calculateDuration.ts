import { parse, differenceInMinutes } from "date-fns";

export function calculateDuration(
  startTime?: string,
  endTime?: string
): string {
  if (!startTime || !endTime) {
    return "0h 00min";
  }

  try {
    const baseDate = new Date();

    const start = parse(startTime, "hh:mm a", baseDate);
    const end = parse(endTime, "hh:mm a", baseDate);

    const diffMinutes = differenceInMinutes(end, start);

    if (diffMinutes <= 0 || isNaN(diffMinutes)) {
      return "0h 00m";
    }

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  } catch {
    return "0h 00m";
  }
}

export function calculateDurationMinutes(
  startTime?: string,
  endTime?: string
): number {
  if (!startTime || !endTime) {
    return 0;
  }

  try {
    const baseDate = new Date();

    const start = parse(startTime, "hh:mm a", baseDate);
    const end = parse(endTime, "hh:mm a", baseDate);

    const diffMinutes = differenceInMinutes(end, start);

    if (diffMinutes <= 0 || isNaN(diffMinutes)) {
      return 0;
    }

    return diffMinutes;
  } catch {
    return 0;
  }
}
