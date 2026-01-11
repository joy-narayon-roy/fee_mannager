import type React from "react";
import type { ScheduleDay } from "../../types/schedule";

type DayKey = "sat" | "sun" | "mon" | "tue" | "wed" | "thu" | "fri";
type Day = {
    key: DayKey;
    label: string;
}
type Props = {
    day: Day,
    selectedDay?: ScheduleDay | undefined
    addDay?: (day: string) => void
    removeDay?: (day: string) => void
    updateTime?: (name: string, value: string) => void
}

function to24Hour(time?: string): string {
    if (!time) return "";

    const match = time.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (!match) return "";

    const [, hours, minutes, period] = match;
    let h = Number(hours);

    if (period.toUpperCase() === "PM" && h !== 12) h += 12;
    if (period.toUpperCase() === "AM" && h === 12) h = 0;

    return `${String(h).padStart(2, "0")}:${minutes}`;
}

function to12Hour(time?: string): string {
    if (!time) return "";

    const match = time.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
    if (!match) return "";

    const [, hours, minutes] = match;
    const h = Number(hours);

    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;

    return `${hour12}:${minutes} ${period}`;
}


export default function ScheduleDayInputRow(props: Props) {
    const {
        day,
        selectedDay,
        addDay = () => { },
        removeDay = () => { },
        updateTime = () => { }
    } = props

    const handelSelect: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
        if (ev.currentTarget.checked) {
            addDay(day.key)
        } else {
            removeDay(day.key)
        }
    }

    return (
        <div
            className={`flex items-center gap-4 p-3 rounded-lg border
            ${selectedDay
                    ? "border-indigo-300 bg-indigo-50"
                    : "border-gray-200 bg-gray-50"
                }`}
        >
            {/* Checkbox */}
            <input
                type="checkbox"
                checked={selectedDay !== undefined}
                onChange={handelSelect}
                // onChange={() => toggleDay(d.key)}
                className="h-4 w-4 accent-indigo-600"
            />

            {/* Day */}
            <div className="w-12 text-sm font-semibold text-gray-700">
                {day.label}
            </div>

            {/* Start time */}
            <input
                type="time"
                name={`${day.key}-start_time`}
                disabled={!selectedDay}
                value={to24Hour(selectedDay?.start_time || '')}
                onChange={(e) =>
                    updateTime(`${day.key}-start_time`, to12Hour(e.target.value))
                }
                placeholder="3:00 PM"
                className="w-32 rounded-md border border-gray-300 px-2 py-1 text-sm disabled:bg-gray-100"
            />

            <span className="text-xs text-gray-500">to</span>

            {/* End time */}
            <input
                type="time"
                name={`${day.key}-end_time`}
                disabled={!selectedDay}
                value={to24Hour(selectedDay?.end_time || '')}
                onChange={(e) => {
                    updateTime(`${day.key}-end_time`, to12Hour(e.target.value))
                }
                }
                placeholder="4:00 PM"
                className="w-32 rounded-md border border-gray-300 px-2 py-1 text-sm disabled:bg-gray-100"
            />
            <span className=" text-xs opacity-70"></span>
        </div>
    );
}
