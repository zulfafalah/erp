import { ReactNode } from "react";

interface FormFieldProps {
    label: string;
    children: ReactNode;
}

export default function FormField({ label, children }: FormFieldProps) {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">
                {label}
            </label>
            {children}
        </div>
    );
}
