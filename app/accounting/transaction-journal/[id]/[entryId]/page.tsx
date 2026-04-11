"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import StatusBar from "../../../../components/StatusBar";
import FormInput from "../../../../components/FormInput";
import FormSelect from "../../../../components/FormSelect";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = "header";

const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "header", label: "Input Detil Jurnal Transaksi", icon: "edit_note" },
];

// ─── Mock Akun Perkiraan Options ───────────────────────────────────────────────

const kodeAkunOptions = [
    { value: "130.01.01", label: "130.01.01 - PIUTANG DAGANG CUSTOMER - IDR" },
    { value: "140.01.01", label: "140.01.01 - PERSEDIAAN BARANG DAGANGAN" },
    { value: "110.01.01", label: "110.01.01 - KAS BESAR" },
    { value: "110.01.02", label: "110.01.02 - KAS KECIL MEDAN" },
    { value: "110.01.03", label: "110.01.03 - KAS KECIL JAKARTA" },
    { value: "120.01.01", label: "120.01.01 - BANK BCA (IDR)" },
    { value: "120.01.02", label: "120.01.02 - BANK MANDIRI (IDR)" },
    { value: "210.01.01", label: "210.01.01 - HUTANG DAGANG PEMB. LOKAL" },
    { value: "240.00.06", label: "240.00.06 - PAJAK PPN KELUARAN" },
    { value: "400.01.01", label: "400.01.01 - PENJUALAN BARANG LOKAL" },
    { value: "420.01.01", label: "420.01.01 - HPP" },
    { value: "530.00.03", label: "530.00.03 - LEMBUR" },
    { value: "550.00.09", label: "550.00.09 - BIAYA PERJALANAN DINAS" },
    { value: "550.00.16", label: "550.00.16 - BIAYA ASURANSI BARANG" },
    { value: "600.20.05", label: "600.20.05 - BIAYA PENGHAPUSAN PIUTANG" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TransactionJournalEntryPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabKey>("header");

    // Form state
    const [kodeAkun,   setKodeAkun]   = useState("130.01.01");
    const [keterangan, setKeterangan] = useState("Piutang Dagang Berkah Jaya. TK-SIL 2401-0001");
    const [voucherNo,  setVoucherNo]  = useState("SIL 2401-0001");
    const [dc,         setDc]         = useState<"Debet" | "Kredit">("Debet");
    const [jumlah,     setJumlah]     = useState("10545000.00");
    const [jumlahOrig, setJumlahOrig] = useState("10545000.00");

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
                                onClick={() => router.push("/accounting/transaction-journal/1")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        :: Input Detil Jurnal Umum SIL 2401-0001
                                    </h1>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    Tambah atau edit entri detail untuk jurnal transaksi ini.
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

                        {/* ── Tab: Header ─────────────────────────────────────── */}
                        {activeTab === "header" && (
                            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                                    {/* Left: Form */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            {/* Card Header */}
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">edit_note</span>
                                                <h3 className="font-bold text-slate-800">Input Detail Jurnal Umum</h3>
                                            </div>
                                            {/* Card Body */}
                                            <div className="p-4 md:p-6 space-y-4">

                                                {/* Kode Akun */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Kode Akun
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormSelect
                                                            value={kodeAkun}
                                                            onChange={(e) => setKodeAkun(e.target.value)}
                                                            className="w-full max-w-lg"
                                                        >
                                                            {kodeAkunOptions.map((opt) => (
                                                                <option key={opt.value} value={opt.value}>
                                                                    {opt.label}
                                                                </option>
                                                            ))}
                                                        </FormSelect>
                                                    </div>
                                                </div>

                                                {/* Keterangan */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Keterangan
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormInput
                                                            value={keterangan}
                                                            onChange={(e) => setKeterangan(e.target.value)}
                                                            className="w-full max-w-lg"
                                                            placeholder="Keterangan entri..."
                                                        />
                                                    </div>
                                                </div>

                                                {/* Voucher # */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Voucher #
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormInput
                                                            value={voucherNo}
                                                            onChange={(e) => setVoucherNo(e.target.value)}
                                                            className="w-40"
                                                            placeholder="No. voucher"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Debet / Credit */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Debet / Credit ?
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormSelect
                                                            value={dc}
                                                            onChange={(e) => setDc(e.target.value as "Debet" | "Kredit")}
                                                            className="w-36"
                                                        >
                                                            <option value="Debet">Debet</option>
                                                            <option value="Kredit">Kredit</option>
                                                        </FormSelect>
                                                    </div>
                                                </div>

                                                {/* Jumlah */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Jumlah
                                                    </label>
                                                    <div className="sm:col-span-3 flex items-center gap-2">
                                                        <FormInput
                                                            type="number"
                                                            value={jumlah}
                                                            onChange={(e) => setJumlah(e.target.value)}
                                                            className="w-40"
                                                            step="0.01"
                                                            placeholder="0.00"
                                                        />
                                                        <FormInput
                                                            type="number"
                                                            value={jumlahOrig}
                                                            onChange={(e) => setJumlahOrig(e.target.value)}
                                                            className="w-40"
                                                            step="0.01"
                                                            placeholder="0.00"
                                                            readOnly
                                                        />
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
                                                <h3 className="font-bold text-slate-800">Informasi Entri</h3>
                                            </div>
                                            <div className="p-4 md:p-6 space-y-3">
                                                <p className="text-xs text-slate-500 leading-relaxed">
                                                    Jurnal transaksi merupakan pencatatan otomatis dari modul operasional. Pastikan kode akun, Voucher#, dan nilai debet/kredit sudah sesuai sebelum menyimpan.
                                                </p>
                                                <div className="pt-3 border-t border-slate-100 space-y-2">
                                                    {[
                                                        { label: "Journal No",     value: "SIL 2401-0001"      },
                                                        { label: "Kode Transaksi", value: "Jurnal Umum (GLD)"  },
                                                        { label: "Tanggal",        value: "2024-01-14"          },
                                                        { label: "Mata Uang",      value: "Rupiah (IDR)"        },
                                                        { label: "Kurs",           value: "1.00"                },
                                                    ].map((row) => (
                                                        <div key={row.label} className="flex justify-between items-center text-xs">
                                                            <span className="text-slate-500">{row.label}</span>
                                                            <span className="font-semibold text-slate-700">{row.value}</span>
                                                        </div>
                                                    ))}
                                                    <div className="pt-2 border-t border-slate-100">
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="text-slate-500">D/C dipilih</span>
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                dc === "Debet" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                                                            }`}>
                                                                {dc}
                                                            </span>
                                                        </div>
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
