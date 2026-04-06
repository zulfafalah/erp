"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";
import DataTable, { Column } from "../../components/DataTable";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SalesReturn {
    id: string;
    noRetur: string;
    tipe: string;
    outlet: string;
    tanggal: string;
    pelanggan: string;
    keterangan: string;
    currency: string;
    qtyRetur: number;
    jumlah: number;
    status: "Approved" | "Closed" | "Pending" | "Draft";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const salesReturns: SalesReturn[] = [
    {
        id: "BRL2601-0001",
        noRetur: "BRL 2601-0001",
        tipe: "Nota & Barang",
        outlet: "GKPK",
        tanggal: "2026-01-06",
        pelanggan: "AYU",
        keterangan: "Retur Penjualan dari AYU",
        currency: "RP",
        qtyRetur: 1.0,
        jumlah: 327971.7,
        status: "Approved",
    },
    {
        id: "BRL1904-0001",
        noRetur: "BRL 1904-0001",
        tipe: "Nota & Barang",
        outlet: "GKPKU",
        tanggal: "2019-04-06",
        pelanggan: "MURL.TRD",
        keterangan: "Retur Penjualan dari Murl.TRD",
        currency: "RP",
        qtyRetur: 0.0,
        jumlah: 0.0,
        status: "Closed",
    },
    {
        id: "BRL1903-0004",
        noRetur: "BRL 1903-0004",
        tipe: "Nota & Barang",
        outlet: "GDPBJAS",
        tanggal: "2019-03-02",
        pelanggan: "FINA, TK",
        keterangan: "Retur Penjualan Barang dari Fina. TK",
        currency: "RP",
        qtyRetur: 0.0,
        jumlah: 0.0,
        status: "Closed",
    },
    {
        id: "BRL1903-0003",
        noRetur: "BRL 1903-0003",
        tipe: "Nota & Barang",
        outlet: "GDPBJAS",
        tanggal: "2019-03-02",
        pelanggan: "AYU",
        keterangan: "Retur Penjualan Barang dari Ayu",
        currency: "RP",
        qtyRetur: 0.0,
        jumlah: 0.0,
        status: "Closed",
    },
    {
        id: "BRL1903-0002",
        noRetur: "BRL 1903-0002",
        tipe: "Nota & Barang",
        outlet: "GDPBJAS",
        tanggal: "2019-03-02",
        pelanggan: "AYU",
        keterangan: "Retur Penjualan Barang dari Ayu",
        currency: "RP",
        qtyRetur: 0.0,
        jumlah: 0.0,
        status: "Closed",
    },
    {
        id: "BRL1903-0001",
        noRetur: "BRL 1903-0001",
        tipe: "Nota & Barang",
        outlet: "GDPBJAS",
        tanggal: "2019-03-02",
        pelanggan: "WANDI",
        keterangan: "Retur Penjualan Barang dari Wandi",
        currency: "RP",
        qtyRetur: 0.0,
        jumlah: 0.0,
        status: "Closed",
    },
    {
        id: "SR1190040",
        noRetur: "SR1190040",
        tipe: "Nota & Barang",
        outlet: "GDPBJAS",
        tanggal: "2019-02-25",
        pelanggan: "DEMDIEL SAPTA",
        keterangan: "Retur Penjualan Barang dari Demdiel Sapta",
        currency: "RP",
        qtyRetur: 0.0,
        jumlah: 0.0,
        status: "Closed",
    },
    {
        id: "SR1190039",
        noRetur: "SR1190039",
        tipe: "Nota & Barang",
        outlet: "GDPBJAS",
        tanggal: "2019-02-25",
        pelanggan: "DEMDIEL SAPTA",
        keterangan: "Retur Penjualan Barang dari Demdiel Sapta",
        currency: "RP",
        qtyRetur: 0.0,
        jumlah: 0.0,
        status: "Closed",
    },
    {
        id: "SR1190038",
        noRetur: "SR1190038",
        tipe: "Nota & Barang",
        outlet: "GDPBJAS",
        tanggal: "2019-02-25",
        pelanggan: "DEMDIEL SAPTA",
        keterangan: "Retur Penjualan Barang dari Demdiel Sapta",
        currency: "RP",
        qtyRetur: 0.0,
        jumlah: 0.0,
        status: "Closed",
    },
    {
        id: "SR1190037",
        noRetur: "SR1190037",
        tipe: "Nota & Barang",
        outlet: "GDPBJAS",
        tanggal: "2019-02-21",
        pelanggan: "MURL.TRD",
        keterangan: "Retur Penjualan Barang dari Murl.TRD",
        currency: "RP",
        qtyRetur: 0.0,
        jumlah: 0.0,
        status: "Closed",
    },
];

// ─── Status ───────────────────────────────────────────────────────────────────

const statusStyles: Record<SalesReturn["status"], string> = {
    Approved: "bg-green-100 text-green-800",
    Closed:   "bg-emerald-100 text-emerald-800",
    Pending:  "bg-yellow-100 text-yellow-800",
    Draft:    "bg-slate-100 text-slate-800",
};

// ─── Filter Fields ────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
    { key: "noRetur",   label: "No. Retur",  type: "text" },
    { key: "pelanggan", label: "Pelanggan",  type: "text" },
    { key: "outlet",    label: "Outlet",     type: "text" },
    { key: "tipe",      label: "Tipe",       type: "text" },
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
    n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SalesReturnListPage() {
    const [filteredData, setFilteredData] = useState<SalesReturn[]>(salesReturns);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(salesReturns);
            return;
        }
        const result = salesReturns.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof SalesReturn];
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

    const columns: Column<SalesReturn>[] = [
        {
            header: "Tipe",
            key: "tipe",
            render: (r) => <span className="text-sm">{r.tipe}</span>,
        },
        {
            header: "Outlet",
            key: "outlet",
            render: (r) => <span className="text-sm font-medium">{r.outlet}</span>,
        },
        {
            header: "Retur#",
            key: "noRetur",
            render: (r) => (
                <Link
                    href={`/sales/return/${r.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {r.noRetur}
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
            header: "Keterangan",
            key: "keterangan",
            render: (r) => (
                <span className="text-sm text-slate-600 max-w-[220px] truncate block" title={r.keterangan}>
                    {r.keterangan}
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
            header: "Currency",
            key: "currency",
            render: (r) => <span className="text-sm text-slate-500">{r.currency}</span>,
        },
        {
            header: "Qty Retur",
            key: "qtyRetur",
            align: "right",
            render: (r) => (
                <span className="text-sm font-medium text-right block">
                    {r.qtyRetur.toFixed(2)}
                </span>
            ),
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
            header: "Aksi",
            key: "aksi",
            align: "right",
            render: (r) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/sales/return/${r.id}`}
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

    const renderMobileCard = (r: SalesReturn) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        href={`/sales/return/${r.id}`}
                        className="font-semibold text-primary text-sm hover:underline"
                    >
                        {r.noRetur}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{r.tanggal}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[r.status]}`}>
                    {r.status}
                </span>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-900">{r.pelanggan}</p>
                <p className="text-xs text-slate-500">{r.keterangan}</p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-sm font-bold text-slate-900">RP {fmtCur(r.jumlah)}</span>
                <div className="flex items-center gap-1">
                    <Link
                        href={`/sales/return/${r.id}`}
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
                                    Daftar Retur Penjualan
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola dan pantau semua retur penjualan barang.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/sales/return/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Retur Baru
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
