import { InputHTMLAttributes } from "react";

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export default function FormInput({
    className,
    readOnly,
    disabled,
    ...props
}: FormInputProps) {
    return (
        <input
            className={`w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-primary focus:border-primary py-2 px-3 ${readOnly || disabled ? "cursor-not-allowed text-slate-400 opacity-60" : ""} ${className ?? ""}`}
            readOnly={readOnly}
            disabled={disabled}
            {...props}
        />
    );
}
