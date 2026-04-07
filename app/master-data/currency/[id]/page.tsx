"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = "header" | "detail-kurs";

const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "header",      label: "Header",      icon: "info"            },
    { key: "detail-kurs", label: "Detail Kurs", icon: "currency_exchange" },
];

// ─── Mock Kurs Data ───────────────────────────────────────────────────────────

interface KursRow {
    id: string;
    tanggal: string;
    kursKMK: number;
    kursBI: number;
}

const kursData: KursRow[] = [
    { id: "K001", tanggal: "2000-01-01", kursKMK: 1.00, kursBI: 1.00 },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CurrencyDetailPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabKey>("header");
    const [showAddKurs, setShowAddKurs] = useState(false);

    const fmtNum = (n: number) =>
        n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
                                onClick={() => router.push("/master-data/currency")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        :: Data Mata Uang
                                    </h1>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    Kelola data mata uang dan informasi kurs di sistem.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-200/50 rounded-lg transition-all border border-slate-200 md:border-transparent flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">refresh</span>
                                Reset
                            </button>
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold bg-white text-slate-700 border border-slate-200 hover:border-slate-400 rounded-lg transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">help</span>
                                Info
                            </button>
                            <button className="w-full md:w-auto justify-center px-4 md:px-5 py-2 text-xs md:text-sm font-bold bg-primary text-white hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">save</span>
                                Simpan
                            </button>
                        </div>
                    </div>

                    {/* Tab System Container */}
                    <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-6 pb-28 md:pb-6 gap-4 md:gap-6">
                        {/* Tabs Selector */}
                        <div className="flex overflow-x-auto no-scrollbar border-b border-slate-200 shrink-0">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`px-4 md:px-6 py-3 text-xs md:text-sm font-medium flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                                        activeTab === tab.key
                                            ? "font-bold border-primary text-primary"
                                            : "text-slate-500 hover:text-slate-700 border-transparent"
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* ── Tab: Header ────────────────────────────────────────── */}
                        {activeTab === "header" && (
                            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                                    {/* Left: Form */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            {/* Card Header */}
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">currency_exchange</span>
                                                <h3 className="font-bold text-slate-800">Informasi Mata Uang</h3>
                                            </div>
                                            {/* Card Body */}
                                            <div className="p-4 md:p-6 space-y-4">

                                                {/* Simbol */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Simbol
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormInput defaultValue="IDR" className="w-32" />
                                                    </div>
                                                </div>

                                                {/* Kode */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Kode
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormInput defaultValue="RP" className="w-32" />
                                                    </div>
                                                </div>

                                                {/* Keterangan */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Keterangan
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormInput defaultValue="Rupian" className="w-48" />
                                                    </div>
                                                </div>

                                                {/* Digit */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Digit
                                                    </label>
                                                    <div className="sm:col-span-3 flex items-center gap-2">
                                                        <FormSelect className="w-24" defaultValue="2">
                                                            <option value="0">0</option>
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                            <option value="4">4</option>
                                                        </FormSelect>
                                                        <span className="text-sm text-slate-500">desimal</span>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Info Sidebar */}
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-0">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">info</span>
                                                <h3 className="font-bold text-slate-800">Informasi</h3>
                                            </div>
                                            <div className="p-4 md:p-6 space-y-3">
                                                <p className="text-xs text-slate-500 leading-relaxed">
                                                    Master mata uang digunakan untuk konfigurasi kurs dan transaksi multi-valuta di seluruh modul sistem.
                                                </p>
                                                <div className="pt-3 border-t border-slate-100 space-y-2">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">Simbol</span>
                                                        <span className="font-semibold text-slate-700">IDR</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">Dibuat oleh</span>
                                                        <span className="font-semibold text-slate-700">ADMINISTRATOR</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">Status</span>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Aktif
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Action Area */}
                                            <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2">
                                                <button className="col-span-2 py-3 bg-primary text-white rounded font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                                                    <span className="material-symbols-outlined">save</span> SIMPAN
                                                </button>
                                                <button className="py-2 bg-white border border-slate-200 text-slate-600 rounded text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined !text-sm">refresh</span> RESET
                                                </button>
                                                <button className="py-2 bg-white border border-slate-200 text-slate-600 rounded text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined !text-sm">help</span> INFO
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Tab: Detail Kurs ────────────────────────────────────── */}
                        {activeTab === "detail-kurs" && (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">
                                    {/* Table Header */}
                                    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">currency_exchange</span>
                                            <h3 className="font-bold text-slate-800">
                                                Detail Kurs Mata Uang IDR-Rupiah
                                            </h3>
                                        </div>
                                        <button
                                            onClick={() => setShowAddKurs(true)}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                        >
                                            <span className="material-symbols-outlined text-base">add_circle</span>
                                            Add New
                                        </button>
                                    </div>

                                    {/* Add Kurs Form (inline) */}
                                    {showAddKurs && (
                                        <div className="px-4 md:px-6 py-4 border-b border-slate-100 bg-slate-50">
                                            <div className="flex flex-col sm:flex-row gap-3 items-end">
                                                <div className="flex-1">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Tanggal</label>
                                                    <FormInput type="date" defaultValue={new Date().toISOString().split("T")[0]} className="w-full" />
                                                </div>
                                                <div className="w-32">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Kurs KMK</label>
                                                    <FormInput type="number" defaultValue="1.00" className="w-full" />
                                                </div>
                                                <div className="w-32">
                                                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Kurs BI</label>
                                                    <FormInput type="number" defaultValue="1.00" className="w-full" />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors flex items-center gap-1">
                                                        <span className="material-symbols-outlined !text-sm">save</span>
                                                        Simpan
                                                    </button>
                                                    <button
                                                        onClick={() => setShowAddKurs(false)}
                                                        className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors"
                                                    >
                                                        Batal
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Desktop Table */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-primary/10">
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-12">No.</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                        <div className="flex items-center gap-1 cursor-pointer select-none hover:text-slate-700">
                                                            Tanggal
                                                            <span className="material-symbols-outlined text-sm">unfold_more</span>
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                        <div className="flex items-center gap-1 cursor-pointer select-none hover:text-slate-700">
                                                            Kurs KMK
                                                            <span className="material-symbols-outlined text-sm">unfold_more</span>
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                        <div className="flex items-center gap-1 cursor-pointer select-none hover:text-slate-700">
                                                            Kurs BI
                                                            <span className="material-symbols-outlined text-sm">unfold_more</span>
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-primary/5">
                                                {kursData.map((kurs, idx) => (
                                                    <tr
                                                        key={kurs.id}
                                                        className="hover:bg-primary/5 transition-colors cursor-pointer"
                                                    >
                                                        <td className="px-6 py-4 text-sm text-slate-500">{idx + 1}.</td>
                                                        <td className="px-6 py-4 text-sm font-medium text-slate-800">{kurs.tanggal}</td>
                                                        <td className="px-6 py-4 text-sm text-slate-700">{fmtNum(kurs.kursKMK)}</td>
                                                        <td className="px-6 py-4 text-sm font-semibold text-slate-800">{fmtNum(kurs.kursBI)}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                                                    title="View"
                                                                >
                                                                    <span className="material-symbols-outlined text-lg">edit_square</span>
                                                                </button>
                                                                <button
                                                                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Card - Kurs */}
                                    <div className="block md:hidden divide-y divide-primary/5">
                                        {kursData.map((kurs, idx) => (
                                            <div key={kurs.id} className="p-4 space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-800">{idx + 1}. {kurs.tanggal}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button className="p-1.5 text-slate-400 hover:text-primary transition-colors">
                                                            <span className="material-symbols-outlined text-base">edit_square</span>
                                                        </button>
                                                        <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                                                            <span className="material-symbols-outlined text-base">delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4 text-xs text-slate-500">
                                                    <span>KMK: <strong className="text-slate-800">{fmtNum(kurs.kursKMK)}</strong></span>
                                                    <span>BI: <strong className="text-slate-800">{fmtNum(kurs.kursBI)}</strong></span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    <div className="px-4 md:px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                                        <p className="text-sm text-slate-500 text-center md:text-left">
                                            Menampilkan 1 sampai {kursData.length} dari {kursData.length} data
                                        </p>
                                        <div className="flex flex-wrap justify-center items-center gap-1">
                                            <button className="p-2 border border-primary/10 rounded hover:bg-white disabled:opacity-50" disabled>
                                                <span className="material-symbols-outlined text-lg">chevron_left</span>
                                            </button>
                                            <button className="px-3 py-1 bg-primary text-white rounded text-sm font-bold">1</button>
                                            <button className="p-2 border border-primary/10 rounded hover:bg-white">
                                                <span className="material-symbols-outlined text-lg">chevron_right</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Footer StatusBar */}
            <StatusBar />
        </div>
    );
}
