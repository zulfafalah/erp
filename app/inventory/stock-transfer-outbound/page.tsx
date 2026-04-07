"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";
import DataTable, { Column } from "../../components/DataTable";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StockTransferOutbound {
    id: string;
    noKirim: string;
    noTerima: string;
    gudangAsal: string;
    gudangTujuan: string;
    tanggal: string;
    alasan: string;
    qty: number;
    status: "Approved" | "Draft" | "In Transit";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const transfers: StockTransferOutbound[] = [
    {
        id: "SOU2206-0001",
        noKirim: "SOU 2206-0001",
        noTerima: "SIN 2206-0001",
        gudangAsal: "GUDANG KAPUK",
        gudangTujuan: "GUDANG DADAP A8",
        tanggal: "2022-05-30",
        alasan: "BOOKING CUSTOMER",
        qty: 5,
        status: "Draft",
    },
    {
        id: "SOU2107-0001",
        noKirim: "SOU 2107-0001",
        noTerima: "SIN 2107-0001",
        gudangAsal: "GUDANG DADAP A8",
        gudangTujuan: "GUDANG DADAP C7",
        tanggal: "2021-07-28",
        alasan: "BOOKING CUSTOMER",
        qty: 2,
        status: "Approved",
    },
    {
        id: "SOU1912-0014",
        noKirim: "SOU 1912-0014",
        noTerima: "SIN 1912-0014",
        gudangAsal: "GUDANG DADAP A8",
        gudangTujuan: "GUDANG DADAP C7",
        tanggal: "2019-12-28",
        alasan: "BOOKING CUSTOMER",
        qty: 700,
        status: "Approved",
    },
    {
        id: "SOU1912-0013",
        noKirim: "SOU 1912-0013",
        noTerima: "SIN 1912-0013",
        gudangAsal: "GUDANG DADAP A8",
        gudangTujuan: "GUDANG DADAP C7",
        tanggal: "2019-12-26",
        alasan: "BOOKING CUSTOMER",
        qty: 1649,
        status: "Approved",
    },
    {
        id: "SOU1912-0012",
        noKirim: "SOU 1912-0012",
        noTerima: "SIN 1912-0012",
        gudangAsal: "GUDANG DADAP C7",
        gudangTujuan: "GUDANG DADAP A8",
        tanggal: "2019-12-26",
        alasan: "BOOKING CUSTOMER",
        qty: 846,
        status: "Approved",
    },
    {
        id: "SOU1912-0011",
        noKirim: "SOU 1912-0011",
        noTerima: "SIN 1912-0011",
        gudangAsal: "GUDANG DADAP C7",
        gudangTujuan: "GUDANG DADAP A8",
        tanggal: "2019-12-24",
        alasan: "BOOKING CUSTOMER",
        qty: 47,
        status: "Approved",
    },
    {
        id: "SOU1912-0010",
        noKirim: "SOU 1912-0010",
        noTerima: "SIN 1912-0010",
        gudangAsal: "GUDANG DADAP C7",
        gudangTujuan: "GUDANG DADAP A8",
        tanggal: "2019-12-23",
        alasan: "BOOKING CUSTOMER",
        qty: 97,
        status: "Approved",
    },
    {
        id: "SOU1912-0009",
        noKirim: "SOU 1912-0009",
        noTerima: "SIN 1912-0009",
        gudangAsal: "GUDANG DADAP A8",
        gudangTujuan: "GUDANG DADAP C7",
        tanggal: "2019-12-20",
        alasan: "BOOKING CUSTOMER",
        qty: 500,
        status: "Approved",
    },
    {
        id: "SOU1912-0008",
        noKirim: "SOU 1912-0008",
        noTerima: "SIN 1912-0008",
        gudangAsal: "GUDANG DADAP A8",
        gudangTujuan: "GUDANG DADAP C7",
        tanggal: "2019-12-18",
        alasan: "BOOKING CUSTOMER",
        qty: 77,
        status: "Approved",
    },
    {
        id: "SOU1912-0007",
        noKirim: "SOU 1912-0007",
        noTerima: "SIN 1912-0007",
        gudangAsal: "GUDANG DADAP A8",
        gudangTujuan: "GUDANG DADAP B1 A8",
        tanggal: "2019-12-18",
        alasan: "BOOKING CUSTOMER",
        qty: 18,
        status: "Approved",
    },
];

// ─── Status ───────────────────────────────────────────────────────────────────

const statusStyles: Record<StockTransferOutbound["status"], string> = {
    Approved:     "bg-green-100 text-green-800",
    Draft:        "bg-slate-100 text-slate-800",
    "In Transit": "bg-blue-100 text-blue-800",
};

// ─── Filter Fields ────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
    { key: "noKirim",      label: "No. Kirim",     type: "text" },
    { key: "noTerima",     label: "No. Terima",    type: "text" },
    { key: "gudangAsal",   label: "Gudang Asal",   type: "text" },
    { key: "gudangTujuan", label: "Gudang Tujuan", type: "text" },
    { key: "alasan",       label: "Alasan",        type: "text" },
    {
        key: "status",
        label: "Status",
        type: "select",
        options: [
            { label: "Approved",   value: "Approved" },
            { label: "Draft",      value: "Draft" },
            { label: "In Transit", value: "In Transit" },
        ],
    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StockTransferOutboundListPage() {
    const [filteredData, setFilteredData] = useState<StockTransferOutbound[]>(transfers);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(transfers);
            return;
        }
        const result = transfers.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof StockTransferOutbound];
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

    const columns: Column<StockTransferOutbound>[] = [
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
            header: "Gd. Asal",
            key: "gudangAsal",
            render: (r) => <span className="text-sm font-medium">{r.gudangAsal}</span>,
        },
        {
            header: "Gd. Tujuan",
            key: "gudangTujuan",
            render: (r) => <span className="text-sm font-medium">{r.gudangTujuan}</span>,
        },
        {
            header: "No. Kirim",
            key: "noKirim",
            render: (r) => (
                <Link
                    href={`/inventory/stock-transfer-outbound/${r.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {r.noKirim}
                </Link>
            ),
        },
        {
            header: "Tanggal",
            key: "tanggal",
            render: (r) => <span className="text-sm">{r.tanggal}</span>,
        },
        {
            header: "No. Terima",
            key: "noTerima",
            render: (r) => <span className="text-sm font-medium text-slate-600">{r.noTerima}</span>,
        },
        {
            header: "Alasan",
            key: "alasan",
            render: (r) => <span className="text-sm font-medium">{r.alasan}</span>,
        },
        {
            header: "Qty",
            key: "qty",
            align: "right",
            render: (r) => (
                <span className="text-sm font-medium text-right block">
                    {r.qty.toFixed(2)}
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
                        href={`/inventory/stock-transfer-outbound/${r.id}`}
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

    const renderMobileCard = (r: StockTransferOutbound) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        href={`/inventory/stock-transfer-outbound/${r.id}`}
                        className="font-semibold text-primary text-sm hover:underline"
                    >
                        {r.noKirim}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{r.tanggal} · {r.noTerima}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[r.status]}`}>
                    {r.status}
                </span>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-900">{r.gudangAsal} → {r.gudangTujuan}</p>
                <p className="text-xs text-slate-500">{r.alasan}</p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <div>
                    <span className="text-xs text-slate-400">Qty: </span>
                    <span className="text-sm font-semibold text-slate-900">
                        {r.qty.toFixed(2)}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <Link
                        href={`/inventory/stock-transfer-outbound/${r.id}`}
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
                                    Daftar Perpindahan Barang Antar Gudang (Kirim)
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola dan pantau semua pengiriman perpindahan barang antar gudang (outbound).
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/inventory/stock-transfer-outbound/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Transfer Baru
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
