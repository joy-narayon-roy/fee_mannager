import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

type DropDownItemProps = {
    title: string;
    children?: React.ReactNode;
    defaultOpen?: boolean;
};

const DropDownItem: React.FC<DropDownItemProps> = ({
    title,
    children,
    defaultOpen = false,
}) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="w-full rounded-md border border-gray-200 bg-white shadow-sm transition-all">
            {/* Header */}
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between px-5 py-2 text-left"
            >
                <span className="text-base font-medium text-gray-800">
                    {title}
                </span>

                <FiChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${open ? "rotate-180" : ""
                        }`}
                />
            </button>

            {/* Content */}
            <div
                className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
            >
                <div className="overflow-hidden">
                    <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DropDownItem