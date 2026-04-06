"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import FormField from "../../../components/FormField";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
import FormTextarea from "../../../components/FormTextarea";

// ─── Types ────────────────────────────────────────────────────────────────────

type CommissionStatus = "Draft" | "Pending" | "Approved";

type TabKey = "header" | "nota-list";

interface CommissionHeader {
    no: string;
    tanggal: string;
    penjual: string;
    keterangan: string;
    jumlahNotaTerhitung: number;
    jumlahNotaTerbayar: number;
    ratioPembayaran: number;
    jumlahKomisiTerhitung: number;
    jumlahKomisiTerbayar: number;
    status: CommissionStatus;
}

interface NotaItem {
    id: string;
    noNota: string;
    tanggalNota: string;
    pelanggan: string;
    nilaiNota: number;
    nilaiTerbayar: number;
    komisi: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockData: CommissionHeader = {
    no: "PKP26040001",
    tanggal: "2026-04-06",
    penjual: "APHAN",
    keterangan: "Komisi untuk : APHAN",
    jumlahNotaTerhitung: 0,
    jumlahNotaTerbayar: 0,
    ratioPembayaran: 0,
    jumlahKomisiTerhitung: 0,
    jumlahKomisiTerbayar: 0,
    status: "Draft",
};

const mockNotas: NotaItem[] = [
    {
        id: "nota-1",
        noNota: "INV26030001",
        tanggalNota: "2026-03-01",
        pelanggan: "PT. MAJU BERSAMA",
        nilaiNota: 5000000,
        nilaiTerbayar: 5000000,
        komisi: 250000,
    },
    {
        id: "nota-2",
        noNota: "INV26030002",
        tanggalNota: "2026-03-05",
        pelanggan: "CV. SEJAHTERA",
        nilaiNota: 3200000,
        nilaiTerbayar: 0,
        komisi: 0,
    },
    {
        id: "nota-3",
        noNota: "INV26030005",
        tanggalNota: "2026-03-10",
        pelanggan: "UD. KARYA MANDIRI",
        nilaiNota: 7800000,
        nilaiTerbayar: 7800000,
        komisi: 390000,
    },
];

// ─── Status Config ────────────────────────────────────────────────────────────

const statusBadgeStyles: Record<CommissionStatus, string> = {
    Draft:    "bg-yellow-100 text-yellow-700 border border-yellow-200",
    Pending:  "bg-blue-100 text-blue-700 border border-blue-200",
    Approved: "bg-green-100 text-green-700 border border-green-200",
};

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const tabs: { key: TabKey; label: string; icon: string; badge?: string }[] = [
    { key: "header",    label: "Informasi Komisi", icon: "payments" },
    { key: "nota-list", label: "Daftar Nota",      icon: "receipt_long", badge: String(mockNotas.length) },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtCur = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SalesCommissionDetailPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabKey>("header");
    const [data] = useState<CommissionHeader>(mockData);
    const [notas] = useState<NotaItem[]>(mockNotas);
    const [showAllValues, setShowAllValues] = useState(false);

    const totalKomisi = notas.reduce((sum, n) => sum + n.komisi, 0);
    const totalNilaiNota = notas.reduce((sum, n) => sum + n.nilaiNota, 0);
    const totalTerbayar = notas.reduce((sum, n) => sum + n.nilaiTerbayar, 0);

    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            {/* Top Navigation Bar */}
            <Navbar />

            <main className="flex-1 flex overflow-hidden">
                {/* Sidebar Navigation */}
                <Sidebar />

                {/* Main Content Area */}
                <section className="flex-1 flex flex-col bg-background-light overflow-hidden">

                    {/* ── Action Header ─────────────────────────────────────────── */}
                    <div className="px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/5 bg-white/50 backdrop-blur-sm shrink-0">
                        {/* Kiri: Back + Judul + Badge */}
                        <div className="flex items-start md:items-center gap-3 md:gap-4 w-full md:w-auto">
                            <button
                                onClick={() => router.push("/sales/commission")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        {data.no}
                                    </h1>
                                    <span className={`px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest ${statusBadgeStyles[data.status]}`}>
                                        {data.status}
                                    </span>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    Pengeluaran Komisi Penjualan — {data.penjual}
                                </p>
                            </div>
                        </div>

                        {/* Kanan: Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-200/50 rounded-lg transition-all border border-slate-200 md:border-transparent flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">refresh</span>
                                Reset
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

                    {/* ── Tab System Container ───────────────────────────────────── */}
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
                                    {tab.badge && (
                                        <span className="size-5 rounded-full bg-slate-100 text-[10px] flex items-center justify-center font-bold">
                                            {tab.badge}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* ── Tab: Informasi Komisi ────────────────────────────── */}
                        {activeTab === "header" && (
                            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

                                    {/* Kiri: Form Cards */}
                                    <div className="lg:col-span-2 space-y-6">

                                        {/* Card: Informasi Dasar */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">info</span>
                                                <h3 className="font-bold text-slate-800">Informasi Dasar</h3>
                                            </div>
                                            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                                <FormField label="No. Transaksi">
                                                    <FormInput defaultValue={data.no} readOnly />
                                                </FormField>
                                                <FormField label="Tanggal">
                                                    <FormInput type="date" defaultValue={data.tanggal} />
                                                </FormField>
                                                <FormField label="Penjual">
                                                    <FormSelect defaultValue={data.penjual}>
                                                        <option value="APHAN">APHAN</option>
                                                        <option value="BUDI">BUDI</option>
                                                        <option value="CITRA">CITRA</option>
                                                        <option value="DIAN">DIAN</option>
                                                    </FormSelect>
                                                </FormField>
                                                <FormField label="Status">
                                                    <FormInput
                                                        defaultValue={data.status}
                                                        readOnly
                                                        className="bg-yellow-50 text-yellow-700 font-semibold"
                                                    />
                                                </FormField>
                                                <FormField label="Keterangan" className="sm:col-span-2">
                                                    <FormTextarea
                                                        defaultValue={data.keterangan}
                                                        rows={2}
                                                        placeholder="Masukkan keterangan..."
                                                    />
                                                </FormField>
                                            </div>
                                        </div>

                                        {/* Card: Hasil Perhitungan */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">calculate</span>
                                                <h3 className="font-bold text-slate-800">Hasil Perhitungan</h3>
                                                <span className="ml-1 text-[10px] text-slate-400 font-medium">
                                                    *Tanggal Nota yang akan dihitung &lt;= Tgl Pengajuan
                                                </span>
                                            </div>
                                            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                                <FormField label="Jumlah Nota (Terhitung)">
                                                    <FormInput
                                                        type="number"
                                                        defaultValue={String(data.jumlahNotaTerhitung)}
                                                        readOnly
                                                    />
                                                </FormField>
                                                <FormField label="Jumlah Nota (Terbayar)">
                                                    <FormInput
                                                        type="number"
                                                        defaultValue={String(data.jumlahNotaTerbayar)}
                                                        readOnly
                                                    />
                                                </FormField>
                                                <FormField label="Ratio Pembayaran (%)">
                                                    <div className="flex items-center gap-2">
                                                        <FormInput
                                                            type="number"
                                                            defaultValue={String(data.ratioPembayaran)}
                                                            readOnly
                                                            className="flex-1"
                                                        />
                                                        <span className="text-xs text-slate-500 whitespace-nowrap">*Ratio Keberhasilan Pembayaran</span>
                                                    </div>
                                                </FormField>
                                                <FormField label="Jumlah Komisi (Terhitung)">
                                                    <FormInput
                                                        type="number"
                                                        defaultValue={data.jumlahKomisiTerhitung.toFixed(2)}
                                                        readOnly
                                                    />
                                                </FormField>
                                                <FormField label="Jumlah Komisi (Dibayar)">
                                                    <FormInput
                                                        type="number"
                                                        defaultValue={data.jumlahKomisiTerbayar.toFixed(2)}
                                                    />
                                                </FormField>
                                            </div>
                                        </div>

                                        {/* Card: Opsi Cetak */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">print</span>
                                                <h3 className="font-bold text-slate-800">Opsi Cetak</h3>
                                            </div>
                                            <div className="p-4 md:p-6">
                                                <label className="flex items-center gap-3 cursor-pointer group">
                                                    <input
                                                        id="show-all-values"
                                                        type="checkbox"
                                                        checked={showAllValues}
                                                        onChange={(e) => setShowAllValues(e.target.checked)}
                                                        className="size-4 rounded border-slate-300 text-primary focus:ring-primary/30"
                                                    />
                                                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                                                        Tampilkan semua nilai
                                                        <span className="ml-1 text-xs text-slate-400">*Klik untuk tampilkan semua nilai</span>
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Kanan: Ringkasan Sidebar */}
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-0">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">receipt_long</span>
                                                <h3 className="font-bold text-slate-800">Ringkasan Komisi</h3>
                                            </div>
                                            <div className="p-4 md:p-6 space-y-3">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500">Total Nilai Nota</span>
                                                    <span className="font-semibold">Rp {fmtCur(totalNilaiNota)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500">Total Terbayar</span>
                                                    <span className="font-semibold">Rp {fmtCur(totalTerbayar)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500">Ratio Pembayaran</span>
                                                    <span className="font-semibold">
                                                        {totalNilaiNota > 0
                                                            ? ((totalTerbayar / totalNilaiNota) * 100).toFixed(1)
                                                            : "0.0"}%
                                                    </span>
                                                </div>
                                                <div className="pt-3 border-t border-slate-100">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm md:text-base font-bold text-slate-900">Total Komisi</span>
                                                        <span className="text-lg md:text-xl font-black text-primary">
                                                            Rp {fmtCur(totalKomisi)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
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
                                                <button className="col-span-2 py-2 bg-emerald-500 text-white rounded text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined !text-sm">verified</span> APPROVE
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Tab: Daftar Nota ─────────────────────────────────── */}
                        {activeTab === "nota-list" && (
                            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    {/* Table Header */}
                                    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">receipt_long</span>
                                            <h3 className="font-bold text-slate-800">Daftar Nota yang Dihitung</h3>
                                        </div>
                                        <span className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                                            {notas.length} nota
                                        </span>
                                    </div>

                                    {/* Mobile Card View */}
                                    <div className="block md:hidden divide-y divide-primary/5">
                                        {notas.map((nota) => (
                                            <div key={nota.id} className="p-4 space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <span className="font-semibold text-primary text-sm">{nota.noNota}</span>
                                                    <span className="text-xs text-slate-500">{nota.tanggalNota}</span>
                                                </div>
                                                <p className="text-sm text-slate-700">{nota.pelanggan}</p>
                                                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                                                    <div>
                                                        <p className="text-slate-400 uppercase tracking-wider">Nilai Nota</p>
                                                        <p className="font-semibold">{fmtCur(nota.nilaiNota)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-400 uppercase tracking-wider">Terbayar</p>
                                                        <p className="font-semibold">{fmtCur(nota.nilaiTerbayar)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-400 uppercase tracking-wider">Komisi</p>
                                                        <p className="font-bold text-primary">{fmtCur(nota.komisi)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Desktop Table View */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-primary/10">
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">No. Nota</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Tanggal</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Pelanggan</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Nilai Nota</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Nilai Terbayar</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Komisi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-primary/5">
                                                {notas.map((nota) => (
                                                    <tr key={nota.id} className="hover:bg-primary/5 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <span className="font-semibold text-primary text-sm tracking-tight">
                                                                {nota.noNota}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm">{nota.tanggalNota}</td>
                                                        <td className="px-6 py-4 text-sm font-medium">{nota.pelanggan}</td>
                                                        <td className="px-6 py-4 text-sm text-right">{fmtCur(nota.nilaiNota)}</td>
                                                        <td className="px-6 py-4 text-sm text-right">{fmtCur(nota.nilaiTerbayar)}</td>
                                                        <td className="px-6 py-4 text-sm font-bold text-primary text-right">{fmtCur(nota.komisi)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className="bg-slate-50 border-t-2 border-primary/10">
                                                    <td colSpan={3} className="px-6 py-4 text-sm font-bold text-slate-700">Total</td>
                                                    <td className="px-6 py-4 text-sm font-bold text-right">{fmtCur(totalNilaiNota)}</td>
                                                    <td className="px-6 py-4 text-sm font-bold text-right">{fmtCur(totalTerbayar)}</td>
                                                    <td className="px-6 py-4 text-sm font-black text-primary text-right">{fmtCur(totalKomisi)}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
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
