import React from "react";

export interface PercentNominalInputProps {
    pctValue: number;
    onChangePct: (value: number) => void;
    nominalValue: string;
    nominalClassName?: string;
    disabled?: boolean;
    readOnly?: boolean;
}

export default function PercentNominalInput({
    pctValue,
    onChangePct,
    nominalValue,
    nominalClassName = "",
    disabled = false,
    readOnly = false,
}: PercentNominalInputProps) {
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        // Use setTimeout to ensure selection happens correctly after browser default focus behavior
        setTimeout(() => {
            e.target.select();
        }, 0);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.value === "") {
            onChangePct(0);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <input
                type="text"
                inputMode="decimal"
                value={pctValue}
                onChange={(e) => {
                    const parsed = parseFloat(e.target.value);
                    onChangePct(isNaN(parsed) ? 0 : parsed);
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={disabled}
                readOnly={readOnly}
                className={`w-16 border border-slate-200 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:border-primary bg-white
                    ${disabled || readOnly ? "bg-slate-50 text-slate-400 cursor-not-allowed focus:border-slate-200" : ""}
                `}
            />
            <input
                readOnly
                disabled={disabled}
                value={nominalValue}
                className={`flex-1 border border-slate-100 rounded px-3 py-1.5 text-sm text-right bg-slate-50 cursor-not-allowed ${nominalClassName}`}
            />
        </div>
    );
}
