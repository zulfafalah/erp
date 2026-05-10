import { ReactNode, SelectHTMLAttributes } from "react";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    children: ReactNode;
    large?: boolean;
}

export default function FormSelect({ children, large, className, disabled, ...props }: FormSelectProps) {
    return (
        <select
            disabled={disabled}
            className={`bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-primary focus:border-primary px-3 ${large ? "py-2.5" : "py-2"} ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className ?? "w-full"}`}
            {...props}
        >
            {children}
        </select>
    );
}
