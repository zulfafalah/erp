import { ReactNode } from "react";

interface FormFieldProps {
    label: string;
    children: ReactNode;
    className?: string;
}

export default function FormField({ label, children, className }: FormFieldProps) {
    return (
        <div className={className}>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">
                {label}
            </label>
            {children}
        </div>
    );
}
