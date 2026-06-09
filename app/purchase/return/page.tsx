"use client";

import Link from "next/link";
import Button from "../../components/Button";
import { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterRule } from "../../components/MultiFilter";
import DataTable from "../../components/DataTable";
import { ReturnPOListItem } from "../../api/purchase/returns/route";
import {
    FILTER_FIELDS,
    DIRECT_PARAM_FIELDS,
    buildColumns,
    ReturnMobileCard,
} from "./constants";

const PAGE_SIZE = 20;

export default function PurchaseReturnListPage() {
    const [data,         setData]         = useState<ReturnPOListItem[]>([]);
    const [filterParams, setFilterParams] = useState<Record<string, string>>({});

    const [page,    setPage]    = useState(1);
    const [total,   setTotal]   = useState(0);
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState<string | null>(null);

    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // ── Fetch list from API ─────────────────────────────────────────────────

    const fetchData = useCallback(async (
        currentPage: number,
        filters: Record<string, string>,
    ) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                page:      String(currentPage),
                page_size: String(PAGE_SIZE),
                ordering:  "-rcvno",
            });
            for (const [k, v] of Object.entries(filters)) {
                if (v !== "") params.set(k, v);
            }

            const res  = await fetch(`/api/purchase/returns?${params.toString()}`);
            const json = await res.json();

            if (!res.ok || !json.ok) {
                setError(json.message ?? "Gagal memuat data.");
                return;
            }

            const paginated = json.data as { count: number; results: ReturnPOListItem[] };
            setData(paginated.results);
            setTotal(paginated.count);
        } catch {
            setError("Terjadi kesalahan jaringan.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(page, filterParams); }, [fetchData, page, filterParams]);

    // ── Server-side filter ──────────────────────────────────────────────────

    const handleApplyFilter = (rules: FilterRule[]) => {
        const next: Record<string, string> = {};

        for (const { field, operator, value } of rules) {
            if (!value) continue;

            if (DIRECT_PARAM_FIELDS.has(field)) {
                next[field] = value;
                continue;
            }

            // supplier_name: use global search
            if (field === "supplier_name") {
                next["search"] = value;
                continue;
            }

            switch (operator) {
                case "equals":      next[`${field}__exact`]       = value; break;
                case "starts_with": next[`${field}__istartswith`] = value; break;
                case "ends_with":   next[`${field}__iendswith`]   = value; break;
                case "contains":
                default:            next[field] = value;
            }
        }

        setFilterParams(next);
        setPage(1);
    };

    // ── Delete ──────────────────────────────────────────────────────────────

    const handleDelete = async (rcvid: number) => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/purchase/returns/${rcvid}`, { method: "DELETE" });
            if (res.ok) {
                setDeletingId(null);
                fetchData(page, filterParams);
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

    const columns = buildColumns(setDeletingId);

    const paginationFooter = !loading ? (
        <div className="px-4 md:px-6 py-4 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
            <p className="text-sm text-slate-500 text-center md:text-left">
                {total > 0
                    ? `Menampilkan ${from}–${to} dari ${total.toLocaleString("id-ID")} data`
                    : "Tidak ada data"}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-1">
                <Button
                    variant="secondary-border"
                    size="icon-sm"
                    icon="chevron_left"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                />
                {pageNumbers().map((p, i) =>
                    p === "..." ? (
                        <span key={`ellipsis-${i}`} className="px-2 text-slate-400">...</span>
                    ) : (
                        <Button
                            key={p}
                            variant={page === p ? "primary" : "ghost"}
                            size="sm"
                            onClick={() => setPage(p as number)}
                        >
                            {p}
                        </Button>
                    )
                )}
                <Button
                    variant="secondary-border"
                    size="icon-sm"
                    icon="chevron_right"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                />
            </div>
        </div>
    ) : undefined;

    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            <Navbar />

            <main className="flex-1 flex overflow-hidden">
                <Sidebar />

                <section className="flex-1 flex flex-col bg-background-light overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-28 md:pb-8 space-y-4 md:space-y-8">

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                                    Daftar Retur Pembelian Barang
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola dan pantau semua retur pembelian barang ke pemasok.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/purchase/return/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Retur Baru
                                </Link>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
                                <span className="material-symbols-outlined text-lg">error</span>
                                {error}
                                <button
                                    onClick={() => fetchData(page, filterParams)}
                                    className="ml-auto text-xs underline hover:no-underline"
                                >
                                    Coba lagi
                                </button>
                            </div>
                        )}

                        <DataTable
                            data={data}
                            columns={columns}
                            keyField="rcvid"
                            isLoading={loading}
                            emptyIcon="assignment_return"
                            emptyText="Tidak ada data. Coba ubah filter atau tambah retur baru."
                            renderMobileCard={(item) =>
                                ReturnMobileCard(item, setDeletingId)
                            }
                            footer={paginationFooter}
                        />
                    </div>
                </section>
            </main>

            <StatusBar />

            {deletingId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="size-10 rounded-full bg-red-100 flex items-center justify-center">
                                <span className="material-symbols-outlined text-red-600">delete_forever</span>
                            </span>
                            <div>
                                <p className="font-bold text-slate-900">Hapus Retur Pembelian?</p>
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
