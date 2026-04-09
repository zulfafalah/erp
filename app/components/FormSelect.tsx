import { ReactNode, ChangeEvent } from "react";

interface FormSelectProps {
    children: ReactNode;
    large?: boolean;
    defaultValue?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
    className?: string;
    disabled?: boolean;
}

export default function FormSelect({ children, large, defaultValue, value, onChange, className, disabled }: FormSelectProps) {
    return (
        <select
            defaultValue={defaultValue}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-primary focus:border-primary px-3 ${large ? "py-2.5" : "py-2"} ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className ?? "w-full"}`}
        >
            {children}
        </select>
    );
}
