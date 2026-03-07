import { ReactNode } from "react";

interface FormSelectProps {
    children: ReactNode;
    large?: boolean;
}

export default function FormSelect({ children, large }: FormSelectProps) {
    return (
        <select
            className={`w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-primary focus:border-primary px-3 ${large ? "py-2.5" : "py-2"
                }`}
        >
            {children}
        </select>
    );
}
