import { ReactNode } from "react";

interface FormSelectProps {
    children: ReactNode;
    large?: boolean;
    defaultValue?: string;
}

export default function FormSelect({ children, large, defaultValue }: FormSelectProps) {
    return (
        <select
            defaultValue={defaultValue}
            className={`w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-primary focus:border-primary px-3 ${large ? "py-2.5" : "py-2"
                }`}
        >
            {children}
        </select>
    );
}
