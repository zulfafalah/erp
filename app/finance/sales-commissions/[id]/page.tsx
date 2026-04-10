"use client";

import { useRouter } from "next/navigation";
import { use, useState } from "react";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import FormField from "../../../components/FormField";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusType = "Approved" | "Pending" | "Draft" | "Closed";

const statusStyles: Record<StatusType, string> = {
    Approved: "bg-green-100 text-green-700 border-green-200",
    Pending:  "bg-yellow-100 text-yellow-700 border-yellow-200",
    Draft:    "bg-slate-100 text-slate-700 border-slate-200",
    Closed:   "bg-emerald-100 text-emerald-700 border-emerald-200",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockData: Record<string, {
    noTransaksi: string;
    tanggal: string;
    penjual: string;
    keterangan: string;
    jumlahNotaTerhitung: number;
    jumlahNotaTerbayar: number;
    ratioPembayaran: number;
    jumlahKomisiTerhitung: number;
    jumlahKomisiInput: number;
    jumlahKomisiDibayar: number;
    opsiCetakan: boolean;
    status: StatusType;
}> = {
    "PKP26040001": {
        noTransaksi: "PKP26040001",
        tanggal: "2026-04-06",
        penjual: "APHAN",
        keterangan: "Komisi untuk : TOKO",
        jumlahNotaTerhitung: 0.00,
        jumlahNotaTerbayar: 0.00,
        ratioPembayaran: 0,
        jumlahKomisiTerhitung: 0.00,
        jumlahKomisiInput: 0.00,
        jumlahKomisiDibayar: 0.00,
        opsiCetakan: false,
        status: "Draft",
    },
    "PKP26030001": {
        noTransaksi: "PKP26030001",
        tanggal: "2026-03-31",
        penjual: "BUDI",
        keterangan: "Komisi untuk : MARET",
        jumlahNotaTerhitung: 12500000.00,
        jumlahNotaTerbayar: 11250000.00,
        ratioPembayaran: 90,
        jumlahKomisiTerhitung: 1250000.00,
        jumlahKomisiInput: 1250000.00,
        jumlahKomisiDibayar: 1250000.00,
        opsiCetakan: false,
        status: "Approved",
    },
    "PKP26020001": {
        noTransaksi: "PKP26020001",
        tanggal: "2026-02-28",
        penjual: "SARI",
        keterangan: "Komisi untuk : FEBRUARI",
        jumlahNotaTerhitung: 8750000.00,
        jumlahNotaTerbayar: 8750000.00,
        ratioPembayaran: 100,
        jumlahKomisiTerhitung: 875000.00,
        jumlahKomisiInput: 875000.00,
        jumlahKomisiDibayar: 875000.00,
        opsiCetakan: false,
        status: "Approved",
    },
    new: {
        noTransaksi: "[Auto]",
        tanggal: new Date().toISOString().slice(0, 10),
        penjual: "",
        keterangan: "",
        jumlahNotaTerhitung: 0.00,
        jumlahNotaTerbayar: 0.00,
        ratioPembayaran: 0,
        jumlahKomisiTerhitung: 0.00,
        jumlahKomisiInput: 0.00,
        jumlahKomisiDibayar: 0.00,
        opsiCetakan: false,
        status: "Draft",
    },
};

const fmtCur = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type TabKey = "header" | "attachments";

const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "header",      label: "Pengeluaran Komisi", icon: "payments" },
    { key: "attachments", label: "Lampiran",            icon: "attachment" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SalesCommissionDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id }  = use(params);
    const router  = useRouter();
    const isNew   = id === "new";
    const data    = mockData[id] ?? mockData["new"];

    const [activeTab, setActiveTab] = useState<TabKey>("header");
    const [opsiCetakan, setOpsiCetakan] = useState(data.opsiCetakan);

    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            <Navbar />

            <main className="flex-1 flex overflow-hidden">
                <Sidebar />

                <section className="flex-1 flex flex-col bg-background-light overflow-hidden">
                    {/* ── Action Header ── */}
                    <div className="px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/5 bg-white/50 backdrop-blur-sm shrink-0">
                        {/* Left: Back + title + status */}
                        <div className="flex items-start md:items-center gap-3 md:gap-4 w-full md:w-auto">
                            <button
                                onClick={() => router.push("/finance/sales-commissions")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        {isNew ? "Tambah Komisi Penjualan" : data.noTransaksi}
                                    </h1>
                                    <span className={`px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest border ${statusStyles[data.status]}`}>
                                        {data.status}
                                    </span>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    Pengeluaran Komisi Penjualan
                                </p>
                            </div>
                        </div>

                        {/* Right: Action buttons */}
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-200/50 rounded-lg transition-all border border-slate-200 md:border-transparent flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">refresh</span>
                                Reset
                            </button>
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold bg-white text-slate-700 border border-slate-200 hover:border-primary rounded-lg transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">help</span>
                                Info
                            </button>
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold bg-white text-primary border border-primary/20 hover:border-primary rounded-lg transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">print</span>
                                Print
                            </button>
                            <button className="w-full md:w-auto justify-center px-4 md:px-5 py-2 text-xs md:text-sm font-bold bg-primary text-white hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">save</span>
                                Simpan
                            </button>
                        </div>
                    </div>

                    {/* ── Tab System Container ── */}
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

                        {/* ── Tab: Pengeluaran Komisi ── */}
                        {activeTab === "header" && (
                            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                                    {/* Left: Form Cards */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Card: Informasi Dasar */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">info</span>
                                                <h3 className="font-bold text-slate-800">Informasi Transaksi</h3>
                                            </div>
                                            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                                <FormField label="No.">
                                                    <FormInput
                                                        defaultValue={data.noTransaksi}
                                                        readOnly={!isNew}
                                                        placeholder="[Auto]"
                                                    />
                                                </FormField>
                                                <FormField label="Tanggal">
                                                    <div className="flex items-center gap-2">
                                                        <FormInput
                                                            type="date"
                                                            defaultValue={data.tanggal}
                                                            className="flex-1"
                                                        />
                                                        <span className="text-xs text-slate-400 whitespace-nowrap">
                                                            *Tanggal Nota yang akan dihitung &lt;= Tgl Pengajuan
                                                        </span>
                                                    </div>
                                                </FormField>
                                                <FormField label="Penjual" className="sm:col-span-2">
                                                    <FormSelect defaultValue={data.penjual}>
                                                        <option value="">— Pilih Penjual —</option>
                                                        <option value="APHAN">APHAN</option>
                                                        <option value="BUDI">BUDI</option>
                                                        <option value="SARI">SARI</option>
                                                        <option value="DIMAS">DIMAS</option>
                                                    </FormSelect>
                                                </FormField>
                                                <FormField label="Keterangan" className="sm:col-span-2">
                                                    <FormInput
                                                        defaultValue={data.keterangan}
                                                        placeholder="Masukkan keterangan..."
                                                    />
                                                </FormField>
                                            </div>
                                        </div>

                                        {/* Card: Perhitungan Komisi */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">calculate</span>
                                                <h3 className="font-bold text-slate-800">Perhitungan Komisi</h3>
                                            </div>
                                            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                                <FormField label="Jumlah Nota (Terhitung)">
                                                    <FormInput
                                                        type="number"
                                                        defaultValue={String(data.jumlahNotaTerhitung)}
                                                        readOnly
                                                        placeholder="0.00"
                                                    />
                                                </FormField>
                                                <FormField label="Jumlah Nota (Terbayar)">
                                                    <FormInput
                                                        type="number"
                                                        defaultValue={String(data.jumlahNotaTerbayar)}
                                                        readOnly
                                                        placeholder="0.00"
                                                    />
                                                </FormField>
                                                <FormField label="Ratio Pembayaran (%)">
                                                    <div className="flex items-center gap-2">
                                                        <FormInput
                                                            type="number"
                                                            defaultValue={String(data.ratioPembayaran)}
                                                            readOnly
                                                            placeholder="0"
                                                            className="flex-1"
                                                        />
                                                        <span className="text-xs text-slate-400 whitespace-nowrap">
                                                            *Ratio Keberhasilan Pembayaran
                                                        </span>
                                                    </div>
                                                </FormField>
                                                <FormField label="Jumlah Komisi (Terhitung)">
                                                    <div className="flex gap-2">
                                                        <FormInput
                                                            type="number"
                                                            defaultValue={String(data.jumlahKomisiTerhitung)}
                                                            readOnly
                                                            placeholder="0.00"
                                                            className="flex-1"
                                                        />
                                                        <FormInput
                                                            type="number"
                                                            defaultValue={String(data.jumlahKomisiInput)}
                                                            placeholder="0.00"
                                                            className="flex-1"
                                                        />
                                                    </div>
                                                </FormField>
                                                <FormField label="Jumlah Komisi (Dibayar)">
                                                    <FormInput
                                                        type="number"
                                                        defaultValue={String(data.jumlahKomisiDibayar)}
                                                        readOnly
                                                        placeholder="0.00"
                                                    />
                                                </FormField>
                                                <FormField label="Status">
                                                    <div className={`w-full rounded-lg px-3 py-2 text-sm font-semibold border ${statusStyles[data.status]}`}>
                                                        {data.status}
                                                    </div>
                                                </FormField>
                                                <FormField label="Opsi Cetakan" className="sm:col-span-2">
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={opsiCetakan}
                                                            onChange={(e) => setOpsiCetakan(e.target.checked)}
                                                            className="w-4 h-4 rounded border-slate-300 text-primary accent-primary cursor-pointer"
                                                        />
                                                        <span className="text-sm text-slate-600">
                                                            *Klik untuk tampilkan semua nilai
                                                        </span>
                                                    </label>
                                                </FormField>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Sidebar Summary */}
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-0">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">receipt_long</span>
                                                <h3 className="font-bold text-slate-800">Ringkasan Komisi</h3>
                                            </div>
                                            <div className="p-4 md:p-6 space-y-4">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500">Jumlah Nota (Terhitung)</span>
                                                    <span className="font-semibold">Rp {fmtCur(data.jumlahNotaTerhitung)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500">Jumlah Nota (Terbayar)</span>
                                                    <span className={`font-semibold ${data.jumlahNotaTerbayar >= data.jumlahNotaTerhitung && data.jumlahNotaTerhitung > 0 ? "text-emerald-600" : "text-slate-700"}`}>
                                                        Rp {fmtCur(data.jumlahNotaTerbayar)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500">Ratio Pembayaran</span>
                                                    <span className={`font-bold ${data.ratioPembayaran >= 100 ? "text-emerald-600" : data.ratioPembayaran > 0 ? "text-amber-600" : "text-slate-400"}`}>
                                                        {isNaN(data.ratioPembayaran) ? "nan" : `${data.ratioPembayaran.toFixed(2)}%`}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500">Komisi Terhitung</span>
                                                    <span className="font-semibold">Rp {fmtCur(data.jumlahKomisiTerhitung)}</span>
                                                </div>
                                                <div className="pt-4 border-t border-slate-100">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm md:text-base font-bold text-slate-900">Komisi Dibayar</span>
                                                        <span className="text-lg md:text-xl font-black text-primary">
                                                            Rp {fmtCur(data.jumlahKomisiDibayar)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2">
                                                <button className="col-span-2 py-3 bg-primary text-white rounded font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                                                    <span className="material-symbols-outlined">save</span>
                                                    SIMPAN
                                                </button>
                                                <button className="py-2 bg-white border border-slate-200 text-slate-600 rounded text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined !text-sm">refresh</span>
                                                    RESET
                                                </button>
                                                <button className="py-2 bg-white border border-slate-200 text-slate-600 rounded text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined !text-sm">help</span>
                                                    INFO
                                                </button>
                                                {!isNew && data.status !== "Approved" && data.status !== "Closed" && (
                                                    <button className="col-span-2 py-2 bg-emerald-500 text-white rounded text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1">
                                                        <span className="material-symbols-outlined !text-sm">verified</span>
                                                        APPROVE
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Tab: Lampiran ── */}
                        {activeTab === "attachments" && (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <span className="material-symbols-outlined text-5xl text-slate-300">attachment</span>
                                    <p className="mt-2 text-sm text-slate-500">Belum ada lampiran.</p>
                                    <button className="mt-4 px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto">
                                        <span className="material-symbols-outlined text-sm">upload_file</span>
                                        Upload File
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <StatusBar />
        </div>
    );
}
