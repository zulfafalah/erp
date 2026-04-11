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
    tanggalDari: string;
    tanggalHingga: string;
    rowPerPage: number;
    user: string;
    module: string;
    event: string;
    grupKodeAkun: string;
    tampilan: string;
}

// --- Mock data options ---
const userOptions = [
    { label: ":: Semua User ::", value: "" },
    { label: "Administrator", value: "admin" },
    { label: "Supervisor", value: "spv" },
    { label: "Kasir 1", value: "kasir1" },
];

const moduleOptions = [
    { label: ":: Semua Module ::", value: "" },
    { label: "Pembelian", value: "pembelian" },
    { label: "Penjualan", value: "penjualan" },
    { label: "Persediaan", value: "persediaan" },
    { label: "Keuangan", value: "keuangan" },
    { label: "Akuntansi", value: "akuntansi" },
];

const eventOptions = [
    { label: ":: Semua Event ::", value: "" },
    { label: "Login", value: "login" },
    { label: "Input Data", value: "create" },
    { label: "Ubah Data", value: "update" },
    { label: "Hapus Data", value: "delete" },
];

const tampilanOptions = [
    { label: "Per Baris", value: "per_baris" },
    { label: "Summary", value: "summary" },
];

const grupKodeAkunOptions = [
    { label: ":: Semua Kode Akun ::", value: "" },
    { label: "1000 - Aktiva", value: "1000" },
    { label: "2000 - Kewajiban", value: "2000" },
    { label: "3000 - Ekuitas", value: "3000" },
    { label: "4000 - Pendapatan", value: "4000" },
];

const today = new Date();
const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const lastOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

const toDateInput = (d: Date) => d.toISOString().split("T")[0];

function UtilityReportContent() {
    const searchParams = useSearchParams();
    const reportType = searchParams.get("report") || "system-log";

    // Configuration for different report types
    const reportConfigs: Record<string, any> = {
        "system-log": {
            title: "Laporan Log File",
            desc: "Menampilkan catatan aktivitas sistem (log) berdasarkan pengguna, modul, dan event.",
            type: "log",
            columns: [
                { key: "tanggal", label: "Tanggal", align: "left" },
                { key: "waktu", label: "Waktu", align: "left" },
                { key: "user", label: "User", align: "left" },
                { key: "module", label: "Modul", align: "left" },
                { key: "event", label: "Event", align: "left" },
                { key: "keterangan", label: "Keterangan", align: "left" },
            ],
            data: [
                { tanggal: "2026-04-01", waktu: "08:15:30", user: "Administrator", module: "Login", event: "Login", keterangan: "User berhasil login" },
                { tanggal: "2026-04-02", waktu: "10:20:45", user: "Kasir 1", module: "Penjualan", event: "Input Data", keterangan: "Membuat Faktur Penjualan INV-001" },
                { tanggal: "2026-04-03", waktu: "14:10:12", user: "Supervisor", module: "Pembelian", event: "Ubah Data", keterangan: "Mengubah Nota Pembelian PIV2401-0002" },
            ]
        },
        "barcode-catalog": {
            title: "Laporan Barcode Catalog",
            desc: "Menampilkan katalog barcode berdasarkan grup kode akun.",
            type: "barcode",
            columns: [
                { key: "kodeBarang", label: "Kode Barang", align: "left" },
                { key: "barcode", label: "Barcode", align: "left" },
                { key: "namaBarang", label: "Nama Barang", align: "left" },
                { key: "grup", label: "Grup Kode Akun", align: "left" },
                { key: "satuan", label: "Satuan", align: "center" },
            ],
            data: [
                { kodeBarang: "B001", barcode: "8991234567890", namaBarang: "Produk A", grup: "1000 - Aktiva", satuan: "PCS" },
                { kodeBarang: "B002", barcode: "8990987654321", namaBarang: "Produk B", grup: "1000 - Aktiva", satuan: "BOX" },
                { kodeBarang: "B003", barcode: "8991122334455", namaBarang: "Sabun Cuci", grup: "2000 - Kewajiban", satuan: "DOS" },
            ]
        }
    };

    const config = reportConfigs[reportType] || reportConfigs["system-log"];

    const [params, setParams] = useState<ReportParams>({
        tanggalDari: toDateInput(firstOfMonth),
        tanggalHingga: toDateInput(lastOfMonth),
        rowPerPage: 20,
        user: "",
        module: "",
        event: "",
        grupKodeAkun: "",
        tampilan: "per_baris",
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
            tanggalDari: toDateInput(firstOfMonth),
            tanggalHingga: toDateInput(lastOfMonth),
            rowPerPage: 20,
            user: "",
            module: "",
            event: "",
            grupKodeAkun: "",
            tampilan: "per_baris",
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
                            <FormField label="Tanggal dari">
                                <FormInput type="date" value={params.tanggalDari} onChange={(e) => set("tanggalDari", e.target.value)} />
                            </FormField>
                            <FormField label="Hingga tanggal">
                                <FormInput type="date" value={params.tanggalHingga} onChange={(e) => set("tanggalHingga", e.target.value)} />
                            </FormField>
                            <FormField label="Row per page">
                                <FormInput type="number" value={String(params.rowPerPage)} onChange={(e) => set("rowPerPage", Number(e.target.value))} min={1} max={500} />
                            </FormField>

                            {reportType === "system-log" && (
                                <>
                                    <FormField label="User">
                                        <FormSelect value={params.user} onChange={(e) => set("user", e.target.value)}>
                                            {userOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                        </FormSelect>
                                    </FormField>
                                    <FormField label="Module">
                                        <FormSelect value={params.module} onChange={(e) => set("module", e.target.value)}>
                                            {moduleOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                        </FormSelect>
                                    </FormField>
                                    <FormField label="Event">
                                        <FormSelect value={params.event} onChange={(e) => set("event", e.target.value)}>
                                            {eventOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                        </FormSelect>
                                    </FormField>
                                    <FormField label="Tampilan">
                                        <FormSelect value={params.tampilan} onChange={(e) => set("tampilan", e.target.value)}>
                                            {tampilanOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                        </FormSelect>
                                    </FormField>
                                </>
                            )}

                            {reportType === "barcode-catalog" && (
                                <FormField label="Grup Kode Akun">
                                    <FormSelect value={params.grupKodeAkun} onChange={(e) => set("grupKodeAkun", e.target.value)}>
                                        {grupKodeAkunOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </FormSelect>
                                </FormField>
                            )}
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
                                        Periode: {params.tanggalDari} s/d {params.tanggalHingga}
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
                                                    {row[col.key]}
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

export default function UtilityReportsPage() {
    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            <Navbar />
            <main className="flex-1 flex overflow-hidden">
                <Sidebar />
                <Suspense fallback={<div className="flex-1 flex justify-center items-center"><span className="animate-spin material-symbols-outlined text-4xl text-primary">refresh</span></div>}>
                    <UtilityReportContent />
                </Suspense>
            </main>
            <StatusBar />
        </div>
    );
}
