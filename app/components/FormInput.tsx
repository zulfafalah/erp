interface FormInputProps {
    type?: string;
    defaultValue?: string;
    placeholder?: string;
    readOnly?: boolean;
    className?: string;
}

export default function FormInput({
    type = "text",
    defaultValue,
    placeholder,
    readOnly,
    className,
}: FormInputProps) {
    return (
        <input
            className={`w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-primary focus:border-primary py-2 px-3 ${readOnly ? "cursor-not-allowed text-slate-400" : ""} ${className ?? ""}`}
            type={type}
            defaultValue={defaultValue}
            placeholder={placeholder}
            readOnly={readOnly}
        />
    );
}
