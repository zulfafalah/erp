"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RegionListItem {
    regionid: number;
    regioncode: string;
    regionname: string;
    cityid: number;
    cityname: string;
}

interface ApiResponse {
    ok: boolean;
    data: RegionListItem[];
    page: number;
    limit: number;
    total: number;
    message?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_LIMIT = 10;

const FILTER_FIELDS: FilterField[] = [
    { key: "regionname", label: "Nama Wilayah", type: "text" },
    { key: "regioncode", label: "Kode Wilayah", type: "text" },
    { key: "cityname",   label: "Nama Kota",    type: "text" },
];

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
    return (
        <tr>
            {Array.from({ length: 3 }).map((_, i) => (
                <td key={i} className="px-6 py-4">
                    <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4" />
                </td>
            ))}
            <td className="px-6 py-4 text-right">
                <div className="h-4 bg-slate-100 rounded animate-pulse w-12 ml-auto" />
            </td>
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
        </div>
    );
}

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

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

interface DeleteModalProps {
    item: RegionListItem | null;
    isDeleting: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

function DeleteModal({ item, isDeleting, onConfirm, onCancel }: DeleteModalProps) {
    if (!item) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
                <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-3xl text-red-500">delete_forever</span>
                    <h3 className="font-bold text-slate-900 text-lg">Hapus Wilayah</h3>
                </div>
                <p className="text-sm text-slate-600 mb-2">
                    Yakin ingin menghapus wilayah berikut?
                </p>
                <div className="bg-slate-50 rounded-lg p-3 mb-6 text-sm">
                    <p className="font-bold text-slate-800">{item.regionname}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{item.regioncode} · {item.cityname}</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="flex-1 py-2 text-sm font-semibold border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 py-2 text-sm font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {isDeleting ? (
                            <>
                                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                Menghapus...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-sm">delete</span>
                                Hapus
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RegionListPage() {
    const router = useRouter();

    const [data, setData]               = useState<RegionListItem[]>([]);
    const [page, setPage]               = useState(1);
    const [total, setTotal]             = useState(0);
    const [isLoading, setIsLoading]     = useState(true);
    const [error, setError]             = useState<string | null>(null);
    const [search, setSearch]           = useState("");

    // Delete state
    const [deleteTarget, setDeleteTarget]   = useState<RegionListItem | null>(null);
    const [isDeleting, setIsDeleting]       = useState(false);
    const [deleteError, setDeleteError]     = useState<string | null>(null);

    // ── Fetch ─────────────────────────────────────────────────────────────────

    const fetchData = useCallback(async (targetPage: number, searchStr: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const qs = new URLSearchParams({
                page:  String(targetPage),
                limit: String(PAGE_LIMIT),
                ...(searchStr ? { search: searchStr } : {}),
            });
            const res  = await fetch(`/api/master-data/regions?${qs.toString()}`);
            const json = await res.json() as ApiResponse;

            if (!res.ok || !json.ok) {
                setError(json.message ?? "Gagal memuat daftar wilayah.");
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

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        setDeleteError(null);
        try {
            const res  = await fetch(`/api/master-data/regions/${deleteTarget.regionid}`, {
                method: "DELETE",
            });
            const json = await res.json() as { ok: boolean; message?: string };

            if (!res.ok || !json.ok) {
                setDeleteError(json.message ?? "Gagal menghapus wilayah.");
                return;
            }

            setDeleteTarget(null);
            fetchData(page, search);
        } catch {
            setDeleteError("Terjadi kesalahan koneksi.");
        } finally {
            setIsDeleting(false);
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            <Navbar />

            <main className="flex-1 flex overflow-hidden">
                <Sidebar />

                <section className="flex-1 flex flex-col bg-background-light overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-28 md:pb-8 space-y-4 md:space-y-8">

                        {/* ── Title & Actions ─────────────────────────────── */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                                    Daftar Wilayah
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola master data wilayah yang tersedia di sistem.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter
                                    fields={FILTER_FIELDS}
                                    onApplyFilter={handleApplyFilter}
                                />
                                <Link
                                    href="/master-data/region/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Wilayah Baru
                                </Link>
                            </div>
                        </div>

                        {/* ── Error Banner ─────────────────────────────────── */}
                        {(error || deleteError) && (
                            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                                <span className="material-symbols-outlined text-base shrink-0">error</span>
                                {error || deleteError}
                                {error && (
                                    <button
                                        onClick={() => fetchData(page, search)}
                                        className="ml-auto text-xs font-semibold underline hover:no-underline"
                                    >
                                        Coba lagi
                                    </button>
                                )}
                                {deleteError && (
                                    <button
                                        onClick={() => setDeleteError(null)}
                                        className="ml-auto text-xs font-semibold underline hover:no-underline"
                                    >
                                        Tutup
                                    </button>
                                )}
                            </div>
                        )}

                        {/* ── Table Container ──────────────────────────────── */}
                        <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden">

                            {/* Mobile Card View */}
                            <div className="block md:hidden divide-y divide-primary/5">
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
                                ) : data.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <span className="material-symbols-outlined text-5xl text-slate-300">map</span>
                                        <p className="mt-2 text-sm text-slate-500">Tidak ada data wilayah</p>
                                    </div>
                                ) : data.map((item) => (
                                    <div key={item.regionid} className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Link
                                                    href={`/master-data/region/${item.regionid}`}
                                                    className="font-semibold text-primary text-sm hover:underline"
                                                >
                                                    {item.regionname}
                                                </Link>
                                                <p className="text-xs text-slate-500 mt-0.5">{item.cityname}</p>
                                            </div>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary uppercase">
                                                {item.regioncode}
                                            </span>
                                        </div>
                                        <div className="flex justify-end items-center pt-2 border-t border-slate-100 gap-1">
                                            <Link
                                                href={`/master-data/region/${item.regionid}`}
                                                className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-base">edit_square</span>
                                            </Link>
                                            <button
                                                onClick={() => setDeleteTarget(item)}
                                                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-base">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-primary/10">
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Kode Wilayah
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Nama Wilayah
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Kota
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-primary/5">
                                        {isLoading ? (
                                            Array.from({ length: PAGE_LIMIT }).map((_, i) => (
                                                <SkeletonRow key={i} />
                                            ))
                                        ) : data.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-16 text-center">
                                                    <span className="material-symbols-outlined text-5xl text-slate-300 block">map</span>
                                                    <p className="mt-2 text-sm text-slate-500">Tidak ada data wilayah</p>
                                                </td>
                                            </tr>
                                        ) : data.map((item) => (
                                            <tr
                                                key={item.regionid}
                                                className="hover:bg-primary/5 transition-colors cursor-pointer"
                                                onClick={() => router.push(`/master-data/region/${item.regionid}`)}
                                            >
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-primary/10 text-primary uppercase">
                                                        {item.regioncode}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Link
                                                        href={`/master-data/region/${item.regionid}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="font-semibold text-primary text-sm tracking-tight hover:underline"
                                                    >
                                                        {item.regionname}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {item.cityname || "—"}
                                                </td>
                                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/master-data/region/${item.regionid}`}
                                                            className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                                            title="Edit"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">edit_square</span>
                                                        </Link>
                                                        <button
                                                            onClick={() => setDeleteTarget(item)}
                                                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                                            title="Hapus"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <Pagination
                                page={page}
                                total={total}
                                limit={PAGE_LIMIT}
                                isLoading={isLoading}
                                onPageChange={handlePageChange}
                            />
                        </div>

                    </div>
                </section>
            </main>

            <StatusBar />

            {/* Delete Confirm Modal */}
            <DeleteModal
                item={deleteTarget}
                isDeleting={isDeleting}
                onConfirm={handleDeleteConfirm}
                onCancel={() => { setDeleteTarget(null); setDeleteError(null); }}
            />
        </div>
    );
}
