"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";
import DataTable, { Column } from "../../components/DataTable";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PeriodeSaldoAwalTahunan {
    id: string;
    periode: string;
    tglAwal: string;
    tglAkhir: string;
    created: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const allData: PeriodeSaldoAwalTahunan[] = [
    { id: "1", periode: "202000", tglAwal: "2020-01-01 00:00:00", tglAkhir: "2020-01-01 00:00:00", created: "2021-01-30 18:59:09" },
    { id: "2", periode: "201900", tglAwal: "2019-01-01 00:00:00", tglAkhir: "2019-01-01 00:00:00", created: "2020-07-09 07:51:07" },
];

// ─── Filter Fields ────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
    { key: "periode",  label: "Periode",   type: "text" },
    { key: "tglAwal",  label: "Tgl Awal",  type: "text" },
    { key: "tglAkhir", label: "Tgl Akhir", type: "text" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function YearlyOpeningBalanceListPage() {
    const [filteredData, setFilteredData] = useState<PeriodeSaldoAwalTahunan[]>(allData);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(allData);
            return;
        }
        const result = allData.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof PeriodeSaldoAwalTahunan];
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

    const columns: Column<PeriodeSaldoAwalTahunan>[] = [
        {
            header: "#",
            key: "id",
            render: (_item, idx) => (
                <span className="text-sm text-slate-400 font-medium">{(idx ?? 0) + 1}.</span>
            ),
        },
        {
            header: "Periode",
            key: "periode",
            render: (item) => (
                <Link
                    href={`/accounting/yearly-opening-balance/${item.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {item.periode}
                </Link>
            ),
        },
        {
            header: "Tgl_Awal",
            key: "tglAwal",
            render: (item) => <span className="text-sm text-slate-600">{item.tglAwal}</span>,
        },
        {
            header: "Tgl_Akhir",
            key: "tglAkhir",
            render: (item) => <span className="text-sm text-slate-600">{item.tglAkhir}</span>,
        },
        {
            header: "Created",
            key: "created",
            render: (item) => <span className="text-sm text-slate-500">{item.created}</span>,
        },
        {
            header: "Task",
            key: "aksi",
            align: "right",
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/accounting/yearly-opening-balance/${item.id}`}
                        className="p-1.5 text-primary hover:text-primary/70 transition-colors font-semibold text-sm"
                        title="View"
                    >
                        View
                    </Link>
                </div>
            ),
        },
    ];

    const renderMobileCard = (item: PeriodeSaldoAwalTahunan, idx?: number) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-medium">{(idx ?? 0) + 1}.</span>
                        <Link
                            href={`/accounting/yearly-opening-balance/${item.id}`}
                            className="font-semibold text-primary text-sm hover:underline"
                        >
                            Periode: {item.periode}
                        </Link>
                    </div>
                    <div className="mt-1.5 space-y-0.5">
                        <p className="text-xs text-slate-500">
                            Tgl Awal: <span className="font-medium text-slate-700">{item.tglAwal}</span>
                        </p>
                        <p className="text-xs text-slate-500">
                            Tgl Akhir: <span className="font-medium text-slate-700">{item.tglAkhir}</span>
                        </p>
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <p className="text-xs text-slate-400">Created</p>
                    <p className="text-xs font-medium text-slate-600">{item.created}</p>
                </div>
            </div>
            <div className="flex justify-end items-center pt-2 border-t border-slate-100">
                <Link
                    href={`/accounting/yearly-opening-balance/${item.id}`}
                    className="text-sm font-semibold text-primary hover:text-primary/70 transition-colors"
                >
                    View →
                </Link>
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
                                    Saldo Awal Tahunan
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Pencatatan saldo awal akun perkiraan per periode tahunan.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/accounting/yearly-opening-balance/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Periode Baru
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
