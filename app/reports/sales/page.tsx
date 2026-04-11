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
    status: string;
    pelanggan: string;
    produkDari: string;
    produkHingga: string;
    gudang: string;
    tampilan: string;
}

// --- Mock data options ---
const pelangganOptions = [
    { label: ":: Semua Pelanggan ::", value: "" },
    { label: "UMUM", value: "UMUM" },
    { label: "PT MAJU BERSAMA", value: "PT MAJU BERSAMA" },
    { label: "TOKO SEJAHTERA", value: "TOKO SEJAHTERA" },
    { label: "CV ABADI JAYA", value: "CV ABADI JAYA" },
];

const gudangOptions = [
    { label: ":: Semua Gudang/Outlet ::", value: "" },
    { label: "GKPK", value: "GKPK" },
    { label: "GOOPC7", value: "GOOPC7" },
    { label: "GOOPA8", value: "GOOPA8" },
];

const statusOptions = [
    { label: "Normal", value: "normal" },
    { label: "Approved", value: "approved" },
    { label: "Pending", value: "pending" },
    { label: "Draft", value: "draft" },
    { label: "Closed", value: "closed" },
];

const tampilanOptions = [
    { label: "Per Baris", value: "per_baris" },
    { label: "Per Nota", value: "per_nota" },
    { label: "Per Pelanggan", value: "per_pelanggan" },
];

const today = new Date();
const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const lastOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

const toDateInput = (d: Date) => d.toISOString().split("T")[0];

// --- Helpers ---
function ProductSearchField({
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
                    placeholder="Pilih produk..."
                    className="flex-1"
                />
                <button
                    type="button"
                    title="Cari Produk"
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
    const reportType = searchParams.get("report") || "sales-detail";

    // Configuration for different report types
    const reportConfigs: Record<string, any> = {
        "sales-detail": {
            title: "Laporan Detil Penjualan",
            desc: "Filter dan tampilkan laporan detail penjualan berdasarkan periode, pelanggan, produk, dan outlet.",
            type: "detail",
            columns: [
                { key: "noNota", label: "No. Nota", align: "left" },
                { key: "tanggal", label: "Tanggal", align: "left" },
                { key: "pelanggan", label: "Pelanggan", align: "left" },
                { key: "outlet", label: "Outlet", align: "left" },
                { key: "produk", label: "Produk", align: "left" },
                { key: "qty", label: "Qty", align: "center", render: (r: any) => `${r.qty} ${r.satuan}` },
                { key: "harga", label: "Harga", align: "right", render: (r: any) => formatCurrency(r.harga) },
                { key: "subtotal", label: "Subtotal", align: "right", render: (r: any) => formatCurrency(r.subtotal) },
                { key: "status", label: "Status", align: "center" },
            ],
            data: [
                { noNota: "SI2401-0002", tanggal: "2026-04-02", pelanggan: "UMUM", outlet: "GKPK", produk: "Produk A", qty: 10, satuan: "PCS", harga: 5000, subtotal: 50000, status: "Approved" },
                { noNota: "SI2401-0001", tanggal: "2026-04-14", pelanggan: "PT MAJU BERSAMA", outlet: "GKPK", produk: "Produk B", qty: 3, satuan: "BOX", harga: 12000000, subtotal: 36000000, status: "Approved" },
                { noNota: "SI2207-0001", tanggal: "2026-04-01", pelanggan: "TOKO SEJAHTERA", outlet: "GKPK", produk: "Barang C", qty: 5, satuan: "DOS", harga: 150000, subtotal: 750000, status: "Approved" },
            ],
            grandTotalKey: "subtotal"
        },
        "sales-summary": {
            title: "Laporan Rekapitulasi Penjualan",
            desc: "Filter dan tampilkan rekapitulasi penjualan berdasarkan periode, pelanggan, dan outlet.",
            type: "summary",
            columns: [
                { key: "noNota", label: "No. Nota", align: "left" },
                { key: "tanggal", label: "Tanggal", align: "left" },
                { key: "pelanggan", label: "Pelanggan", align: "left" },
                { key: "outlet", label: "Outlet", align: "left" },
                { key: "totalItem", label: "Total Item", align: "center", render: (r: any) => `${r.totalItem} Item` },
                { key: "totalHarga", label: "Total Penjualan", align: "right", render: (r: any) => formatCurrency(r.totalHarga) },
                { key: "status", label: "Status", align: "center" },
            ],
            data: [
                { noNota: "SI2401-0002", tanggal: "2026-04-02", pelanggan: "UMUM", outlet: "GKPK", totalItem: 5, totalHarga: 50000, status: "Approved" },
                { noNota: "SI2401-0001", tanggal: "2026-04-14", pelanggan: "PT MAJU BERSAMA", outlet: "GKPK", totalItem: 3, totalHarga: 36000000, status: "Approved" },
            ],
            grandTotalKey: "totalHarga"
        },
        // Fallback for others
        "default": {
            title: "Laporan Penjualan",
            desc: "Laporan data penjualan",
            type: "summary",
            columns: [
                { key: "noNota", label: "No. Nota", align: "left" },
                { key: "tanggal", label: "Tanggal", align: "left" },
                { key: "pelanggan", label: "Pelanggan", align: "left" },
                { key: "totalHarga", label: "Total Penjualan", align: "right", render: (r: any) => formatCurrency(r.totalHarga) },
            ],
            data: [
                { noNota: "SO2401-0001", tanggal: "2026-04-10", pelanggan: "UMUM", totalHarga: 500000 }
            ],
            grandTotalKey: "totalHarga"
        }
    };

    let config = reportConfigs[reportType];
    
    // Provide default mappings for other mapped reports
    if (!config) {
        config = { ...reportConfigs["default"] };
        let generatedTitle = reportType.replace(/-/g, " ");
        generatedTitle = generatedTitle.replace(/sales/gi, "penjualan").replace(/return/gi, "retur").replace(/order/gi, "pesanan");

        if (reportType.includes("detail")) {
            config.title = "Laporan Dirinci " + generatedTitle.replace(/detail/gi, "");
            config.type = "detail";
        } else if (reportType.includes("summary")) {
            config.title = "Laporan Rekapitulasi " + generatedTitle.replace(/summary/gi, "");
            config.type = "summary";
        } else {
            config.title = "Laporan " + generatedTitle;
        }
        
        // Capitalize words
        config.title = config.title.replace(/\b\w/g, (c: string) => c.toUpperCase());
    }

    const [params, setParams] = useState<ReportParams>({
        tanggalDari: toDateInput(firstOfMonth),
        tanggalHingga: toDateInput(lastOfMonth),
        rowPerPage: 20,
        status: "normal",
        pelanggan: "",
        produkDari: "",
        produkHingga: "",
        gudang: "",
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
            status: "normal",
            pelanggan: "",
            produkDari: "",
            produkHingga: "",
            gudang: "",
            tampilan: "per_baris",
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            <FormField label="Tanggal Dari">
                                <FormInput type="date" value={params.tanggalDari} onChange={(e) => set("tanggalDari", e.target.value)} />
                            </FormField>
                            <FormField label="Hingga Tanggal">
                                <FormInput type="date" value={params.tanggalHingga} onChange={(e) => set("tanggalHingga", e.target.value)} />
                            </FormField>
                            <FormField label="Row per Page">
                                <FormInput type="number" value={String(params.rowPerPage)} onChange={(e) => set("rowPerPage", Number(e.target.value))} min={1} max={500} />
                            </FormField>
                            <FormField label="Status">
                                <FormSelect value={params.status} onChange={(e) => set("status", e.target.value)}>
                                    {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </FormSelect>
                            </FormField>
                            <FormField label="Pelanggan">
                                <FormSelect value={params.pelanggan} onChange={(e) => set("pelanggan", e.target.value)}>
                                    {pelangganOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </FormSelect>
                            </FormField>
                            <FormField label="Gudang / Outlet">
                                <FormSelect value={params.gudang} onChange={(e) => set("gudang", e.target.value)}>
                                    {gudangOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </FormSelect>
                            </FormField>
                            <ProductSearchField label="Produk (Dari)" value={params.produkDari} onChange={(v) => set("produkDari", v)} />
                            <ProductSearchField label="Produk (Hingga)" value={params.produkHingga} onChange={(v) => set("produkHingga", v)} />
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
                                        Periode: {params.tanggalDari} s/d {params.tanggalHingga} · {params.pelanggan ? pelangganOptions.find((p) => p.value === params.pelanggan)?.label : "Semua Pelanggan"}
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
                                                <td key={colIdx} className={`px-4 py-3 text-sm text-${col.align || 'left'} ${col.key === 'noNota' ? 'font-semibold text-primary' : ''} ${col.key === 'status' ? 'text-center' : ''}`}>
                                                    {col.key === 'status' ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            {row.status}
                                                        </span>
                                                    ) : col.render ? col.render(row) : row[col.key]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-slate-50 border-t-2 border-primary/10">
                                        <td colSpan={config.columns.length - 1} className="px-4 py-3 text-sm font-bold text-slate-700 text-right">
                                            Grand Total
                                        </td>
                                        <td className="px-4 py-3 text-base font-black text-primary text-right" colSpan={2}>
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

export default function SalesReportsPage() {
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
