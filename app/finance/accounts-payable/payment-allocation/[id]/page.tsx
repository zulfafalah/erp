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
import FormTextarea from "../../../../components/FormTextarea";

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusType = "Approved" | "Pending" | "Draft" | "Completed";

const statusStyles: Record<StatusType, string> = {
    Approved:  "bg-green-100 text-green-700 border-green-200",
    Pending:   "bg-yellow-100 text-yellow-700 border-yellow-200",
    Draft:     "bg-slate-100 text-slate-700 border-slate-200",
    Completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

// ─── Detail Line Interface ────────────────────────────────────────────────────

interface AllocationDetail {
    id: string;
    noBilyet: string;
    nilaiSisaBilyet: number;
    notaNo: string;
    keterangan: string;
    tglBayar: string;
    mataUang: string;
    kursBayar: number;
    totalBayar: number;
}

// ─── Header Data Interface ────────────────────────────────────────────────────

interface PaymentAllocationDetail {
    noTransaksi: string;
    tanggal: string;
    pemasok: string;
    mataUang: string;
    kursBayar: string;
    pembayaranDariKodeAkun: string;
    catatan: string;
    status: StatusType;
    jumlahOriginal: number;
    jumlahLokal: number;
    details: AllocationDetail[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockData: Record<string, PaymentAllocationDetail> = {
    "APP2207-0001": {
        noTransaksi: "APP 2207-0001",
        tanggal: "2022-07-01",
        pemasok: "UNILEVER",
        mataUang: "Rupiah",
        kursBayar: "1.00",
        pembayaranDariKodeAkun: "120.01.01 - BCA 194-398-7878",
        catatan: "",
        status: "Completed",
        jumlahOriginal: 550152.90,
        jumlahLokal: 550152.90,
        details: [
            {
                id: "D001",
                noBilyet: "BGO 2207-0001",
                nilaiSisaBilyet: 449847.10,
                notaNo: "PIV 2207-0001, 2022-07-01 ~ 0.00",
                keterangan: "PIV 2207-0001, 2022-07-01",
                tglBayar: "2022-07-01",
                mataUang: "RP",
                kursBayar: 1.00,
                totalBayar: 550000.00,
            },
            {
                id: "D002",
                noBilyet: "BGO 2207-0001",
                nilaiSisaBilyet: 449847.10,
                notaNo: "SAH 1812-0302",
                keterangan: "SAH 1812-0302, 2018-12-31",
                tglBayar: "2022-07-01",
                mataUang: "RP",
                kursBayar: 1.00,
                totalBayar: 152.90,
            },
        ],
    },
    "APP2206-0001": {
        noTransaksi: "APP 2206-0001",
        tanggal: "2022-06-30",
        pemasok: "UNILEVER",
        mataUang: "Rupiah",
        kursBayar: "1.00",
        pembayaranDariKodeAkun: "120.01.01 - BCA 194-398-7878",
        catatan: "",
        status: "Approved",
        jumlahOriginal: 1528798.47,
        jumlahLokal: 1528798.47,
        details: [],
    },
    new: {
        noTransaksi: "[Auto]",
        tanggal: new Date().toISOString().slice(0, 10),
        pemasok: "",
        mataUang: "Rupiah",
        kursBayar: "1.00",
        pembayaranDariKodeAkun: "",
        catatan: "",
        status: "Draft",
        jumlahOriginal: 0,
        jumlahLokal: 0,
        details: [],
    },
};

const fmtCur = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type TabKey = "header" | "detail" | "attachments";

const tabs: { key: TabKey; label: string; icon: string; badge?: string }[] = [
    { key: "header",      label: "Input Alokasi",     icon: "description" },
    { key: "detail",      label: "Daftar Detail",      icon: "list_alt" },
    { key: "attachments", label: "Lampiran",            icon: "attachment" },
];

// ─── Input Detail Modal ───────────────────────────────────────────────────────

interface InputDetailModalProps {
    onClose: () => void;
}

function InputDetailModal({ onClose }: InputDetailModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl border border-primary/10 overflow-hidden">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">add_card</span>
                        <h3 className="font-bold text-slate-800">Input Detail Pembayaran</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="size-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg text-slate-500">close</span>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                    <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                        <p className="text-xs font-semibold text-primary uppercase tracking-wide">Input Detail Pembayaran</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <FormField label="No. Bilyet">
                            <div className="flex gap-2">
                                <FormSelect>
                                    <option value="BGO2207-0001">BGO 2207-0001 ~ BG</option>
                                    <option value="BGO2206-0001">BGO 2206-0001 ~ BG</option>
                                    <option value="BGO2205-0001">BGO 2205-0001 ~ BG</option>
                                </FormSelect>
                                <FormInput
                                    defaultValue="449,847.10"
                                    readOnly
                                    className="w-36 text-right"
                                />
                            </div>
                        </FormField>

                        <FormField label="Nota #">
                            <FormSelect>
                                <option value="PIV2207-0001">PIV 2207-0001, 2022-07-01 ~ 0.00</option>
                                <option value="PIV2206-0001">PIV 2206-0001, 2022-06-30 ~ 0.00</option>
                            </FormSelect>
                        </FormField>

                        <FormField label="Keterangan">
                            <FormInput defaultValue="PIV 2207-0001, 2022-07-01" />
                        </FormField>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Mata Uang">
                                <FormSelect>
                                    <option value="Rupiah">Rupiah</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                </FormSelect>
                            </FormField>
                            <FormField label="Kurs Bayar">
                                <FormInput type="number" defaultValue="1.00" />
                            </FormField>
                        </div>

                        <FormField label="Total Bayar">
                            <div className="flex items-center gap-3">
                                <FormInput type="number" defaultValue="550000.00" className="flex-1" />
                                <p className="text-xs text-slate-500 shrink-0">
                                    * Nilai Maksimum yang diinput adalah Sebesar Sisa Nilai Bilyet
                                </p>
                            </div>
                        </FormField>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                    <button className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-sm">save</span>
                        Save
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">refresh</span>
                        Reset
                    </button>
                    <button className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-sm">help</span>
                        Info
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PaymentAllocationDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id }  = use(params);
    const router  = useRouter();
    const isNew   = id === "new";
    const data    = mockData[id] ?? mockData["new"];

    const [activeTab, setActiveTab]     = useState<TabKey>("header");
    const [showModal, setShowModal]     = useState(false);

    const totalBayar = data.details.reduce((sum, d) => sum + d.totalBayar, 0);

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
                                onClick={() => router.push("/finance/accounts-payable/payment-allocation")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        {isNew ? "Tambah Alokasi Pembayaran" : data.noTransaksi}
                                    </h1>
                                    <span className={`px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest border ${statusStyles[data.status]}`}>
                                        {data.status}
                                    </span>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    Input Alokasi Pembayaran Ke Pemasok
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

                        {/* ── Tab: Input Alokasi (Header) ── */}
                        {activeTab === "header" && (
                            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                                    {/* Left: Form Cards */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Card: Informasi Transaksi */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">info</span>
                                                <h3 className="font-bold text-slate-800">Informasi Transaksi</h3>
                                            </div>
                                            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                                <FormField label="No. Transaksi">
                                                    <FormInput
                                                        defaultValue={data.noTransaksi}
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
                                                <FormField label="Pemasok" className="sm:col-span-2">
                                                    <FormSelect defaultValue={data.pemasok}>
                                                        <option value="">— Pilih Pemasok —</option>
                                                        <option value="UNILEVER">UNILEVER</option>
                                                        <option value="CV CITRA HARAPAN JAYA">CV CITRA HARAPAN JAYA</option>
                                                        <option value="CARREFOUR PURI INDAH">CARREFOUR PURI INDAH</option>
                                                        <option value="MANDALA DHARMA KRIDA, PT">MANDALA DHARMA KRIDA, PT</option>
                                                        <option value="WAHANA INDAH SURYA BAHARI, PT">WAHANA INDAH SURYA BAHARI, PT</option>
                                                    </FormSelect>
                                                </FormField>
                                            </div>
                                        </div>

                                        {/* Card: Informasi Pembayaran */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">payments</span>
                                                <h3 className="font-bold text-slate-800">Informasi Pembayaran</h3>
                                            </div>
                                            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                                <FormField label="Mata Uang">
                                                    <FormSelect defaultValue={data.mataUang}>
                                                        <option value="Rupiah">Rupiah</option>
                                                        <option value="USD">USD</option>
                                                        <option value="EUR">EUR</option>
                                                        <option value="SGD">SGD</option>
                                                    </FormSelect>
                                                </FormField>
                                                <FormField label="Kurs Bayar">
                                                    <FormInput
                                                        type="number"
                                                        defaultValue={data.kursBayar}
                                                    />
                                                </FormField>
                                                <FormField label="Pembayaran dari Kode Akun" className="sm:col-span-2">
                                                    <FormSelect defaultValue={data.pembayaranDariKodeAkun}>
                                                        <option value="">— Pilih Kode Akun —</option>
                                                        <option value="120.01.01 - BCA 194-398-7878">120.01.01 - BCA 194-398-7878</option>
                                                        <option value="120.01.02 - BCA 194-448-7878">120.01.02 - BCA 194-448-7878</option>
                                                        <option value="120.02.01 - MANDIRI 103-000-1234">120.02.01 - MANDIRI 103-000-1234</option>
                                                    </FormSelect>
                                                </FormField>
                                                <FormField label="Catatan" className="sm:col-span-2">
                                                    <FormTextarea
                                                        defaultValue={data.catatan}
                                                        placeholder="Masukkan catatan pembayaran..."
                                                        rows={3}
                                                    />
                                                </FormField>
                                                <FormField label="Status">
                                                    <FormSelect defaultValue={data.status} disabled>
                                                        <option value="Completed">COMPLETED</option>
                                                        <option value="Approved">APPROVED</option>
                                                        <option value="Pending">PENDING</option>
                                                        <option value="Draft">DRAFT</option>
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
                                                <h3 className="font-bold text-slate-800">Ringkasan Jumlah</h3>
                                            </div>
                                            <div className="p-4 md:p-6 space-y-4">
                                                <FormField label="Jumlah Original">
                                                    <FormInput
                                                        type="number"
                                                        defaultValue={String(data.jumlahOriginal)}
                                                        readOnly
                                                        placeholder="0.00"
                                                    />
                                                </FormField>
                                                <div className="pt-2 border-t border-slate-100">
                                                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Jumlah Lokal</p>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm md:text-base font-bold text-slate-900">Total</span>
                                                        <span className="text-lg md:text-xl font-black text-primary">
                                                            Rp {fmtCur(data.jumlahLokal)}
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
                                                {!isNew && data.status !== "Approved" && data.status !== "Completed" && (
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

                        {/* ── Tab: Daftar Detail ── */}
                        {activeTab === "detail" && (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                {/* Detail Sub-header */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">
                                    {/* Card Header */}
                                    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">list_alt</span>
                                            <h3 className="font-bold text-slate-800">
                                                Daftar Detail {!isNew && data.noTransaksi}
                                            </h3>
                                        </div>
                                        <button
                                            onClick={() => setShowModal(true)}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                        >
                                            <span className="material-symbols-outlined text-sm">add_circle</span>
                                            Add New
                                        </button>
                                    </div>

                                    {/* Desktop Table */}
                                    <div className="hidden md:block overflow-x-auto flex-1">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-primary/10">
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">#</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Bukti #</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Nota #</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Keterangan</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Tgl Bayar</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Mata Uang</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Kurs Bayar</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Total Bayar</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-primary/5">
                                                {data.details.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={9} className="px-6 py-12 text-center">
                                                            <span className="material-symbols-outlined text-4xl text-slate-300 block mb-2">list_alt</span>
                                                            <p className="text-sm text-slate-400">Belum ada detail pembayaran.</p>
                                                            <button
                                                                onClick={() => setShowModal(true)}
                                                                className="mt-3 px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-all inline-flex items-center gap-2"
                                                            >
                                                                <span className="material-symbols-outlined text-sm">add_circle</span>
                                                                Tambah Detail
                                                            </button>
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
                                                                    {detail.noBilyet}
                                                                </Link>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <Link
                                                                    href="#"
                                                                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                                                                >
                                                                    {detail.notaNo.split(",")[0]}
                                                                </Link>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-slate-600 max-w-[200px] truncate" title={detail.keterangan}>
                                                                {detail.keterangan}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm">{detail.tglBayar}</td>
                                                            <td className="px-6 py-4 text-sm text-slate-500">{detail.mataUang}</td>
                                                            <td className="px-6 py-4 text-sm text-right">{detail.kursBayar.toFixed(2)}</td>
                                                            <td className="px-6 py-4 text-sm font-bold text-right">{fmtCur(detail.totalBayar)}</td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <button
                                                                        onClick={() => setShowModal(true)}
                                                                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                                                        title="View/Edit"
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
                                                    ))
                                                )}
                                            </tbody>
                                            {data.details.length > 0 && (
                                                <tfoot>
                                                    <tr className="bg-slate-50 border-t-2 border-primary/10">
                                                        <td colSpan={7} className="px-6 py-4 text-sm font-bold text-right text-slate-700">
                                                            Total :
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-black text-right text-primary">
                                                            {fmtCur(totalBayar)}
                                                        </td>
                                                        <td></td>
                                                    </tr>
                                                </tfoot>
                                            )}
                                        </table>
                                    </div>

                                    {/* Mobile Cards */}
                                    <div className="block md:hidden divide-y divide-primary/5">
                                        {data.details.length === 0 ? (
                                            <div className="p-8 text-center">
                                                <span className="material-symbols-outlined text-4xl text-slate-300 block mb-2">list_alt</span>
                                                <p className="text-sm text-slate-400">Belum ada detail pembayaran.</p>
                                            </div>
                                        ) : (
                                            data.details.map((detail, idx) => (
                                                <div key={detail.id} className="p-4 space-y-3">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <Link href="#" className="font-semibold text-primary text-sm hover:underline">
                                                                {detail.noBilyet}
                                                            </Link>
                                                            <p className="text-xs text-slate-500 mt-0.5">{detail.tglBayar}</p>
                                                        </div>
                                                        <span className="text-xs text-slate-400">#{idx + 1}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">{detail.keterangan}</p>
                                                        <p className="text-xs text-slate-500">{detail.mataUang} · Kurs {detail.kursBayar.toFixed(2)}</p>
                                                    </div>
                                                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                                        <span className="text-sm font-bold text-slate-900">
                                                            Rp {fmtCur(detail.totalBayar)}
                                                        </span>
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => setShowModal(true)}
                                                                className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                                            >
                                                                <span className="material-symbols-outlined text-base">edit_square</span>
                                                            </button>
                                                            <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                                                                <span className="material-symbols-outlined text-base">delete</span>
                                                            </button>
                                                        </div>
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

            {/* ── Input Detail Modal ── */}
            {showModal && <InputDetailModal onClose={() => setShowModal(false)} />}
        </div>
    );
}
