"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";
import DataTable, { Column } from "../../components/DataTable";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Currency {
    id: string;
    simbol: string;
    kode: string;
    keterangan: string;
    digit: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const allData: Currency[] = [
    { id: "IDR", simbol: "IDR", kode: "RP",  keterangan: "RUPIAH",    digit: 2 },
    { id: "USD", simbol: "US$", kode: "USD", keterangan: "US DOLLAR", digit: 2 },
    { id: "YEN", simbol: "YEN", kode: "YUE", keterangan: "YUEN",      digit: 2 },
];

// ─── Filter Fields ────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
    { key: "simbol",     label: "Simbol",     type: "text" },
    { key: "kode",       label: "Kode",       type: "text" },
    { key: "keterangan", label: "Keterangan", type: "text" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDigit = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CurrencyListPage() {
    const [filteredData, setFilteredData] = useState<Currency[]>(allData);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(allData);
            return;
        }
        const result = allData.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof Currency];
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

    const columns: Column<Currency>[] = [
        {
            header: "Simbol",
            key: "simbol",
            render: (item) => (
                <Link
                    href={`/master-data/currency/${item.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {item.simbol}
                </Link>
            ),
        },
        {
            header: "Kode",
            key: "kode",
            render: (item) => <span className="text-sm text-slate-600">{item.kode}</span>,
        },
        {
            header: "Keterangan",
            key: "keterangan",
            render: (item) => <span className="text-sm text-slate-800 font-medium">{item.keterangan}</span>,
        },
        {
            header: "Digit",
            key: "digit",
            align: "right",
            render: (item) => (
                <span className="text-sm font-semibold text-right block">
                    {fmtDigit(item.digit)}
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
                        href={`/master-data/currency/${item.id}`}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                        title="Edit"
                    >
                        <span className="material-symbols-outlined text-lg">edit_square</span>
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

    const renderMobileCard = (item: Currency) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                    <Link
                        href={`/master-data/currency/${item.id}`}
                        className="font-semibold text-primary text-sm hover:underline block"
                    >
                        {item.simbol} — {item.keterangan}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">Kode: {item.kode}</p>
                </div>
                <div className="text-right shrink-0">
                    <p className="text-xs text-slate-400">Digit</p>
                    <p className="text-sm font-bold text-slate-800">{fmtDigit(item.digit)}</p>
                </div>
            </div>
            <div className="flex justify-end items-center pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1">
                    <Link
                        href={`/master-data/currency/${item.id}`}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-base">edit_square</span>
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
                                    Daftar Mata Uang
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola master data mata uang dan kurs di sistem.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/master-data/currency/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Mata Uang Baru
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
