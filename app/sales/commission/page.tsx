"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";
import DataTable, { Column } from "../../components/DataTable";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SalesCommission {
    id: string;
    noTransaksi: string;
    tanggal: string;
    penjual: string;
    jumlah: number;
    status: "Approved" | "Pending" | "Draft";
    keterangan: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const salesCommissions: SalesCommission[] = [
    {
        id: "PKP26040001",
        noTransaksi: "PKP26040001",
        tanggal: "2026-04-06",
        penjual: "APHAN",
        jumlah: 0.0,
        status: "Draft",
        keterangan: "Komisi untuk : APHAN",
    },
    {
        id: "PKP26030002",
        noTransaksi: "PKP26030002",
        tanggal: "2026-03-15",
        penjual: "BUDI",
        jumlah: 1500000.0,
        status: "Approved",
        keterangan: "Komisi untuk : BUDI",
    },
    {
        id: "PKP26030001",
        noTransaksi: "PKP26030001",
        tanggal: "2026-03-01",
        penjual: "CITRA",
        jumlah: 850000.0,
        status: "Approved",
        keterangan: "Komisi untuk : CITRA",
    },
    {
        id: "PKP26020001",
        noTransaksi: "PKP26020001",
        tanggal: "2026-02-10",
        penjual: "DIAN",
        jumlah: 0.0,
        status: "Pending",
        keterangan: "Komisi untuk : DIAN",
    },
    {
        id: "PKP26010001",
        noTransaksi: "PKP26010001",
        tanggal: "2026-01-20",
        penjual: "APHAN",
        jumlah: 2300000.0,
        status: "Approved",
        keterangan: "Komisi untuk : APHAN",
    },
];

// ─── Status ───────────────────────────────────────────────────────────────────

const statusStyles: Record<SalesCommission["status"], string> = {
    Approved: "bg-green-100 text-green-800",
    Pending:  "bg-yellow-100 text-yellow-800",
    Draft:    "bg-slate-100 text-slate-800",
};

// ─── Filter Fields ────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
    { key: "noTransaksi", label: "No. Transaksi", type: "text" },
    { key: "penjual",     label: "Penjual",        type: "text" },
    { key: "keterangan",  label: "Keterangan",     type: "text" },
    {
        key: "status",
        label: "Status",
        type: "select",
        options: [
            { label: "Approved", value: "Approved" },
            { label: "Pending",  value: "Pending" },
            { label: "Draft",    value: "Draft" },
        ],
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCur = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SalesCommissionListPage() {
    const [filteredData, setFilteredData] = useState<SalesCommission[]>(salesCommissions);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(salesCommissions);
            return;
        }
        const result = salesCommissions.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof SalesCommission];
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

    const columns: Column<SalesCommission>[] = [
        {
            header: "Transaksi#",
            key: "noTransaksi",
            render: (r) => (
                <Link
                    href={`/sales/commission/${r.id}`}
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
            header: "Penjual",
            key: "penjual",
            render: (r) => <span className="text-sm font-medium">{r.penjual}</span>,
        },
        {
            header: "Jumlah",
            key: "jumlah",
            align: "right",
            render: (r) => (
                <span className="text-sm font-bold text-right block">
                    {fmtCur(r.jumlah)}
                </span>
            ),
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
            header: "Keterangan",
            key: "keterangan",
            render: (r) => (
                <span className="text-sm text-slate-600 max-w-[220px] truncate block" title={r.keterangan}>
                    {r.keterangan}
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
                        href={`/sales/commission/${r.id}`}
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

    const renderMobileCard = (r: SalesCommission) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        href={`/sales/commission/${r.id}`}
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
                <p className="text-sm font-medium text-slate-900">{r.penjual}</p>
                <p className="text-xs text-slate-500">{r.keterangan}</p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-sm font-bold text-slate-900">Rp {fmtCur(r.jumlah)}</span>
                <div className="flex items-center gap-1">
                    <Link
                        href={`/sales/commission/${r.id}`}
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
                                    Daftar Pengeluaran Komisi Penjualan
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola dan pantau semua pengeluaran komisi penjualan.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/sales/commission/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Komisi Baru
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
