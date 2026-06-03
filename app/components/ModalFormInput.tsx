import { InputHTMLAttributes, useRef } from "react";

export interface ModalFormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    /** Jika true, teks rata kanan (cocok untuk input numerik) */
    textRight?: boolean;
    /** Jika true, teks dalam input akan otomatis dipilih semua saat focus */
    selectOnFocus?: boolean;
}

export default function ModalFormInput({
    className,
    textRight = false,
    selectOnFocus = false,
    readOnly,
    disabled,
    type,
    onFocus,
    onBlur,
    onChange,
    value,
    ...props
}: ModalFormInputProps) {
    const isNumber = type === "number";
    // For number inputs we render as text+inputMode to allow proper select()
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        if (selectOnFocus) {
            // Use setTimeout to ensure the selection happens after browser default focus behavior
            setTimeout(() => {
                e.target.select();
            }, 0);
        }
        onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        // Restore "0" if field is left empty on a number input
        if (isNumber && e.target.value === "" && onChange) {
            const syntheticEvent = {
                ...e,
                target: { ...e.target, value: "0" },
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
        }
        onBlur?.(e);
    };

    return (
        <input
            ref={inputRef}
            className={`w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none bg-white
                ${textRight ? "text-right" : ""}
                ${readOnly || disabled
                    ? "bg-slate-50 text-slate-400 cursor-not-allowed focus:border-slate-200"
                    : "focus:border-primary"
                }
                ${className ?? ""}`}
            // Render number inputs as "text" with decimal keyboard so select() works correctly
            type={isNumber ? "text" : type}
            inputMode={isNumber ? "decimal" : undefined}
            readOnly={readOnly}
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={onChange}
            value={value}
            {...props}
        />
    );
}

