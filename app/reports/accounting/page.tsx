"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import FormField from "../../components/FormField";
import FormInput from "../../components/FormInput";
import FormSelect from "../../components/FormSelect";

// --- Types ---
interface ReportParams {
    perTanggal: string; // YYYY-MM
    tanggalDari: string;
    tanggalHingga: string;
    rowPerPage: number;
    subTotal: string;
    kodeAkunDari: string;
    kodeAkunHingga: string;
    noJournalDari: string;
    noJournalHingga: string;
    penjual: string;
    pelanggan: string;
}

// --- Mock data options ---
const kodeAkunOptions = [
    { label: ":: Semua Kode Akun ::", value: "" },
    { label: "1110 - Kas Kecil", value: "1110" },
    { label: "1120 - Bank BCA", value: "1120" },
    { label: "1210 - Piutang Dagang", value: "1210" },
    { label: "2110 - Hutang Dagang", value: "2110" },
    { label: "4110 - Penjualan Produk", value: "4110" },
    { label: "6110 - Biaya Listrik & Air", value: "6110" },
];

const subTotalOptions = [
    { label: "Tidak", value: "tidak" },
    { label: "Ya", value: "ya" },
];

const penjualOptions = [
    { label: ":: Semua Penjual ::", value: "" },
    { label: "Sales 1", value: "sales_1" },
    { label: "Sales 2", value: "sales_2" },
];

const pelangganOptions = [
    { label: ":: Semua Pelanggan ::", value: "" },
    { label: "Pelanggan A", value: "pelanggan_a" },
    { label: "Pelanggan B", value: "pelanggan_b" },
];

const today = new Date();
const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const lastOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

const toDateInput = (d: Date) => d.toISOString().split("T")[0];
const toMonthInput = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

// --- Helpers ---
function JournalSearchField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (val: string) => void;
}) {
    return (
        <FormField label={label}>
            <div className="flex items-center gap-1.5">
                <FormInput
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1"
                />
                <button
                    type="button"
                    title="Cari"
                    className="flex items-center justify-center size-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all"
                >
                    <span className="material-symbols-outlined text-base">search</span>
                </button>
                <button
                    type="button"
                    title="Hapus"
                    onClick={() => onChange("")}
                    className="flex items-center justify-center size-8 rounded-lg border border-red-200 bg-white text-red-400 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all"
                >
                    <span className="material-symbols-outlined text-base">close</span>
                </button>
            </div>
        </FormField>
    );
}

const formatCurrency = (v: number) =>
    v.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function ReportContent() {
    const searchParams = useSearchParams();
    const reportType = searchParams.get("report") || "default";

    // Configuration for different report types
    const reportConfigs: Record<string, any> = {
        "general-ledger": {
            title: "Laporan Buku Besar",
            desc: "Filter dan tampilkan laporan buku besar berdasarkan periode.",
            type: "ledger",
            columns: [
                { key: "tanggal", label: "Tanggal", align: "left" },
                { key: "noJournal", label: "No. Journal", align: "left" },
                { key: "akun", label: "Akun", align: "left" },
                { key: "keterangan", label: "Keterangan", align: "left" },
                { key: "debit", label: "Debit", align: "right", render: (r: any) => formatCurrency(r.debit) },
                { key: "kredit", label: "Kredit", align: "right", render: (r: any) => formatCurrency(r.kredit) },
                { key: "saldo", label: "Saldo", align: "right", render: (r: any) => formatCurrency(r.saldo) },
            ],
            data: [
                { tanggal: "2026-04-01", noJournal: "JV2604-001", akun: "1110 - Kas Kecil", keterangan: "Saldo Awal", debit: 5000000, kredit: 0, saldo: 5000000 },
                { tanggal: "2026-04-05", noJournal: "JV2604-002", akun: "1110 - Kas Kecil", keterangan: "Biaya Operasional", debit: 0, kredit: 500000, saldo: 4500000 },
            ],
            grandTotalKey: "saldo"
        },
        "default": {
            title: "Laporan Akuntansi",
            desc: "Filter dan tampilkan laporan akuntansi per periode bulan.",
            type: "monthly",
            columns: [
                { key: "akun", label: "Akun", align: "left" },
                { key: "keterangan", label: "Keterangan", align: "left" },
                { key: "debit", label: "Debit", align: "right", render: (r: any) => formatCurrency(r.debit) },
                { key: "kredit", label: "Kredit", align: "right", render: (r: any) => formatCurrency(r.kredit) },
            ],
            data: [
                { akun: "1110 - Kas Kecil", keterangan: "Kas Kantor", debit: 5000000, kredit: 500000 },
                { akun: "1120 - Bank BCA", keterangan: "Rekening Utama", debit: 15000000, kredit: 0 },
            ],
            grandTotalKey: "debit"
        }
    };

    const config = reportConfigs[reportType] || reportConfigs["default"];
    const isLedger = reportType === "general-ledger";

    // Provide default mappings for other mapped reports
    if (!reportConfigs[reportType]) {
        config.title = "Laporan " + reportType.replace(/-/g, " ");
    }

    const [params, setParams] = useState<ReportParams>({
        perTanggal: toMonthInput(today),
        tanggalDari: toDateInput(firstOfMonth),
        tanggalHingga: toDateInput(lastOfMonth),
        rowPerPage: 20,
        subTotal: "tidak",
        kodeAkunDari: "",
        kodeAkunHingga: "",
        noJournalDari: "",
        noJournalHingga: "",
        penjual: "",
        pelanggan: "",
    });

    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const set = <K extends keyof ReportParams>(key: K, value: ReportParams[K]) =>
        setParams((prev) => ({ ...prev, [key]: value }));

    const handlePreview = () => {
        setIsPreviewLoading(true);
        setTimeout(() => {
            setIsPreviewLoading(false);
            setShowPreview(true);
        }, 800);
    };

    const handleReset = () => {
        setParams({
            perTanggal: toMonthInput(today),
            tanggalDari: toDateInput(firstOfMonth),
            tanggalHingga: toDateInput(lastOfMonth),
            rowPerPage: 20,
            subTotal: "tidak",
            kodeAkunDari: "",
            kodeAkunHingga: "",
            noJournalDari: "",
            noJournalHingga: "",
            penjual: "",
            pelanggan: "",
        });
        setShowPreview(false);
    };

    const reportRows = config.data;

    return (
        <section className="flex-1 flex flex-col bg-background-light overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-28 md:pb-8 space-y-6 md:space-y-8">
                {/* Page Header */}
                <div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 capitalize">
                        {config.title}
                    </h2>
                    <p className="text-slate-500 mt-1 capitalize">
                        {config.desc}
                    </p>
                </div>

                {/* Filter Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/60">
                        <span className="material-symbols-outlined text-primary">tune</span>
                        <h3 className="font-bold text-slate-800">Parameter Laporan</h3>
                    </div>

                    <div className="p-4 md:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {isLedger ? (
                                <>
                                    <FormField label="Tanggal dari">
                                        <FormInput type="date" value={params.tanggalDari} onChange={(e) => set("tanggalDari", e.target.value)} />
                                    </FormField>
                                    <FormField label="Hingga tanggal">
                                        <FormInput type="date" value={params.tanggalHingga} onChange={(e) => set("tanggalHingga", e.target.value)} />
                                    </FormField>
                                </>
                            ) : (
                                <FormField label="Per Tanggal">
                                    <div className="flex items-center gap-2">
                                        <FormInput type="month" value={params.perTanggal} onChange={(e) => set("perTanggal", e.target.value)} className="flex-1" />
                                        <span className="text-xs text-slate-500 italic">*Tgl 1 setiap periode bulannya</span>
                                    </div>
                                </FormField>
                            )}

                            <FormField label="Row per page">
                                <FormInput type="number" value={String(params.rowPerPage)} onChange={(e) => set("rowPerPage", Number(e.target.value))} min={1} max={500} />
                            </FormField>
                            <FormField label="Add Sub Total">
                                <FormSelect value={params.subTotal} onChange={(e) => set("subTotal", e.target.value)}>
                                    {subTotalOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </FormSelect>
                            </FormField>
                            <FormField label="Kode Akun">
                                <FormSelect value={params.kodeAkunDari} onChange={(e) => set("kodeAkunDari", e.target.value)}>
                                    {kodeAkunOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </FormSelect>
                            </FormField>
                            <FormField label="s/d Kode Akun">
                                <FormSelect value={params.kodeAkunHingga} onChange={(e) => set("kodeAkunHingga", e.target.value)}>
                                    {kodeAkunOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </FormSelect>
                            </FormField>

                            <JournalSearchField label="No. Journal" value={params.noJournalDari} onChange={(v) => set("noJournalDari", v)} />
                            <JournalSearchField label="Hingga No. Journal" value={params.noJournalHingga} onChange={(v) => set("noJournalHingga", v)} />

                            <FormField label="Penjual">
                                <FormSelect value={params.penjual} onChange={(e) => set("penjual", e.target.value)}>
                                    {penjualOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </FormSelect>
                            </FormField>
                            <FormField label="Pelanggan">
                                <FormSelect value={params.pelanggan} onChange={(e) => set("pelanggan", e.target.value)}>
                                    {pelangganOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </FormSelect>
                            </FormField>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-slate-100">
                            <button onClick={handlePreview} disabled={isPreviewLoading} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed">
                                {isPreviewLoading ? <><span className="material-symbols-outlined text-base animate-spin">refresh</span> Memproses...</> : <><span className="material-symbols-outlined text-base">preview</span> Preview</>}
                            </button>
                            <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all">
                                <span className="material-symbols-outlined text-base">refresh</span> Reset
                            </button>
                            {showPreview && (
                                <>
                                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-primary/20 text-primary rounded-lg text-sm font-semibold hover:border-primary hover:bg-primary/5 transition-all">
                                        <span className="material-symbols-outlined text-base">print</span> Cetak
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-all">
                                        <span className="material-symbols-outlined text-base">download</span> Export Excel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Report Preview */}
                {showPreview && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">receipt_long</span>
                                <div>
                                    <h3 className="font-bold text-slate-800 capitalize">{config.title}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {isLedger 
                                            ? `Periode: ${params.tanggalDari} s/d ${params.tanggalHingga}` 
                                            : `Periode: Bulan ${params.perTanggal}`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {reportRows.length} data
                                </span>
                            </div>
                        </div>

                        {/* Desktop Table View */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-primary/10">
                                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 w-12 text-center">#</th>
                                        {config.columns.map((col: any, idx: number) => (
                                            <th key={idx} className={`px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-${col.align || 'left'}`}>
                                                {col.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-primary/5">
                                    {reportRows.map((row: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-primary/5 transition-colors">
                                            <td className="px-4 py-3 text-sm text-slate-400 text-center">{idx + 1}</td>
                                            {config.columns.map((col: any, colIdx: number) => (
                                                <td key={colIdx} className={`px-4 py-3 text-sm text-${col.align || 'left'}`}>
                                                    {col.render ? col.render(row) : row[col.key]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-4 md:px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                            <p className="text-sm text-slate-500 text-center md:text-left">
                                Menampilkan 1 sampai {Math.min(params.rowPerPage, reportRows.length)} dari {reportRows.length} data
                            </p>
                            <div className="flex flex-wrap justify-center items-center gap-1">
                                <button className="p-2 border border-primary/10 rounded hover:bg-white disabled:opacity-50" disabled><span className="material-symbols-outlined text-lg">chevron_left</span></button>
                                <button className="px-3 py-1 bg-primary text-white rounded text-sm font-bold">1</button>
                                <button className="p-2 border border-primary/10 rounded hover:bg-white disabled:opacity-50" disabled><span className="material-symbols-outlined text-lg">chevron_right</span></button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty states */}
                {!showPreview && !isPreviewLoading && (
                    <div className="bg-white rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center py-16 px-4 text-center">
                        <span className="material-symbols-outlined text-5xl text-slate-300">description</span>
                        <p className="mt-3 text-slate-500 font-medium">Belum ada data laporan</p>
                    </div>
                )}
                {isPreviewLoading && (
                    <div className="bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center py-16 px-4">
                        <span className="material-symbols-outlined text-5xl text-primary animate-spin">refresh</span>
                        <p className="mt-3 text-slate-600 font-medium">Memuat data laporan...</p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default function AccountingReportsPage() {
    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            <Navbar />
            <main className="flex-1 flex overflow-hidden">
                <Sidebar />
                <Suspense fallback={<div className="flex-1 flex justify-center items-center"><span className="animate-spin material-symbols-outlined text-4xl text-primary">refresh</span></div>}>
                    <ReportContent />
                </Suspense>
            </main>
            <StatusBar />
        </div>
    );
}
