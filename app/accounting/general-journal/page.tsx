"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";
import DataTable, { Column } from "../../components/DataTable";

// ─── Types ────────────────────────────────────────────────────────────────────

type JurnalStatus = "Open" | "Posted" | "Cancelled";

interface JurnalUmum {
    id: string;
    journalNo: string;
    tanggal: string;
    keterangan: string;
    status: JurnalStatus;
    jumlah: number;
}

// ─── Status Styles ────────────────────────────────────────────────────────────

const statusStyles: Record<JurnalStatus, string> = {
    Open:      "bg-yellow-100 text-yellow-800",
    Posted:    "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const allData: JurnalUmum[] = [
    { id: "1", journalNo: "BKM26040001", tanggal: "2026-04-11", keterangan: "test [0]", status: "Open", jumlah: 0 },
    { id: "2", journalNo: "BKK26030001", tanggal: "2026-03-15", keterangan: "Pembayaran Operasional [5]", status: "Posted", jumlah: 5750000 },
    { id: "3", journalNo: "BKM26030002", tanggal: "2026-03-20", keterangan: "Penerimaan Kas [3]", status: "Posted", jumlah: 12500000 },
    { id: "4", journalNo: "BKM26020001", tanggal: "2026-02-10", keterangan: "Jurnal Penyesuaian [2]", status: "Posted", jumlah: 3200000 },
    { id: "5", journalNo: "BKK26010001", tanggal: "2026-01-05", keterangan: "Draft Jurnal [0]", status: "Cancelled", jumlah: 0 },
];

// ─── Filter Fields ────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
    { key: "journalNo",  label: "Journal #",   type: "text" },
    { key: "tanggal",    label: "Tanggal",      type: "text" },
    { key: "keterangan", label: "Keterangan",   type: "text" },
    {
        key: "status", label: "Status", type: "select", options: [
            { label: "Open",      value: "Open"      },
            { label: "Posted",    value: "Posted"    },
            { label: "Cancelled", value: "Cancelled" },
        ],
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatRupiah = (n: number) =>
    "RP. " + n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GeneralJournalListPage() {
    const [filteredData, setFilteredData] = useState<JurnalUmum[]>(allData);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(allData);
            return;
        }
        const result = allData.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof JurnalUmum];
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

    const columns: Column<JurnalUmum>[] = [
        {
            header: "#",
            key: "id",
            render: (_item, idx) => (
                <span className="text-sm text-slate-400 font-medium">{(idx ?? 0) + 1}</span>
            ),
        },
        {
            header: "Journal#",
            key: "journalNo",
            render: (item) => (
                <Link
                    href={`/accounting/general-journal/${item.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {item.journalNo}
                </Link>
            ),
        },
        {
            header: "Tanggal",
            key: "tanggal",
            render: (item) => <span className="text-sm text-slate-600">{item.tanggal}</span>,
        },
        {
            header: "Keterangan",
            key: "keterangan",
            render: (item) => <span className="text-sm text-slate-700">{item.keterangan}</span>,
        },
        {
            header: "Status",
            key: "status",
            render: (item) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[item.status]}`}>
                    {item.status}
                </span>
            ),
        },
        {
            header: "Jumlah",
            key: "jumlah",
            render: (item) => (
                <span className="text-sm font-bold text-slate-800">{formatRupiah(item.jumlah)}</span>
            ),
        },
        {
            header: "Aksi",
            key: "aksi",
            align: "right",
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/accounting/general-journal/${item.id}`}
                        className="text-sm font-semibold text-primary hover:text-primary/70 transition-colors"
                        title="View"
                    >
                        View
                    </Link>
                    <button
                        className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors"
                        title="Delete"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    const renderMobileCard = (item: JurnalUmum, idx?: number) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-medium">{(idx ?? 0) + 1}.</span>
                        <Link
                            href={`/accounting/general-journal/${item.id}`}
                            className="font-semibold text-primary text-sm hover:underline"
                        >
                            {item.journalNo}
                        </Link>
                    </div>
                    <div className="mt-1.5 space-y-0.5">
                        <p className="text-xs text-slate-500">
                            Tanggal: <span className="font-medium text-slate-700">{item.tanggal}</span>
                        </p>
                        <p className="text-xs text-slate-500">
                            {item.keterangan}
                        </p>
                    </div>
                </div>
                <div className="text-right shrink-0 space-y-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[item.status]}`}>
                        {item.status}
                    </span>
                    <p className="text-xs font-bold text-slate-800">{formatRupiah(item.jumlah)}</p>
                </div>
            </div>
            <div className="flex justify-end items-center pt-2 border-t border-slate-100 gap-3">
                <Link
                    href={`/accounting/general-journal/${item.id}`}
                    className="text-sm font-semibold text-primary hover:text-primary/70 transition-colors"
                >
                    View
                </Link>
                <button className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors">
                    Delete
                </button>
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
                                    Jurnal Umum
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Pencatatan transaksi jurnal umum perusahaan.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/accounting/general-journal/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Add New
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
