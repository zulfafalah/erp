"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = "header";

const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "header", label: "Data Akun Perkiraan", icon: "account_tree" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChartOfAccountDetailPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabKey>("header");
    const [isBank, setIsBank] = useState(false);
    const [isNonAktif, setIsNonAktif] = useState(false);

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
                                onClick={() => router.push("/accounting/chart-of-accounts")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        :: Data Akun Perkiraan
                                    </h1>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    Kelola data akun perkiraan untuk chart of accounts perusahaan.
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
                                                <span className="material-symbols-outlined text-primary">account_tree</span>
                                                <h3 className="font-bold text-slate-800">Informasi Akun</h3>
                                            </div>
                                            {/* Card Body */}
                                            <div className="p-4 md:p-6 space-y-4">

                                                {/* Tipe Akun */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Tipe Akun
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormSelect className="w-40" defaultValue="GRUP">
                                                            <option value="GRUP">GRUP</option>
                                                            <option value="SUB GRUP">SUB GRUP</option>
                                                            <option value="DETAIL">DETAIL</option>
                                                        </FormSelect>
                                                    </div>
                                                </div>

                                                {/* Grup Akun */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Grup Akun
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormSelect className="w-56" defaultValue="1.Assets">
                                                            <option value="1.Assets">1. Assets</option>
                                                            <option value="2.Liabilities">2. Liabilities</option>
                                                            <option value="3.Equity">3. Equity</option>
                                                            <option value="4.Revenue">4. Revenue</option>
                                                            <option value="5.Expenses">5. Expenses</option>
                                                        </FormSelect>
                                                    </div>
                                                </div>

                                                {/* Parent Key */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Parent Key
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormSelect className="w-full max-w-xs" defaultValue="">
                                                            <option value="">:: Tanpa Parent Key ::</option>
                                                            <option value="AKTIVA">AKTIVA</option>
                                                            <option value="AKTIVA LANCAR">AKTIVA LANCAR</option>
                                                            <option value="KAS & BANK">KAS & BANK</option>
                                                            <option value="KAS KECIL">KAS KECIL</option>
                                                            <option value="KAS BESAR">KAS BESAR</option>
                                                            <option value="BANK">BANK</option>
                                                            <option value="PIUTANG USAHA">PIUTANG USAHA</option>
                                                            <option value="AKTIVA TETAP">AKTIVA TETAP</option>
                                                        </FormSelect>
                                                    </div>
                                                </div>

                                                {/* Kode Akun */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Kode Akun
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormInput defaultValue="100" className="w-32" />
                                                    </div>
                                                </div>

                                                {/* Keterangan Akun */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Keterangan Akun
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormInput defaultValue="AKTIVA" className="w-full" />
                                                    </div>
                                                </div>

                                                {/* Mata Uang */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Mata Uang
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormSelect className="w-40" defaultValue="IDR">
                                                            <option value="IDR">Rupiah</option>
                                                            <option value="USD">US Dollar</option>
                                                            <option value="EUR">Euro</option>
                                                            <option value="YEN">Yen</option>
                                                        </FormSelect>
                                                    </div>
                                                </div>

                                                {/* Limit Saldo Akun */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Limit Saldo Akun
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormInput
                                                            type="number"
                                                            defaultValue="15000000.0000"
                                                            className="w-full max-w-xs"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Bank */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Bank
                                                    </label>
                                                    <div className="sm:col-span-3 flex items-center gap-3">
                                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                                            <input
                                                                type="checkbox"
                                                                checked={isBank}
                                                                onChange={(e) => setIsBank(e.target.checked)}
                                                                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/50"
                                                            />
                                                            <span className="text-sm text-slate-600">Yes / No ?</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                {/* Non Aktif */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Non Aktif
                                                    </label>
                                                    <div className="sm:col-span-3 flex items-center gap-3">
                                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                                            <input
                                                                type="checkbox"
                                                                checked={isNonAktif}
                                                                onChange={(e) => setIsNonAktif(e.target.checked)}
                                                                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/50"
                                                            />
                                                            <span className="text-sm text-slate-600">Yes / No ?</span>
                                                        </label>
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
                                                <h3 className="font-bold text-slate-800">Informasi Akun</h3>
                                            </div>
                                            <div className="p-4 md:p-6 space-y-3">
                                                <p className="text-xs text-slate-500 leading-relaxed">
                                                    Chart of Accounts digunakan sebagai dasar pencatatan seluruh transaksi keuangan dalam sistem ERP.
                                                </p>
                                                <div className="pt-3 border-t border-slate-100 space-y-2">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">Tipe Akun</span>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                            GRUP UTAMA
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">Kode</span>
                                                        <span className="font-mono font-semibold text-slate-700">100</span>
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
                    </div>
                </section>
            </main>

            {/* Footer StatusBar */}
            <StatusBar />
        </div>
    );
}
