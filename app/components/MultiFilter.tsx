"use client";

import { useState, useRef, useEffect } from "react";

export type FilterFieldType = 'text' | 'select' | 'boolean' | 'number';

export interface FilterOption {
    label: string;
    value: string;
}

export interface FilterField {
    key: string;
    label: string;
    type: FilterFieldType;
    options?: FilterOption[]; // required for 'select' or 'boolean'
}

export interface FilterOperator {
    value: string;
    label: string;
    types: FilterFieldType[];
}

export const OPERATORS: FilterOperator[] = [
    { value: 'contains', label: 'Mengandung', types: ['text'] },
    { value: 'equals', label: 'Sama Dengan (=)', types: ['text', 'select', 'boolean', 'number'] },
    { value: 'not_equals', label: 'Tidak Sama (!=)', types: ['text', 'select', 'number'] },
    { value: 'starts_with', label: 'Dimulai Dengan', types: ['text'] },
    { value: 'ends_with', label: 'Diakhiri Dengan', types: ['text'] },
    { value: 'greater_than', label: 'Lebih Dari (>)', types: ['number'] },
    { value: 'less_than', label: 'Kurang Dari (<)', types: ['number'] },
];

export interface FilterRule {
    id: string;
    field: string;
    operator: string;
    value: string;
}

interface MultiFilterProps {
    fields: FilterField[];
    onApplyFilter: (rules: FilterRule[]) => void;
}

export default function MultiFilter({ fields, onApplyFilter }: MultiFilterProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Internal state for pending rules inside the dropdown
    const [rules, setRules] = useState<FilterRule[]>([]);

    // Applied rules count for displaying the badge
    const [appliedRulesCount, setAppliedRulesCount] = useState(0);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const addRule = () => {
        if (fields.length === 0) return;
        const defaultField = fields[0];
        const defaultOp = OPERATORS.find(op => op.types.includes(defaultField.type))?.value || 'equals';

        setRules([...rules, {
            id: Math.random().toString(36).substring(2, 9),
            field: defaultField.key,
            operator: defaultOp,
            value: ''
        }]);
    };

    const removeRule = (id: string) => {
        setRules(rules.filter(r => r.id !== id));
    };

    const updateRule = (id: string, key: keyof FilterRule, val: string) => {
        setRules(rules.map(r => {
            if (r.id === id) {
                const newRule = { ...r, [key]: val };

                // If the field changes, automatically reset the operator & value
                // depending on the new field's available types
                if (key === 'field') {
                    const newField = fields.find(f => f.key === val);
                    const oldField = fields.find(f => f.key === r.field);
                    if (newField && oldField && newField.type !== oldField.type) {
                        newRule.operator = OPERATORS.find(o => o.types.includes(newField.type))?.value || 'equals';
                        newRule.value = '';
                    } else if (newField && newField.type === 'select') {
                        // Reset value if field changed, so old selection isn't mistakenly carried over
                        newRule.value = '';
                    }
                }
                return newRule;
            }
            return r;
        }));
    };

    const handleApply = () => {
        // filter out invalid/empty rules unless needed
        const validRules = rules.filter(r => r.field && r.operator && r.value !== undefined && r.value !== '');
        onApplyFilter(validRules);
        setAppliedRulesCount(validRules.length);
        setIsOpen(false);
    };

    const handleReset = () => {
        setRules([]);
        onApplyFilter([]);
        setAppliedRulesCount(0);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left w-full sm:w-auto" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex-1 sm:flex-none justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-primary/10 rounded-lg text-sm font-semibold hover:bg-primary/5 transition-colors focus:outline-none"
            >
                <div className="relative flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">
                        filter_list
                    </span>
                    {appliedRulesCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                            {appliedRulesCount}
                        </span>
                    )}
                </div>
                Filter
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full sm:w-[500px] rounded-xl bg-white shadow-xl border border-primary/10 overflow-hidden sm:right-0 left-0 sm:left-auto origin-top sm:origin-top-right flex flex-col">
                    <div className="p-2 md:p-3 border-b border-primary/5 bg-slate-50 flex items-center justify-between">
                        <h3 className="font-bold text-slate-700 flex items-center gap-1.5 text-sm">
                            <span className="material-symbols-outlined text-[16px] text-primary">manage_search</span>
                            Filter Data
                        </h3>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-200/50">
                            <span className="material-symbols-outlined text-[16px] flex">close</span>
                        </button>
                    </div>

                    <div className="p-2 md:p-3 max-h-[50vh] overflow-y-auto space-y-2 bg-white">
                        {rules.length === 0 ? (
                            <div className="text-center py-6 text-slate-400 text-sm bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                                <span className="material-symbols-outlined text-3xl mb-1 text-slate-300">filter_1</span>
                                <p>Belum ada kondisi filter.</p>
                                <p className="text-xs mt-1">Gunakan tombol "Tambah Kondisi" di bawah.</p>
                            </div>
                        ) : (
                            rules.map((rule, idx) => {
                                const currentField = fields.find(f => f.key === rule.field);
                                const availableOperators = currentField
                                    ? OPERATORS.filter(op => op.types.includes(currentField.type))
                                    : [];

                                return (
                                    <div key={rule.id} className="flex flex-col sm:flex-row gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-200/60 items-start sm:items-center relative group">
                                        <div className="hidden sm:flex text-[10px] font-bold text-slate-400 w-6 justify-center items-center">
                                            {idx > 0 ? 'AND' : '#'}
                                        </div>
                                        <div className="flex-1 w-full sm:w-auto">
                                            <select
                                                value={rule.field}
                                                onChange={(e) => updateRule(rule.id, 'field', e.target.value)}
                                                className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-shadow"
                                            >
                                                {fields.map(f => (
                                                    <option key={f.key} value={f.key}>{f.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex-1 w-full sm:w-auto">
                                            <select
                                                value={rule.operator}
                                                onChange={(e) => updateRule(rule.id, 'operator', e.target.value)}
                                                className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-shadow"
                                            >
                                                {availableOperators.map(op => (
                                                    <option key={op.value} value={op.value}>{op.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex-[1.5] flex w-full sm:w-auto gap-1.5">
                                            {currentField?.type === 'select' || currentField?.type === 'boolean' ? (
                                                <select
                                                    value={rule.value}
                                                    onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
                                                    className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-shadow"
                                                >
                                                    <option value="" disabled>Pilih Nilai...</option>
                                                    {currentField.options?.map(opt => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type={currentField?.type === 'number' ? 'number' : 'text'}
                                                    value={rule.value}
                                                    onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
                                                    placeholder="Nilai..."
                                                    className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-shadow"
                                                />
                                            )}
                                            <button
                                                onClick={() => removeRule(rule.id)}
                                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors flex-shrink-0"
                                                title="Hapus Kondisi"
                                            >
                                                <span className="material-symbols-outlined text-[16px] flex">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}

                        <button
                            onClick={addRule}
                            className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 mt-2 p-1.5 hover:bg-primary/5 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined text-[16px]">add_circle</span>
                            Tambah Kondisi
                        </button>
                    </div>

                    <div className="p-2 md:p-3 border-t border-slate-100 bg-slate-50 flex justify-between sm:justify-end gap-2 items-center">
                        <button
                            onClick={handleReset}
                            className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-[14px]">restart_alt</span>
                            Hapus Semua
                        </button>
                        <button
                            onClick={handleApply}
                            className="flex-1 sm:flex-none justify-center px-4 py-1.5 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20 flex items-center gap-1.5"
                        >
                            <span className="material-symbols-outlined text-[14px]">done_all</span>
                            Terapkan
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
