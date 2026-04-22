import { ChangeEvent } from "react";

interface FormTextareaProps {
    defaultValue?: string;
    value?: string;
    placeholder?: string;
    rows?: number;
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    className?: string;
}

export default function FormTextarea({
    defaultValue,
    value,
    placeholder,
    rows = 2,
    onChange,
    className,
}: FormTextareaProps) {
    return (
        <textarea
            className={`w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-primary focus:border-primary resize-none p-3 ${className ?? ""}`}
            placeholder={placeholder}
            rows={rows}
            defaultValue={value === undefined ? defaultValue : undefined}
            value={value !== undefined ? value : undefined}
            onChange={onChange}
        />
    );
}
