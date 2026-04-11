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
    { label: "Lokal", value: "lokal" },
    { label: "Export", value: "export" },
    { label: "Semua Status", value: "all" },
];

const tampilanOptions = [
    { label: "All Value", value: "all_value" },
    { label: "Summary", value: "summary" },
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
const formatQty = (v: number) =>
    v.toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

function ReportContent() {
    const searchParams = useSearchParams();
    const reportType = searchParams.get("report") || "stock-card";

    // Configuration for different report types
    const reportConfigs: Record<string, any> = {
        "stock-card": {
            title: "Laporan Kartu Persediaan Barang",
            desc: "Filter dan tampilkan pergerakan masuk keluar barang serta saldo akhirnya (Kartu Stok).",
            type: "detail",
            columns: [
                { key: "tanggal", label: "Tanggal", align: "left" },
                { key: "noReferensi", label: "No. Referensi", align: "left" },
                { key: "keterangan", label: "Keterangan", align: "left" },
                { key: "masuk", label: "Masuk", align: "center", render: (r: any) => formatQty(r.masuk) },
                { key: "keluar", label: "Keluar", align: "center", render: (r: any) => formatQty(r.keluar) },
                { key: "saldo", label: "Saldo", align: "center", render: (r: any) => formatQty(r.saldo) },
            ],
            data: [
                { tanggal: "2026-04-01", noReferensi: "SALDO-AWAL", keterangan: "Saldo Awal", masuk: 0, keluar: 0, saldo: 50 },
                { tanggal: "2026-04-02", noReferensi: "PIV2401-0002", keterangan: "Pembelian dari TRIAL", masuk: 10, keluar: 0, saldo: 60 },
                { tanggal: "2026-04-05", noReferensi: "INV2404-0010", keterangan: "Penjualan ke Cust A", masuk: 0, keluar: 5, saldo: 55 },
                { tanggal: "2026-04-14", noReferensi: "PIV2401-0001", keterangan: "Pembelian dari CHUP", masuk: 3, keluar: 0, saldo: 58 },
            ],
        },
        "stock-summary": {
            title: "Laporan Rekapitulasi Stok Barang",
            desc: "Ringkasan stok barang terkini di berbagai gudang.",
            type: "summary",
            columns: [
                { key: "kodeProduk", label: "Kode Produk", align: "left" },
                { key: "namaProduk", label: "Nama Produk", align: "left" },
                { key: "gudang", label: "Gudang", align: "left" },
                { key: "stokAwal", label: "Stok Awal", align: "center", render: (r: any) => formatQty(r.stokAwal) },
                { key: "pemasukan", label: "Pemasukan", align: "center", render: (r: any) => formatQty(r.pemasukan) },
                { key: "pengeluaran", label: "Pengeluaran", align: "center", render: (r: any) => formatQty(r.pengeluaran) },
                { key: "stokAkhir", label: "Stok Akhir", align: "center", render: (r: any) => formatQty(r.stokAkhir) },
                { key: "satuan", label: "Satuan", align: "center" },
            ],
            data: [
                { kodeProduk: "PRD-A", namaProduk: "Produk A", gudang: "GKPK", stokAwal: 50, pemasukan: 10, pengeluaran: 5, stokAkhir: 55, satuan: "PCS" },
                { kodeProduk: "PRD-B", namaProduk: "Produk B", gudang: "GKPK", stokAwal: 100, pemasukan: 15, pengeluaran: 50, stokAkhir: 65, satuan: "BOX" },
            ],
        },
        "stock-transaction-summary": {
            title: "Laporan Rekap Transaksi Stok",
            desc: "Rekapitulasi total qty mutasi stok per tipe transaksi.",
            type: "summary",
            columns: [
                { key: "tipeTransaksi", label: "Tipe Transaksi", align: "left" },
                { key: "totalMasuk", label: "Total Masuk", align: "center", render: (r: any) => formatQty(r.totalMasuk) },
                { key: "totalKeluar", label: "Total Keluar", align: "center", render: (r: any) => formatQty(r.totalKeluar) },
            ],
            data: [
                { tipeTransaksi: "Pembelian (PIV)", totalMasuk: 130, totalKeluar: 0 },
                { tipeTransaksi: "Penjualan (INV)", totalMasuk: 0, totalKeluar: 55 },
                { tipeTransaksi: "Retur Pembelian", totalMasuk: 0, totalKeluar: 10 },
                { tipeTransaksi: "Retur Penjualan", totalMasuk: 5, totalKeluar: 0 },
            ],
        },
        "selling-price-list": {
            title: "Laporan Daftar Harga Penjualan Barang",
            desc: "Daftar harga jual barang berdasarkan produk.",
            type: "summary",
            columns: [
                { key: "kodeProduk", label: "Kode Produk", align: "left" },
                { key: "namaProduk", label: "Nama Produk", align: "left" },
                { key: "satuan", label: "Satuan", align: "center" },
                { key: "hargaBeli", label: "Harga Beli Terakhir", align: "right", render: (r: any) => formatCurrency(r.hargaBeli) },
                { key: "hargaJual", label: "Harga Jual", align: "right", render: (r: any) => formatCurrency(r.hargaJual) },
                { key: "margin", label: "Margin", align: "center", render: (r: any) => `${r.margin}%` },
            ],
            data: [
                { kodeProduk: "PRD-A", namaProduk: "Produk A", satuan: "PCS", hargaBeli: 4000, hargaJual: 5000, margin: 25 },
                { kodeProduk: "PRD-B", namaProduk: "Produk B", satuan: "BOX", hargaBeli: 100000, hargaJual: 120000, margin: 20 },
                { kodeProduk: "PRD-C", namaProduk: "Sabun Cuci", satuan: "DOS", hargaBeli: 110000, hargaJual: 132000, margin: 20 },
            ],
        },
        // Fallback for others
        "default": {
            title: "Laporan Persediaan Barang",
            desc: "Informasi dan laporan seputar persediaan / stok barang.",
            type: "summary",
            columns: [
                { key: "referensi", label: "Referensi", align: "left" },
                { key: "keterangan", label: "Keterangan", align: "left" },
                { key: "nilai", label: "Nilai", align: "right", render: (r: any) => formatCurrency(r.nilai) },
            ],
            data: [
                { referensi: "MUTASI-01", keterangan: "Data Default", nilai: 50000 }
            ],
            grandTotalKey: "nilai"
        }
    };

    const config = reportConfigs[reportType] || reportConfigs["default"];

    // Provide default mappings for other mapped reports
    if (!reportConfigs[reportType]) {
        config.title = "Laporan " + reportType.replace(/-/g, " ");
        config.type = "detail";
    }

    const [params, setParams] = useState<ReportParams>({
        tanggalDari: toDateInput(firstOfMonth),
        tanggalHingga: toDateInput(lastOfMonth),
        rowPerPage: 20,
        status: "lokal",
        pemasok: "",
        produkDari: "",
        produkHingga: "",
        gudang: "",
        tampilan: "all_value",
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
            status: "lokal",
            pemasok: "",
            produkDari: "",
            produkHingga: "",
            gudang: "",
            tampilan: "all_value",
        });
        setShowPreview(false);
    };

    const reportRows = config.data;
    const grandTotal = config.grandTotalKey ? reportRows.reduce((sum: number, row: any) => sum + (row[config.grandTotalKey] || 0), 0) : null;

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
                            {reportType !== "selling-price-list" && (
                                <>
                                    <FormField label="Tanggal dari">
                                        <FormInput type="date" value={params.tanggalDari} onChange={(e) => set("tanggalDari", e.target.value)} />
                                    </FormField>
                                    <FormField label="Hingga tanggal">
                                        <FormInput type="date" value={params.tanggalHingga} onChange={(e) => set("tanggalHingga", e.target.value)} />
                                    </FormField>
                                    <FormField label="Row per page">
                                        <FormInput type="number" value={String(params.rowPerPage)} onChange={(e) => set("rowPerPage", Number(e.target.value))} min={1} max={500} />
                                    </FormField>
                                    <FormField label="Status">
                                        <FormSelect value={params.status} onChange={(e) => set("status", e.target.value)}>
                                            {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                        </FormSelect>
                                    </FormField>
                                    <FormField label="Pemasok">
                                        <FormSelect value={params.pemasok} onChange={(e) => set("pemasok", e.target.value)}>
                                            {pemasokOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                        </FormSelect>
                                    </FormField>
                                    <FormField label="Gudang">
                                        <FormSelect value={params.gudang} onChange={(e) => set("gudang", e.target.value)}>
                                            {gudangOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                        </FormSelect>
                                    </FormField>
                                </>
                            )}
                            <ProductSearchField label="Produk" value={params.produkDari} onChange={(v) => set("produkDari", v)} />
                            <ProductSearchField label="Hingga Produk" value={params.produkHingga} onChange={(v) => set("produkHingga", v)} />
                            {reportType !== "selling-price-list" && (
                                <FormField label="Tampilan">
                                    <FormSelect value={params.tampilan} onChange={(e) => set("tampilan", e.target.value)}>
                                        {tampilanOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
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
                                <span className="material-symbols-outlined text-primary">inventory_2</span>
                                <div>
                                    <h3 className="font-bold text-slate-800 capitalize">{config.title}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Periode: {params.tanggalDari} s/d {params.tanggalHingga} · {params.gudang ? gudangOptions.find((p) => p.value === params.gudang)?.label : "Semua Gudang"}
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
                                                <td key={colIdx} className={`px-4 py-3 text-sm text-${col.align || 'left'} ${col.key === 'noReferensi' ? 'font-semibold text-primary' : ''} ${col.key === 'status' ? 'text-center' : ''}`}>
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
                                {config.grandTotalKey && grandTotal !== null && (
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
                                )}
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

export default function InventoryReportsPage() {
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
