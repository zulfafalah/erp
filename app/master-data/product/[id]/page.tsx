"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
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

interface ProductFormState {
    familyid: number;
    productname: string;
    productname2: string;
    productname3: string;
    prodtype: string;
    barcodeno: string;
    barcodeno2: string;
    uom_id_prod: number;
    qty_outer: string;
    uom_inner_outer: number;
    qty_inner: string;
    qty_gram: string;
    uom_berat: number;
    prod_gw: string;
    prod_nw: string;
    prod_p: string;
    prod_l: string;
    prod_t: string;
    maxprice: string;
    minprice: string;
    minorder: number;
    limitstok: number;
    sizeprod: number;
    iscontinue: number;
    prodcur: string;
}

const defaultFormState: ProductFormState = {
    familyid: 0,
    productname: "",
    productname2: "",
    productname3: "",
    prodtype: "",
    barcodeno: "",
    barcodeno2: "",
    uom_id_prod: 0,
    qty_outer: "1.00",
    uom_inner_outer: 0,
    qty_inner: "1.00",
    qty_gram: "0.00",
    uom_berat: 0,
    prod_gw: "0.00",
    prod_nw: "0.00",
    prod_p: "0.00",
    prod_l: "0.00",
    prod_t: "0.00",
    maxprice: "0.0000",
    minprice: "0.0000",
    minorder: 1,
    limitstok: 10,
    sizeprod: 0,
    iscontinue: 1,
    prodcur: "IDR",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
    const router = useRouter();
    const params = useParams();
    const idParam = params?.id as string;
    const isNew = idParam === "new";

    const [activeTab, setActiveTab] = useState<TabKey>("data-barang");
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<ProductFormState>(defaultFormState);
    const [isLoading, setIsLoading] = useState(!isNew);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [readOnlyData, setReadOnlyData] = useState<any>(null);

    // ── Fetch Existing Data ───────────────────────────────────────────────────

    useEffect(() => {
        if (isNew) return;

        const fetchProduct = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/master-data/products/${idParam}`);
                const json = await res.json();
                if (!res.ok || !json.ok) {
                    setError(json.message || "Failed to fetch product data");
                    return;
                }
                const data = json.data;
                setReadOnlyData(data);
                
                // Merge data into form state
                setForm(prev => ({
                    ...prev,
                    familyid: data.familyid ?? 0,
                    productname: data.productname ?? "",
                    productname2: data.productname2 ?? "",
                    productname3: data.productname3 ?? "",
                    prodtype: data.prodtype ?? "",
                    barcodeno: data.barcodeno ?? "",
                    barcodeno2: data.barcodeno2 ?? "",
                    uom_id_prod: data.uom_id_prod ?? 0,
                    qty_outer: data.qty_outer ?? "1.00",
                    uom_inner_outer: data.uom_inner_outer ?? 0,
                    qty_inner: data.qty_inner ?? "1.00",
                    qty_gram: data.qty_gram ?? "0.00",
                    uom_berat: data.uom_berat ?? 0,
                    prod_gw: data.prod_gw ?? "0.00",
                    prod_nw: data.prod_nw ?? "0.00",
                    prod_p: data.prod_p ?? "0.00",
                    prod_l: data.prod_l ?? "0.00",
                    prod_t: data.prod_t ?? "0.00",
                    maxprice: data.maxprice ?? "0.0000",
                    minprice: data.minprice ?? "0.0000",
                    minorder: typeof data.minorder === "string" ? parseInt(data.minorder) : data.minorder ?? 1,
                    limitstok: data.limitstok ?? 10,
                    sizeprod: data.sizeprod ?? 0,
                    iscontinue: data.iscontinue ?? 1,
                    prodcur: data.prodcur ?? "IDR",
                }));
            } catch (err) {
                setError("Connection error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [isNew, idParam]);

    // ── Form Handlers ─────────────────────────────────────────────────────────

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "number" ? (value === "" ? "" : Number(value)) : value
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        try {
            // Build payload
            const payload = { ...form };
            // Ensure numbers are numbers, strings are strings based on schema
            payload.familyid = Number(payload.familyid) || 0;
            payload.uom_id_prod = Number(payload.uom_id_prod) || 0;
            // Provide a default for uom_inner_outer since it's removed from UI
            payload.uom_inner_outer = Number(payload.uom_inner_outer) || payload.uom_id_prod || 1;
            payload.uom_berat = Number(payload.uom_berat) || 0;
            payload.minorder = Number(payload.minorder) || 1;
            payload.limitstok = Number(payload.limitstok) || 10;
            payload.sizeprod = Number(payload.sizeprod) || 0;
            payload.iscontinue = Number(payload.iscontinue);

            // Using FormData if image upload was supported, but API schema accepts JSON.
            // Sending JSON for now.
            const url = isNew 
                ? `/api/master-data/products` 
                : `/api/master-data/products/${idParam}`;
            const method = isNew ? "POST" : "PUT";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const json = await res.json();

            if (!res.ok || !json.ok) {
                setError(json.message || "Failed to save product.");
                if (json.errors) {
                    console.error("Validation errors:", json.errors);
                    alert("Validation errors: " + JSON.stringify(json.errors));
                }
                return;
            }

            alert("Product saved successfully.");
            router.push("/master-data/product");
        } catch (err) {
            setError("Connection error during save.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewImage(url);
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            <Navbar />
            <main className="flex-1 flex overflow-hidden">
                <Sidebar />
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
                                        {isNew ? "Tambah Produk Baru" : `Edit Produk: ${readOnlyData?.productcode || idParam}`}
                                    </h1>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    Kelola detail data produk/barang di sistem.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                            <button 
                                onClick={() => setForm(defaultFormState)}
                                className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-200/50 rounded-lg transition-all border border-slate-200 md:border-transparent flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">refresh</span>
                                Reset
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full md:w-auto justify-center px-4 md:px-5 py-2 text-xs md:text-sm font-bold bg-primary text-white hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-sm">save</span>
                                {isSaving ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mx-4 md:mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">error</span>
                            {error}
                        </div>
                    )}

                    {/* Tab System Container */}
                    <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-6 pb-28 md:pb-6 gap-4 md:gap-6">
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
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">inventory_2</span>
                                                <h3 className="font-bold text-slate-800">Informasi Barang</h3>
                                            </div>
                                            <div className="p-4 md:p-6 space-y-4">

                                                {/* Group / Family ID */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Family ID
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormInput 
                                                            name="familyid" 
                                                            type="number" 
                                                            value={form.familyid} 
                                                            onChange={handleChange} 
                                                            className="w-full sm:w-1/2" 
                                                            required 
                                                        />
                                                    </div>
                                                </div>

                                                {/* Barcode */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Barcode Luar ~ Dalam
                                                    </label>
                                                    <div className="sm:col-span-3 flex gap-2">
                                                        <FormInput name="barcodeno" value={form.barcodeno} onChange={handleChange} className="flex-1" placeholder="Barcode 1" required />
                                                        <FormInput name="barcodeno2" value={form.barcodeno2} onChange={handleChange} className="flex-1" placeholder="Barcode 2" required />
                                                    </div>
                                                </div>

                                                {/* Name 1 */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-start">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1 pt-2">
                                                        Nama Barang
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormInput name="productname" value={form.productname} onChange={handleChange} className="w-full" required maxLength={200} />
                                                    </div>
                                                </div>

                                                {/* Name 2 & 3 */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-start">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1 pt-2">
                                                        Nama Barang Alt
                                                    </label>
                                                    <div className="sm:col-span-3 flex gap-2">
                                                        <FormInput name="productname2" value={form.productname2} onChange={handleChange} className="flex-1" placeholder="Nama Alt 1" />
                                                        <FormInput name="productname3" value={form.productname3} onChange={handleChange} className="flex-1" placeholder="Nama Alt 2" />
                                                    </div>
                                                </div>

                                                <div className="border-t border-slate-100 pt-4 space-y-4">
                                                    {/* UOM Satuan Kecil */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                            Isi Qty ~ UOM Satuan Kecil
                                                        </label>
                                                        <div className="sm:col-span-3 flex items-center gap-2">
                                                            <span className="hidden sm:inline-block font-bold text-slate-700">:</span>
                                                            <div className="w-20">
                                                                <FormInput name="qty_inner" type="number" step="0.01" value={form.qty_inner} onChange={handleChange} required />
                                                            </div>
                                                            <div className="w-32">
                                                                <FormSelect name="uom_id_prod" value={form.uom_id_prod} onChange={handleChange} required>
                                                                    <option value={0}>-- Pilih --</option>
                                                                    <option value={1}>PCS</option>
                                                                    <option value={2}>BOX</option>
                                                                    <option value={3}>PACK</option>
                                                                </FormSelect>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Berat Satuan Kecil */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                            Berat Satuan Kecil ~ UOM
                                                        </label>
                                                        <div className="sm:col-span-3 flex items-center gap-2">
                                                            <span className="hidden sm:inline-block font-bold text-slate-700">:</span>
                                                            <div className="w-20">
                                                                <FormInput name="qty_gram" type="number" step="0.01" value={form.qty_gram} onChange={handleChange} />
                                                            </div>
                                                            <div className="w-32">
                                                                <FormSelect name="uom_berat" value={form.uom_berat} onChange={handleChange}>
                                                                    <option value={0}>-- Pilih --</option>
                                                                    <option value={4}>GRAM</option>
                                                                    <option value={5}>KG</option>
                                                                </FormSelect>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Weight / Size */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                            P X L X T
                                                        </label>
                                                        <div className="sm:col-span-3 flex items-center gap-2 flex-wrap">
                                                            <span className="hidden sm:inline-block font-bold text-slate-700">:</span>
                                                            <div className="w-20">
                                                                <FormInput name="prod_p" type="number" step="0.01" value={form.prod_p} onChange={handleChange} />
                                                            </div>
                                                            <span className="text-slate-400 font-medium">X</span>
                                                            <div className="w-20">
                                                                <FormInput name="prod_l" type="number" step="0.01" value={form.prod_l} onChange={handleChange} />
                                                            </div>
                                                            <span className="text-slate-400 font-medium">X</span>
                                                            <div className="w-20">
                                                                <FormInput name="prod_t" type="number" step="0.01" value={form.prod_t} onChange={handleChange} />
                                                            </div>
                                                            <span className="text-slate-400 font-medium">=</span>
                                                            <div className="w-32">
                                                                <FormInput 
                                                                    name="volume" 
                                                                    value={((Number(form.prod_p) || 0) * (Number(form.prod_l) || 0) * (Number(form.prod_t) || 0) / 1000000).toFixed(8)} 
                                                                    readOnly 
                                                                    className="bg-slate-100 text-slate-500 cursor-not-allowed" 
                                                                />
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-700">(M3)</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                            GW / NW
                                                        </label>
                                                        <div className="sm:col-span-3 flex items-center gap-2 flex-wrap">
                                                            <span className="hidden sm:inline-block font-bold text-slate-700">:</span>
                                                            <div className="w-24">
                                                                <FormInput name="prod_gw" type="number" step="0.01" value={form.prod_gw} onChange={handleChange} placeholder="GW" />
                                                            </div>
                                                            <div className="w-24">
                                                                <FormInput name="prod_nw" type="number" step="0.01" value={form.prod_nw} onChange={handleChange} placeholder="NW" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border-t border-slate-100 pt-4 space-y-4">
                                                    {/* Prices */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                            Harga Min ~ Max
                                                        </label>
                                                        <div className="sm:col-span-3 flex gap-2 flex-wrap">
                                                            <FormInput name="minprice" type="number" step="0.01" value={form.minprice} onChange={handleChange} className="w-32" placeholder="Min" />
                                                            <FormInput name="maxprice" type="number" step="0.01" value={form.maxprice} onChange={handleChange} className="w-32" placeholder="Max" />
                                                        </div>
                                                    </div>

                                                    {/* Min Order & Limit */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                            Min Order ~ Limit Stok
                                                        </label>
                                                        <div className="sm:col-span-3 flex gap-2">
                                                            <FormInput name="minorder" type="number" value={form.minorder} onChange={handleChange} className="w-24" />
                                                            <FormInput name="limitstok" type="number" value={form.limitstok} onChange={handleChange} className="w-24" />
                                                        </div>
                                                    </div>

                                                    {/* Is Continue */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                            Status Lanjut?
                                                        </label>
                                                        <div className="sm:col-span-3">
                                                            <FormSelect name="iscontinue" value={form.iscontinue} onChange={handleChange} className="w-40">
                                                                <option value={1}>Ya (Tampilkan)</option>
                                                                <option value={0}>Tidak (Sembunyikan)</option>
                                                            </FormSelect>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        )}

                        {/* Other Tabs Content Placeholder */}
                        {activeTab !== "data-barang" && (
                            <div className="flex-1 flex items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm p-12">
                                <div className="text-center">
                                    <span className="material-symbols-outlined text-5xl text-slate-300">construction</span>
                                    <h3 className="mt-4 text-lg font-bold text-slate-800">Tab Belum Tersedia</h3>
                                    <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
                                        Modul tambahan ini sedang dalam pengembangan atau tidak tercakup dalam integrasi saat ini.
                                    </p>
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
