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
    tampilan: string;
}

const tampilanOptions = [
    { label: "Per Baris", value: "Per Baris" },
    { label: "Per Nota", value: "Per Nota" },
];

const formatCurrency = (v: number) =>
    v.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function ReportContent() {
    const searchParams = useSearchParams();
    const reportType = searchParams.get("report") || "customer-deposit-allocation";

    const reportConfigs: Record<string, any> = {
        "customer-deposit-allocation": {
            title: "Laporan Alokasi Dana atas Deposit dari Pelanggan",
            desc: "Laporan alokasi dana atas deposit yang diterima dari pelanggan (Customer Deposit).",
            columns: [
                { key: "noBukti", label: "No. Bukti", align: "left" },
                { key: "tanggal", label: "Tanggal", align: "left" },
                { key: "pelanggan", label: "Pelanggan", align: "left" },
                { key: "keterangan", label: "Keterangan", align: "left" },
                { key: "nominal", label: "Nominal", align: "right", render: (r: any) => formatCurrency(r.nominal) },
            ],
            data: [
                { noBukti: "CDA2604-001", tanggal: "2026-04-10", pelanggan: "PT. ABC", keterangan: "Deposit untuk pesanan PO-001", nominal: 5000000 },
                { noBukti: "CDA2604-002", tanggal: "2026-04-12", pelanggan: "CV. Makmur", keterangan: "Uang muka proyek", nominal: 10000000 },
            ],
            grandTotalKey: "nominal"
        },
        "supplier-deposit-allocation": {
            title: "Laporan Alokasi Dana atas Deposit ke Pemasok",
            desc: "Laporan alokasi dana atas deposit yang dibayarkan ke pemasok (Supplier Deposit).",
            columns: [
                { key: "noBukti", label: "No. Bukti", align: "left" },
                { key: "tanggal", label: "Tanggal", align: "left" },
                { key: "pemasok", label: "Pemasok", align: "left" },
                { key: "keterangan", label: "Keterangan", align: "left" },
                { key: "nominal", label: "Nominal", align: "right", render: (r: any) => formatCurrency(r.nominal) },
            ],
            data: [
                { noBukti: "SDA2604-001", tanggal: "2026-04-05", pemasok: "PT. Gudang Garam", keterangan: "DP Barang Mentah", nominal: 15000000 },
            ],
            grandTotalKey: "nominal"
        },
        "default": {
            title: "Laporan Keuangan",
            desc: "Laporan data keuangan",
            columns: [
                { key: "noRef", label: "No Referensi", align: "left" },
                { key: "tanggal", label: "Tanggal", align: "left" },
                { key: "total", label: "Total", align: "right", render: (r: any) => formatCurrency(r.total) },
            ],
            data: [
                { noRef: "REF-001", tanggal: "2026-04-10", total: 500000 }
            ],
            grandTotalKey: "total"
        }
    };

    const config = reportConfigs[reportType] || reportConfigs["default"];

    const [params, setParams] = useState<ReportParams>({
        tanggalDari: "2026-04-01",
        tanggalHingga: "2026-04-30",
        rowPerPage: 20,
        tampilan: "Per Baris",
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
            tanggalDari: "2026-04-01",
            tanggalHingga: "2026-04-30",
            rowPerPage: 20,
            tampilan: "Per Baris",
        });
        setShowPreview(false);
    };

    const reportRows = config.data;
    const grandTotal = reportRows.reduce((sum: number, row: any) => sum + (row[config.grandTotalKey] || 0), 0);

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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:w-3/4 xl:w-2/3">
                            <FormField label="Tanggal dari">
                                <FormInput type="date" value={params.tanggalDari} onChange={(e) => set("tanggalDari", e.target.value)} />
                            </FormField>
                            <FormField label="Hingga tanggal">
                                <FormInput type="date" value={params.tanggalHingga} onChange={(e) => set("tanggalHingga", e.target.value)} />
                            </FormField>
                            <FormField label="Row per page">
                                <FormInput type="number" value={String(params.rowPerPage)} onChange={(e) => set("rowPerPage", Number(e.target.value))} min={1} max={500} />
                            </FormField>
                            <FormField label="Tampilan">
                                <FormSelect value={params.tampilan} onChange={(e) => set("tampilan", e.target.value)}>
                                    {tampilanOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
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
                                                <td key={colIdx} className={`px-4 py-3 text-sm text-${col.align || 'left'} ${col.key === 'noBukti' ? 'font-semibold text-primary' : ''}`}>
                                                    {col.render ? col.render(row) : row[col.key]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-slate-50 border-t-2 border-primary/10">
                                        <td colSpan={config.columns.length} className="px-4 py-3 text-sm font-bold text-slate-700 text-right">
                                            Grand Total
                                        </td>
                                        <td className="px-4 py-3 text-base font-black text-primary text-right">
                                            Rp {formatCurrency(grandTotal)}
                                        </td>
                                    </tr>
                                </tfoot>
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

export default function FinancialReportsPage() {
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
