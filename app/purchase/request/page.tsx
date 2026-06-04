"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";
import { PurchaseOrderListItem } from "../../api/purchase/orders/route";

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusKey = "Approved" | "Pending" | "Draft" | "Rejected" | "Closed";

const STATUS_MAP: Record<number, StatusKey> = {
    1: "Draft",
    2: "Pending",
    3: "Approved",
    4: "Rejected",
    5: "Closed",
};

const statusStyles: Record<string, string> = {
    Approved: "bg-green-100 text-green-800",
    Pending:  "bg-yellow-100 text-yellow-800",
    Draft:    "bg-slate-100 text-slate-800",
    Rejected: "bg-red-100 text-red-800",
    Closed:   "bg-emerald-100 text-emerald-800",
};

// ─── Filter Fields ────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
    { key: "pono",          label: "No. PO",   type: "text" },
    { key: "supplier_name", label: "Pemasok",  type: "text" },
    { key: "pocurr",        label: "Mata Uang", type: "text" },
    {
        key: "ispolokal", label: "Tipe PO", type: "select", options: [
            { label: "Lokal",   value: "0" },
            { label: "Import",  value: "1" },
        ],
    },
    {
        key: "statuspo_display", label: "Status", type: "select", options: [
            { label: "Draft",    value: "Draft" },
            { label: "Pending",  value: "Pending" },
            { label: "Approved", value: "Approved" },
            { label: "Rejected", value: "Rejected" },
        ],
    },
];

// ─── Formatting helpers ───────────────────────────────────────────────────────

const fmtDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const fmtCurrency = (amount: string | null, curr: string | null) => {
    if (!amount || !curr) return "—";
    const n = parseFloat(amount);
    return `${curr} ${n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// ─── Page Component ───────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

export default function PurchaseRequestListPage() {
    const [allData,       setAllData]       = useState<PurchaseOrderListItem[]>([]);
    const [filteredData,  setFilteredData]  = useState<PurchaseOrderListItem[]>([]);
    const [activeRules,   setActiveRules]   = useState<FilterRule[]>([]);

    // Pagination
    const [page,    setPage]    = useState(1);
    const [total,   setTotal]   = useState(0);
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState<string | null>(null);

    // Delete confirm
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Debounce ref for search
    const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Fetch list from API ─────────────────────────────────────────────────

    const fetchData = useCallback(async (currentPage: number) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                page:      String(currentPage),
                page_size: String(PAGE_SIZE),
                ordering:  "-pono",
            });
            const res  = await fetch(`/api/purchase/orders?${params.toString()}`);
            const json = await res.json();

            if (!res.ok || !json.ok) {
                setError(json.message ?? "Gagal memuat data.");
                return;
            }

            const paginated = json.data as { count: number; results: PurchaseOrderListItem[] };
            setAllData(paginated.results);
            setFilteredData(paginated.results);
            setTotal(paginated.count);
        } catch {
            setError("Terjadi kesalahan jaringan.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(page); }, [fetchData, page]);

    // ── Client-side filter (runs over already-loaded page) ──────────────────

    const handleApplyFilter = (rules: FilterRule[]) => {
        setActiveRules(rules);
        if (rules.length === 0) {
            setFilteredData(allData);
            return;
        }
        const result = allData.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof PurchaseOrderListItem];
                if (itemValue === undefined || itemValue === null) return false;
                const itemStr = String(itemValue).toLowerCase();
                const valStr  = value.toLowerCase();
                switch (operator) {
                    case "contains":    return itemStr.includes(valStr);
                    case "equals":      return itemStr === valStr;
                    case "not_equals":  return itemStr !== valStr;
                    case "starts_with": return itemStr.startsWith(valStr);
                    case "ends_with":   return itemStr.endsWith(valStr);
                    default:            return true;
                }
            })
        );
        setFilteredData(result);
    };

    // Re-apply active rules whenever raw data refreshes
    useEffect(() => {
        if (activeRules.length > 0) handleApplyFilter(activeRules);
        else setFilteredData(allData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allData]);

    // ── Delete ──────────────────────────────────────────────────────────────

    const handleDelete = async (poid: number) => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/purchase/orders/${poid}`, { method: "DELETE" });
            if (res.ok) {
                setDeletingId(null);
                fetchData(page);
            }
        } finally {
            setIsDeleting(false);
        }
    };

    // ── Pagination helpers ──────────────────────────────────────────────────

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const from       = (page - 1) * PAGE_SIZE + 1;
    const to         = Math.min(page * PAGE_SIZE, total);

    const pageNumbers = () => {
        const pages: (number | "...")[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (page > 3) pages.push("...");
            for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
            if (page < totalPages - 2) pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    };

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            {/* Top Navigation Bar */}
            <Navbar />

            <main className="flex-1 flex overflow-hidden">
                {/* Sidebar Navigation */}
                <Sidebar />

                {/* Main Content Area */}
                <section className="flex-1 flex flex-col bg-background-light overflow-hidden">
                    {/* Page Body */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-28 md:pb-8 space-y-4 md:space-y-8">

                        {/* Title and Actions */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                                    Daftar Permintaan Pembelian
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola dan pantau semua permintaan pembelian barang.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/purchase/request/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Permintaan Baru
                                </Link>
                            </div>
                        </div>

                        {/* Error Banner */}
                        {error && (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
                                <span className="material-symbols-outlined text-lg">error</span>
                                {error}
                                <button
                                    onClick={() => fetchData(page)}
                                    className="ml-auto text-xs underline hover:no-underline"
                                >
                                    Coba lagi
                                </button>
                            </div>
                        )}

                        {/* Table Container */}
                        <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden">

                            {/* Loading skeleton */}
                            {loading && (
                                <div className="divide-y divide-slate-100">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <div key={i} className="px-6 py-4 flex gap-4 animate-pulse">
                                            <div className="h-4 w-28 bg-slate-200 rounded" />
                                            <div className="h-4 w-24 bg-slate-100 rounded" />
                                            <div className="h-4 flex-1 bg-slate-100 rounded" />
                                            <div className="h-4 w-20 bg-slate-100 rounded" />
                                            <div className="h-4 w-24 bg-slate-100 rounded" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Empty state */}
                            {!loading && filteredData.length === 0 && !error && (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <span className="material-symbols-outlined text-5xl text-slate-300">inbox</span>
                                    <p className="mt-3 text-sm font-semibold text-slate-500">Tidak ada data</p>
                                    <p className="text-xs text-slate-400 mt-1">Coba ubah filter atau tambah permintaan baru.</p>
                                </div>
                            )}

                            {/* Mobile Card View */}
                            {!loading && filteredData.length > 0 && (
                                <div className="block md:hidden divide-y divide-primary/5">
                                    {filteredData.map((po) => {
                                        const statusLabel = po.statuspo_display || STATUS_MAP[po.statuspo ?? 0] || "Draft";
                                        return (
                                            <div key={po.poid} className="p-4 space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <Link
                                                            href={`/purchase/request/${po.poid}`}
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
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{po.supplier_name || "—"}</p>
                                                    <p className="text-xs text-slate-500 truncate">{po.poket1 || "—"}</p>
                                                </div>
                                                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                                    <div>
                                                        <p className="text-xs text-slate-400">Grand Total</p>
                                                        <span className="text-sm font-bold text-slate-900">
                                                            {fmtCurrency(po.gtotalpo, po.pocurr)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Link
                                                            href={`/purchase/request/${po.poid}`}
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
                                    })}
                                </div>
                            )}

                            {/* Desktop Table View */}
                            {!loading && filteredData.length > 0 && (
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-primary/10">
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">No. PO</th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Tanggal</th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Pemasok</th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Tipe</th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Keterangan</th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Grand Total</th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-primary/5">
                                            {filteredData.map((po) => {
                                                const statusLabel = po.statuspo_display || STATUS_MAP[po.statuspo ?? 0] || "Draft";
                                                return (
                                                    <tr key={po.poid} className="hover:bg-primary/5 transition-colors cursor-pointer">
                                                        <td className="px-6 py-4">
                                                            <Link
                                                                href={`/purchase/request/${po.poid}`}
                                                                className="font-semibold text-primary text-sm tracking-tight hover:underline"
                                                            >
                                                                {po.pono ?? `#${po.poid}`}
                                                            </Link>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-slate-600">{fmtDate(po.podate)}</td>
                                                        <td className="px-6 py-4 text-sm font-medium">{po.supplier_name || "—"}</td>
                                                        <td className="px-6 py-4 text-sm text-slate-500">
                                                            {po.ispolokal === 1 ? "Import" : "Lokal"}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-slate-500 max-w-[200px]">
                                                            <span className="block truncate">{po.poket1 || "—"}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-bold text-right">
                                                            {fmtCurrency(po.gtotalpo, po.pocurr)}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[statusLabel] ?? statusStyles.Draft}`}>
                                                                {statusLabel}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Link
                                                                    href={`/purchase/request/${po.poid}`}
                                                                    className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <span className="material-symbols-outlined text-lg">edit_square</span>
                                                                </Link>
                                                                <button
                                                                    className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                                                    title="Print"
                                                                >
                                                                    <span className="material-symbols-outlined text-lg">print</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => setDeletingId(po.poid)}
                                                                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            {!loading && total > 0 && (
                                <div className="px-4 md:px-6 py-4 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                                    <p className="text-sm text-slate-500 text-center md:text-left">
                                        Menampilkan {from}–{to} dari {total.toLocaleString("id-ID")} data
                                    </p>
                                    <div className="flex flex-wrap justify-center items-center gap-1">
                                        <button
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="p-2 border border-primary/10 rounded hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg">chevron_left</span>
                                        </button>
                                        {pageNumbers().map((p, i) =>
                                            p === "..." ? (
                                                <span key={`ellipsis-${i}`} className="px-2 text-slate-400">...</span>
                                            ) : (
                                                <button
                                                    key={p}
                                                    onClick={() => setPage(p as number)}
                                                    className={`px-3 py-1 rounded text-sm font-bold transition-colors ${
                                                        page === p
                                                            ? "bg-primary text-white"
                                                            : "hover:bg-white text-slate-600"
                                                    }`}
                                                >
                                                    {p}
                                                </button>
                                            )
                                        )}
                                        <button
                                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            className="p-2 border border-primary/10 rounded hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg">chevron_right</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer StatusBar */}
            <StatusBar />

            {/* ── Delete Confirmation Dialog ──────────────────────────────────── */}
            {deletingId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="size-10 rounded-full bg-red-100 flex items-center justify-center">
                                <span className="material-symbols-outlined text-red-600">delete_forever</span>
                            </span>
                            <div>
                                <p className="font-bold text-slate-900">Hapus Purchase Order?</p>
                                <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan.</p>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={() => setDeletingId(null)}
                                disabled={isDeleting}
                                className="flex-1 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleDelete(deletingId)}
                                disabled={isDeleting}
                                className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {isDeleting && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
