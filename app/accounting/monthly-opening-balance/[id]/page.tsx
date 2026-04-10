"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../../components/MultiFilter";
import DataTable, { Column } from "../../../components/DataTable";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SaldoAwalEntry {
    id: string;
    periode: string;
    tgl: string;
    kodeAkun: string;
    namaAkun: string;
    mataUang: string;
    kurs: number;
    debetLocal: number;
    creditLocal: number;
    debetForeign: number;
    creditForeign: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const periodeInfo = {
    id: "1",
    periode: "202003",
    tglAwal: "2020-03-01",
    tglAkhir: "2020-03-31",
    created: "2024-01-14 19:30:20",
};

const allEntries: SaldoAwalEntry[] = [
    { id: "1",  periode: "202003", tgl: "2020-03-31", kodeAkun: "540.00.03", namaAkun: "BIAYA BENSIN & SOLAR KENDARAAN",         mataUang: "IDR", kurs: 1, debetLocal: 0, creditLocal: 0, debetForeign: 0, creditForeign: 0 },
    { id: "2",  periode: "202003", tgl: "2020-03-31", kodeAkun: "240.00.03", namaAkun: "HUTANG PAJAK PPH PASAL 29 BADAN",        mataUang: "IDR", kurs: 1, debetLocal: 0, creditLocal: 0, debetForeign: 0, creditForeign: 0 },
    { id: "3",  periode: "202003", tgl: "2020-03-31", kodeAkun: "130.02.01", namaAkun: "PIUTANG DAGANG CUSTOMER - USD",           mataUang: "IDR", kurs: 1, debetLocal: 0, creditLocal: 0, debetForeign: 0, creditForeign: 0 },
    { id: "4",  periode: "202003", tgl: "2020-03-31", kodeAkun: "230.00.02", namaAkun: "HUTANG ONGKOS KIRIM BARANG (EKSPEDISI)", mataUang: "IDR", kurs: 1, debetLocal: 0, creditLocal: 0, debetForeign: 0, creditForeign: 0 },
    { id: "5",  periode: "202003", tgl: "2020-03-31", kodeAkun: "600.10.01", namaAkun: "PENDAPATAN DARI USAHA LAINNYA",           mataUang: "IDR", kurs: 1, debetLocal: 0, creditLocal: 0, debetForeign: 0, creditForeign: 0 },
    { id: "6",  periode: "202003", tgl: "2020-03-31", kodeAkun: "131.04.01", namaAkun: "DEPOSIT PEMBELIAN BARANG",                mataUang: "IDR", kurs: 1, debetLocal: 0, creditLocal: 0, debetForeign: 0, creditForeign: 0 },
    { id: "7",  periode: "202003", tgl: "2020-03-31", kodeAkun: "150.02.02", namaAkun: "PAJAK PPH PSL.25",                        mataUang: "IDR", kurs: 1, debetLocal: 0, creditLocal: 0, debetForeign: 0, creditForeign: 0 },
    { id: "8",  periode: "202003", tgl: "2020-03-31", kodeAkun: "550.00.05", namaAkun: "BIAYA POS & PENGIRIMAN DOKUMEN",          mataUang: "IDR", kurs: 1, debetLocal: 0, creditLocal: 0, debetForeign: 0, creditForeign: 0 },
    { id: "9",  periode: "202003", tgl: "2020-03-31", kodeAkun: "240.00.04", namaAkun: "HUTANG PAJAK PPH PASAL 4 AYAT 2",        mataUang: "IDR", kurs: 1, debetLocal: 0, creditLocal: 0, debetForeign: 0, creditForeign: 0 },
    { id: "10", periode: "202003", tgl: "2020-03-31", kodeAkun: "420.01.01", namaAkun: "HPP",                                     mataUang: "IDR", kurs: 1, debetLocal: 0, creditLocal: 0, debetForeign: 0, creditForeign: 0 },
];

// ─── Filter Fields ────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
    { key: "kodeAkun",  label: "Kode Akun",  type: "text" },
    { key: "namaAkun",  label: "Nama Akun",  type: "text" },
    { key: "mataUang",  label: "Mata Uang",  type: "text" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatNumber = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MonthlyOpeningBalanceDetailPage() {
    const router = useRouter();
    const [filteredEntries, setFilteredEntries] = useState<SaldoAwalEntry[]>(allEntries);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredEntries(allEntries);
            return;
        }
        const result = allEntries.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof SaldoAwalEntry];
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
        setFilteredEntries(result);
    };

    // Totals
    const totals = filteredEntries.reduce(
        (acc, e) => ({
            debetLocal:    acc.debetLocal    + e.debetLocal,
            creditLocal:   acc.creditLocal   + e.creditLocal,
            debetForeign:  acc.debetForeign  + e.debetForeign,
            creditForeign: acc.creditForeign + e.creditForeign,
        }),
        { debetLocal: 0, creditLocal: 0, debetForeign: 0, creditForeign: 0 }
    );

    const columns: Column<SaldoAwalEntry>[] = [
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
            render: (item) => <span className="text-sm text-slate-600">{item.periode}</span>,
        },
        {
            header: "Tgl",
            key: "tgl",
            render: (item) => <span className="text-sm text-slate-600">{item.tgl}</span>,
        },
        {
            header: "Kode Akun",
            key: "kodeAkun",
            render: (item) => (
                <span className="text-sm font-mono font-semibold text-slate-700">{item.kodeAkun}</span>
            ),
        },
        {
            header: "Nama Akun",
            key: "namaAkun",
            render: (item) => (
                <Link
                    href={`/accounting/monthly-opening-balance/1/${item.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {item.namaAkun}
                </Link>
            ),
        },
        {
            header: "Mata Uang",
            key: "mataUang",
            render: (item) => <span className="text-sm text-slate-600">{item.mataUang}</span>,
        },
        {
            header: "Kurs",
            key: "kurs",
            render: (item) => <span className="text-sm text-slate-600">{item.kurs.toFixed(2)}</span>,
        },
        {
            header: "Debet Local",
            key: "debetLocal",
            render: (item) => (
                <span className="text-sm font-medium text-slate-700">{formatNumber(item.debetLocal)}</span>
            ),
        },
        {
            header: "Credit Local",
            key: "creditLocal",
            render: (item) => (
                <span className="text-sm font-medium text-slate-700">{formatNumber(item.creditLocal)}</span>
            ),
        },
        {
            header: "Debet Foreign",
            key: "debetForeign",
            render: (item) => (
                <span className="text-sm font-medium text-slate-700">{formatNumber(item.debetForeign)}</span>
            ),
        },
        {
            header: "Credit Foreign",
            key: "creditForeign",
            render: (item) => (
                <span className="text-sm font-medium text-slate-700">{formatNumber(item.creditForeign)}</span>
            ),
        },
        {
            header: "Aksi",
            key: "aksi",
            align: "right",
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/accounting/monthly-opening-balance/1/${item.id}`}
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

    const renderMobileCard = (item: SaldoAwalEntry, idx?: number) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-medium">{(idx ?? 0) + 1}.</span>
                        <span className="text-xs font-mono font-semibold text-slate-700">{item.kodeAkun}</span>
                    </div>
                    <Link
                        href={`/accounting/monthly-opening-balance/1/${item.id}`}
                        className="font-semibold text-primary text-sm hover:underline block mt-0.5"
                    >
                        {item.namaAkun}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">
                        {item.tgl} &middot; {item.mataUang} &middot; Kurs {item.kurs.toFixed(2)}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                    <span className="text-slate-400">Debet Lokal</span>
                    <p className="font-semibold text-slate-700">{formatNumber(item.debetLocal)}</p>
                </div>
                <div>
                    <span className="text-slate-400">Credit Lokal</span>
                    <p className="font-semibold text-slate-700">{formatNumber(item.creditLocal)}</p>
                </div>
                <div>
                    <span className="text-slate-400">Debet Foreign</span>
                    <p className="font-semibold text-slate-700">{formatNumber(item.debetForeign)}</p>
                </div>
                <div>
                    <span className="text-slate-400">Credit Foreign</span>
                    <p className="font-semibold text-slate-700">{formatNumber(item.creditForeign)}</p>
                </div>
            </div>
            <div className="flex justify-end items-center pt-2 border-t border-slate-100 gap-3">
                <Link
                    href={`/accounting/monthly-opening-balance/1/${item.id}`}
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

                    {/* Action Header */}
                    <div className="px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/5 bg-white/50 backdrop-blur-sm shrink-0">
                        <div className="flex items-start md:items-center gap-3 md:gap-4 w-full md:w-auto">
                            <button
                                onClick={() => router.push("/accounting/monthly-opening-balance")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        :: Pencatatan Saldo Awal Akun Perkiraan Bulanan
                                    </h1>
                                    <span className="px-2 md:px-3 py-0.5 md:py-1 bg-blue-100 text-blue-700 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest border border-blue-200">
                                        {periodeInfo.periode}
                                    </span>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    Periode {periodeInfo.tglAwal} s/d {periodeInfo.tglAkhir}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                            <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                            <Link
                                href="/accounting/monthly-opening-balance/1/new"
                                className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                            >
                                <span className="material-symbols-outlined text-lg">add_circle</span>
                                Add New
                            </Link>
                        </div>
                    </div>

                    {/* Page Body */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-28 md:pb-8 space-y-4 md:space-y-6">
                        {/* Periode Info Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { label: "Periode", value: periodeInfo.periode,  icon: "calendar_month" },
                                { label: "Tgl Awal",  value: periodeInfo.tglAwal,  icon: "event" },
                                { label: "Tgl Akhir", value: periodeInfo.tglAkhir, icon: "event_available" },
                                { label: "Total Entry", value: `${allEntries.length} Akun`, icon: "account_tree" },
                            ].map((info) => (
                                <div key={info.label} className="bg-white rounded-xl border border-primary/10 shadow-sm p-4 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary text-xl">{info.icon}</span>
                                    <div>
                                        <p className="text-xs text-slate-400">{info.label}</p>
                                        <p className="text-sm font-bold text-slate-800">{info.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Entry Table */}
                        <div className="space-y-0">
                            <DataTable
                                data={filteredEntries}
                                columns={columns}
                                keyField="id"
                                renderMobileCard={renderMobileCard}
                            />
                        </div>

                        {/* Totals Footer */}
                        <div className="bg-white rounded-xl border border-primary/10 shadow-sm p-4 md:p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-primary">receipt_long</span>
                                <h3 className="font-bold text-slate-800">Total Saldo</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: "Total Debet Lokal",    value: totals.debetLocal    },
                                    { label: "Total Credit Lokal",   value: totals.creditLocal   },
                                    { label: "Total Debet Foreign",  value: totals.debetForeign  },
                                    { label: "Total Credit Foreign", value: totals.creditForeign },
                                ].map((total) => (
                                    <div key={total.label} className="border border-slate-100 rounded-lg p-3">
                                        <p className="text-xs text-slate-400 mb-1">{total.label}</p>
                                        <p className="text-base font-black text-slate-900">{formatNumber(total.value)}</p>
                                    </div>
                                ))}
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
