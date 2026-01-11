import React, { useState } from "react";

// ------------------- Group Component -------------------
interface GroupProps {
    label?: string;
    children?: React.ReactNode;
    disabled?: boolean;
    required?: boolean;
    errmessage?: string;
}

function Group(props: GroupProps) {
    const { label, required, disabled, errmessage, children } = props;
    return (
        <div
            className={`my-2 flex flex-col w-full text-text-secondary ${disabled ? "opacity-60" : ""
                }`}
        >
            <label className="font-semibold">
                {label || "Label"}: {required && <span className="text-error">*</span>}
            </label>
            {children}
            {errmessage && (
                <small className="ml-1.5 my-0.5 text-error font-light">
                    {errmessage}
                </small>
            )}
        </div>
    );
}

// ------------------- InputGroup Component -------------------
interface InputGroupProps extends GroupProps {
    type?: React.HTMLInputTypeAttribute;
    name?: string;
    value?: string | number | readonly string[];
    placeholder?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    min?: number;
    max?: number;
    step?: number;
    minLength?: number;
    maxLength?: number;
}

export default function InputGroup(props: InputGroupProps) {
    const {
        name = "name",
        type = "text",
        value,
        placeholder,
        onChange = () => { },
        required,
        disabled,
        min,
        max,
        step,
        minLength,
        maxLength,
        label,
    } = props;

    const [errorMsg, setErrorMsg] = useState("");

    // Handle invalid event
    const handleInvalid = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault(); // Prevent default tooltip
        const target = e.currentTarget;

        if (target.validity.valueMissing) setErrorMsg("This field is required!");
        else if (target.validity.tooShort)
            setErrorMsg(`Minimum length is ${minLength}`);
        else if (target.validity.tooLong)
            setErrorMsg(`Maximum length is ${maxLength}`);
        else if (target.validity.rangeUnderflow)
            setErrorMsg(`Minimum value is ${min}`);
        else if (target.validity.rangeOverflow)
            setErrorMsg(`Maximum value is ${max}`);
        else setErrorMsg("Invalid value");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrorMsg(""); // Clear error when user types
        onChange(e);
    };

    return (
        <Group label={label} required={required} disabled={disabled} errmessage={errorMsg}>
            <input
                name={name}
                type={type}
                value={value}
                placeholder={placeholder || "Enter text"}
                required={required}
                disabled={disabled}
                min={min}
                max={max}
                step={step}
                minLength={minLength}
                maxLength={maxLength}
                onInvalid={handleInvalid}
                onChange={handleChange}
                className={`border-2 border-border outline-text-muted bg-white px-2 py-1 rounded-md mt-2 ${errorMsg ? "border-error" : ""
                    }`}
            />
        </Group>
    );
}

// ------------------- InputGroupSelect Component -------------------
interface InputGroupSelectProps extends GroupProps {
    name?: string;
    options?: string[] | { [key: string]: string }[];
    defaultValue?: string;
    onChange?: React.ChangeEventHandler;
    value?: string | undefined
}

export function InputGroupSelect(props: InputGroupSelectProps) {
    const {
        name,
        options = [],
        disabled,
        required,
        label,
        errmessage,
        value,
        onChange = () => { },
    } = props;

    const [errorMsg, setErrorMsg] = useState(errmessage || "");

    const handleInvalid = (e: React.FormEvent<HTMLSelectElement>) => {
        e.preventDefault();
        if (required) setErrorMsg("Please select a value!");
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setErrorMsg("");
        onChange(e);
    };

    // Normalize options to { value, label } array
    const normalizedOptions = options.flatMap((opt) => {
        if (typeof opt === "string") return [{ value: opt, label: opt }];
        return Object.entries(opt).map(([value, label]) => ({ value, label }));
    });

    return (
        <Group label={label} required={required} disabled={disabled} errmessage={errorMsg}>
            <select
                name={name}
                disabled={disabled}
                required={required}
                onInvalid={handleInvalid}
                onChange={handleChange}
                value={value}
                className={`border-2 border-border outline-text-muted bg-white px-2 py-1 rounded-md mt-2 ${errorMsg ? "border-error" : ""
                    }`}
            >
                <option value="" disabled hidden>
                    Select an option
                </option>
                {normalizedOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </Group>
    );
}

