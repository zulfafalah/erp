"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SupplierListItem {
    supplierid: number;
    suppcode: string;
    companyname: string;
    address: string;
    phone: string;
    tempobyr: number | null;
    contactname: string;
    islocal: number;
}

interface ApiResponse {
    ok: boolean;
    data: SupplierListItem[];
    page: number;
    limit: number;
    total: number;
    message?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_LIMIT = 10;

const FILTER_FIELDS: FilterField[] = [
    { key: "suppcode",    label: "Kode Pemasok",  type: "text" },
    { key: "companyname", label: "Nama Pemasok",  type: "text" },
    { key: "contactname", label: "Kontak / PIC",  type: "text" },
    { key: "phone",       label: "Telepon",        type: "text" },
    {
        key: "islocal",
        label: "Jenis Pemasok",
        type: "select",
        options: [
            { label: "Lokal",   value: "1" },
            { label: "Importir", value: "0" },
        ],
    },
];

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
    return (
        <tr>
            {Array.from({ length: 5 }).map((_, i) => (
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
            <div className="space-y-1">
                <div className="h-3.5 w-32 bg-slate-100 rounded animate-pulse" />
                <div className="h-3 w-48 bg-slate-100 rounded animate-pulse" />
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

    // Build visible page numbers (max 5 shown)
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function PemasokListPage() {
    const router = useRouter();

    const [data, setData]           = useState<SupplierListItem[]>([]);
    const [page, setPage]           = useState(1);
    const [total, setTotal]         = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError]         = useState<string | null>(null);
    const [search, setSearch]       = useState("");

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
            const res  = await fetch(`/api/master-data/suppliers?${qs.toString()}`);
            const json = await res.json() as ApiResponse;

            if (!res.ok || !json.ok) {
                setError(json.message ?? "Gagal memuat data pemasok.");
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

    // Initial load + refetch when page changes
    useEffect(() => {
        fetchData(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handleApplyFilter = (rules: FilterRule[]) => {
        // Build simple search string dari rule pertama bertipe "contains"
        const searchRule = rules.find(r => r.operator === "contains" || r.operator === "equals");
        const q = searchRule?.value ?? "";
        setSearch(q);
        setPage(1);
        fetchData(1, q);
    };

    const handlePageChange = (p: number) => {
        setPage(p);
        // fetchData akan dipanggil via useEffect[page]
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
                                    Daftar Pemasok
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola master data pemasok/supplier Anda.
                                    {total > 0 && !isLoading && (
                                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                                            {total} data
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter
                                    fields={FILTER_FIELDS}
                                    onApplyFilter={handleApplyFilter}
                                />
                                <button
                                    onClick={() => fetchData(page, search)}
                                    disabled={isLoading}
                                    className="flex-none p-2 border border-primary/10 rounded-lg hover:bg-white text-slate-500 hover:text-primary transition-colors disabled:opacity-50"
                                    title="Refresh data"
                                >
                                    <span className={`material-symbols-outlined text-lg ${isLoading ? "animate-spin" : ""}`}>
                                        refresh
                                    </span>
                                </button>
                                <Link
                                    href="/master-data/supplier/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Pemasok Baru
                                </Link>
                            </div>
                        </div>

                        {/* ── Error Banner ─────────────────────────────────── */}
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

                        {/* ── Table Container ──────────────────────────────── */}
                        <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden">

                            {/* Mobile Card View */}
                            <div className="block md:hidden divide-y divide-primary/5">
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
                                ) : data.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <span className="material-symbols-outlined text-5xl text-slate-300">inventory_2</span>
                                        <p className="mt-2 text-sm text-slate-500">Tidak ada data pemasok</p>
                                    </div>
                                ) : data.map((p) => (
                                    <div key={p.supplierid} className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Link
                                                    href={`/master-data/supplier/${p.supplierid}`}
                                                    className="font-semibold text-primary text-sm hover:underline"
                                                >
                                                    {p.suppcode} — {p.companyname}
                                                </Link>
                                                <p className="text-xs text-slate-500 mt-0.5">{p.address || "—"}</p>
                                            </div>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                p.islocal === 1
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-blue-100 text-blue-800"
                                            }`}>
                                                {p.islocal === 1 ? "Lokal" : "Importir"}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">
                                                {p.contactname || "—"}{p.phone ? ` · ${p.phone}` : ""}
                                            </p>
                                        </div>
                                        <div className="flex justify-end items-center pt-2 border-t border-slate-100 gap-1">
                                            <Link
                                                href={`/master-data/supplier/${p.supplierid}`}
                                                className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-base">edit_square</span>
                                            </Link>
                                            <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
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
                                                Kode &amp; Nama
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Kontak &amp; Telp
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Alamat
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Jenis
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Tempo Bayar
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
                                                <td colSpan={6} className="px-6 py-16 text-center">
                                                    <span className="material-symbols-outlined text-5xl text-slate-300 block">inventory_2</span>
                                                    <p className="mt-2 text-sm text-slate-500">Tidak ada data pemasok</p>
                                                </td>
                                            </tr>
                                        ) : data.map((p) => (
                                            <tr
                                                key={p.supplierid}
                                                className="hover:bg-primary/5 transition-colors cursor-pointer"
                                                onClick={() => router.push(`/master-data/supplier/${p.supplierid}`)}
                                            >
                                                <td className="px-6 py-4">
                                                    <Link
                                                        href={`/master-data/supplier/${p.supplierid}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="font-semibold text-primary text-sm tracking-tight hover:underline flex flex-col"
                                                    >
                                                        <span>{p.suppcode}</span>
                                                        <span className="text-slate-700 font-medium">{p.companyname}</span>
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="font-medium text-slate-900">{p.contactname || "—"}</div>
                                                    <div className="text-slate-500 text-xs">{p.phone || "—"}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600 max-w-[200px] truncate">
                                                    {p.address || "—"}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                        p.islocal === 1
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-blue-100 text-blue-800"
                                                    }`}>
                                                        {p.islocal === 1 ? "Lokal" : "Importir"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {p.tempobyr != null ? `${p.tempobyr} hari` : "—"}
                                                </td>
                                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/master-data/supplier/${p.supplierid}`}
                                                            className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                                            title="Edit"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">edit_square</span>
                                                        </Link>
                                                        <button
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
        </div>
    );
}
