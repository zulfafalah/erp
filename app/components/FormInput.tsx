import { ChangeEvent } from "react";

export interface FormInputProps {
    type?: string;
    defaultValue?: string | number;
    value?: string | number;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    readOnly?: boolean;
    className?: string;
}

export default function FormInput({
    type = "text",
    defaultValue,
    value,
    onChange,
    placeholder,
    readOnly,
    className,
}: FormInputProps) {
    return (
        <input
            className={`w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-primary focus:border-primary py-2 px-3 ${readOnly ? "cursor-not-allowed text-slate-400" : ""} ${className ?? ""}`}
            type={type}
            defaultValue={value === undefined ? defaultValue : undefined}
            value={value !== undefined ? value : undefined}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
        />
    );
}
