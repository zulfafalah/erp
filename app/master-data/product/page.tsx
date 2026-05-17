"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";
import DataTable, { Column } from "../../components/DataTable";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductListItem {
    productid: number;
    productcode: string;
    productname: string;
    productname2: string;
    productname3: string;
    prodtype: string | null;
    familyid: number;
    familyname: string | null;
    produnit: string | null;
    uom_id_prod: number;
    barcodeno: string | null;
    barcodeno2: string | null;
    maxprice: string | null;
    minprice: string | null;
    minorder: string;
    limitstok: number | null;
    sizeprod: number | null;
    iscontinue: number | null;
    prodcur: string;
    created: string | null;
    createdby: string | null;
    modified: string | null;
    modifiedby: string | null;
}

interface ApiResponse {
    ok: boolean;
    data: ProductListItem[];
    page: number;
    limit: number;
    total: number;
    message?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_LIMIT = 10;

const FILTER_FIELDS: FilterField[] = [
    { key: "productcode", label: "Kode Barang", type: "text" },
    { key: "productname", label: "Nama Barang", type: "text" },
    { key: "familyname",  label: "Grup Barang", type: "text" },
    { key: "barcodeno",   label: "Barcode",     type: "text" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtNum = (n: number | string | null) => {
    if (n === null || n === undefined) return "0.00";
    const num = typeof n === "string" ? parseFloat(n) : n;
    if (isNaN(num)) return "0.00";
    return num.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

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

export default function ProductListPage() {
    const [data, setData]             = useState<ProductListItem[]>([]);
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
            const res  = await fetch(`/api/master-data/products?${qs.toString()}`);
            const json = await res.json() as ApiResponse;

            if (!res.ok || !json.ok) {
                setError(json.message ?? "Gagal memuat data produk.");
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
        if (!confirm(`Hapus produk "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
        setDeletingId(id);
        try {
            const res  = await fetch(`/api/master-data/products/${id}`, { method: "DELETE" });
            const json = await res.json() as { ok: boolean; message?: string };
            if (!res.ok || !json.ok) {
                alert(json.message ?? "Gagal menghapus data produk.");
                return;
            }
            fetchData(page, search);
        } catch {
            alert("Terjadi kesalahan koneksi saat menghapus data.");
        } finally {
            setDeletingId(null);
        }
    };

    // ── Render Helpers ─────────────────────────────────────────────────────────

    const columns: Column<ProductListItem>[] = [
        {
            header: "Grup Barang",
            key: "familyname",
            render: (item) => (
                <span className="text-sm text-slate-600">{item.familyname ?? "-"}</span>
            ),
        },
        {
            header: "Nama Barang",
            key: "productname",
            render: (item) => (
                <div>
                    <Link
                        href={`/master-data/product/${item.productid}`}
                        className="font-semibold text-primary text-sm tracking-tight hover:underline block"
                    >
                        {item.productname}
                    </Link>
                    <div className="flex flex-wrap gap-x-1 mt-0.5 items-center">
                        <span className="text-xs text-slate-400 font-medium">
                            {item.productcode}
                        </span>
                        {item.barcodeno && (
                            <span className="text-xs text-slate-400">
                                · {item.barcodeno}
                            </span>
                        )}
                    </div>
                </div>
            ),
        },
        {
            header: "UOM",
            key: "produnit",
            render: (item) => <span className="text-sm text-slate-600">{item.produnit ?? "-"}</span>,
        },
        {
            header: "H. Jual Min",
            key: "minprice",
            align: "right",
            render: (item) => (
                <span className="text-sm text-right block">
                    {fmtNum(item.minprice)}
                </span>
            ),
        },
        {
            header: "H. Jual Max",
            key: "maxprice",
            align: "right",
            render: (item) => (
                <span className="text-sm font-medium text-right block">
                    {fmtNum(item.maxprice)}
                </span>
            ),
        },
        {
            header: "Aksi",
            key: "aksi",
            align: "right",
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/master-data/product/${item.productid}`}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                        title="Edit"
                    >
                        <span className="material-symbols-outlined text-lg">edit_square</span>
                    </Link>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(item.productid, item.productname); }}
                        disabled={deletingId === item.productid}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Delete"
                    >
                        <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                </div>
            ),
        },
    ];

    const renderMobileCard = (item: ProductListItem) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                    <Link
                        href={`/master-data/product/${item.productid}`}
                        className="font-semibold text-primary text-sm hover:underline block truncate"
                    >
                        {item.productname}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">
                        {item.familyname ?? "-"} · {item.produnit ?? "-"}
                    </p>
                </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <div>
                    <p className="text-xs text-slate-400">Min / Max</p>
                    <p className="text-sm font-semibold text-slate-800">
                        {fmtNum(item.minprice)} / {fmtNum(item.maxprice)}
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    <Link
                        href={`/master-data/product/${item.productid}`}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-base">edit_square</span>
                    </Link>
                    <button 
                        onClick={() => handleDelete(item.productid, item.productname)}
                        disabled={deletingId === item.productid}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            <Navbar />

            <main className="flex-1 flex overflow-hidden">
                <Sidebar />

                <section className="flex-1 flex flex-col bg-background-light overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-28 md:pb-8 space-y-4 md:space-y-8">
                        {/* Title and Actions */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                                    Daftar Produk
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola master data barang/produk di sistem.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/master-data/product/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Produk Baru
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
                            keyField="productid"
                            renderMobileCard={renderMobileCard}
                            isLoading={isLoading}
                            skeletonRows={PAGE_LIMIT}
                            emptyIcon="inventory_2"
                            emptyText="Tidak ada data produk"
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

            <StatusBar />
        </div>
    );
}
