"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";
import DataTable, { Column } from "../../components/DataTable";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductCategoryListItem {
    familyid: number;
    famno: string | null;
    productfamily: string;
}

interface ApiResponse {
    ok: boolean;
    data: ProductCategoryListItem[];
    page: number;
    limit: number;
    total: number;
    message?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_LIMIT = 10;

const FILTER_FIELDS: FilterField[] = [
    { key: "famno", label: "Kode", type: "text" },
    { key: "productfamily", label: "Nama Kategori", type: "text" },
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

export default function ProductCategoryListPage() {
    const [data, setData]             = useState<ProductCategoryListItem[]>([]);
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
            const res  = await fetch(`/api/master-data/product-category?${qs.toString()}`);
            const json = await res.json() as ApiResponse;

            if (!res.ok || !json.ok) {
                setError(json.message ?? "Gagal memuat data kategori produk.");
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
        if (!confirm(`Hapus kategori produk "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
        setDeletingId(id);
        try {
            const res  = await fetch(`/api/master-data/product-category/${id}`, { method: "DELETE" });
            const json = await res.json() as { ok: boolean; message?: string };
            if (!res.ok || !json.ok) {
                alert(json.message ?? "Gagal menghapus data kategori produk.");
                return;
            }
            fetchData(page, search);
        } catch {
            alert("Terjadi kesalahan koneksi saat menghapus data.");
        } finally {
            setDeletingId(null);
        }
    };

    const columns: Column<ProductCategoryListItem>[] = [
        {
            header: "Kode",
            key: "famno",
            render: (item) => (
                <Link
                    href={`/master-data/product-category/${item.familyid}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline block"
                >
                    {item.famno ?? "-"}
                </Link>
            ),
        },
        {
            header: "Nama Kategori",
            key: "productfamily",
            render: (item) => (
                <span className="text-sm text-slate-800 font-medium">{item.productfamily}</span>
            ),
        },
        {
            header: "Aksi",
            key: "aksi",
            align: "right",
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/master-data/product-category/${item.familyid}`}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                        title="Edit"
                    >
                        <span className="material-symbols-outlined text-lg">edit_square</span>
                    </Link>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(item.familyid, item.productfamily); }}
                        disabled={deletingId === item.familyid}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Delete"
                    >
                        <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                </div>
            ),
        },
    ];

    const renderMobileCard = (item: ProductCategoryListItem) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        href={`/master-data/product-category/${item.familyid}`}
                        className="font-semibold text-primary text-sm hover:underline block"
                    >
                        {item.famno ?? "-"}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{item.productfamily}</p>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-primary/10 text-primary uppercase">
                    Kategori
                </span>
            </div>
            <div className="flex justify-end items-center pt-2 border-t border-slate-100 gap-1">
                <Link
                    href={`/master-data/product-category/${item.familyid}`}
                    className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                >
                    <span className="material-symbols-outlined text-base">edit_square</span>
                </Link>
                <button
                    onClick={() => handleDelete(item.familyid, item.productfamily)}
                    disabled={deletingId === item.familyid}
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
                                    Daftar Kategori Produk
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola master data grup/kategori produk di sistem.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter
                                    fields={FILTER_FIELDS}
                                    onApplyFilter={handleApplyFilter}
                                />
                                <Link
                                    href="/master-data/product-category/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Kategori Baru
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
                            keyField="familyid"
                            renderMobileCard={renderMobileCard}
                            isLoading={isLoading}
                            skeletonRows={PAGE_LIMIT}
                            emptyIcon="category"
                            emptyText="Tidak ada data kategori produk"
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
