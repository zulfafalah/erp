interface FormTextareaProps {
    defaultValue?: string;
    placeholder?: string;
    rows?: number;
}

export default function FormTextarea({
    defaultValue,
    placeholder,
    rows = 2,
}: FormTextareaProps) {
    return (
        <textarea
            className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-primary focus:border-primary resize-none p-3"
            placeholder={placeholder}
            rows={rows}
            defaultValue={defaultValue}
        />
    );
}
