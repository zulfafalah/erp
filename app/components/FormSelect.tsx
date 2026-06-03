import { ReactNode, SelectHTMLAttributes } from "react";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    children: ReactNode;
    large?: boolean;
}

export default function FormSelect({ children, large, className, disabled, ...props }: FormSelectProps) {
    return (
        <div className="relative w-full">
            <select
                disabled={disabled}
                className={`w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary pr-9 px-3 ${large ? "py-2.5" : "py-2"} ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} ${className ?? ""}`}
                {...props}
            >
                {children}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-slate-400">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
            </span>
        </div>
    );
}
