"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = "data-barang" | "gambar" | "account-code" | "pemasok" | "stok-gudang";

const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "data-barang",   label: "Data Barang",   icon: "inventory_2" },
    { key: "gambar",        label: "Gambar",        icon: "image" },
    { key: "account-code",  label: "Account Code",  icon: "account_tree" },
    { key: "pemasok",       label: "R/Pemasok",     icon: "local_shipping" },
    { key: "stok-gudang",   label: "Stok/Gudang",   icon: "warehouse" },
];

// ─── Mock Supplier Data ──────────────────────────────────────────────────────

interface SupplierRow {
    id: string;
    nama: string;
    alamat: string;
    dipilih: boolean;
}

const supplierData: SupplierRow[] = [
    { id: "S001", nama: "BEKASI SQUARE",       alamat: "Jl. Jend. Ahmad Yani No.8, Pekayam Jaya, Bekasi Sel., Kota Bks, Jawa Barat 17141",                                                                                                      dipilih: true  },
    { id: "S002", nama: "CARREFOUR BALIKPAPAN", alamat: "Jl. MT Haryono, Grn. Banaraja, Balikpapan Sel., Kota Balikpapan, Kalimantan Timur 76114",                                                                                                dipilih: false },
    { id: "S003", nama: "CARREFOUR DENPASAR",   alamat: "Sunset Road Building Lt. 3, Jl. Sunset Road, Pemogan, Denpasar Selatan, Kuta, Kabupaten Badung, Bali 8022",                                                                              dipilih: false },
    { id: "S004", nama: "CARREFOUR DEWI SARTIKA", alamat: "Jalan Dewi Sartika No. 9, Pancoran MAS, Depok, Pancoran MAS, Depok, Jawa Barat 16430",                                                                                                dipilih: false },
    { id: "S005", nama: "CARREFOUR KIARA CONDONG", alamat: "Jl. Soekarno Hatta No.526, Cipaganti, Buahbatu, Kota Bandung, Jawa Barat 40286",                                                                                                     dipilih: false },
    { id: "S006", nama: "CARREFOUR LEBAK BULUS", alamat: "Jl. Lebak Bulus Raya No.8, RT.1/RW.10, Pondok Pinang, Kebayoran Lama, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12310",                                                     dipilih: false },
    { id: "S007", nama: "CARREFOUR MANGGA DUA",  alamat: "Jl. Gn. Sahari Raya No.10, RT.11/RW.6, Kota Tua, Ancol, Pademangan, Kota Jak Utara, Daerah Khusus Ibukota Jakarta 14420",                                                             dipilih: false },
    { id: "S008", nama: "CARREFOUR MATARAM",     alamat: "Jl. Selaparang No.60, Mayura, Cakranegara, Kota Mataram, Nusa Tenggara Bar. 83239",                                                                                                    dipilih: false },
    { id: "S009", nama: "CARREFOUR MEDAN",       alamat: "Kompleks Medan Fair Plaza, Jl. Gatot Subroto No.30, Sekip, Medan Petisah, Kota Medan, Sumatera Utara 20214",                                                                           dipilih: true  },
    { id: "S010", nama: "CARREFOUR PURI INDAH",  alamat: "Jalan Puri Indah Blok Q No.1, RT1/RW.2, Kembangan Selatan, Kembangan, RT.1/RW.2, Kembangan Sel., Kembangan, RT1/RW.2, Kembangan Sel., Kembangan, Daerah Khusus Ibukota Jakarta 11610", dipilih: false },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabKey>("data-barang");
    const [suppliers, setSuppliers] = useState<SupplierRow[]>(supplierData);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const toggleSupplier = (id: string) => {
        setSuppliers((prev) =>
            prev.map((s) => (s.id === id ? { ...s, dipilih: !s.dipilih } : s))
        );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewImage(url);
        }
    };

    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            {/* Top Navigation Bar */}
            <Navbar />

            <main className="flex-1 flex overflow-hidden">
                {/* Sidebar Navigation */}
                <Sidebar />

                {/* Main Content Area */}
                <section className="flex-1 flex flex-col bg-background-light overflow-hidden">

                    {/* Action Header */}
                    <div className="px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/5 bg-white/50 backdrop-blur-sm shrink-0">
                        <div className="flex items-start md:items-center gap-3 md:gap-4 w-full md:w-auto">
                            <button
                                onClick={() => router.push("/master-data/product")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        :: Data Barang
                                    </h1>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    Kelola detail data produk/barang di sistem.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-200/50 rounded-lg transition-all border border-slate-200 md:border-transparent flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">refresh</span>
                                Reset
                            </button>
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold bg-white text-slate-700 border border-slate-200 hover:border-slate-400 rounded-lg transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">help</span>
                                Info
                            </button>
                            <button className="w-full md:w-auto justify-center px-4 md:px-5 py-2 text-xs md:text-sm font-bold bg-primary text-white hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">save</span>
                                Simpan
                            </button>
                        </div>
                    </div>

                    {/* Tab System Container */}
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
                                </button>
                            ))}
                        </div>

                        {/* ── Tab: Data Barang ───────────────────────────────────── */}
                        {activeTab === "data-barang" && (
                            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                                    {/* Left: Form */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            {/* Card Header */}
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">inventory_2</span>
                                                <h3 className="font-bold text-slate-800">Informasi Barang</h3>
                                            </div>
                                            {/* Card Body */}
                                            <div className="p-4 md:p-6 space-y-4">

                                                {/* Grup Barang ~ Kode Barang */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Grup Barang ~ Kode Barang
                                                    </label>
                                                    <div className="sm:col-span-3 flex gap-2">
                                                        <FormSelect className="flex-1">
                                                            <option>PERSONAL CARE</option>
                                                            <option>BEVERAGES</option>
                                                            <option>HOME CARE</option>
                                                            <option>FOOD</option>
                                                            <option>GA</option>
                                                            <option>IT</option>
                                                        </FormSelect>
                                                        <FormInput
                                                            defaultValue="P."
                                                            className="w-16 text-center"
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>

                                                {/* Barcode Luar ~ Dalam */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Barcode Luar ~ Dalam
                                                    </label>
                                                    <div className="sm:col-span-3 flex gap-2">
                                                        <FormInput defaultValue="8999999042288" className="flex-1" />
                                                        <FormInput defaultValue="8999999042288" className="flex-1" />
                                                    </div>
                                                </div>

                                                {/* Nama Barang (Bahasa) */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-start">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1 pt-2">
                                                        Nama Barang (Bahasa)
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormInput defaultValue="PONDS FW LGHTNNG DAY CR SPF18 PA12X3X10G" className="w-full" />
                                                        <p className="text-xs text-slate-400 mt-1">*max 50 karakter</p>
                                                    </div>
                                                </div>

                                                {/* Nama Barang (English) */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Nama Barang (English)
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormInput defaultValue="PONDS FW LGHTNNG DAY CR SPF18 PA12X3X10G" className="w-full" />
                                                    </div>
                                                </div>

                                                {/* SKU Code/Number */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-start">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1 pt-2">
                                                        SKU Code/Number
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormInput defaultValue="" placeholder="" className="w-full" />
                                                        <p className="text-xs text-slate-400 mt-1">*max 20 karakter</p>
                                                    </div>
                                                </div>

                                                {/* Keterangan Tambahan */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Keterangan Tambahan
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormInput defaultValue="PONDS FW LGHTNNG DAY CR SPF18 PA12X3X10G" className="w-full" />
                                                    </div>
                                                </div>

                                                <div className="border-t border-slate-100 pt-4 space-y-4">
                                                    {/* Isi Qty ~ UOM Satuan Besar */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                            Isi Qty ~ UOM Satuan Besar
                                                        </label>
                                                        <div className="sm:col-span-3 flex gap-2">
                                                            <FormInput defaultValue="1.00" type="number" className="w-24" />
                                                            <FormSelect className="w-32">
                                                                <option>DUS</option>
                                                                <option>BOX</option>
                                                                <option>CARTON</option>
                                                                <option>PCS</option>
                                                            </FormSelect>
                                                        </div>
                                                    </div>

                                                    {/* Berat Kotor Satuan Besar (KG) */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                            Berat Kotor Satuan Besar (KG)
                                                        </label>
                                                        <div className="sm:col-span-3 flex items-center gap-2">
                                                            <FormInput defaultValue="1.50" type="number" className="w-24" />
                                                            <span className="text-sm text-slate-500">(KG)</span>
                                                        </div>
                                                    </div>

                                                    {/* Berat Bersih Satuan Besar (KG) */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                            Berat Bersih Satuan Besar (KG)
                                                        </label>
                                                        <div className="sm:col-span-3 flex items-center gap-2">
                                                            <FormInput defaultValue="0.40" type="number" className="w-24" />
                                                            <span className="text-sm text-slate-500">(KG)</span>
                                                        </div>
                                                    </div>

                                                    {/* Isi Qty ~ UOM Satuan Kecil */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                            Isi Qty ~ UOM Satuan Kecil
                                                        </label>
                                                        <div className="sm:col-span-3 flex gap-2">
                                                            <FormInput defaultValue="36.00" type="number" className="w-24" />
                                                            <FormSelect className="w-32">
                                                                <option>Pcs</option>
                                                                <option>Gram</option>
                                                                <option>Liter</option>
                                                                <option>Ml</option>
                                                            </FormSelect>
                                                        </div>
                                                    </div>

                                                    {/* Berat Satuan Kecil ~ UOM */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                            Berat Satuan Kecil ~ UOM
                                                        </label>
                                                        <div className="sm:col-span-3 flex gap-2">
                                                            <FormInput defaultValue="10.00" type="number" className="w-24" />
                                                            <FormSelect className="w-32">
                                                                <option>Gram</option>
                                                                <option>Kg</option>
                                                                <option>Ml</option>
                                                                <option>Liter</option>
                                                            </FormSelect>
                                                        </div>
                                                    </div>

                                                    {/* P X L X T */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                            P X L X T
                                                        </label>
                                                        <div className="sm:col-span-3 flex items-center gap-2 flex-wrap">
                                                            <FormInput defaultValue="24.00" type="number" className="w-20" />
                                                            <span className="text-slate-400">X</span>
                                                            <FormInput defaultValue="19.50" type="number" className="w-20" />
                                                            <span className="text-slate-400">X</span>
                                                            <FormInput defaultValue="15.50" type="number" className="w-20" />
                                                            <span className="text-sm text-slate-500">=</span>
                                                            <FormInput defaultValue="0.00725400" readOnly className="w-28 bg-slate-50" />
                                                            <span className="text-sm text-slate-500">(M3)</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border-t border-slate-100 pt-4 space-y-4">
                                                    {/* Mata Uang */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                            Mata Uang
                                                        </label>
                                                        <div className="sm:col-span-3">
                                                            <FormSelect className="w-40">
                                                                <option>Rupiah</option>
                                                                <option>USD</option>
                                                                <option>EUR</option>
                                                                <option>SGD</option>
                                                            </FormSelect>
                                                        </div>
                                                    </div>

                                                    {/* Harga Jual ~ Min ~ Beli */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                            Harga Jual ~ Min ~ Beli
                                                        </label>
                                                        <div className="sm:col-span-3 flex gap-2 flex-wrap">
                                                            <FormInput defaultValue="0.00" type="number" className="w-28" />
                                                            <FormInput defaultValue="0.00" type="number" className="w-28" />
                                                            <FormInput defaultValue="123,000.00" readOnly className="w-32 bg-slate-50" />
                                                        </div>
                                                    </div>

                                                    {/* Min Order ~ Limit Warning Stock */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                            Min Order ~ Limit Warning Stock
                                                        </label>
                                                        <div className="sm:col-span-3 flex gap-2">
                                                            <FormInput defaultValue="1" type="number" className="w-24" />
                                                            <FormInput defaultValue="10" type="number" className="w-24" />
                                                        </div>
                                                    </div>

                                                    {/* Stok saat ini */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                            Stok saat ini
                                                        </label>
                                                        <div className="sm:col-span-3">
                                                            <FormInput defaultValue="10" readOnly className="w-24 bg-slate-50" />
                                                        </div>
                                                    </div>

                                                    {/* Jasa? */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                            Jasa ?
                                                        </label>
                                                        <div className="sm:col-span-3 flex items-center gap-2 flex-wrap">
                                                            <FormSelect className="w-32">
                                                                <option>Bukan</option>
                                                                <option>Ya</option>
                                                            </FormSelect>
                                                            <span className="text-xs text-slate-400">(Pilih : &apos;Bukan&apos;, jika barang ini memerlukan stok untuk dapat dijual)</span>
                                                        </div>
                                                    </div>

                                                    {/* Tampilkan? */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                            Tampilkan ?
                                                        </label>
                                                        <div className="sm:col-span-3">
                                                            <FormSelect className="w-40">
                                                                <option>Tampilkan</option>
                                                                <option>Sembunyikan</option>
                                                            </FormSelect>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Summary / Info */}
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-0">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">info</span>
                                                <h3 className="font-bold text-slate-800">Informasi</h3>
                                            </div>
                                            <div className="p-4 md:p-6 space-y-3">
                                                <p className="text-xs text-slate-500 leading-relaxed">
                                                    Data barang adalah master produk yang digunakan dalam seluruh transaksi penjualan, pembelian, dan pengelolaan persediaan.
                                                </p>
                                                <div className="pt-3 border-t border-slate-100 space-y-2">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">Kode Barang</span>
                                                        <span className="font-semibold text-slate-700">R0033</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">Dibuat oleh</span>
                                                        <span className="font-semibold text-slate-700">ADMINISTRATOR</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">Tanggal</span>
                                                        <span className="font-semibold text-slate-700">—</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">Status</span>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Aktif
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Action Area */}
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Tab: Gambar ────────────────────────────────────────── */}
                        {activeTab === "gambar" && (
                            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                                    <div className="lg:col-span-2">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">image</span>
                                                <h3 className="font-bold text-slate-800">
                                                    Gambar PONDS FW LGHTNNG DAY CR SPF18 PA12X3X10G
                                                </h3>
                                            </div>
                                            <div className="p-4 md:p-6">
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
                                                    <label className="text-sm font-medium text-slate-700">
                                                        Gambar
                                                    </label>
                                                    <div className="sm:col-span-3 space-y-3">
                                                        {/* Image Preview */}
                                                        <div
                                                            className="w-48 h-48 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/40 transition-colors"
                                                            onClick={() => fileInputRef.current?.click()}
                                                        >
                                                            {previewImage ? (
                                                                // eslint-disable-next-line @next/next/no-img-element
                                                                <img
                                                                    src={previewImage}
                                                                    alt="Preview"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="text-center p-4">
                                                                    <span className="material-symbols-outlined text-4xl text-slate-300">
                                                                        image
                                                                    </span>
                                                                    <p className="text-xs text-slate-400 mt-2">No Image</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {/* File Input */}
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                ref={fileInputRef}
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={handleFileChange}
                                                            />
                                                            <button
                                                                onClick={() => fileInputRef.current?.click()}
                                                                className="px-4 py-2 text-sm border border-slate-300 rounded hover:bg-slate-50 transition-colors font-medium text-slate-700 flex items-center gap-2"
                                                            >
                                                                <span className="material-symbols-outlined text-sm">upload_file</span>
                                                                Choose File
                                                            </button>
                                                            <span className="text-sm text-slate-400">
                                                                {previewImage ? "File dipilih" : "No file chosen"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">info</span>
                                                <h3 className="font-bold text-slate-800">Panduan</h3>
                                            </div>
                                            <div className="p-4 md:p-6 space-y-2">
                                                <p className="text-xs text-slate-500 leading-relaxed">
                                                    Upload gambar produk dalam format JPG, PNG, atau WEBP.
                                                    Ukuran maksimal file adalah 2MB.
                                                </p>
                                                <p className="text-xs text-slate-500 leading-relaxed">
                                                    Resolusi yang disarankan adalah 400×400 piksel atau lebih untuk tampilan yang optimal.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Tab: Account Code ─────────────────────────────────── */}
                        {activeTab === "account-code" && (
                            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                                    <div className="lg:col-span-2">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">account_tree</span>
                                                <h3 className="font-bold text-slate-800">Account Code of</h3>
                                            </div>
                                            <div className="p-4 md:p-6 space-y-4">

                                                {/* Invt Sales */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Invt Sales
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormSelect className="w-full">
                                                            <option>400.01.01 - PENJUALAN BARANG LOKAL</option>
                                                            <option>400.01.02 - PENJUALAN BARANG IMPOR</option>
                                                            <option>400.02.01 - PENJUALAN JASA</option>
                                                        </FormSelect>
                                                    </div>
                                                </div>

                                                {/* Invt COGS */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Invt COGS
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormSelect className="w-full">
                                                            <option>420.01.01 - HPP</option>
                                                            <option>420.01.02 - HPP IMPOR</option>
                                                        </FormSelect>
                                                    </div>
                                                </div>

                                                {/* Invt Account */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Invt Account
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormSelect className="w-full">
                                                            <option>140.01.01 - PERSEDIAAN BARANG DAGANGAN</option>
                                                            <option>140.01.02 - PERSEDIAAN BARANG IMPOR</option>
                                                            <option>140.02.01 - PERSEDIAAN BAHAN BAKU</option>
                                                        </FormSelect>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">info</span>
                                                <h3 className="font-bold text-slate-800">Informasi</h3>
                                            </div>
                                            <div className="p-4 md:p-6">
                                                <p className="text-xs text-slate-500 leading-relaxed">
                                                    Kode akun digunakan untuk pemetaan jurnal otomatis saat transaksi terkait barang ini terjadi di sistem akuntansi.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Tab: Pemasok ──────────────────────────────────────── */}
                        {activeTab === "pemasok" && (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">
                                    {/* Table Header */}
                                    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">local_shipping</span>
                                            <h3 className="font-bold text-slate-800">
                                                Pemasok atas Produk PONDS FW LGHTNNG DAY CR SPF18 PA12X3X10G
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Desktop Table */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-primary/10">
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-12">No.</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                        <div className="flex items-center gap-1 cursor-pointer select-none hover:text-slate-700">
                                                            Nama Supplier
                                                            <span className="material-symbols-outlined text-sm">unfold_more</span>
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Alamat</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center w-24">Pilih</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-primary/5">
                                                {suppliers.map((supplier, idx) => (
                                                    <tr
                                                        key={supplier.id}
                                                        className="hover:bg-primary/5 transition-colors cursor-pointer"
                                                        onClick={() => toggleSupplier(supplier.id)}
                                                    >
                                                        <td className="px-6 py-4 text-sm text-slate-500">{idx + 1}.</td>
                                                        <td className="px-6 py-4 text-sm font-semibold text-slate-800">{supplier.nama}</td>
                                                        <td className="px-6 py-4 text-sm text-slate-500 max-w-xs">
                                                            <span className="line-clamp-2">{supplier.alamat}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <div className="flex items-center justify-center">
                                                                {supplier.dipilih ? (
                                                                    <div className="w-6 h-6 rounded bg-primary flex items-center justify-center shadow shadow-primary/30">
                                                                        <span className="material-symbols-outlined text-white text-sm">check</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-6 h-6 rounded border-2 border-slate-300 hover:border-primary transition-colors" />
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Card - Pemasok */}
                                    <div className="block md:hidden divide-y divide-primary/5">
                                        {suppliers.map((supplier, idx) => (
                                            <div
                                                key={supplier.id}
                                                className="p-4 space-y-2 cursor-pointer hover:bg-primary/5"
                                                onClick={() => toggleSupplier(supplier.id)}
                                            >
                                                <div className="flex justify-between items-start gap-3">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold text-slate-800">{idx + 1}. {supplier.nama}</p>
                                                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{supplier.alamat}</p>
                                                    </div>
                                                    <div className="shrink-0 mt-1">
                                                        {supplier.dipilih ? (
                                                            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center shadow shadow-primary/30">
                                                                <span className="material-symbols-outlined text-white text-sm">check</span>
                                                            </div>
                                                        ) : (
                                                            <div className="w-6 h-6 rounded border-2 border-slate-300" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    <div className="px-4 md:px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                                        <p className="text-sm text-slate-500 text-center md:text-left">
                                            Menampilkan 1 sampai {suppliers.length} dari {suppliers.length} data
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
                                </div>
                            </div>
                        )}

                        {/* ── Tab: Stok / Gudang ───────────────────────────── */}
                        {activeTab === "stok-gudang" && (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">
                                    {/* Card Header */}
                                    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">warehouse</span>
                                            <h3 className="font-bold text-slate-800">
                                                Persediaan atas Produk PONDS FW LGHTNNG DAY CR SPF18 PA12X3X10G
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Desktop Table */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-primary/10">
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-12">No.</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                        <div className="flex items-center gap-1 cursor-pointer select-none hover:text-slate-700">
                                                            Gudang
                                                            <span className="material-symbols-outlined text-sm">unfold_more</span>
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">
                                                        <div className="flex items-center justify-end gap-1 cursor-pointer select-none hover:text-slate-700">
                                                            Qty
                                                            <span className="material-symbols-outlined text-sm">unfold_more</span>
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">UOM</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-primary/5">
                                                {/* Data row */}
                                                <tr className="hover:bg-primary/5 transition-colors">
                                                    <td className="px-6 py-4 text-sm text-slate-500">1.</td>
                                                    <td className="px-6 py-4 text-sm font-medium text-slate-800">GUDANG DAOP AB</td>
                                                    <td className="px-6 py-4 text-sm font-semibold text-right text-slate-800">10.00</td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">DUS</td>
                                                </tr>
                                            </tbody>
                                            {/* Total row */}
                                            <tfoot>
                                                <tr className="bg-slate-50 border-t border-primary/10">
                                                    <td className="px-6 py-4" />
                                                    <td className="px-6 py-4" />
                                                    <td className="px-6 py-4 text-sm font-black text-right text-slate-900">10.00</td>
                                                    <td className="px-6 py-4 text-sm font-bold text-slate-700">DUS</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>

                                    {/* Mobile Card - Stok/Gudang */}
                                    <div className="block md:hidden divide-y divide-primary/5">
                                        <div className="p-4 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">1. GUDANG DAOP AB</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-slate-900">10.00</p>
                                                    <p className="text-xs text-slate-500">DUS</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Mobile Total */}
                                        <div className="p-4 bg-slate-50">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total</span>
                                                <div className="text-right">
                                                    <p className="text-sm font-black text-slate-900">10.00</p>
                                                    <p className="text-xs text-slate-500">DUS</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pagination */}
                                    <div className="px-4 md:px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                                        <p className="text-sm text-slate-500 text-center md:text-left">
                                            Showing 1 to 1 of 1 entries
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
