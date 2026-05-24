"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";

// ── Default item shape for purchase pages ──────────────────────────────────
export interface ProductItem {
    name: string;
    barcode: string;
    uom: string;
    qty: number;
    hargaDasar: number;
    discount: number;
    ppn: number;
    hargaFinal: number;
    jumlah: number;
}

// ── Column definition ──────────────────────────────────────────────────────
export interface ColumnDef<T = Record<string, unknown>> {
    /** Key of the data field to display */
    key: string;
    /** Column header label */
    label: string;
    /** Tailwind width class, e.g. "w-28" */
    width?: string;
    align?: "left" | "center" | "right";
    /** Renders an editable input in the cell instead of read-only text */
    editable?: boolean;
    editType?: "number" | "text";
    /** Custom cell renderer */
    render?: (value: unknown, item: T, index: number) => ReactNode;
    /**
     * Footer aggregation.
     * - "sum"  → automatically sums the numeric field
     * - function → receives all items and returns a ReactNode
     * - omit / undefined → empty footer cell
     */
    footer?: "sum" | ((items: T[]) => ReactNode);
}

const _fmt = (v: number) =>
    (v ?? 0).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ── Pre-built columns for standard purchase item tables ───────────────────
export const defaultPurchaseColumns: ColumnDef<ProductItem>[] = [
    { key: "barcode", label: "Barcode", width: "w-28", align: "left" },
    {
        key: "name",
        label: "Nama Barang",
        render: (v) => (
            <p className="font-semibold text-slate-800 leading-tight">{String(v || "—")}</p>
        ),
    },
    { key: "uom", label: "UOM", width: "w-20", align: "center" },
    {
        key: "qty",
        label: "Qty",
        width: "w-24",
        align: "right",
        editable: true,
        editType: "number",
        footer: "sum",
    },
    {
        key: "hargaDasar",
        label: "Harga Dasar",
        width: "w-32",
        align: "right",
        render: (v) => _fmt(v as number),
    },
    {
        key: "discount",
        label: "Discount",
        width: "w-28",
        align: "right",
        render: (v) => _fmt(v as number),
    },
    {
        key: "ppn",
        label: "PPN",
        width: "w-28",
        align: "right",
        render: (v) => _fmt(v as number),
    },
    {
        key: "hargaFinal",
        label: "Harga Final",
        width: "w-32",
        align: "right",
        render: (v) => <span className="font-medium">{_fmt(v as number)}</span>,
    },
    {
        key: "jumlah",
        label: "Jumlah",
        width: "w-36",
        align: "right",
        render: (v) => <span className="font-bold">{_fmt(v as number)}</span>,
        footer: "sum",
    },
];

// ── Props ──────────────────────────────────────────────────────────────────
interface ItemTableProps<T> {
    items: T[];
    columns: ColumnDef<T>[];
    onUpdateItem?: (index: number, field: keyof T, value: unknown) => void;
    onRemoveItem?: (index: number) => void;
    onEditItem?: (index: number) => void;
    emptyMessage?: string;
}

const alignClass: Record<string, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
};

export default function ItemTable<T extends object>({
    items,
    columns,
    onUpdateItem,
    onRemoveItem,
    onEditItem,
    emptyMessage = "Belum ada item.",
}: ItemTableProps<T>) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Reset to page 1 when items change (add/remove)
    useEffect(() => {
        setPage(1);
    }, [items.length]);

    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const clampedPage = Math.min(page, totalPages);
    const pagedItems = items.slice((clampedPage - 1) * pageSize, clampedPage * pageSize);

    const hasFooter = columns.some((c) => !!c.footer);
    // +1 for the # column, +1 for the actions column
    const totalColSpan = columns.length + 2;

    return (
        <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Table Wrapper */}
            <div className="flex-1 overflow-auto no-scrollbar">
                <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
                        <tr>
                            <th className="px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider w-8 text-center">
                                #
                            </th>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider ${col.width ?? ""} ${alignClass[col.align ?? "left"]}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                            <th className="px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider w-16" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {items.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={totalColSpan}
                                    className="px-4 py-12 text-center text-sm text-slate-400"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            pagedItems.map((item, pageIndex) => {
                                const index = (clampedPage - 1) * pageSize + pageIndex;
                                return (
                                    <tr
                                        key={index}
                                        className="hover:bg-primary/5 transition-colors group"
                                    >
                                        <td className="px-3 py-2.5 text-center text-slate-400 font-medium">
                                            {index + 1}.
                                        </td>
                                        {columns.map((col) => {
                                            const value = (item as Record<string, unknown>)[col.key];
                                            const align = alignClass[col.align ?? "left"];

                                            if (col.editable) {
                                                return (
                                                    <td key={col.key} className={`px-3 py-2.5 ${align}`}>
                                                        <input
                                                            className="w-20 border border-yellow-300 bg-yellow-50 focus:border-primary focus:ring-1 focus:ring-primary/30 rounded px-2 py-1 font-medium text-right outline-none transition-colors ml-auto block"
                                                            type={col.editType ?? "text"}
                                                            value={value as string | number}
                                                            onChange={(e) =>
                                                                onUpdateItem?.(
                                                                    index,
                                                                    col.key as keyof T,
                                                                    col.editType === "number"
                                                                        ? Number(e.target.value)
                                                                        : e.target.value
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                );
                                            }

                                            return (
                                                <td key={col.key} className={`px-3 py-2.5 ${align}`}>
                                                    {col.render
                                                        ? col.render(value, item, index)
                                                        : String(value ?? "—")}
                                                </td>
                                            );
                                        })}
                                        <td className="px-3 py-2.5">
                                            <div className="flex items-center justify-center gap-0.5">
                                                <button
                                                    onClick={() => onEditItem?.(index)}
                                                    className="text-slate-400 hover:text-primary px-1.5 py-1 rounded hover:bg-primary/10 transition-colors font-medium"
                                                    title="Edit"
                                                >
                                                    <span className="material-symbols-outlined text-sm">
                                                        edit
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={() => onRemoveItem?.(index)}
                                                    className="text-slate-400 hover:text-red-500 px-1.5 py-1 rounded hover:bg-red-50 transition-colors"
                                                    title="Hapus"
                                                >
                                                    <span className="material-symbols-outlined text-sm">
                                                        delete
                                                    </span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                    {items.length > 0 && hasFooter && (
                        <tfoot className="border-t-2 border-slate-200 bg-slate-50">
                            <tr className="font-bold text-slate-700">
                                <td className="px-3 py-2.5 text-right text-xs uppercase tracking-wider text-slate-500">
                                    Total
                                </td>
                                {columns.map((col) => {
                                    const align = alignClass[col.align ?? "left"];
                                    if (!col.footer) return <td key={col.key} />;
                                    if (typeof col.footer === "function") {
                                        return (
                                            <td key={col.key} className={`px-3 py-2.5 ${align}`}>
                                                {col.footer(items)}
                                            </td>
                                        );
                                    }
                                    // "sum"
                                    const sum = items.reduce(
                                        (acc, item) =>
                                            acc +
                                            (Number((item as Record<string, unknown>)[col.key]) || 0),
                                        0
                                    );
                                    return (
                                        <td key={col.key} className={`px-3 py-2.5 ${align} text-sm`}>
                                            {_fmt(sum)}
                                        </td>
                                    );
                                })}
                                <td />
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>

            {/* Table Footer with Pagination */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center gap-x-5 gap-y-2 shrink-0">
                {/* Left: row summary */}
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                    ROWS: <span className="text-slate-700 ml-1">{items.length}</span>
                </span>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Page size selector */}
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Per Halaman</span>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPage(1);
                        }}
                        className="border border-slate-200 rounded px-1.5 py-0.5 text-[11px] font-semibold text-slate-700 bg-white focus:outline-none focus:border-primary"
                    >
                        {[5, 10, 25, 50, 100].map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Page info */}
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Hal <span className="text-slate-700">{clampedPage}</span>
                    {" / "}
                    <span className="text-slate-700">{totalPages}</span>
                </span>

                {/* Pagination controls */}
                <div className="flex items-center gap-0.5">
                    <button
                        onClick={() => setPage(1)}
                        disabled={clampedPage === 1}
                        className="size-6 flex items-center justify-center rounded hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Halaman pertama"
                    >
                        <span className="material-symbols-outlined text-sm">first_page</span>
                    </button>
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={clampedPage === 1}
                        className="size-6 flex items-center justify-center rounded hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Sebelumnya"
                    >
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={clampedPage === totalPages}
                        className="size-6 flex items-center justify-center rounded hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Berikutnya"
                    >
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                    <button
                        onClick={() => setPage(totalPages)}
                        disabled={clampedPage === totalPages}
                        className="size-6 flex items-center justify-center rounded hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Halaman terakhir"
                    >
                        <span className="material-symbols-outlined text-sm">last_page</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
