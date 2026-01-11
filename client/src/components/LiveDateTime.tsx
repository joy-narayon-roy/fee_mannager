import { useEffect, useState } from "react";

export default function LiveDateTime() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000); // updates every second

        return () => clearInterval(timer);
    }, []);

    // English format
    const englishDate = new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(now);

    const englistTime = new Intl.DateTimeFormat("en-gb", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    }).format(now);


    // Bangla format (weekday + Bangla digits)
    const banglaDate = new Intl.DateTimeFormat("bn-BD", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(now);

    return (
        <div className="space-y-2 rounded-lg bg-gray-100 p-4 w-sm mx-auto md:ml-0">
            <p className="text-lg font-semibold text-gray-800">
                {englishDate} - {englistTime}
            </p>

            <p className="text-lg font-semibold text-gray-800">
                {banglaDate}
            </p>
        </div>
    );
};
