"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";
import DataTable, { Column } from "../../components/DataTable";

// ─── Types ────────────────────────────────────────────────────────────────────

interface InventoryAdjustment {
    id: string;
    noAdjustment: string;
    gudang: string;
    tanggal: string;
    alasan: string;
    catatan: string;
    qty: number;
    jumlah: number;
    status: "Approved" | "Draft" | "Pending";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const adjustments: InventoryAdjustment[] = [
    {
        id: "AJB2206-0003",
        noAdjustment: "AJB 2206-0003",
        gudang: "GUDANG DADAP A8",
        tanggal: "2022-06-30",
        alasan: "PENYESUAIAN",
        catatan: "Penyesuaian Stok karena PENYESUAIAN",
        qty: 0,
        jumlah: 0,
        status: "Draft",
    },
    {
        id: "AJB2206-0002",
        noAdjustment: "AJB 2206-0002",
        gudang: "GUDANG DADAP B2 AB",
        tanggal: "2022-06-30",
        alasan: "PENYESUAIAN",
        catatan: "Penyesuaian Stok karena PENYESUAIAN",
        qty: 160,
        jumlah: 15257732.91,
        status: "Draft",
    },
    {
        id: "AJB2206-0001",
        noAdjustment: "AJB 2206-0001",
        gudang: "GUDANG DADAP A8",
        tanggal: "2022-06-29",
        alasan: "PENYESUAIAN",
        catatan: "Penyesuaian Stok karena PENYESUAIAN",
        qty: 385,
        jumlah: 36713919.82,
        status: "Draft",
    },
    {
        id: "AJB1912-0008",
        noAdjustment: "AJB 1912-0008",
        gudang: "GUDANG KAPUK",
        tanggal: "2019-12-31",
        alasan: "PENYESUAIAN",
        catatan: "Penyesuaian Stok untuk BARANG REJECT 201912",
        qty: 75,
        jumlah: 3056789.92,
        status: "Approved",
    },
    {
        id: "AJB1912-0007",
        noAdjustment: "AJB 1912-0007",
        gudang: "GUDANG DADAP B2 AB",
        tanggal: "2019-12-31",
        alasan: "PENYESUAIAN",
        catatan: "Penyesuaian Stok untuk BARANG PROMOSI 201912",
        qty: -185,
        jumlah: -17652668.08,
        status: "Approved",
    },
    {
        id: "AJB1912-0006",
        noAdjustment: "AJB 1912-0006",
        gudang: "GUDANG RAWA BEBEK",
        tanggal: "2019-12-31",
        alasan: "STOCK OPNAME",
        catatan: "Penyesuaian Stok karena STOCK OPNAME GUDANG RAWA BEBEK",
        qty: 0,
        jumlah: 0,
        status: "Approved",
    },
    {
        id: "AJB1912-0005",
        noAdjustment: "AJB 1912-0005",
        gudang: "GUDANG KAPUK B3",
        tanggal: "2019-12-31",
        alasan: "STOCK OPNAME",
        catatan: "Penyesuaian Stok karena STOCK OPNAME GUDANG KAPUK B3",
        qty: 0,
        jumlah: 0,
        status: "Approved",
    },
    {
        id: "AJB1912-0004",
        noAdjustment: "AJB 1912-0004",
        gudang: "GUDANG KAPUK",
        tanggal: "2019-12-31",
        alasan: "STOCK OPNAME",
        catatan: "Penyesuaian Stok karena STOCK OPNAME GUDANG KAPUK",
        qty: 0,
        jumlah: 0,
        status: "Approved",
    },
    {
        id: "AJB1912-0003",
        noAdjustment: "AJB 1912-0003",
        gudang: "GUDANG DADAP B1 AB",
        tanggal: "2019-12-31",
        alasan: "STOCK OPNAME",
        catatan: "Penyesuaian Stok karena STOCK OPNAME GUDANG DADAP B1 AB",
        qty: 0,
        jumlah: 0,
        status: "Approved",
    },
    {
        id: "AJB1912-0002",
        noAdjustment: "AJB 1912-0002",
        gudang: "GUDANG DADAP C7",
        tanggal: "2019-12-31",
        alasan: "STOCK OPNAME",
        catatan: "Penyesuaian Stok karena STOCK OPNAME GUDANG DADAP C7",
        qty: 0,
        jumlah: 0,
        status: "Approved",
    },
];

// ─── Status ───────────────────────────────────────────────────────────────────

const statusStyles: Record<InventoryAdjustment["status"], string> = {
    Approved: "bg-green-100 text-green-800",
    Draft:    "bg-slate-100 text-slate-800",
    Pending:  "bg-yellow-100 text-yellow-800",
};

// ─── Filter Fields ────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
    { key: "noAdjustment", label: "No. Adjustment", type: "text" },
    { key: "gudang",       label: "Gudang",          type: "text" },
    { key: "alasan",       label: "Alasan",          type: "text" },
    { key: "catatan",      label: "Catatan",         type: "text" },
    {
        key: "status",
        label: "Status",
        type: "select",
        options: [
            { label: "Approved", value: "Approved" },
            { label: "Draft",    value: "Draft" },
            { label: "Pending",  value: "Pending" },
        ],
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCur = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InventoryAdjustmentListPage() {
    const [filteredData, setFilteredData] = useState<InventoryAdjustment[]>(adjustments);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(adjustments);
            return;
        }
        const result = adjustments.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof InventoryAdjustment];
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

    const columns: Column<InventoryAdjustment>[] = [
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
            header: "Gudang",
            key: "gudang",
            render: (r) => <span className="text-sm font-medium">{r.gudang}</span>,
        },
        {
            header: "No. Adjustment",
            key: "noAdjustment",
            render: (r) => (
                <Link
                    href={`/inventory/adjustment/${r.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {r.noAdjustment}
                </Link>
            ),
        },
        {
            header: "Tanggal",
            key: "tanggal",
            render: (r) => <span className="text-sm">{r.tanggal}</span>,
        },
        {
            header: "Alasan",
            key: "alasan",
            render: (r) => <span className="text-sm font-medium">{r.alasan}</span>,
        },
        {
            header: "Catatan",
            key: "catatan",
            render: (r) => (
                <span className="text-sm text-slate-600 max-w-[240px] truncate block" title={r.catatan}>
                    {r.catatan}
                </span>
            ),
        },
        {
            header: "Qty",
            key: "qty",
            align: "right",
            render: (r) => (
                <span className={`text-sm font-medium text-right block ${r.qty < 0 ? "text-red-600" : ""}`}>
                    {r.qty.toFixed(2)}
                </span>
            ),
        },
        {
            header: "Jumlah",
            key: "jumlah",
            align: "right",
            render: (r) => (
                <span className={`text-sm font-bold text-right block ${r.jumlah < 0 ? "text-red-600" : ""}`}>
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
                        href={`/inventory/adjustment/${r.id}`}
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

    const renderMobileCard = (r: InventoryAdjustment) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        href={`/inventory/adjustment/${r.id}`}
                        className="font-semibold text-primary text-sm hover:underline"
                    >
                        {r.noAdjustment}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{r.tanggal} · {r.gudang}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[r.status]}`}>
                    {r.status}
                </span>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-900">{r.alasan}</p>
                <p className="text-xs text-slate-500">{r.catatan}</p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <div>
                    <span className="text-xs text-slate-400">Qty: </span>
                    <span className={`text-sm font-semibold ${r.qty < 0 ? "text-red-600" : "text-slate-900"}`}>
                        {r.qty.toFixed(2)}
                    </span>
                    <span className="mx-2 text-slate-300">|</span>
                    <span className={`text-sm font-bold ${r.jumlah < 0 ? "text-red-600" : "text-slate-900"}`}>
                        {fmtCur(r.jumlah)}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <Link
                        href={`/inventory/adjustment/${r.id}`}
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
                                    Daftar Penyesuaian Persediaan
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola dan pantau semua penyesuaian (adjustment) stok barang.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/inventory/adjustment/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Adjustment Baru
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
