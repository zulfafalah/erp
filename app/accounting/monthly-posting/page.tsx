"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProcessType =
    | "daily-journal"
    | "monthly-posting"
    | "monthly-unposting"
    | "monthly-cogs"
    | "process-sn";

interface ProcessOption {
    value: ProcessType;
    label: string;
    description: string;
    icon: string;
    actionLabel: string;
    actionColor: string;
}

// ─── Process Options ──────────────────────────────────────────────────────────

const PROCESS_OPTIONS: ProcessOption[] = [
    {
        value: "daily-journal",
        label: "1. Create Daily Transaction Journal",
        description: "Buat jurnal transaksi harian dari semua transaksi yang telah diposting pada periode yang dipilih.",
        icon: "today",
        actionLabel: "Proses Jurnal Harian",
        actionColor: "bg-primary hover:bg-primary/90 shadow-primary/20",
    },
    {
        value: "monthly-posting",
        label: "2. Monthly Posting (Closing Period)",
        description: "Lakukan posting bulanan untuk menutup periode akuntansi. Tgl 1 setiap periode bulannya.",
        icon: "lock_clock",
        actionLabel: "Proses Monthly Posting",
        actionColor: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20",
    },
    {
        value: "monthly-unposting",
        label: "3. Monthly Unposting (Opening Period)",
        description: "Batalkan posting bulanan untuk membuka kembali periode akuntansi yang sudah ditutup.",
        icon: "lock_open",
        actionLabel: "Proses Monthly Unposting",
        actionColor: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20",
    },
    {
        value: "monthly-cogs",
        label: "4. Monthly COGS ONLY",
        description: "Proses kalkulasi Harga Pokok Penjualan (COGS) untuk bulan yang dipilih tanpa menutup periode.",
        icon: "calculate",
        actionLabel: "Proses COGS",
        actionColor: "bg-violet-600 hover:bg-violet-700 shadow-violet-600/20",
    },
    {
        value: "process-sn",
        label: "5. Process SN Data",
        description: "Proses data Serial Number (SN) untuk periode yang dipilih.",
        icon: "qr_code_2",
        actionLabel: "Proses SN Data",
        actionColor: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20",
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCurrentPeriod(): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    return `${yyyy}-${mm}`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MonthlyPostingPage() {
    const router = useRouter();
    const [selectedProcess, setSelectedProcess] = useState<ProcessType>("monthly-posting");
    const [periode, setPeriode] = useState<string>(getCurrentPeriod());
    const [isProcessing, setIsProcessing] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const activeOption = PROCESS_OPTIONS.find((o) => o.value === selectedProcess)!;

    const handleProses = () => {
        setSuccessMsg(null);
        setIsProcessing(true);
        // Simulate async process
        setTimeout(() => {
            setIsProcessing(false);
            setSuccessMsg(
                `Proses "${activeOption.label}" untuk periode ${periode} telah selesai dijalankan.`
            );
        }, 1800);
    };

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
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-28 md:pb-8 space-y-6 md:space-y-8">
                        {/* Title */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                                    Posting
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Pilih jenis proses dan periode yang ingin dieksekusi.
                                </p>
                            </div>
                        </div>

                        {/* Two-column layout: Daftar Proses (left) | Konfigurasi Proses (right) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">

                            {/* ── Daftar Proses ── */}
                            <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden">
                                <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">list_alt</span>
                                    <h3 className="font-bold text-slate-800">Daftar Proses</h3>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {PROCESS_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => {
                                                setSelectedProcess(opt.value);
                                                setSuccessMsg(null);
                                            }}
                                            className={`w-full text-left flex items-center gap-3 px-4 md:px-6 py-3.5 transition-colors ${
                                                selectedProcess === opt.value
                                                    ? "bg-primary/5"
                                                    : "hover:bg-slate-50"
                                            }`}
                                        >
                                            <span
                                                className={`material-symbols-outlined text-lg ${
                                                    selectedProcess === opt.value ? "text-primary" : "text-slate-400"
                                                }`}
                                            >
                                                {opt.icon}
                                            </span>
                                            <span
                                                className={`text-sm font-medium ${
                                                    selectedProcess === opt.value
                                                        ? "text-primary font-semibold"
                                                        : "text-slate-700"
                                                }`}
                                            >
                                                {opt.label}
                                            </span>
                                            {selectedProcess === opt.value && (
                                                <span className="ml-auto material-symbols-outlined text-primary text-base">
                                                    arrow_forward_ios
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* ── Konfigurasi Proses ── */}
                            <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden">
                                {/* Card Header */}
                                <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">manufacturing</span>
                                    <h3 className="font-bold text-slate-800">Konfigurasi Proses</h3>
                                </div>

                                {/* Card Body */}
                                <div className="p-4 md:p-6 space-y-5">
                                    {/* Description */}
                                    <div className="flex items-start gap-3 bg-slate-50 rounded-lg px-4 py-3">
                                        <span className="material-symbols-outlined text-primary mt-0.5">{activeOption.icon}</span>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                                {activeOption.label}
                                            </p>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                {activeOption.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Periode */}
                                    <div className="space-y-1.5">
                                        <label
                                            htmlFor="periode"
                                            className="block text-xs font-semibold text-slate-500 uppercase tracking-wider"
                                        >
                                            Periode
                                            <span className="ml-2 text-[10px] font-normal text-slate-400 normal-case tracking-normal">
                                                *Tgl 1 setiap periode bulannya
                                            </span>
                                        </label>
                                        <input
                                            id="periode"
                                            type="month"
                                            value={periode}
                                            onChange={(e) => {
                                                setPeriode(e.target.value);
                                                setSuccessMsg(null);
                                            }}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                                        />
                                    </div>

                                    {/* Success Message */}
                                    {successMsg && (
                                        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                                            <span className="material-symbols-outlined text-green-600 mt-0.5 text-base">check_circle</span>
                                            <p className="text-sm text-green-700 leading-relaxed">{successMsg}</p>
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    <div className="pt-1">
                                        <button
                                            onClick={handleProses}
                                            disabled={isProcessing || !periode}
                                            className={`w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-lg shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed ${activeOption.actionColor}`}
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <span className="material-symbols-outlined text-lg animate-spin">autorenew</span>
                                                    Memproses...
                                                </>
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined text-lg">play_circle</span>
                                                    {activeOption.actionLabel}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
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
