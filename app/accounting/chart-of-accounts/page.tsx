"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";
import DataTable, { Column } from "../../components/DataTable";

// ─── Types ────────────────────────────────────────────────────────────────────

type TipeAkun = "GRUP UTAMA" | "SUB GRUP" | "DETAIL";

interface ChartOfAccount {
    id: string;
    tipeAkun: TipeAkun;
    grupAkun: string;
    parent: string;
    kodeAkun: string;
    keteranganAkun: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const allData: ChartOfAccount[] = [
    { id: "1",  tipeAkun: "GRUP UTAMA", grupAkun: "ASSETS", parent: "",            kodeAkun: "100",       keteranganAkun: "AKTIVA"           },
    { id: "2",  tipeAkun: "SUB GRUP",   grupAkun: "ASSETS", parent: "AKTIVA",      kodeAkun: "100.00",    keteranganAkun: "AKTIVA LANCAR"    },
    { id: "3",  tipeAkun: "SUB GRUP",   grupAkun: "ASSETS", parent: "AKTIVA LANCAR", kodeAkun: "110.00.20", keteranganAkun: "KAS & BANK"     },
    { id: "4",  tipeAkun: "SUB GRUP",   grupAkun: "ASSETS", parent: "KAS & BANK",  kodeAkun: "110.01.20", keteranganAkun: "KAS KECIL"        },
    { id: "5",  tipeAkun: "DETAIL",     grupAkun: "ASSETS", parent: "KAS KECIL",   kodeAkun: "110.01.01", keteranganAkun: "KAS KECIL GD PIK" },
    { id: "6",  tipeAkun: "DETAIL",     grupAkun: "ASSETS", parent: "KAS KECIL",   kodeAkun: "110.01.02", keteranganAkun: "KAS KECIL MEDAN"  },
    { id: "7",  tipeAkun: "DETAIL",     grupAkun: "ASSETS", parent: "KAS KECIL",   kodeAkun: "110.01.03", keteranganAkun: "KAS KECIL SURABAYA" },
    { id: "8",  tipeAkun: "SUB GRUP",   grupAkun: "ASSETS", parent: "KAS & BANK",  kodeAkun: "110.02.00", keteranganAkun: "KAS BESAR"        },
    { id: "9",  tipeAkun: "DETAIL",     grupAkun: "ASSETS", parent: "KAS BESAR",   kodeAkun: "110.02.01", keteranganAkun: "KAS BESAR PUSAT"  },
    { id: "10", tipeAkun: "SUB GRUP",   grupAkun: "ASSETS", parent: "KAS & BANK",  kodeAkun: "120.00.00", keteranganAkun: "BANK"             },
    { id: "11", tipeAkun: "DETAIL",     grupAkun: "ASSETS", parent: "BANK",        kodeAkun: "120.01.00", keteranganAkun: "BCA PUSAT"        },
    { id: "12", tipeAkun: "DETAIL",     grupAkun: "ASSETS", parent: "BANK",        kodeAkun: "120.02.00", keteranganAkun: "MANDIRI PUSAT"    },
    { id: "13", tipeAkun: "SUB GRUP",   grupAkun: "ASSETS", parent: "AKTIVA LANCAR", kodeAkun: "130.00.00", keteranganAkun: "PIUTANG USAHA"  },
    { id: "14", tipeAkun: "DETAIL",     grupAkun: "ASSETS", parent: "PIUTANG USAHA", kodeAkun: "130.01.00", keteranganAkun: "PIUTANG PELANGGAN" },
    { id: "15", tipeAkun: "SUB GRUP",   grupAkun: "ASSETS", parent: "AKTIVA",      kodeAkun: "200.00.00", keteranganAkun: "AKTIVA TETAP"     },
];

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChartOfAccountsListPage() {
    const [filteredData, setFilteredData] = useState<ChartOfAccount[]>(allData);

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
                const valStr = value.toLowerCase();
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

    const columns: Column<ChartOfAccount>[] = [
        {
            header: "#",
            key: "id",
            render: (item, idx) => (
                <span className="text-sm text-slate-400 font-medium">{(idx ?? 0) + 1}.</span>
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
                    href={`/accounting/chart-of-accounts/${item.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {item.keteranganAkun}
                </Link>
            ),
        },
        {
            header: "Aksi",
            key: "aksi",
            align: "right",
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/accounting/chart-of-accounts/${item.id}`}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                        title="View"
                    >
                        <span className="material-symbols-outlined text-lg">visibility</span>
                    </Link>
                    <button
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                        title="Delete"
                    >
                        <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                </div>
            ),
        },
    ];

    const renderMobileCard = (item: ChartOfAccount, idx?: number) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-slate-400 font-medium">{(idx ?? 0) + 1}.</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${tipeStyles[item.tipeAkun]}`}>
                            {item.tipeAkun}
                        </span>
                    </div>
                    <Link
                        href={`/accounting/chart-of-accounts/${item.id}`}
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
                        href={`/accounting/chart-of-accounts/${item.id}`}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-base">visibility</span>
                    </Link>
                    <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                </div>
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

                        {/* Table Container */}
                        <DataTable
                            data={filteredData}
                            columns={columns}
                            keyField="id"
                            renderMobileCard={renderMobileCard}
                        />
                    </div>
                </section>
            </main>

            {/* Footer StatusBar */}
            <StatusBar />
        </div>
    );
}
