import { ReactNode, ChangeEvent } from "react";

interface FormSelectProps {
    children: ReactNode;
    large?: boolean;
    defaultValue?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
    className?: string;
}

export default function FormSelect({ children, large, defaultValue, value, onChange, className }: FormSelectProps) {
    return (
        <select
            defaultValue={defaultValue}
            value={value}
            onChange={onChange}
            className={`bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-primary focus:border-primary px-3 ${large ? "py-2.5" : "py-2"} ${className ?? "w-full"}`}
        >
            {children}
        </select>
    );
}
