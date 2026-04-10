"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../../components/MultiFilter";
import DataTable, { Column } from "../../../components/DataTable";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AROpeningBalance {
    id: string;
    noTransaksi: string;
    tanggal: string;
    pelanggan: string;
    status: "Approved" | "Pending" | "Draft" | "Closed";
    nilaiAwal: number;
    totalBayar: number;
    catatan: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const arOpeningBalances: AROpeningBalance[] = [
    {
        id: "SAP1812-0026",
        noTransaksi: "SAP 1812-0026",
        tanggal: "2018-12-31",
        pelanggan: "JANI WIDJAJA",
        status: "Closed",
        nilaiAwal: 0,
        totalBayar: 0,
        catatan: "JANI WIDJAJA",
    },
    {
        id: "SAP1812-0025",
        noTransaksi: "SAP 1812-0025",
        tanggal: "2018-12-31",
        pelanggan: "PT. Surya Bersaudara Sejahtera",
        status: "Closed",
        nilaiAwal: 0,
        totalBayar: 0,
        catatan: "PT. SURYA BERSAUDARA SEI",
    },
    {
        id: "SAP1812-0024",
        noTransaksi: "SAP 1812-0024",
        tanggal: "2018-12-31",
        pelanggan: "Latif Nur Azizah",
        status: "Closed",
        nilaiAwal: 0,
        totalBayar: 0,
        catatan: "LATIF NUR AZIZAH",
    },
    {
        id: "SAP1812-0023",
        noTransaksi: "SAP 1812-0023",
        tanggal: "2018-12-31",
        pelanggan: "Nur Azizah",
        status: "Closed",
        nilaiAwal: 1775.39,
        totalBayar: 0,
        catatan: "NUR AZIZAH",
    },
    {
        id: "SAP1812-0022",
        noTransaksi: "SAP 1812-0022",
        tanggal: "2018-12-31",
        pelanggan: "Kopassindo",
        status: "Closed",
        nilaiAwal: 0,
        totalBayar: 324213200,
        catatan: "KOPASSINDO",
    },
    {
        id: "SAP1812-0021",
        noTransaksi: "SAP 1812-0021",
        tanggal: "2018-12-31",
        pelanggan: "ABADI",
        status: "Closed",
        nilaiAwal: 0,
        totalBayar: 0,
        catatan: "ABADI",
    },
    {
        id: "SAP1812-0020",
        noTransaksi: "SAP 1812-0020",
        tanggal: "2018-12-31",
        pelanggan: "PT. Katsubiro Indonesia",
        status: "Closed",
        nilaiAwal: 34650000,
        totalBayar: 34650000,
        catatan: "PT. KATSUBIRO INDONESIA",
    },
    {
        id: "SAP1812-0019",
        noTransaksi: "SAP 1812-0019",
        tanggal: "2018-12-31",
        pelanggan: "Sulaeman",
        status: "Closed",
        nilaiAwal: 265000.02,
        totalBayar: 265000,
        catatan: "SULAEMAN",
    },
    {
        id: "SAP1812-0018",
        noTransaksi: "SAP 1812-0018",
        tanggal: "2018-12-31",
        pelanggan: "PT. Surya Putra Akusara",
        status: "Closed",
        nilaiAwal: 86000,
        totalBayar: 86000,
        catatan: "PT. SURYA PUTRA AKUSARA",
    },
    {
        id: "SAP1812-0017",
        noTransaksi: "SAP 1812-0017",
        tanggal: "2018-12-31",
        pelanggan: "Iman",
        status: "Closed",
        nilaiAwal: 229950000.70,
        totalBayar: 229950000,
        catatan: "IMAN",
    },
];

// ─── Status ───────────────────────────────────────────────────────────────────

const statusStyles: Record<AROpeningBalance["status"], string> = {
    Approved: "bg-green-100 text-green-800",
    Pending:  "bg-yellow-100 text-yellow-800",
    Draft:    "bg-slate-100 text-slate-800",
    Closed:   "bg-emerald-100 text-emerald-800",
};

// ─── Filter Fields ────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
    { key: "noTransaksi", label: "No. Transaksi", type: "text" },
    { key: "pelanggan",   label: "Pelanggan",     type: "text" },
    {
        key: "status",
        label: "Status",
        type: "select",
        options: [
            { label: "Approved", value: "Approved" },
            { label: "Closed",   value: "Closed" },
            { label: "Pending",  value: "Pending" },
            { label: "Draft",    value: "Draft" },
        ],
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCur = (n: number) =>
    "Rp " + n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AROpeningBalanceListPage() {
    const [filteredData, setFilteredData] = useState<AROpeningBalance[]>(arOpeningBalances);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(arOpeningBalances);
            return;
        }
        const result = arOpeningBalances.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof AROpeningBalance];
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

    const columns: Column<AROpeningBalance>[] = [
        {
            header: "No. Transaksi",
            key: "noTransaksi",
            render: (r) => (
                <Link
                    href={`/finance/accounts-receivable/opening-balance/${r.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {r.noTransaksi}
                </Link>
            ),
        },
        {
            header: "Tanggal",
            key: "tanggal",
            render: (r) => <span className="text-sm">{r.tanggal}</span>,
        },
        {
            header: "Pelanggan",
            key: "pelanggan",
            render: (r) => <span className="text-sm font-medium">{r.pelanggan}</span>,
        },
        {
            header: "Status",
            key: "status",
            render: (r) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[r.status]}`}>
                    {r.status}
                </span>
            ),
        },
        {
            header: "Nilai Awal",
            key: "nilaiAwal",
            align: "right",
            render: (r) => (
                <span className="text-sm font-bold text-right block">
                    {fmtCur(r.nilaiAwal)}
                </span>
            ),
        },
        {
            header: "Total Bayar",
            key: "totalBayar",
            align: "right",
            render: (r) => (
                <span className={`text-sm font-bold text-right block ${r.totalBayar === 0 ? "text-red-500" : "text-primary"}`}>
                    {fmtCur(r.totalBayar)}
                </span>
            ),
        },
        {
            header: "Catatan",
            key: "catatan",
            render: (r) => (
                <span className="text-sm text-slate-600 max-w-[260px] truncate block" title={r.catatan}>
                    {r.catatan}
                </span>
            ),
        },
        {
            header: "Aksi",
            key: "aksi",
            align: "right",
            render: (r) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/finance/accounts-receivable/opening-balance/${r.id}`}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                        title="View/Edit"
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
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                        title="Delete"
                    >
                        <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                </div>
            ),
        },
    ];

    const renderMobileCard = (r: AROpeningBalance) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        href={`/finance/accounts-receivable/opening-balance/${r.id}`}
                        className="font-semibold text-primary text-sm hover:underline"
                    >
                        {r.noTransaksi}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{r.tanggal}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[r.status]}`}>
                    {r.status}
                </span>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-900">{r.pelanggan}</p>
                <p className="text-xs text-slate-500 truncate">{r.catatan}</p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <div>
                    <p className="text-[11px] text-slate-400">Nilai Awal</p>
                    <span className="text-sm font-bold text-slate-900">{fmtCur(r.nilaiAwal)}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Link
                        href={`/finance/accounts-receivable/opening-balance/${r.id}`}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-base">edit_square</span>
                    </Link>
                    <button className="p-1.5 text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-base">print</span>
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                </div>
            </div>
        </div>
    );

    // Summary total
    const totalNilaiAwal = filteredData.reduce((s, r) => s + r.nilaiAwal, 0);
    const totalBayar     = filteredData.reduce((s, r) => s + r.totalBayar, 0);

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
                        {/* Title and Actions */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                                    Saldo Awal Piutang Pelanggan
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Daftar pencatatan sisa piutang pelanggan awal (Opening Balance AR).
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/finance/accounts-receivable/opening-balance/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Saldo Awal Baru
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

                        {/* Summary Footer */}
                        <div className="bg-white rounded-xl border border-primary/10 shadow-sm px-4 md:px-6 py-4 flex flex-col sm:flex-row gap-4 sm:gap-8">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">account_balance</span>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Nilai Awal</p>
                                    <p className="text-base md:text-lg font-black text-slate-900">{fmtCur(totalNilaiAwal)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-emerald-500">payments</span>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Bayar</p>
                                    <p className="text-base md:text-lg font-black text-emerald-600">{fmtCur(totalBayar)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer StatusBar */}
            <StatusBar />
        </div>
    );
}
