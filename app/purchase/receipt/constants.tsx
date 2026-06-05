import React from "react";
import Link from "next/link";
import { Column } from "../../components/DataTable";
import { FilterField } from "../../components/MultiFilter";
import { ColumnDef, ProductItem } from "@/app/components/ItemTable";
import { GoodsReceivingListItem, TabKey } from "./types";

// ─── Formatters ───────────────────────────────────────────────────────────────

export const _fmt = (v: number) =>
    typeof v === "number"
        ? v.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : "0,00";

export const fmtDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export const fmtCurrency = (amount: string | null, curr: string | null) => {
    if (!amount || !curr) return "—";
    const n = parseFloat(amount);
    return `${curr} ${n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// ─── Status ───────────────────────────────────────────────────────────────────

export type StatusKey = "Approved" | "Pending" | "Draft" | "Rejected" | "Closed";

export const STATUS_MAP: Record<number, StatusKey> = {
    0: "Draft",
    1: "Pending",
    2: "Pending",
    3: "Approved",
    4: "Rejected",
    5: "Closed",
};

export const statusStyles: Record<string, string> = {
    Approved: "bg-green-100 text-green-800",
    Pending:  "bg-yellow-100 text-yellow-800",
    Draft:    "bg-slate-100 text-slate-800",
    Rejected: "bg-red-100 text-red-800",
    Closed:   "bg-emerald-100 text-emerald-800",
};

export const statusBadgeStyles: Record<string, string> = {
    Closed:   "bg-emerald-100 text-emerald-700 border-emerald-200",
    Approved: "bg-green-100 text-green-700 border-green-200",
    Pending:  "bg-yellow-100 text-yellow-700 border-yellow-200",
    Draft:    "bg-slate-100 text-slate-600 border-slate-200",
    Rejected: "bg-red-100 text-red-700 border-red-200",
};

// ─── Tabs ─────────────────────────────────────────────────────────────────────

export const tabs: { key: TabKey; label: string; icon: string; badge?: string }[] = [
    { key: "header",          label: "Header Info",       icon: "description" },
    { key: "receipt-details", label: "Detail Penerimaan", icon: "inventory_2" },
    { key: "attachments",     label: "Lampiran",          icon: "attachment" },
];

// ─── Item Table Columns (for detail page) ─────────────────────────────────────

export const purchaseReceiptColumns: ColumnDef<ProductItem>[] = [
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
        label: "Qty Terima",
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

// ─── Filter Fields (for list page) ───────────────────────────────────────────

export const FILTER_FIELDS: FilterField[] = [
    // ── Teks ─────────────────────────────────────────────────────────────────
    { key: "search",          label: "Cari (No./Nota/Pemasok)", type: "text" },
    { key: "inv_no_supplier", label: "No. Invoice Supplier",    type: "text" },
    { key: "sj_no_supplier",  label: "No. SJ Supplier",        type: "text" },
    // ── Select ───────────────────────────────────────────────────────────────
    {
        key: "statusrcv", label: "Status", type: "select", options: [
            { label: "Approved", value: "3" },
        ],
    },
    {
        key: "paramst_pch", label: "Tipe", type: "select", options: [
            { label: "Penerimaan Barang", value: "0" },
            { label: "Invoice",           value: "2" },
        ],
    },
    // ── Tanggal ───────────────────────────────────────────────────────────────
    { key: "rcvdate__gte", label: "Tgl. Terima Mulai", type: "text" },
    { key: "rcvdate__lte", label: "Tgl. Terima Akhir", type: "text" },
];

// Direct param keys (no operator suffix needed)
export const DIRECT_PARAM_FIELDS = new Set([
    "statusrcv", "paramst_pch", "supplierid", "poidh",
    "rcvdate__gte", "rcvdate__lte",
]);

// ─── List Page: Table Columns ─────────────────────────────────────────────────

export const buildColumns = (
    setDeletingId: (id: number) => void,
): Column<GoodsReceivingListItem>[] => [
    {
        key: "rcvno",
        header: "No. BPB",
        render: (item) => (
            <Link
                href={`/purchase/receipt/${item.rcvid}`}
                className="font-semibold text-primary text-sm tracking-tight hover:underline whitespace-nowrap"
            >
                {item.rcvno || `#${item.rcvid}`}
            </Link>
        ),
    },
    {
        key: "rcvdate",
        header: "Tanggal",
        render: (item) => (
            <span className="text-sm text-slate-600 whitespace-nowrap">{fmtDate(item.rcvdate)}</span>
        ),
    },
    {
        key: "supplier_name",
        header: "Pemasok",
        render: (item) => (
            <span className="text-sm font-medium">{item.supplier_name || "—"}</span>
        ),
    },
    {
        key: "inv_no_supplier",
        header: "No. Invoice",
        render: (item) => (
            <span className="text-sm text-slate-500">{item.inv_no_supplier || "—"}</span>
        ),
    },
    {
        key: "grandtotalrcv",
        header: "Grand Total",
        align: "right",
        render: (item) => (
            <span className="text-sm font-bold whitespace-nowrap">
                {fmtCurrency(item.grandtotalrcv, item.currencyid)}
            </span>
        ),
    },
    {
        key: "total_qty_received",
        header: "Total Qty",
        align: "right",
        render: (item) => (
            <span className="text-sm text-slate-600">
                {item.total_qty_received.toLocaleString("id-ID")}
            </span>
        ),
    },
    {
        key: "statusrcv_display",
        header: "Status",
        render: (item) => {
            const label = item.statusrcv_display || STATUS_MAP[item.statusrcv ?? 0] || "Draft";
            return (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[label] ?? statusStyles.Draft}`}>
                    {label}
                </span>
            );
        },
    },
    {
        key: "rcvid",
        header: "Aksi",
        align: "right",
        render: (item) => (
            <div className="flex items-center justify-end gap-2">
                <Link
                    href={`/purchase/receipt/${item.rcvid}`}
                    className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                    title="Edit"
                >
                    <span className="material-symbols-outlined text-lg">edit_square</span>
                </Link>
                <button
                    onClick={() => setDeletingId(item.rcvid)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete"
                >
                    <span className="material-symbols-outlined text-lg">delete</span>
                </button>
            </div>
        ),
    },
];

// ─── List Page: Mobile Card ───────────────────────────────────────────────────

export function ReceiptMobileCard(
    item: GoodsReceivingListItem,
    setDeletingId: (id: number) => void,
) {
    const statusLabel = item.statusrcv_display || STATUS_MAP[item.statusrcv ?? 0] || "Draft";
    return (
        <div className="p-4 space-y-3">
            {/* Row atas: identifier + status */}
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        href={`/purchase/receipt/${item.rcvid}`}
                        className="font-semibold text-primary text-sm hover:underline"
                    >
                        {item.rcvno || `#${item.rcvid}`}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{fmtDate(item.rcvdate)}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[statusLabel] ?? statusStyles.Draft}`}>
                    {statusLabel}
                </span>
            </div>
            {/* Row tengah: info utama */}
            <div>
                <p className="text-sm font-medium text-slate-900">{item.supplier_name || "—"}</p>
                <p className="text-xs text-slate-500 truncate">{item.inv_no_supplier || "—"}</p>
            </div>
            {/* Row bawah: nilai + aksi */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <div>
                    <p className="text-xs text-slate-400">Grand Total</p>
                    <span className="text-sm font-bold text-slate-900">
                        {fmtCurrency(item.grandtotalrcv, item.currencyid)}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <Link
                        href={`/purchase/receipt/${item.rcvid}`}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-base">edit_square</span>
                    </Link>
                    <button
                        onClick={() => setDeletingId(item.rcvid)}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                    >
                        <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
