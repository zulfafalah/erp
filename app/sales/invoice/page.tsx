"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";
import DataTable, { Column } from "../../components/DataTable";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SalesInvoice {
    id: string;
    noInv: string;
    noSO: string;
    tanggal: string;
    tanggalKirim: string;
    outlet: string;
    pelanggan: string;
    currency: string;
    jumlah: number;
    totalRetur: number;
    totalBayar: number;
    status: "Approved" | "Pending" | "Draft" | "Closed";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const allInvoices: SalesInvoice[] = [
    {
        id: "SIL-2601-0001",
        noInv: "SIL 2601-0001",
        noSO: "SOL 2601-0001",
        tanggal: "06/01/2026",
        tanggalKirim: "06/01/2026",
        outlet: "GKPK",
        pelanggan: "AYU",
        currency: "IDR",
        jumlah: 655943.39,
        totalRetur: 327971.70,
        totalBayar: 0.00,
        status: "Approved",
    },
    {
        id: "SIL-2601-0002",
        noInv: "SIL 2601-0002",
        noSO: "SOL 2601-0002",
        tanggal: "08/01/2026",
        tanggalKirim: "08/01/2026",
        outlet: "GKPK",
        pelanggan: "TOKO MAKMUR",
        currency: "IDR",
        jumlah: 1250000.00,
        totalRetur: 0.00,
        totalBayar: 1250000.00,
        status: "Closed",
    },
    {
        id: "SIL-2602-0001",
        noInv: "SIL 2602-0001",
        noSO: "SOL 2602-0001",
        tanggal: "05/02/2026",
        tanggalKirim: "05/02/2026",
        outlet: "GKPK",
        pelanggan: "CV SUMBER BERKAH",
        currency: "IDR",
        jumlah: 3750000.00,
        totalRetur: 0.00,
        totalBayar: 0.00,
        status: "Pending",
    },
    {
        id: "SIL-2602-0002",
        noInv: "SIL 2602-0002",
        noSO: "SOL 2602-0003",
        tanggal: "12/02/2026",
        tanggalKirim: "13/02/2026",
        outlet: "ONLINE",
        pelanggan: "PT MITRA SENTOSA",
        currency: "IDR",
        jumlah: 8200000.00,
        totalRetur: 500000.00,
        totalBayar: 7700000.00,
        status: "Approved",
    },
    {
        id: "SIL-2603-0001",
        noInv: "SIL 2603-0001",
        noSO: "SOL 2603-0001",
        tanggal: "03/03/2026",
        tanggalKirim: "04/03/2026",
        outlet: "GKPK",
        pelanggan: "UD HARAPAN BARU",
        currency: "IDR",
        jumlah: 980000.00,
        totalRetur: 0.00,
        totalBayar: 0.00,
        status: "Draft",
    },
];

// ─── Status Styles ────────────────────────────────────────────────────────────

const statusStyles: Record<SalesInvoice["status"], string> = {
    Approved: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Draft: "bg-slate-100 text-slate-800",
    Closed: "bg-emerald-100 text-emerald-800",
};

// ─── Filter Fields ────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
    { key: "noInv", label: "No. Invoice", type: "text" },
    { key: "noSO", label: "No. SO", type: "text" },
    { key: "pelanggan", label: "Pelanggan", type: "text" },
    { key: "outlet", label: "Outlet", type: "text" },
    {
        key: "status",
        label: "Status",
        type: "select",
        options: [
            { label: "Approved", value: "Approved" },
            { label: "Pending", value: "Pending" },
            { label: "Draft", value: "Draft" },
            { label: "Closed", value: "Closed" },
        ],
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCur = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Page Component ───────────────────────────────────────────────────────────

export default function SalesInvoiceListPage() {
    const [filteredInvoices, setFilteredInvoices] = useState<SalesInvoice[]>(allInvoices);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredInvoices(allInvoices);
            return;
        }
        const result = allInvoices.filter((inv) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const invValue = inv[field as keyof SalesInvoice];
                if (invValue === undefined) return true;
                const invStr = String(invValue).toLowerCase();
                const valStr = value.toLowerCase();
                switch (operator) {
                    case "contains":    return invStr.includes(valStr);
                    case "equals":      return invStr === valStr;
                    case "not_equals":  return invStr !== valStr;
                    case "starts_with": return invStr.startsWith(valStr);
                    case "ends_with":   return invStr.endsWith(valStr);
                    default:            return true;
                }
            })
        );
        setFilteredInvoices(result);
    };

    const columns: Column<SalesInvoice>[] = [
        {
            header: "Outlet",
            key: "outlet",
            render: (inv) => <span className="text-sm font-medium">{inv.outlet}</span>,
        },
        {
            header: "SO#",
            key: "noSO",
            render: (inv) => (
                <Link
                    href={`/sales/order/${inv.noSO.replace(/\s/g, "")}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {inv.noSO}
                </Link>
            ),
        },
        {
            header: "INV#",
            key: "noInv",
            render: (inv) => (
                <Link
                    href={`/sales/invoice/${inv.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {inv.noInv}
                </Link>
            ),
        },
        {
            header: "Tanggal",
            key: "tanggal",
            render: (inv) => <span className="text-sm">{inv.tanggal}</span>,
        },
        {
            header: "Pelanggan",
            key: "pelanggan",
            render: (inv) => <span className="text-sm font-medium">{inv.pelanggan}</span>,
        },
        {
            header: "Status",
            key: "status",
            render: (inv) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[inv.status]}`}>
                    {inv.status}
                </span>
            ),
        },
        {
            header: "Currency",
            key: "currency",
            render: (inv) => <span className="text-sm">{inv.currency}</span>,
        },
        {
            header: "Jumlah",
            key: "jumlah",
            align: "right",
            render: (inv) => <span className="text-sm font-bold">{fmtCur(inv.jumlah)}</span>,
        },
        {
            header: "Total Retur",
            key: "totalRetur",
            align: "right",
            render: (inv) => (
                <span className={`text-sm font-bold ${inv.totalRetur > 0 ? "text-amber-600" : "text-slate-500"}`}>
                    {fmtCur(inv.totalRetur)}
                </span>
            ),
        },
        {
            header: "Total Bayar",
            key: "totalBayar",
            align: "right",
            render: (inv) => <span className="text-sm font-bold text-emerald-600">{fmtCur(inv.totalBayar)}</span>,
        },
        {
            header: "Aksi",
            key: "aksi",
            align: "right",
            render: (inv) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/sales/invoice/${inv.id}`}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                        title="View/Edit"
                    >
                        <span className="material-symbols-outlined text-lg">edit_square</span>
                    </Link>
                    <button className="p-1.5 text-slate-400 hover:text-primary transition-colors" title="Print">
                        <span className="material-symbols-outlined text-lg">print</span>
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                        <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                </div>
            ),
        },
    ];

    const renderMobileCard = (inv: SalesInvoice) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        href={`/sales/invoice/${inv.id}`}
                        className="font-semibold text-primary text-sm hover:underline"
                    >
                        {inv.noInv}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{inv.tanggal} · {inv.outlet}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[inv.status]}`}>
                    {inv.status}
                </span>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-900">{inv.pelanggan}</p>
                <p className="text-xs text-slate-500">SO: {inv.noSO}</p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <div>
                    <p className="text-xs text-slate-500">Jumlah</p>
                    <span className="text-sm font-bold text-slate-900">{inv.currency} {fmtCur(inv.jumlah)}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Link
                        href={`/sales/invoice/${inv.id}`}
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
                                    Daftar Faktur Penjualan
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola dan pantau semua faktur penjualan barang lokal.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/sales/invoice/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Faktur Baru
                                </Link>
                            </div>
                        </div>

                        {/* Table Container */}
                        <DataTable
                            data={filteredInvoices}
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
