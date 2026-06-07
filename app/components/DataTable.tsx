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
    footer?: ReactNode;
    isLoading?: boolean;
    skeletonRows?: number;
    emptyIcon?: string;
    emptyText?: string;
}

// ─── Skeleton Components ──────────────────────────────────────────────────────

function SkeletonRow({ colCount }: { colCount: number }) {
    return (
        <tr>
            {Array.from({ length: colCount }).map((_, i) => (
                <td key={i} className="px-6 py-4">
                    <div
                        className="h-4 bg-slate-100 rounded animate-pulse"
                        style={{ width: i === colCount - 1 ? "3rem" : "75%", marginLeft: i === colCount - 1 ? "auto" : undefined }}
                    />
                </td>
            ))}
        </tr>
    );
}

function SkeletonCard() {
    return (
        <div className="p-4 space-y-3 border-b border-primary/5">
            <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                    <div className="h-3.5 w-40 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                </div>
                <div className="h-5 w-16 bg-slate-100 rounded-full animate-pulse" />
            </div>
            <div className="space-y-1">
                <div className="h-3.5 w-32 bg-slate-100 rounded animate-pulse" />
                <div className="h-3 w-48 bg-slate-100 rounded animate-pulse" />
            </div>
        </div>
    );
}

// ─── DataTable ────────────────────────────────────────────────────────────────

export default function DataTable<T>({
    data,
    columns,
    keyField,
    renderMobileCard,
    footer,
    isLoading = false,
    skeletonRows = 5,
    emptyIcon = "inventory_2",
    emptyText = "Tidak ada data",
}: DataTableProps<T>) {
    const showEmpty = !isLoading && data.length === 0;

    return (
        <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden">
            {/* Mobile Card View */}
            <div className="block md:hidden divide-y divide-primary/5">
                {isLoading ? (
                    Array.from({ length: skeletonRows }).map((_, i) => <SkeletonCard key={i} />)
                ) : showEmpty ? (
                    <div className="p-12 text-center">
                        <span className="material-symbols-outlined text-5xl text-slate-300">{emptyIcon}</span>
                        <p className="mt-2 text-sm text-slate-500">{emptyText}</p>
                    </div>
                ) : (
                    data.map((item, idx) => (
                        <React.Fragment key={String(item[keyField])}>
                            {renderMobileCard(item, idx)}
                        </React.Fragment>
                    ))
                )}
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
                        {isLoading ? (
                            Array.from({ length: skeletonRows }).map((_, i) => (
                                <SkeletonRow key={i} colCount={columns.length} />
                            ))
                        ) : showEmpty ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-16 text-center">
                                    <span className="material-symbols-outlined text-5xl text-slate-300 block">{emptyIcon}</span>
                                    <p className="mt-2 text-sm text-slate-500">{emptyText}</p>
                                </td>
                            </tr>
                        ) : (
                            data.map((item, rowIndex) => (
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
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination */}
            {footer}
        </div>
    );
}
