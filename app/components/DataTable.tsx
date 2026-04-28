"use client";

import React, { ReactNode } from "react";

export interface Column<T> {
    header: string;
    key: string;
    render?: (item: T, index?: number) => ReactNode;
    align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyField: keyof T;
    renderMobileCard: (item: T, index?: number) => ReactNode;
    /** Override the default pagination placeholder with a custom footer */
    footer?: ReactNode;
    // Default values for pagination placeholders (ignored when footer is provided)
    totalItems?: number;
    itemsPerPage?: number;
    currentPage?: number;
}

export default function DataTable<T>({
    data,
    columns,
    keyField,
    renderMobileCard,
    footer,
    totalItems = 57,
    itemsPerPage = 5,
    currentPage = 1,
}: DataTableProps<T>) {
    return (
        <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden">
            {/* Mobile Card View */}
            <div className="block md:hidden divide-y divide-primary/5">
                {data.map((item, idx) => (
                    <React.Fragment key={String(item[keyField])}>
                        {renderMobileCard(item, idx)}
                    </React.Fragment>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-primary/10">
                            {columns.map((col, idx) => (
                                <th
                                    key={col.key || idx}
                                    className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 ${col.align === "right"
                                            ? "text-right"
                                            : col.align === "center"
                                                ? "text-center"
                                                : "text-left"
                                        }`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/5">
                        {data.map((item, rowIndex) => (
                            <tr
                                key={String(item[keyField])}
                                className="hover:bg-primary/5 transition-colors cursor-pointer"
                            >
                                {columns.map((col, idx) => (
                                    <td
                                        key={col.key || idx}
                                        className={`px-6 py-4 ${col.align === "right"
                                                ? "text-right"
                                                : col.align === "center"
                                                    ? "text-center"
                                                    : ""
                                            }`}
                                    >
                                        {col.render
                                            ? col.render(item, rowIndex)
                                            : String(item[col.key as keyof T] || "")}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination */}
            {footer ?? (
                <div className="px-4 md:px-6 py-4 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 border-t border-primary/10">
                    <p className="text-sm text-slate-500 text-center md:text-left">
                        Menampilkan {currentPage} sampai {Math.min(itemsPerPage, totalItems)} dari {totalItems} data
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-1">
                        <button
                            className="p-2 border border-primary/10 rounded hover:bg-white disabled:opacity-50"
                            disabled
                        >
                            <span className="material-symbols-outlined text-lg">chevron_left</span>
                        </button>
                        <button className="px-3 py-1 bg-primary text-white rounded text-sm font-bold">1</button>
                        <button className="px-3 py-1 hover:bg-white text-sm font-medium rounded transition-colors">2</button>
                        <button className="px-3 py-1 hover:bg-white text-sm font-medium rounded transition-colors">3</button>
                        <span className="px-2 text-slate-400">...</span>
                        <button className="px-3 py-1 hover:bg-white text-sm font-medium rounded transition-colors">12</button>
                        <button className="p-2 border border-primary/10 rounded hover:bg-white">
                            <span className="material-symbols-outlined text-lg">chevron_right</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
