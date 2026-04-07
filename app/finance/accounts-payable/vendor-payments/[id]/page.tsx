"use client";

import { useRouter } from "next/navigation";
import { use, useState } from "react";
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import StatusBar from "../../../../components/StatusBar";
import FormField from "../../../../components/FormField";
import FormInput from "../../../../components/FormInput";
import FormSelect from "../../../../components/FormSelect";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusType = "Sudah Cair" | "Belum Cair";
type JenisBliyet = "BG" | "Transfer" | "Tunai" | "BATAL";

const statusStyles: Record<StatusType, string> = {
    "Sudah Cair": "bg-green-100 text-green-700 border-green-200",
    "Belum Cair": "bg-amber-100 text-amber-700 border-amber-200",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

interface AllokasiItem {
    transaksi: string;
    tanggal: string;
    keterangan: string;
    jumlah: number;
}

interface PaymentDetail {
    noBukti: string;
    tanggal: string;
    pemasok: string;
    mataUang: string;
    kurs: string;
    akunPembayaran: string;
    originalValue: number;
    originalAlokasi: number;
    originalSisa: number;
    localValue: number;
    localAlokasi: number;
    localSisa: number;
    jenisBliyet: JenisBliyet;
    keterangan: string;
    tglSetor: string;
    tglJatuhTempo: string;
    tglCair: string;
    sudahCair: StatusType;
    alokasi: AllokasiItem[];
}

const mockData: Record<string, PaymentDetail> = {
    "BGO2207-0001": {
        noBukti: "BGO 2207-0001",
        tanggal: "2022-07-01",
        pemasok: "UNILEVER",
        mataUang: "RP",
        kurs: "1.00",
        akunPembayaran: "120.01.01 - BCA 194-398-7878",
        originalValue: 1000000.00,
        originalAlokasi: 550152.90,
        originalSisa: 449847.10,
        localValue: 1000000.00,
        localAlokasi: 550152.90,
        localSisa: 449847.10,
        jenisBliyet: "BG",
        keterangan: "BG",
        tglSetor: "2022-07-01",
        tglJatuhTempo: "2022-07-01",
        tglCair: "2022-07-01",
        sudahCair: "Sudah Cair",
        alokasi: [
            { transaksi: "APP 2207-0001", tanggal: "2022-07-01", keterangan: "PIV 2207-0001, 2022-07-01", jumlah: 550000.00 },
            { transaksi: "APP 2207-0001", tanggal: "2022-07-01", keterangan: "SAH 1812-0002, 2018-12-31", jumlah: 152.90 },
        ],
    },
    "BGO2206-0001": {
        noBukti: "BGO 2206-0001",
        tanggal: "2022-06-30",
        pemasok: "UNILEVER",
        mataUang: "RP",
        kurs: "1.00",
        akunPembayaran: "120.01.01 - BCA 194-398-7878",
        originalValue: 2000000.00,
        originalAlokasi: 1528798.97,
        originalSisa: 471201.03,
        localValue: 2000000.00,
        localAlokasi: 1528798.97,
        localSisa: 471201.03,
        jenisBliyet: "BG",
        keterangan: "BG BCA 38747837487384",
        tglSetor: "2022-06-30",
        tglJatuhTempo: "2022-06-30",
        tglCair: "2022-06-30",
        sudahCair: "Sudah Cair",
        alokasi: [
            { transaksi: "APP 2206-0001", tanggal: "2022-06-30", keterangan: "PIV 2206-0001, 2022-06-30", jumlah: 1528798.97 },
        ],
    },
    new: {
        noBukti: "[Auto]",
        tanggal: new Date().toISOString().slice(0, 10),
        pemasok: "",
        mataUang: "RP",
        kurs: "1.00",
        akunPembayaran: "",
        originalValue: 0,
        originalAlokasi: 0,
        originalSisa: 0,
        localValue: 0,
        localAlokasi: 0,
        localSisa: 0,
        jenisBliyet: "Transfer",
        keterangan: "",
        tglSetor: new Date().toISOString().slice(0, 10),
        tglJatuhTempo: new Date().toISOString().slice(0, 10),
        tglCair: new Date().toISOString().slice(0, 10),
        sudahCair: "Belum Cair",
        alokasi: [],
    },
};

const fmtCur = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type TabKey = "header" | "alokasi" | "attachments";

const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "header",      label: "Data Pembayaran",  icon: "payments" },
    { key: "alokasi",     label: "Alokasi",           icon: "account_tree" },
    { key: "attachments", label: "Lampiran",           icon: "attachment" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VendorPaymentDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const isNew  = id === "new";
    const data   = mockData[id] ?? mockData["new"];

    const [activeTab, setActiveTab] = useState<TabKey>("header");

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
                                onClick={() => router.push("/finance/accounts-payable/vendor-payments")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        {isNew ? "Tambah Pembayaran Pemasok" : data.noBukti}
                                    </h1>
                                    <span className={`px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest border ${statusStyles[data.sudahCair]}`}>
                                        {data.sudahCair}
                                    </span>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    Pencatatan Pembayaran ke Pemasok
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
                                    {tab.key === "alokasi" && data.alokasi.length > 0 && (
                                        <span className="size-5 rounded-full bg-slate-100 text-[10px] flex items-center justify-center font-bold">
                                            {data.alokasi.length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* ── Tab: Data Pembayaran ── */}
                        {activeTab === "header" && (
                            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                                    {/* Left: Form Cards */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Card: Informasi Bukti */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">info</span>
                                                <h3 className="font-bold text-slate-800">Informasi Bukti</h3>
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
                                                <FormField label="Pemasok" className="sm:col-span-2">
                                                    <div className="flex gap-2">
                                                        <FormSelect defaultValue={data.pemasok} className="flex-1">
                                                            <option value="">— Pilih Pemasok —</option>
                                                            <option value="UNILEVER">UNILEVER</option>
                                                            <option value="CV. CITRA HARAPAN JAYA">CV. CITRA HARAPAN JAYA</option>
                                                            <option value="CARREFOUR PURI INDAH">CARREFOUR PURI INDAH</option>
                                                            <option value="CARREFOUR DENPASAR">CARREFOUR DENPASAR</option>
                                                            <option value="WAHANA INDAH SURYA BAHARI, PT">WAHANA INDAH SURYA BAHARI, PT</option>
                                                            <option value="MANDALA DHARMA KRIDA, PT">MANDALA DHARMA KRIDA, PT</option>
                                                        </FormSelect>
                                                        <button className="flex-shrink-0 size-9 flex items-center justify-center border border-slate-200 rounded-lg hover:border-primary hover:text-primary transition-colors text-slate-400">
                                                            <span className="material-symbols-outlined text-lg">manage_search</span>
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
                                                        step="0.01"
                                                    />
                                                </FormField>
                                                <FormField label="Pembayaran dari Kode Akun" className="sm:col-span-2">
                                                    <FormSelect defaultValue={data.akunPembayaran}>
                                                        <option value="">— Pilih Akun —</option>
                                                        <option value="120.01.01 - BCA 194-398-7878">120.01.01 - BCA 194-398-7878</option>
                                                        <option value="120.01.02-BCA 194-448-7878">120.01.02-BCA 194-448-7878</option>
                                                        <option value="110.02.01-KAS BESAR PUSAT">110.02.01-KAS BESAR PUSAT</option>
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
                                                <FormField label="Original Value">
                                                    <FormInput
                                                        type="number"
                                                        defaultValue={String(data.originalValue)}
                                                        step="0.01"
                                                    />
                                                </FormField>
                                                <FormField label="Local Value">
                                                    <FormInput
                                                        type="number"
                                                        defaultValue={String(data.localValue)}
                                                        step="0.01"
                                                        readOnly
                                                    />
                                                </FormField>

                                                {/* Original Allocation */}
                                                <FormField label="Original Allocation Value">
                                                    <div className="flex gap-2">
                                                        <FormInput
                                                            type="number"
                                                            defaultValue={String(data.originalAlokasi)}
                                                            readOnly
                                                            className="flex-1"
                                                        />
                                                        <div className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 flex items-center justify-end font-medium">
                                                            {fmtCur(data.originalSisa)}
                                                        </div>
                                                    </div>
                                                </FormField>

                                                {/* Local Allocation */}
                                                <FormField label="Local Allocation Value">
                                                    <div className="flex gap-2">
                                                        <FormInput
                                                            type="number"
                                                            defaultValue={String(data.localAlokasi)}
                                                            readOnly
                                                            className="flex-1"
                                                        />
                                                        <div className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 flex items-center justify-end font-medium">
                                                            {fmtCur(data.localSisa)}
                                                        </div>
                                                    </div>
                                                </FormField>
                                            </div>
                                        </div>

                                        {/* Card: Informasi Bliyet */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">receipt</span>
                                                <h3 className="font-bold text-slate-800">Informasi Bliyet & Tanggal</h3>
                                            </div>
                                            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                                <FormField label="Jenis Bliyet">
                                                    <FormSelect defaultValue={data.jenisBliyet}>
                                                        <option value="BG">BG</option>
                                                        <option value="Transfer">Transfer</option>
                                                        <option value="Tunai">Tunai</option>
                                                        <option value="BATAL">BATAL</option>
                                                    </FormSelect>
                                                </FormField>
                                                <FormField label="Keterangan">
                                                    <FormInput
                                                        defaultValue={data.keterangan}
                                                        placeholder="Keterangan pembayaran..."
                                                    />
                                                </FormField>
                                                <FormField label="Tanggal Setor">
                                                    <FormInput type="date" defaultValue={data.tglSetor} />
                                                </FormField>
                                                <FormField label="Tanggal Jatuh Tempo">
                                                    <FormInput type="date" defaultValue={data.tglJatuhTempo} />
                                                </FormField>
                                                <FormField label="Tanggal Cair">
                                                    <FormInput type="date" defaultValue={data.tglCair} />
                                                </FormField>
                                                <FormField label="Sudah Cair ?">
                                                    <FormSelect defaultValue={data.sudahCair}>
                                                        <option value="Sudah Cair">Sudah Cair</option>
                                                        <option value="Belum Cair">Belum Cair</option>
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
                                                <h3 className="font-bold text-slate-800">Ringkasan</h3>
                                            </div>
                                            <div className="p-4 md:p-6 space-y-4">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500">Nilai Original</span>
                                                    <span className="font-semibold">{fmtCur(data.originalValue)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500">Terpakai (Alokasi)</span>
                                                    <span className="font-semibold text-primary">{fmtCur(data.originalAlokasi)}</span>
                                                </div>
                                                <div className="pt-4 border-t border-slate-100">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm md:text-base font-bold text-slate-900">Sisa</span>
                                                        <span className={`text-lg md:text-xl font-black ${data.originalSisa > 0 ? "text-amber-600" : "text-primary"}`}>
                                                            {fmtCur(data.originalSisa)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Cair status */}
                                                <div className={`mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold ${
                                                    data.sudahCair === "Sudah Cair"
                                                        ? "bg-green-50 text-green-700"
                                                        : "bg-amber-50 text-amber-700"
                                                }`}>
                                                    <span className="material-symbols-outlined !text-sm">
                                                        {data.sudahCair === "Sudah Cair" ? "check_circle" : "pending"}
                                                    </span>
                                                    {data.sudahCair}
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
                                                <button className="col-span-2 py-2 bg-white border border-primary/20 text-primary rounded text-xs font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-1">
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
                            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">account_tree</span>
                                            <h3 className="font-bold text-slate-800">
                                                Alokasi atas Penerimaan Pembayaran {data.noBukti}
                                            </h3>
                                        </div>
                                        <span className="text-xs text-slate-500">
                                            {data.alokasi.length} transaksi
                                        </span>
                                    </div>
                                    {data.alokasi.length > 0 ? (
                                        <>
                                            <div className="overflow-x-auto">
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
                                                        {data.alokasi.map((item, idx) => (
                                                            <tr key={idx} className="hover:bg-primary/5 transition-colors">
                                                                <td className="px-6 py-4 text-sm text-slate-500">{idx + 1}.</td>
                                                                <td className="px-6 py-4">
                                                                    <Link
                                                                        href="#"
                                                                        className="font-semibold text-primary text-sm tracking-tight hover:underline"
                                                                    >
                                                                        {item.transaksi}
                                                                    </Link>
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-slate-600">{item.tanggal}</td>
                                                                <td className="px-6 py-4 text-sm text-slate-600">{item.keterangan}</td>
                                                                <td className="px-6 py-4 text-sm font-bold text-right">{fmtCur(item.jumlah)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                    <tfoot>
                                                        <tr className="bg-slate-50 border-t border-primary/10">
                                                            <td colSpan={4} className="px-6 py-4 text-sm font-bold text-right text-slate-700">Total :</td>
                                                            <td className="px-6 py-4 text-sm font-black text-right text-primary">
                                                                {fmtCur(data.alokasi.reduce((s, a) => s + a.jumlah, 0))}
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-16 text-center">
                                            <span className="material-symbols-outlined text-5xl text-slate-300">account_tree</span>
                                            <p className="mt-3 text-sm text-slate-500">Belum ada data alokasi.</p>
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
