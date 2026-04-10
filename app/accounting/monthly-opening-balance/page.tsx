"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";
import DataTable, { Column } from "../../components/DataTable";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PeriodeSaldoAwal {
    id: string;
    periode: string;
    tglAwal: string;
    tglAkhir: string;
    created: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const allData: PeriodeSaldoAwal[] = [
    { id: "1",  periode: "202003", tglAwal: "2020-03-01", tglAkhir: "2020-03-31", created: "2024-01-14 19:30:20" },
    { id: "2",  periode: "202002", tglAwal: "2020-02-01", tglAkhir: "2020-02-29", created: "2023-07-20 14:04:13" },
    { id: "3",  periode: "202001", tglAwal: "2020-01-01", tglAkhir: "2020-01-31", created: "2021-06-30 17:45:55" },
    { id: "4",  periode: "201912", tglAwal: "2019-12-01", tglAkhir: "2019-12-31", created: "2021-01-30 18:45:15" },
    { id: "5",  periode: "201911", tglAwal: "2019-11-01", tglAkhir: "2019-11-30", created: "2020-08-24 11:53:15" },
    { id: "6",  periode: "201910", tglAwal: "2019-10-01", tglAkhir: "2019-10-31", created: "2020-08-21 11:21:24" },
    { id: "7",  periode: "201909", tglAwal: "2019-09-01", tglAkhir: "2019-09-30", created: "2020-08-21 11:11:52" },
    { id: "8",  periode: "201908", tglAwal: "2019-08-01", tglAkhir: "2019-08-31", created: "2020-08-21 11:01:11" },
    { id: "9",  periode: "201907", tglAwal: "2019-07-01", tglAkhir: "2019-07-31", created: "2020-08-14 14:41:52" },
    { id: "10", periode: "201906", tglAwal: "2019-06-01", tglAkhir: "2019-06-30", created: "2020-08-14 14:37:05" },
    { id: "11", periode: "201905", tglAwal: "2019-05-01", tglAkhir: "2019-05-31", created: "2020-08-14 14:25:10" },
    { id: "12", periode: "201904", tglAwal: "2019-04-01", tglAkhir: "2019-04-30", created: "2020-08-14 14:10:30" },
    { id: "13", periode: "201903", tglAwal: "2019-03-01", tglAkhir: "2019-03-31", created: "2020-08-10 09:30:00" },
    { id: "14", periode: "201902", tglAwal: "2019-02-01", tglAkhir: "2019-02-28", created: "2020-08-10 09:15:00" },
    { id: "15", periode: "201901", tglAwal: "2019-01-01", tglAkhir: "2019-01-31", created: "2020-08-10 09:00:00" },
];

// ─── Filter Fields ────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
    { key: "periode",  label: "Periode",   type: "text" },
    { key: "tglAwal",  label: "Tgl Awal",  type: "text" },
    { key: "tglAkhir", label: "Tgl Akhir", type: "text" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MonthlyOpeningBalanceListPage() {
    const [filteredData, setFilteredData] = useState<PeriodeSaldoAwal[]>(allData);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(allData);
            return;
        }
        const result = allData.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof PeriodeSaldoAwal];
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

    const columns: Column<PeriodeSaldoAwal>[] = [
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
                    href={`/accounting/monthly-opening-balance/${item.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {item.periode}
                </Link>
            ),
        },
        {
            header: "Tgl Awal",
            key: "tglAwal",
            render: (item) => <span className="text-sm text-slate-600">{item.tglAwal}</span>,
        },
        {
            header: "Tgl Akhir",
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
                        href={`/accounting/monthly-opening-balance/${item.id}`}
                        className="p-1.5 text-primary hover:text-primary/70 transition-colors font-semibold text-sm"
                        title="View"
                    >
                        View
                    </Link>
                </div>
            ),
        },
    ];

    const renderMobileCard = (item: PeriodeSaldoAwal, idx?: number) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-medium">{(idx ?? 0) + 1}.</span>
                        <Link
                            href={`/accounting/monthly-opening-balance/${item.id}`}
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
                    href={`/accounting/monthly-opening-balance/${item.id}`}
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
                                    Saldo Awal Bulanan
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Pencatatan saldo awal akun perkiraan per periode bulanan.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/accounting/monthly-opening-balance/new"
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
