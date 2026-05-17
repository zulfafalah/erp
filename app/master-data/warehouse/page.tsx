"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";
import DataTable, { Column } from "../../components/DataTable";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WarehouseListItem {
    whsid: number;
    whscode: string;
    whsname: string;
    whsloc: string | null;
    whstelp: string | null;
    whsman: string | null;
}

interface ApiResponse {
    ok: boolean;
    data: WarehouseListItem[];
    page: number;
    limit: number;
    total: number;
    message?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_LIMIT = 10;

const FILTER_FIELDS: FilterField[] = [
    { key: "whscode", label: "Kode",        type: "text" },
    { key: "whsname", label: "Nama Gudang", type: "text" },
    { key: "whsloc",  label: "Alamat",      type: "text" },
    { key: "whsman",  label: "PIC",         type: "text" },
];

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationProps {
    page: number;
    total: number;
    limit: number;
    isLoading: boolean;
    onPageChange: (p: number) => void;
}

function Pagination({ page, total, limit, isLoading, onPageChange }: PaginationProps) {
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const from = total === 0 ? 0 : (page - 1) * limit + 1;
    const to   = Math.min(page * limit, total);

    const getPages = (): (number | "…")[] => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages: (number | "…")[] = [];
        if (page <= 4) {
            for (let i = 1; i <= 5; i++) pages.push(i);
            pages.push("…", totalPages);
        } else if (page >= totalPages - 3) {
            pages.push(1, "…");
            for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1, "…", page - 1, page, page + 1, "…", totalPages);
        }
        return pages;
    };

    return (
        <div className="px-4 md:px-6 py-4 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 border-t border-primary/5">
            <p className="text-sm text-slate-500 text-center md:text-left">
                {total === 0
                    ? "Tidak ada data"
                    : `Menampilkan ${from}–${to} dari ${total} data`
                }
            </p>
            <div className="flex flex-wrap justify-center items-center gap-1">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1 || isLoading}
                    className="p-2 border border-primary/10 rounded hover:bg-white disabled:opacity-40 transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>

                {getPages().map((p, i) =>
                    p === "…" ? (
                        <span key={`ellipsis-${i}`} className="px-2 text-slate-400 text-sm select-none">…</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p as number)}
                            disabled={isLoading}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                p === page
                                    ? "bg-primary text-white font-bold shadow-sm"
                                    : "hover:bg-white text-slate-600 disabled:opacity-50"
                            }`}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages || isLoading}
                    className="p-2 border border-primary/10 rounded hover:bg-white disabled:opacity-40 transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WarehouseListPage() {
    const [data, setData]             = useState<WarehouseListItem[]>([]);
    const [page, setPage]             = useState(1);
    const [total, setTotal]           = useState(0);
    const [isLoading, setIsLoading]   = useState(true);
    const [error, setError]           = useState<string | null>(null);
    const [search, setSearch]         = useState("");
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // ── Fetch ─────────────────────────────────────────────────────────────────

    const fetchData = useCallback(async (targetPage: number, searchStr: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const qs = new URLSearchParams({
                page: String(targetPage),
                limit: String(PAGE_LIMIT),
                ...(searchStr ? { search: searchStr } : {}),
            });
            const res  = await fetch(`/api/master-data/warehouses?${qs.toString()}`);
            const json = await res.json() as ApiResponse;

            if (!res.ok || !json.ok) {
                setError(json.message ?? "Gagal memuat data gudang.");
                return;
            }

            setData(json.data ?? []);
            setTotal(json.total ?? 0);
            setPage(json.page ?? targetPage);
        } catch {
            setError("Terjadi kesalahan koneksi. Pastikan server berjalan.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    // ── Filter ────────────────────────────────────────────────────────────────

    const handleApplyFilter = (rules: FilterRule[]) => {
        const searchRule = rules.find(r => r.operator === "contains" || r.operator === "equals");
        const q = searchRule?.value ?? "";
        setSearch(q);
        setPage(1);
        fetchData(1, q);
    };

    const handlePageChange = (p: number) => {
        setPage(p);
    };

    // ── Delete ────────────────────────────────────────────────────────────────

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Hapus gudang "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
        setDeletingId(id);
        try {
            const res  = await fetch(`/api/master-data/warehouses/${id}`, { method: "DELETE" });
            const json = await res.json() as { ok: boolean; message?: string };
            if (!res.ok || !json.ok) {
                alert(json.message ?? "Gagal menghapus data gudang.");
                return;
            }
            fetchData(page, search);
        } catch {
            alert("Terjadi kesalahan koneksi saat menghapus data.");
        } finally {
            setDeletingId(null);
        }
    };

    const columns: Column<WarehouseListItem>[] = [
        {
            header: "Kode",
            key: "whscode",
            render: (item) => (
                <Link
                    href={`/master-data/warehouse/${item.whsid}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline block"
                >
                    {item.whscode}
                </Link>
            ),
        },
        {
            header: "Nama Gudang",
            key: "whsname",
            render: (item) => (
                <span className="text-sm font-medium text-slate-800">{item.whsname}</span>
            ),
        },
        {
            header: "Alamat",
            key: "whsloc",
            render: (item) => (
                <span className="text-sm text-slate-500 line-clamp-2 max-w-xs">{item.whsloc || "—"}</span>
            ),
        },
        {
            header: "Telp",
            key: "whstelp",
            render: (item) => (
                <span className="text-sm text-slate-600">{item.whstelp || "—"}</span>
            ),
        },
        {
            header: "PIC",
            key: "whsman",
            render: (item) => (
                <span className="text-sm text-slate-600">{item.whsman || "—"}</span>
            ),
        },
        {
            header: "Aksi",
            key: "aksi",
            align: "right",
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/master-data/warehouse/${item.whsid}`}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                        title="Edit"
                    >
                        <span className="material-symbols-outlined text-lg">edit_square</span>
                    </Link>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(item.whsid, item.whsname); }}
                        disabled={deletingId === item.whsid}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Delete"
                    >
                        <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                </div>
            ),
        },
    ];

    const renderMobileCard = (item: WarehouseListItem) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        href={`/master-data/warehouse/${item.whsid}`}
                        className="font-semibold text-primary text-sm hover:underline block"
                    >
                        {item.whscode}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{item.whsname}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-xs mr-1">warehouse</span>
                    Gudang
                </span>
            </div>
            <div>
                <p className="text-xs text-slate-500 line-clamp-2">{item.whsloc || "—"}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                    <span className="text-slate-400 uppercase font-semibold">Telp</span>
                    <p className="text-slate-700 font-medium mt-0.5">{item.whstelp || "—"}</p>
                </div>
                <div>
                    <span className="text-slate-400 uppercase font-semibold">PIC</span>
                    <p className="text-slate-700 font-medium mt-0.5">{item.whsman || "—"}</p>
                </div>
            </div>
            <div className="flex justify-end items-center pt-2 border-t border-slate-100 gap-1">
                <Link
                    href={`/master-data/warehouse/${item.whsid}`}
                    className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                >
                    <span className="material-symbols-outlined text-base">edit_square</span>
                </Link>
                <button
                    onClick={() => handleDelete(item.whsid, item.whsname)}
                    disabled={deletingId === item.whsid}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                >
                    <span className="material-symbols-outlined text-base">delete</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            {/* Top Navigation Bar */}
            <Navbar />

            <main className="flex-1 flex overflow-hidden">
                {/* Sidebar Navigation */}
                <Sidebar />

                {/* Main Content Area */}
                <section className="flex-1 flex flex-col bg-background-light overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-28 md:pb-8 space-y-4 md:space-y-8">

                        {/* Title & Actions */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                                    Daftar Gudang
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola master data gudang yang tersedia di sistem.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter
                                    fields={FILTER_FIELDS}
                                    onApplyFilter={handleApplyFilter}
                                />
                                <Link
                                    href="/master-data/warehouse/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Gudang Baru
                                </Link>
                            </div>
                        </div>

                        {/* Error Banner */}
                        {error && (
                            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                                <span className="material-symbols-outlined text-base shrink-0">error</span>
                                {error}
                                <button
                                    onClick={() => fetchData(page, search)}
                                    className="ml-auto text-xs font-semibold underline hover:no-underline"
                                >
                                    Coba lagi
                                </button>
                            </div>
                        )}

                        {/* Table Container */}
                        <DataTable
                            data={data}
                            columns={columns}
                            keyField="whsid"
                            renderMobileCard={renderMobileCard}
                            isLoading={isLoading}
                            skeletonRows={PAGE_LIMIT}
                            emptyIcon="warehouse"
                            emptyText="Tidak ada data gudang"
                            footer={
                                <Pagination
                                    page={page}
                                    total={total}
                                    limit={PAGE_LIMIT}
                                    isLoading={isLoading}
                                    onPageChange={handlePageChange}
                                />
                            }
                        />
                    </div>
                </section>
            </main>

            {/* Footer StatusBar */}
            <StatusBar />
        </div>
    );
}
