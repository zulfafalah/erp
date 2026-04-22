import { ChangeEvent } from "react";

export interface FormInputProps {
    type?: string;
    defaultValue?: string | number;
    value?: string | number;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    readOnly?: boolean;
    disabled?: boolean;
    className?: string;
    step?: string | number;
    min?: string | number;
    max?: string | number;
}

export default function FormInput({
    type = "text",
    defaultValue,
    value,
    onChange,
    placeholder,
    readOnly,
    disabled,
    className,
    step,
    min,
    max,
}: FormInputProps) {
    return (
        <input
            className={`w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-primary focus:border-primary py-2 px-3 ${readOnly || disabled ? "cursor-not-allowed text-slate-400 opacity-60" : ""} ${className ?? ""}`}
            type={type}
            defaultValue={value === undefined ? defaultValue : undefined}
            value={value !== undefined ? value : undefined}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
            disabled={disabled}
            step={step}
            min={min}
            max={max}
        />
    );
}
