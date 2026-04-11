"use client";

import { useState } from "react";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import FormField from "../../../components/FormField";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";

// --- Types ---
interface ReportParams {
    tanggalDari: string;
    tanggalHingga: string;
    rowPerPage: number;
    status: string;
    pemasok: string;
    produkDari: string;
    produkHingga: string;
    gudang: string;
    tampilan: string;
}

// --- Mock data options ---
const pemasokOptions = [
    { label: ":: Semua Pemasok ::", value: "" },
    { label: "TRIAL", value: "TRIAL" },
    { label: "CHUP", value: "CHUP" },
    { label: "UNILEVER", value: "UNILEVER" },
    { label: "BEKASI SQUARE", value: "BEKASI SQUARE" },
    { label: "CARREFOUR MATARAM", value: "CARREFOUR MATARAM" },
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
    { label: "Per Pemasok", value: "per_pemasok" },
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

// --- Page ---
export default function PurchaseInvoiceDetailReportPage() {
    const [params, setParams] = useState<ReportParams>({
        tanggalDari: toDateInput(firstOfMonth),
        tanggalHingga: toDateInput(lastOfMonth),
        rowPerPage: 20,
        status: "normal",
        pemasok: "",
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
            pemasok: "",
            produkDari: "",
            produkHingga: "",
            gudang: "",
            tampilan: "per_baris",
        });
        setShowPreview(false);
    };

    // --- Mock report data ---
    const reportRows = [
        { noNota: "PIV2401-0002", tanggal: "2026-04-02", pemasok: "TRIAL", outlet: "GKPK", produk: "Produk A", qty: 10, satuan: "PCS", harga: 4100, subtotal: 41000, status: "Approved" },
        { noNota: "PIV2401-0001", tanggal: "2026-04-14", pemasok: "CHUP", outlet: "GKPK", produk: "Produk B", qty: 3, satuan: "BOX", harga: 10385849, subtotal: 31157547, status: "Approved" },
        { noNota: "PIV2207-0001", tanggal: "2026-04-01", pemasok: "UNILEVER", outlet: "GKPK", produk: "Sabun Cuci", qty: 5, satuan: "DOS", harga: 110000, subtotal: 550000, status: "Approved" },
        { noNota: "PIV2206-0003", tanggal: "2026-04-30", pemasok: "UNILEVER", outlet: "GKPK", produk: "Sampo Kecantikan", qty: 12, satuan: "PCS", harga: 17997, subtotal: 215961, status: "Approved" },
        { noNota: "PIV2206-0002", tanggal: "2026-04-30", pemasok: "UNILEVER", outlet: "GKPK", produk: "Pelembab Kulit", qty: 8, satuan: "PCS", harga: 52651, subtotal: 421205, status: "Approved" },
        { noNota: "PIV2206-0001", tanggal: "2026-04-30", pemasok: "UNILEVER", outlet: "GKPK", produk: "Deterjen Cair", qty: 15, satuan: "BTL", harga: 73840, subtotal: 1107592, status: "Approved" },
    ];

    const grandTotal = reportRows.reduce((s, r) => s + r.subtotal, 0);
    const formatCurrency = (v: number) =>
        v.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            {/* Top Navigation Bar */}
            <Navbar />

            <main className="flex-1 flex overflow-hidden">
                {/* Sidebar Navigation */}
                <Sidebar />

                {/* Main Content Area */}
                <section className="flex-1 flex flex-col bg-background-light overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-28 md:pb-8 space-y-6 md:space-y-8">
                        {/* Page Header */}
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                                Laporan Detil Nota Pembelian Barang
                            </h2>
                            <p className="text-slate-500 mt-1">
                                Filter dan tampilkan laporan detail pembelian (PIV) berdasarkan periode, pemasok, produk, dan outlet.
                            </p>
                        </div>

                        {/* Filter Card */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            {/* Card Header */}
                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/60">
                                <span className="material-symbols-outlined text-primary">tune</span>
                                <h3 className="font-bold text-slate-800">Parameter Laporan</h3>
                            </div>

                            {/* Card Body */}
                            <div className="p-4 md:p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                    {/* Tanggal dari */}
                                    <FormField label="Tanggal Dari">
                                        <FormInput
                                            type="date"
                                            value={params.tanggalDari}
                                            onChange={(e) => set("tanggalDari", e.target.value)}
                                        />
                                    </FormField>

                                    {/* Hingga Tanggal */}
                                    <FormField label="Hingga Tanggal">
                                        <FormInput
                                            type="date"
                                            value={params.tanggalHingga}
                                            onChange={(e) => set("tanggalHingga", e.target.value)}
                                        />
                                    </FormField>

                                    {/* Row per page */}
                                    <FormField label="Row per Page">
                                        <FormInput
                                            type="number"
                                            value={String(params.rowPerPage)}
                                            onChange={(e) => set("rowPerPage", Number(e.target.value))}
                                            min={1}
                                            max={500}
                                        />
                                    </FormField>

                                    {/* Status */}
                                    <FormField label="Status">
                                        <FormSelect
                                            value={params.status}
                                            onChange={(e) => set("status", e.target.value)}
                                        >
                                            {statusOptions.map((o) => (
                                                <option key={o.value} value={o.value}>
                                                    {o.label}
                                                </option>
                                            ))}
                                        </FormSelect>
                                    </FormField>

                                    {/* Pemasok */}
                                    <FormField label="Pemasok">
                                        <FormSelect
                                            value={params.pemasok}
                                            onChange={(e) => set("pemasok", e.target.value)}
                                        >
                                            {pemasokOptions.map((o) => (
                                                <option key={o.value} value={o.value}>
                                                    {o.label}
                                                </option>
                                            ))}
                                        </FormSelect>
                                    </FormField>

                                    {/* Gudang */}
                                    <FormField label="Gudang / Outlet">
                                        <FormSelect
                                            value={params.gudang}
                                            onChange={(e) => set("gudang", e.target.value)}
                                        >
                                            {gudangOptions.map((o) => (
                                                <option key={o.value} value={o.value}>
                                                    {o.label}
                                                </option>
                                            ))}
                                        </FormSelect>
                                    </FormField>

                                    {/* Produk Dari */}
                                    <ProductSearchField
                                        label="Produk (Dari)"
                                        value={params.produkDari}
                                        onChange={(v) => set("produkDari", v)}
                                    />

                                    {/* Produk Hingga */}
                                    <ProductSearchField
                                        label="Produk (Hingga)"
                                        value={params.produkHingga}
                                        onChange={(v) => set("produkHingga", v)}
                                    />

                                    {/* Tampilan */}
                                    <FormField label="Tampilan">
                                        <FormSelect
                                            value={params.tampilan}
                                            onChange={(e) => set("tampilan", e.target.value)}
                                        >
                                            {tampilanOptions.map((o) => (
                                                <option key={o.value} value={o.value}>
                                                    {o.label}
                                                </option>
                                            ))}
                                        </FormSelect>
                                    </FormField>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-slate-100">
                                    <button
                                        id="btn-preview-report"
                                        onClick={handlePreview}
                                        disabled={isPreviewLoading}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {isPreviewLoading ? (
                                            <>
                                                <span className="material-symbols-outlined text-base animate-spin">refresh</span>
                                                Memproses...
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-base">preview</span>
                                                Preview
                                            </>
                                        )}
                                    </button>
                                    <button
                                        id="btn-reset-report"
                                        onClick={handleReset}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all"
                                    >
                                        <span className="material-symbols-outlined text-base">refresh</span>
                                        Reset
                                    </button>
                                    {showPreview && (
                                        <button
                                            id="btn-print-report"
                                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-primary/20 text-primary rounded-lg text-sm font-semibold hover:border-primary hover:bg-primary/5 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-base">print</span>
                                            Cetak
                                        </button>
                                    )}
                                    {showPreview && (
                                        <button
                                            id="btn-export-report"
                                            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-base">download</span>
                                            Export Excel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Report Preview */}
                        {showPreview && (
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                {/* Preview Header */}
                                <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">receipt_long</span>
                                        <div>
                                            <h3 className="font-bold text-slate-800">
                                                Laporan Detil Nota Pembelian Barang
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                Periode: {params.tanggalDari} s/d {params.tanggalHingga} ·{" "}
                                                {params.pemasok
                                                    ? pemasokOptions.find((p) => p.value === params.pemasok)?.label
                                                    : "Semua Pemasok"}{" "}
                                                ·{" "}
                                                {params.gudang
                                                    ? gudangOptions.find((g) => g.value === params.gudang)?.label
                                                    : "Semua Gudang/Outlet"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {reportRows.length} baris
                                        </span>
                                    </div>
                                </div>

                                {/* Mobile Card View */}
                                <div className="block md:hidden divide-y divide-primary/5">
                                    {reportRows.map((row, idx) => (
                                        <div key={idx} className="p-4 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold text-primary text-sm">{row.noNota}</p>
                                                    <p className="text-xs text-slate-500 mt-0.5">{row.tanggal} · {row.outlet}</p>
                                                </div>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {row.status}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{row.pemasok}</p>
                                                <p className="text-xs text-slate-500">{row.produk}</p>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                                <div>
                                                    <p className="text-xs text-slate-400">Qty</p>
                                                    <span className="text-sm font-semibold">{row.qty} {row.satuan}</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-400">Subtotal</p>
                                                    <span className="text-sm font-bold">Rp {formatCurrency(row.subtotal)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Mobile Grand Total */}
                                    <div className="p-4 bg-slate-50 flex justify-between items-center">
                                        <span className="text-sm font-bold text-slate-900">Grand Total</span>
                                        <span className="text-base font-black text-primary">
                                            Rp {formatCurrency(grandTotal)}
                                        </span>
                                    </div>
                                </div>

                                {/* Desktop Table View */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-primary/10">
                                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">#</th>
                                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">No. Nota</th>
                                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Tanggal</th>
                                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Pemasok</th>
                                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Outlet</th>
                                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Produk</th>
                                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Qty</th>
                                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Satuan</th>
                                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Harga</th>
                                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Subtotal</th>
                                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-primary/5">
                                            {reportRows.map((row, idx) => (
                                                <tr key={idx} className="hover:bg-primary/5 transition-colors">
                                                    <td className="px-4 py-3 text-sm text-slate-400">{idx + 1}</td>
                                                    <td className="px-4 py-3">
                                                        <span className="font-semibold text-primary text-sm tracking-tight">
                                                            {row.noNota}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">{row.tanggal}</td>
                                                    <td className="px-4 py-3 text-sm font-medium">{row.pemasok}</td>
                                                    <td className="px-4 py-3 text-sm">{row.outlet}</td>
                                                    <td className="px-4 py-3 text-sm">{row.produk}</td>
                                                    <td className="px-4 py-3 text-sm text-center">{row.qty}</td>
                                                    <td className="px-4 py-3 text-sm text-slate-500">{row.satuan}</td>
                                                    <td className="px-4 py-3 text-sm font-semibold text-right">
                                                        {formatCurrency(row.harga)}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-bold text-right">
                                                        {formatCurrency(row.subtotal)}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            {row.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="bg-slate-50 border-t-2 border-primary/10">
                                                <td colSpan={9} className="px-4 py-3 text-sm font-bold text-slate-700 text-right">
                                                    Grand Total
                                                </td>
                                                <td className="px-4 py-3 text-base font-black text-primary text-right">
                                                    {formatCurrency(grandTotal)}
                                                </td>
                                                <td />
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
                                        <button className="p-2 border border-primary/10 rounded hover:bg-white disabled:opacity-50" disabled>
                                            <span className="material-symbols-outlined text-lg">chevron_left</span>
                                        </button>
                                        <button className="px-3 py-1 bg-primary text-white rounded text-sm font-bold">1</button>
                                        <button className="p-2 border border-primary/10 rounded hover:bg-white disabled:opacity-50" disabled>
                                            <span className="material-symbols-outlined text-lg">chevron_right</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Empty state when not yet previewed */}
                        {!showPreview && !isPreviewLoading && (
                            <div className="bg-white rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center py-16 px-4 text-center">
                                <span className="material-symbols-outlined text-5xl text-slate-300">description</span>
                                <p className="mt-3 text-slate-500 font-medium">Belum ada data laporan</p>
                                <p className="mt-1 text-sm text-slate-400">
                                    Atur parameter di atas dan klik <strong>Preview</strong> untuk melihat laporan.
                                </p>
                            </div>
                        )}

                        {/* Loading state */}
                        {isPreviewLoading && (
                            <div className="bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center py-16 px-4">
                                <span className="material-symbols-outlined text-5xl text-primary animate-spin">refresh</span>
                                <p className="mt-3 text-slate-600 font-medium">Memuat data laporan...</p>
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
