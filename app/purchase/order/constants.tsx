import React from "react";
import Link from "next/link";
import { Column } from "../../components/DataTable";
import { FilterField } from "../../components/MultiFilter";
import { PurchaseOrderListItem } from "../../api/purchase/orders/route";
import { ColumnDef, ProductItem } from "@/app/components/ItemTable";
import { TabKey, ExtendedProductItem } from "./types";

export const _fmt = (v: number) =>
    typeof v === "number"
        ? v.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : "0,00";

export const purchaseOrderColumns: ColumnDef<ProductItem>[] = [
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

export const tabs: { key: TabKey; label: string; icon: string; badge?: string }[] = [
    { key: "header", label: "Header Info", icon: "description" },
    { key: "order-details", label: "Detail Pesanan", icon: "list_alt" },
    { key: "attachments", label: "Lampiran", icon: "attachment" },
];

export const statusBadgeStyles: Record<string, string> = {
    Approved: "bg-green-100 text-green-700 border-green-200",
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Draft: "bg-slate-100 text-slate-600 border-slate-200",
    Rejected: "bg-red-100 text-red-700 border-red-200",
};

export const defaultProductItems: ExtendedProductItem[] = [];

// ─── List Page: Types & Constants ─────────────────────────────────────────────

export type StatusKey = "Approved" | "Pending" | "Draft" | "Rejected" | "Closed";

export const STATUS_MAP: Record<number, StatusKey> = {
    1: "Draft",
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

// ─── List Page: Filter Fields ─────────────────────────────────────────────────
//
// Setiap field di sini dipetakan ke query param spesifik oleh handleApplyFilter
// di page.tsx. Operator dari MultiFilter (contains, equals, starts_with, …)
// ditranslasikan ke suffix Django ORM yang sesuai.

export const FILTER_FIELDS: FilterField[] = [
    // ── Teks ──────────────────────────────────────────────────────────────────
    { key: "pono",          label: "No. PO",         type: "text" },
    { key: "supplier_name", label: "Pemasok",         type: "text" },
    { key: "poket1",        label: "Keterangan",      type: "text" },
    { key: "pocurr",        label: "Mata Uang",       type: "text" },
    { key: "pokontrakno",   label: "No. Kontrak",     type: "text" },
    { key: "createdby",     label: "Dibuat Oleh",     type: "text" },
    { key: "approvedby",    label: "Disetujui Oleh",  type: "text" },
    // ── Select ────────────────────────────────────────────────────────────────
    {
        key: "ispolokal", label: "Tipe PO", type: "select", options: [
            { label: "Lokal",  value: "0" },
            { label: "Import", value: "1" },
        ],
    },
    {
        key: "statuspo", label: "Status", type: "select", options: [
            { label: "Draft",    value: "1" },
            { label: "Pending",  value: "2" },
            { label: "Approved", value: "3" },
            { label: "Rejected", value: "4" },
        ],
    },
    // ── Angka ─────────────────────────────────────────────────────────────────
    { key: "gtotalpo__gte", label: "Grand Total ≥", type: "number" },
    { key: "gtotalpo__lte", label: "Grand Total ≤", type: "number" },
    // ── Tanggal ───────────────────────────────────────────────────────────────
    { key: "podate__gte",   label: "Tgl. PO Mulai", type: "text" },
    { key: "podate__lte",   label: "Tgl. PO Akhir", type: "text" },
];

// ─── List Page: Formatting Helpers ───────────────────────────────────────────

export const fmtDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export const fmtCurrency = (amount: string | null, curr: string | null) => {
    if (!amount || !curr) return "—";
    const n = parseFloat(amount);
    return `${curr} ${n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// ─── List Page: Table Columns Definition ─────────────────────────────────────

export const buildColumns = (
    setDeletingId: (id: number) => void
): Column<PurchaseOrderListItem>[] => [
    {
        key: "pono",
        header: "No. PO",
        render: (po) => (
            <Link
                href={`/purchase/order/${po.poid}`}
                className="font-semibold text-primary text-sm tracking-tight hover:underline"
            >
                {po.pono ?? `#${po.poid}`}
            </Link>
        ),
    },
    {
        key: "podate",
        header: "Tanggal",
        render: (po) => (
            <span className="text-sm text-slate-600">{fmtDate(po.podate)}</span>
        ),
    },
    {
        key: "supplier_name",
        header: "Pemasok",
        render: (po) => (
            <span className="text-sm font-medium">{po.supplier_name || "—"}</span>
        ),
    },
    {
        key: "ispolokal",
        header: "Tipe",
        render: (po) => (
            <span className="text-sm text-slate-500">
                {po.ispolokal === 1 ? "Import" : "Lokal"}
            </span>
        ),
    },
    {
        key: "poket1",
        header: "Keterangan",
        render: (po) => (
            <span className="block truncate text-sm text-slate-500 max-w-[200px]">
                {po.poket1 || "—"}
            </span>
        ),
    },
    {
        key: "gtotalpo",
        header: "Grand Total",
        align: "right",
        render: (po) => (
            <span className="text-sm font-bold">
                {fmtCurrency(po.gtotalpo, po.pocurr)}
            </span>
        ),
    },
    {
        key: "statuspo_display",
        header: "Status",
        render: (po) => {
            const statusLabel = po.statuspo_display || STATUS_MAP[po.statuspo ?? 0] || "Draft";
            return (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[statusLabel] ?? statusStyles.Draft}`}>
                    {statusLabel}
                </span>
            );
        },
    },
    {
        key: "poid",
        header: "Aksi",
        align: "right",
        render: (po) => (
            <div className="flex items-center justify-end gap-2">
                <Link
                    href={`/purchase/order/${po.poid}`}
                    className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                    title="Edit"
                >
                    <span className="material-symbols-outlined text-lg">edit_square</span>
                </Link>
                <button
                    onClick={() => setDeletingId(po.poid)}
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

export function PurchaseOrderMobileCard(
    po: PurchaseOrderListItem,
    setDeletingId: (id: number) => void
) {
    const statusLabel = po.statuspo_display || STATUS_MAP[po.statuspo ?? 0] || "Draft";
    return (
        <div className="p-4 space-y-3">
            {/* Row atas: identifier + status */}
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        href={`/purchase/order/${po.poid}`}
                        className="font-semibold text-primary text-sm hover:underline"
                    >
                        {po.pono ?? `#${po.poid}`}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{fmtDate(po.podate)}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[statusLabel] ?? statusStyles.Draft}`}>
                    {statusLabel}
                </span>
            </div>
            {/* Row tengah: info utama */}
            <div>
                <p className="text-sm font-medium text-slate-900">{po.supplier_name || "—"}</p>
                <p className="text-xs text-slate-500 truncate">{po.poket1 || "—"}</p>
            </div>
            {/* Row bawah: nilai + aksi */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <div>
                    <p className="text-xs text-slate-400">Grand Total</p>
                    <span className="text-sm font-bold text-slate-900">
                        {fmtCurrency(po.gtotalpo, po.pocurr)}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <Link
                        href={`/purchase/order/${po.poid}`}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-base">edit_square</span>
                    </Link>
                    <button
                        onClick={() => setDeletingId(po.poid)}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                    >
                        <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

