"use client";

import { useRouter } from "next/navigation";
import { use, useState } from "react";
import Link from "next/link";
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import StatusBar from "../../../../components/StatusBar";
import FormField from "../../../../components/FormField";
import FormInput from "../../../../components/FormInput";
import FormSelect from "../../../../components/FormSelect";

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusType = "Sudah Cair" | "Belum Cair" | "Proses";

const statusStyles: Record<StatusType, string> = {
    "Sudah Cair":  "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Belum Cair":  "bg-red-100 text-red-700 border-red-200",
    "Proses":      "bg-yellow-100 text-yellow-700 border-yellow-200",
};

// ─── Allocation Detail Interface ──────────────────────────────────────────────

interface AllocationDetail {
    id: string;
    noTransaksi: string;
    tanggal: string;
    keterangan: string;
    jumlah: number;
}

// ─── Header Data Interface ────────────────────────────────────────────────────

interface CustomerReceiptDetail {
    noBukti: string;
    tanggal: string;
    pelanggan: string;
    mataUang: string;
    kurs: string;
    penerimaanKeKodeAkun: string;
    originalValue: number;
    originalAlokasi: number;
    localValue: number;
    localAlokasi: number;
    jenisBilyet: string;
    keterangan: string;
    tanggalSetor: string;
    tanggalJatuhTempo: string;
    tanggalCair: string;
    sudahCair: StatusType;
    details: AllocationDetail[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockData: Record<string, CustomerReceiptDetail> = {
    "BGI2604-0001": {
        noBukti: "BGI 2604-0001",
        tanggal: "2026-04-10",
        pelanggan: "AYU",
        mataUang: "RP",
        kurs: "1.00",
        penerimaanKeKodeAkun: "120.01.01 - BCA 194-398-7878",
        originalValue: 1000000,
        originalAlokasi: 327971.70,
        localValue: 1000000,
        localAlokasi: 327971.70,
        jenisBilyet: "Transfer",
        keterangan: "Transfer",
        tanggalSetor: "2026-04-10",
        tanggalJatuhTempo: "2026-04-10",
        tanggalCair: "2026-04-10",
        sudahCair: "Sudah Cair",
        details: [
            {
                id: "D001",
                noTransaksi: "ARS 2604-0001",
                tanggal: "2026-04-10",
                keterangan: "SIL 2601-0001, 2026-01-06",
                jumlah: 327971.70,
            },
        ],
    },
    "BGI2309-0001": {
        noBukti: "BGI 2309-0001",
        tanggal: "2023-09-08",
        pelanggan: "ABUN",
        mataUang: "RP",
        kurs: "1.00",
        penerimaanKeKodeAkun: "120.01.01 - BCA 194-398-7878",
        originalValue: 10000,
        originalAlokasi: 6000,
        localValue: 10000,
        localAlokasi: 6000,
        jenisBilyet: "Transfer",
        keterangan: "Transfer",
        tanggalSetor: "2023-09-08",
        tanggalJatuhTempo: "2023-09-08",
        tanggalCair: "2023-09-08",
        sudahCair: "Sudah Cair",
        details: [],
    },
    "BGI2107-0001": {
        noBukti: "BGI 2107-0001",
        tanggal: "2021-07-06",
        pelanggan: "DAMAS KARYA ABADI, PT",
        mataUang: "RP",
        kurs: "1.00",
        penerimaanKeKodeAkun: "120.01.01 - BCA 194-398-7878",
        originalValue: 17000000,
        originalAlokasi: 15038000.01,
        localValue: 17000000,
        localAlokasi: 15038000.01,
        jenisBilyet: "Cheque",
        keterangan: "Cheque BCA 738718371",
        tanggalSetor: "2021-07-06",
        tanggalJatuhTempo: "2021-07-06",
        tanggalCair: "2021-07-06",
        sudahCair: "Sudah Cair",
        details: [],
    },
    new: {
        noBukti: "[Auto]",
        tanggal: new Date().toISOString().slice(0, 10),
        pelanggan: "",
        mataUang: "RP",
        kurs: "1.00",
        penerimaanKeKodeAkun: "",
        originalValue: 0,
        originalAlokasi: 0,
        localValue: 0,
        localAlokasi: 0,
        jenisBilyet: "Transfer",
        keterangan: "",
        tanggalSetor: new Date().toISOString().slice(0, 10),
        tanggalJatuhTempo: new Date().toISOString().slice(0, 10),
        tanggalCair: new Date().toISOString().slice(0, 10),
        sudahCair: "Belum Cair",
        details: [],
    },
};

const fmtCur = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type TabKey = "header" | "alokasi" | "attachments";

const tabs: { key: TabKey; label: string; icon: string; badge?: string }[] = [
    { key: "header",      label: "Input Penerimaan",  icon: "description" },
    { key: "alokasi",     label: "Alokasi",            icon: "assignment_turned_in" },
    { key: "attachments", label: "Lampiran",            icon: "attachment" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CustomerReceiptsDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id }  = use(params);
    const router  = useRouter();
    const isNew   = id === "new";
    const data    = mockData[id] ?? mockData["new"];

    const [activeTab, setActiveTab] = useState<TabKey>("header");

    const sisa = data.originalValue - data.originalAlokasi;

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
                                onClick={() => router.push("/finance/accounts-receivable/customer-receipts")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        {isNew ? "Tambah Penerimaan Pembayaran" : data.noBukti}
                                    </h1>
                                    <span className={`px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest border ${statusStyles[data.sudahCair]}`}>
                                        {data.sudahCair}
                                    </span>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    Pencatatan Penerimaan Pembayaran Dari Pelanggan
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
                                    {tab.badge && (
                                        <span className="size-5 rounded-full bg-slate-100 text-[10px] flex items-center justify-center font-bold">
                                            {tab.badge}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* ── Tab: Input Penerimaan (Header) ── */}
                        {activeTab === "header" && (
                            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                                    {/* Left: Form Cards */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Card: Informasi Dasar */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">info</span>
                                                <h3 className="font-bold text-slate-800">Informasi Penerimaan</h3>
                                            </div>
                                            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                                <FormField label="No. Bukti">
                                                    <FormInput
                                                        defaultValue={data.noBukti}
                                                        readOnly={!isNew}
                                                        placeholder="[Auto]"
                                                    />
                                                </FormField>
                                                <FormField label="Tanggal">
                                                    <FormInput
                                                        type="date"
                                                        defaultValue={data.tanggal}
                                                    />
                                                </FormField>
                                                <FormField label="Pelanggan" className="sm:col-span-2">
                                                    <div className="flex gap-2">
                                                        <FormSelect defaultValue={data.pelanggan} className="flex-1">
                                                            <option value="">— Pilih Pelanggan —</option>
                                                            <option value="AYU">AYU</option>
                                                            <option value="ABUN">ABUN</option>
                                                            <option value="DAMAS KARYA ABADI, PT">DAMAS KARYA ABADI, PT</option>
                                                            <option value="AKA">AKA</option>
                                                            <option value="ROBERT SERANG">ROBERT SERANG</option>
                                                            <option value="NURMALA">NURMALA</option>
                                                            <option value="SANDRY">SANDRY</option>
                                                            <option value="JANI WIDJAJA">JANI WIDJAJA</option>
                                                            <option value="HANDI TAN">HANDI TAN</option>
                                                            <option value="LIMA DARA">LIMA DARA</option>
                                                        </FormSelect>
                                                        <button
                                                            className="flex-shrink-0 px-3 py-2 text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-primary transition-colors"
                                                            title="Cari Pelanggan"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">search</span>
                                                        </button>
                                                    </div>
                                                </FormField>
                                                <FormField label="Mata Uang">
                                                    <FormSelect defaultValue={data.mataUang}>
                                                        <option value="RP">RP</option>
                                                        <option value="USD">USD</option>
                                                        <option value="EUR">EUR</option>
                                                        <option value="SGD">SGD</option>
                                                    </FormSelect>
                                                </FormField>
                                                <FormField label="Kurs">
                                                    <FormInput
                                                        type="number"
                                                        defaultValue={data.kurs}
                                                    />
                                                </FormField>
                                                <FormField label="Penerimaan ke Kode Akun" className="sm:col-span-2">
                                                    <FormSelect defaultValue={data.penerimaanKeKodeAkun}>
                                                        <option value="">— Pilih Kode Akun —</option>
                                                        <option value="120.01.01 - BCA 194-398-7878">120.01.01 - BCA 194-398-7878</option>
                                                        <option value="120.01.02 - BCA 194-448-7878">120.01.02 - BCA 194-448-7878</option>
                                                        <option value="120.02.01 - MANDIRI 103-000-1234">120.02.01 - MANDIRI 103-000-1234</option>
                                                    </FormSelect>
                                                </FormField>
                                            </div>
                                        </div>

                                        {/* Card: Nilai Pembayaran */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">payments</span>
                                                <h3 className="font-bold text-slate-800">Nilai Pembayaran</h3>
                                            </div>
                                            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                                {/* Original Value */}
                                                <FormField label="Original Value" className="sm:col-span-2">
                                                    <FormInput
                                                        type="number"
                                                        defaultValue={String(data.originalValue)}
                                                        placeholder="0.00"
                                                    />
                                                </FormField>
                                                {/* Original Allocation Value */}
                                                <FormField label="Original Allocation Value" className="sm:col-span-2">
                                                    <div className="flex gap-2">
                                                        <FormInput
                                                            type="number"
                                                            defaultValue={String(data.originalAlokasi)}
                                                            readOnly
                                                            placeholder="0.00"
                                                            className="flex-1"
                                                        />
                                                        <FormInput
                                                            type="number"
                                                            defaultValue={String(data.originalValue - data.originalAlokasi)}
                                                            readOnly
                                                            placeholder="0.00"
                                                            className="flex-1"
                                                        />
                                                    </div>
                                                </FormField>
                                                {/* Local Value */}
                                                <FormField label="Local Value" className="sm:col-span-2">
                                                    <FormInput
                                                        type="number"
                                                        defaultValue={String(data.localValue)}
                                                        readOnly
                                                        placeholder="0.00"
                                                    />
                                                </FormField>
                                                {/* Local Allocation Value */}
                                                <FormField label="Local Allocation Value" className="sm:col-span-2">
                                                    <div className="flex gap-2">
                                                        <FormInput
                                                            type="number"
                                                            defaultValue={String(data.localAlokasi)}
                                                            readOnly
                                                            placeholder="0.00"
                                                            className="flex-1"
                                                        />
                                                        <FormInput
                                                            type="number"
                                                            defaultValue={String(data.localValue - data.localAlokasi)}
                                                            readOnly
                                                            placeholder="0.00"
                                                            className="flex-1"
                                                        />
                                                    </div>
                                                </FormField>
                                            </div>
                                        </div>

                                        {/* Card: Informasi Bilyet */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">receipt</span>
                                                <h3 className="font-bold text-slate-800">Informasi Bilyet</h3>
                                            </div>
                                            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                                <FormField label="Jenis Bilyet">
                                                    <FormSelect defaultValue={data.jenisBilyet}>
                                                        <option value="Transfer">Transfer</option>
                                                        <option value="Cheque">Cheque</option>
                                                        <option value="Tunai">Tunai</option>
                                                        <option value="BG">Bilyet Giro (BG)</option>
                                                        <option value="Deposit">Deposit</option>
                                                    </FormSelect>
                                                </FormField>
                                                <FormField label="Keterangan">
                                                    <FormInput
                                                        defaultValue={data.keterangan}
                                                        placeholder="Masukkan keterangan..."
                                                    />
                                                </FormField>
                                                <FormField label="Tanggal Setor">
                                                    <FormInput
                                                        type="date"
                                                        defaultValue={data.tanggalSetor}
                                                    />
                                                </FormField>
                                                <FormField label="Tanggal Jatuh Tempo">
                                                    <FormInput
                                                        type="date"
                                                        defaultValue={data.tanggalJatuhTempo}
                                                    />
                                                </FormField>
                                                <FormField label="Tanggal Cair">
                                                    <FormInput
                                                        type="date"
                                                        defaultValue={data.tanggalCair}
                                                    />
                                                </FormField>
                                                <FormField label="Sudah Cair ?">
                                                    <FormSelect defaultValue={data.sudahCair}>
                                                        <option value="Sudah Cair">Sudah Cair</option>
                                                        <option value="Belum Cair">Belum Cair</option>
                                                        <option value="Proses">Proses</option>
                                                    </FormSelect>
                                                </FormField>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Sidebar Summary */}
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-0">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">receipt_long</span>
                                                <h3 className="font-bold text-slate-800">Ringkasan Nilai</h3>
                                            </div>
                                            <div className="p-4 md:p-6 space-y-4">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500">Original Value</span>
                                                    <span className="font-semibold">{fmtCur(data.originalValue)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500">Telah Dialokasi</span>
                                                    <span className={`font-semibold ${data.originalAlokasi > 0 ? "text-primary" : "text-slate-400"}`}>
                                                        {fmtCur(data.originalAlokasi)}
                                                    </span>
                                                </div>
                                                <div className="pt-4 border-t border-slate-100">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm md:text-base font-bold text-slate-900">Sisa Belum Alokasi</span>
                                                        <span className={`text-lg md:text-xl font-black ${sisa > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                                                            {fmtCur(sisa)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Status indicator */}
                                                <div className="pt-2">
                                                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${
                                                        data.sudahCair === "Sudah Cair"
                                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                            : data.sudahCair === "Proses"
                                                            ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                                            : "bg-red-50 text-red-700 border border-red-200"
                                                    }`}>
                                                        <span className="material-symbols-outlined !text-base">
                                                            {data.sudahCair === "Sudah Cair" ? "check_circle" : data.sudahCair === "Proses" ? "schedule" : "pending"}
                                                        </span>
                                                        {data.sudahCair}
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
                                                <button className="col-span-2 py-2 bg-white border border-slate-200 text-primary rounded text-xs font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined !text-sm">print</span>
                                                    PRINT
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Tab: Alokasi ── */}
                        {activeTab === "alokasi" && (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">
                                    {/* Card Header */}
                                    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">assignment_turned_in</span>
                                            <h3 className="font-bold text-slate-800">
                                                Alokasi atas Penerimaan Pembayaran {!isNew && data.noBukti}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Desktop Table */}
                                    <div className="hidden md:block overflow-x-auto flex-1">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-primary/10">
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">#</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Transaksi #</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Tanggal</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Keterangan</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Jumlah</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-primary/5">
                                                {data.details.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} className="px-6 py-12 text-center">
                                                            <span className="material-symbols-outlined text-4xl text-slate-300 block mb-2">assignment_turned_in</span>
                                                            <p className="text-sm text-slate-400">Belum ada alokasi penerimaan.</p>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    data.details.map((detail, idx) => (
                                                        <tr key={detail.id} className="hover:bg-primary/5 transition-colors cursor-pointer">
                                                            <td className="px-6 py-4 text-sm text-slate-500">{idx + 1}.</td>
                                                            <td className="px-6 py-4">
                                                                <Link
                                                                    href="#"
                                                                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                                                                >
                                                                    {detail.noTransaksi}
                                                                </Link>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm">{detail.tanggal}</td>
                                                            <td className="px-6 py-4 text-sm text-slate-600 max-w-[280px] truncate" title={detail.keterangan}>
                                                                {detail.keterangan}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm font-bold text-right">
                                                                {fmtCur(detail.jumlah)}
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                            {data.details.length > 0 && (
                                                <tfoot>
                                                    <tr className="bg-slate-50 border-t-2 border-primary/10">
                                                        <td colSpan={4} className="px-6 py-4 text-sm font-bold text-right text-slate-700">
                                                            Total :
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-black text-right text-primary">
                                                            {fmtCur(data.details.reduce((s, d) => s + d.jumlah, 0))}
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            )}
                                        </table>
                                    </div>

                                    {/* Mobile Cards */}
                                    <div className="block md:hidden divide-y divide-primary/5">
                                        {data.details.length === 0 ? (
                                            <div className="p-8 text-center">
                                                <span className="material-symbols-outlined text-4xl text-slate-300 block mb-2">assignment_turned_in</span>
                                                <p className="text-sm text-slate-400">Belum ada alokasi penerimaan.</p>
                                            </div>
                                        ) : (
                                            data.details.map((detail, idx) => (
                                                <div key={detail.id} className="p-4 space-y-3">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <Link href="#" className="font-semibold text-primary text-sm hover:underline">
                                                                {detail.noTransaksi}
                                                            </Link>
                                                            <p className="text-xs text-slate-500 mt-0.5">{detail.tanggal}</p>
                                                        </div>
                                                        <span className="text-xs text-slate-400">#{idx + 1}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-600">{detail.keterangan}</p>
                                                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                                        <span className="text-sm font-bold text-slate-900">
                                                            Rp {fmtCur(detail.jumlah)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Pagination */}
                                    {data.details.length > 0 && (
                                        <div className="px-4 md:px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                                            <p className="text-sm text-slate-500 text-center md:text-left">
                                                Menampilkan 1 sampai {data.details.length} dari {data.details.length} data
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
                                    )}
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
