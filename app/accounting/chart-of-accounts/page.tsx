"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";
import DataTable, { Column } from "../../components/DataTable";

// ─── Types ────────────────────────────────────────────────────────────────────

type TipeAkun = "GRUP UTAMA" | "SUB GRUP" | "DETAIL";

interface ChartOfAccount {
    id: string;
    primarykey: number;
    tipeAkun: TipeAkun;
    grupAkun: string;
    parent: string;
    kodeAkun: string;
    keteranganAkun: string;
    accounttype: string;
    isbank: number;
    coa0: number;
    currencyname: string;
    limit_saldo_val: string;
}

// ─── Filter Fields ────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
    {
        key: "tipeAkun", label: "Tipe Akun", type: "select",
        options: [
            { label: "Grup Utama", value: "GRUP UTAMA" },
            { label: "Sub Grup",   value: "SUB GRUP"   },
            { label: "Detail",     value: "DETAIL"     },
        ],
    },
    {
        key: "grupAkun", label: "Grup Akun", type: "select",
        options: [
            { label: "Assets",      value: "ASSETS"      },
            { label: "Liabilities", value: "LIABILITIES" },
            { label: "Equity",      value: "EQUITY"      },
            { label: "Revenue",     value: "REVENUE"     },
            { label: "Expenses",    value: "EXPENSES"    },
        ],
    },
    { key: "kodeAkun",       label: "Kode Akun",       type: "text" },
    { key: "keteranganAkun", label: "Keterangan Akun", type: "text" },
    { key: "parent",         label: "Parent",          type: "text" },
];

// ─── Tipe Akun Badge Styles ───────────────────────────────────────────────────

const tipeStyles: Record<TipeAkun, string> = {
    "GRUP UTAMA": "bg-purple-100 text-purple-800",
    "SUB GRUP":   "bg-blue-100 text-blue-800",
    "DETAIL":     "bg-slate-100 text-slate-700",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Map API accounttype → display TipeAkun badge */
function toTipeAkun(accounttype: string): TipeAkun {
    const t = (accounttype ?? "").toUpperCase();
    if (t.includes("GRUP UTAMA") || t.includes("MAIN") || t.includes("HEADER")) return "GRUP UTAMA";
    if (t.includes("SUB"))     return "SUB GRUP";
    return "DETAIL";
}

/** Map API groupname → display grupAkun */
function toGrupAkun(groupname: string): string {
    return (groupname ?? "").toUpperCase() || "—";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChartOfAccountsListPage() {
    const [allData,      setAllData]      = useState<ChartOfAccount[]>([]);
    const [filteredData, setFilteredData] = useState<ChartOfAccount[]>([]);
    const [loading,      setLoading]      = useState(true);
    const [error,        setError]        = useState<string | null>(null);
    const [deletingId,   setDeletingId]   = useState<string | null>(null);

    // Pagination state
    const [page,     setPage]     = useState(1);
    const [pageSize] = useState(20);
    const [total,    setTotal]    = useState(0);
    const [search,   setSearch]   = useState("");

    // ── Fetch data ────────────────────────────────────────────────────────────

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const qs = new URLSearchParams({
                page:      String(page),
                page_size: String(pageSize),
            });
            if (search) qs.set("search", search);

            const res = await fetch(`/api/accounting/accounts?${qs.toString()}`);
            const json = await res.json() as {
                ok: boolean;
                data?: {
                    primarykey: number;
                    code: string;
                    name: string;
                    accounttype: string;
                    groupname: string;
                    parentname: string | null;
                    isbank: number;
                    coa0: number;
                    currencyname: string | null;
                    limit_saldo_val: string | null;
                }[];
                total?: number;
                message?: string;
            };

            if (!json.ok) throw new Error(json.message ?? "Gagal memuat data.");

            const mapped: ChartOfAccount[] = (json.data ?? []).map((item) => ({
                id:             String(item.primarykey),
                primarykey:     item.primarykey,
                tipeAkun:       toTipeAkun(item.accounttype),
                grupAkun:       toGrupAkun(item.groupname),
                parent:         item.parentname ?? "",
                kodeAkun:       item.code,
                keteranganAkun: item.name,
                accounttype:    item.accounttype,
                isbank:         item.isbank,
                coa0:           item.coa0,
                currencyname:   item.currencyname ?? "",
                limit_saldo_val: item.limit_saldo_val ?? "",
            }));

            setAllData(mapped);
            setFilteredData(mapped);
            setTotal(json.total ?? mapped.length);
        } catch (err: unknown) {
            const e = err as Error;
            setError(e.message ?? "Terjadi kesalahan.");
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, search]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // ── Filter ────────────────────────────────────────────────────────────────

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(allData);
            return;
        }
        const result = allData.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof ChartOfAccount];
                if (itemValue === undefined) return true;
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
            }),
        );
        setFilteredData(result);
    };

    // ── Delete ────────────────────────────────────────────────────────────────

    const handleDelete = async (item: ChartOfAccount) => {
        if (!confirm(`Nonaktifkan akun "${item.keteranganAkun}" (${item.kodeAkun})?`)) return;
        setDeletingId(item.id);
        try {
            const res = await fetch(`/api/accounting/accounts/${item.primarykey}`, {
                method: "DELETE",
            });
            const json = await res.json() as { ok: boolean; message?: string };
            if (!json.ok) throw new Error(json.message);
            await fetchData();
        } catch (err: unknown) {
            const e = err as Error;
            alert(e.message ?? "Gagal menonaktifkan akun.");
        } finally {
            setDeletingId(null);
        }
    };

    // ── Pagination ────────────────────────────────────────────────────────────

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    // ── Columns ───────────────────────────────────────────────────────────────

    const columns: Column<ChartOfAccount>[] = [
        {
            header: "#",
            key: "id",
            render: (_item, idx) => (
                <span className="text-sm text-slate-400 font-medium">{((page - 1) * pageSize) + (idx ?? 0) + 1}.</span>
            ),
        },
        {
            header: "Tipe Akun",
            key: "tipeAkun",
            render: (item) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tipeStyles[item.tipeAkun]}`}>
                    {item.tipeAkun}
                </span>
            ),
        },
        {
            header: "Grup Akun",
            key: "grupAkun",
            render: (item) => <span className="text-sm text-slate-600">{item.grupAkun}</span>,
        },
        {
            header: "Parent",
            key: "parent",
            render: (item) => (
                <span className="text-sm text-slate-500 italic">
                    {item.parent || <span className="text-slate-300">—</span>}
                </span>
            ),
        },
        {
            header: "Kode Akun",
            key: "kodeAkun",
            render: (item) => (
                <span className="text-sm font-mono font-semibold text-slate-700">{item.kodeAkun}</span>
            ),
        },
        {
            header: "Keterangan Akun",
            key: "keteranganAkun",
            render: (item) => (
                <Link
                    href={`/accounting/chart-of-accounts/${item.primarykey}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {item.keteranganAkun}
                </Link>
            ),
        },
        {
            header: "Status",
            key: "coa0",
            render: (item) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.coa0 === 1 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-800"
                }`}>
                    {item.coa0 === 1 ? "Non Aktif" : "Aktif"}
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
                        href={`/accounting/chart-of-accounts/${item.primarykey}`}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                        title="View / Edit"
                    >
                        <span className="material-symbols-outlined text-lg">edit_square</span>
                    </Link>
                    <button
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-40"
                        title="Nonaktifkan"
                        disabled={deletingId === item.id}
                        onClick={() => handleDelete(item)}
                    >
                        <span className="material-symbols-outlined text-lg">
                            {deletingId === item.id ? "hourglass_top" : "delete"}
                        </span>
                    </button>
                </div>
            ),
        },
    ];

    // ── Mobile Card ───────────────────────────────────────────────────────────

    const renderMobileCard = (item: ChartOfAccount, idx?: number) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-slate-400 font-medium">{((page - 1) * pageSize) + (idx ?? 0) + 1}.</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${tipeStyles[item.tipeAkun]}`}>
                            {item.tipeAkun}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.coa0 === 1 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-800"
                        }`}>
                            {item.coa0 === 1 ? "Non Aktif" : "Aktif"}
                        </span>
                    </div>
                    <Link
                        href={`/accounting/chart-of-accounts/${item.primarykey}`}
                        className="font-semibold text-primary text-sm hover:underline block mt-1"
                    >
                        {item.keteranganAkun}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Kode: <span className="font-mono font-bold text-slate-700">{item.kodeAkun}</span>
                    </p>
                </div>
                <div className="text-right shrink-0">
                    <p className="text-xs text-slate-400">Grup</p>
                    <p className="text-xs font-semibold text-slate-700">{item.grupAkun}</p>
                </div>
            </div>
            {item.parent && (
                <p className="text-xs text-slate-400">
                    Parent: <span className="text-slate-600 italic">{item.parent}</span>
                </p>
            )}
            <div className="flex justify-end items-center pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1">
                    <Link
                        href={`/accounting/chart-of-accounts/${item.primarykey}`}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-base">edit_square</span>
                    </Link>
                    <button
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-40"
                        disabled={deletingId === item.id}
                        onClick={() => handleDelete(item)}
                    >
                        <span className="material-symbols-outlined text-base">
                            {deletingId === item.id ? "hourglass_top" : "delete"}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );

    // ── Render ────────────────────────────────────────────────────────────────

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
                                    Chart of Accounts
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola daftar akun perkiraan untuk pencatatan keuangan perusahaan.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                {/* Search bar */}
                                <div className="relative w-full sm:w-56">
                                    <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
                                    <input
                                        type="text"
                                        placeholder="Cari kode / nama akun…"
                                        value={search}
                                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                        className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                                    />
                                </div>
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/accounting/chart-of-accounts/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Akun Baru
                                </Link>
                            </div>
                        </div>

                        {/* Error Banner */}
                        {error && (
                            <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                                <span className="material-symbols-outlined text-base">error</span>
                                {error}
                                <button
                                    onClick={fetchData}
                                    className="ml-auto text-xs font-bold underline hover:no-underline"
                                >
                                    Coba lagi
                                </button>
                            </div>
                        )}

                        {/* Loading Skeleton */}
                        {loading && (
                            <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden">
                                <div className="p-6 space-y-3">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="h-8 bg-slate-100 rounded animate-pulse" />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Table Container */}
                        {!loading && (
                            <DataTable
                                data={filteredData}
                                columns={columns}
                                keyField="id"
                                renderMobileCard={renderMobileCard}
                                footer={
                                    <div className="px-4 md:px-6 py-4 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                                        <p className="text-sm text-slate-500 text-center md:text-left">
                                            Menampilkan {filteredData.length === 0 ? 0 : ((page - 1) * pageSize) + 1} sampai{" "}
                                            {Math.min(page * pageSize, total)} dari {total} data
                                        </p>
                                        <div className="flex flex-wrap justify-center items-center gap-1">
                                            <button
                                                className="p-2 border border-primary/10 rounded hover:bg-white disabled:opacity-50"
                                                disabled={page <= 1}
                                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            >
                                                <span className="material-symbols-outlined text-lg">chevron_left</span>
                                            </button>
                                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                                                .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                                                    if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push("…");
                                                    acc.push(p);
                                                    return acc;
                                                }, [])
                                                .map((p, i) =>
                                                    p === "…" ? (
                                                        <span key={`ellipsis-${i}`} className="px-2 text-slate-400">…</span>
                                                    ) : (
                                                        <button
                                                            key={p}
                                                            onClick={() => setPage(p as number)}
                                                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                                                p === page
                                                                    ? "bg-primary text-white font-bold"
                                                                    : "hover:bg-white text-slate-600"
                                                            }`}
                                                        >
                                                            {p}
                                                        </button>
                                                    ),
                                                )}
                                            <button
                                                className="p-2 border border-primary/10 rounded hover:bg-white disabled:opacity-50"
                                                disabled={page >= totalPages}
                                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                            >
                                                <span className="material-symbols-outlined text-lg">chevron_right</span>
                                            </button>
                                        </div>
                                    </div>
                                }
                            />
                        )}
                    </div>
                </section>
            </main>

            {/* Footer StatusBar */}
            <StatusBar />
        </div>
    );
}
