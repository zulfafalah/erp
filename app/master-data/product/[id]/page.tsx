"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductCategoryOption {
    familyid: number;
    famno: string | null;
    productfamily: string;
}

interface UnitOption {
    unitid: number;
    unit: string;
    unitname: string;
}

type TabKey = "data-barang" | "gambar" | "account-code" | "pemasok" | "stok-gudang";

const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "data-barang", label: "Data Barang", icon: "inventory_2" },
    { key: "gambar", label: "Gambar", icon: "image" },
    { key: "account-code", label: "Account Code", icon: "account_tree" },
    { key: "pemasok", label: "R/Pemasok", icon: "local_shipping" },
    { key: "stok-gudang", label: "Stok/Gudang", icon: "warehouse" },
];

interface ProductFormState {
    familyid: number;
    productname: string;
    productname2: string;
    productname3: string;
    prodtype: string;
    skucode: string;
    keterangan: string;
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
    sellprice: string;
    maxprice: string;
    minprice: string;
    minorder: number;
    limitstok: number;
    sizeprod: number;
    isjasa: number;
    iscontinue: number;
    prodcur: string;
}

const defaultFormState: ProductFormState = {
    familyid: 0,
    productname: "",
    productname2: "",
    productname3: "",
    prodtype: "",
    skucode: "",
    keterangan: "",
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
    sellprice: "0.00",
    maxprice: "0.00",
    minprice: "0.00",
    minorder: 1,
    limitstok: 10,
    sizeprod: 0,
    isjasa: 0,
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

    // ── Product Category Options ──────────────────────────────────────────────
    const [categories, setCategories] = useState<ProductCategoryOption[]>([]);
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

    // ── Unit Options ──────────────────────────────────────────────────────
    const [units, setUnits] = useState<UnitOption[]>([]);
    const [isUnitsLoading, setIsUnitsLoading] = useState(true);

    // ── Fetch Product Categories ──────────────────────────────────────────────

    useEffect(() => {
        const fetchCategories = async () => {
            setIsCategoriesLoading(true);
            try {
                const res = await fetch(`/api/master-data/product-category?limit=999`);
                const json = await res.json();
                if (res.ok && json.ok) {
                    setCategories(json.data ?? []);
                }
            } catch {
                // Silently fail — dropdown will just be empty
            } finally {
                setIsCategoriesLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // ── Fetch Units ──────────────────────────────────────────────────────────

    useEffect(() => {
        const fetchUnits = async () => {
            setIsUnitsLoading(true);
            try {
                const res = await fetch(`/api/master-data/units`);
                const json = await res.json();
                if (res.ok && json.ok) {
                    setUnits(json.data ?? []);
                }
            } catch {
                // Silently fail — dropdown will just be empty
            } finally {
                setIsUnitsLoading(false);
            }
        };
        fetchUnits();
    }, []);

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
                    skucode: data.skucode ?? "",
                    keterangan: data.keterangan ?? "",
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
                    sellprice: data.sellprice ?? "0.00",
                    maxprice: data.maxprice ?? "0.00",
                    minprice: data.minprice ?? "0.00",
                    minorder: typeof data.minorder === "string" ? parseInt(data.minorder) : data.minorder ?? 1,
                    limitstok: data.limitstok ?? 10,
                    sizeprod: data.sizeprod ?? 0,
                    isjasa: data.isjasa ?? 0,
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
            payload.isjasa = Number(payload.isjasa);

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
                                    className={`px-4 md:px-6 py-3 text-xs md:text-sm font-medium flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.key
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

                                                {/* 1. Grup Barang ~ Kode Barang */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Grup Barang ~ Kode Barang
                                                    </label>
                                                    <div className="sm:col-span-3 flex gap-2">
                                                        <FormSelect name="familyid" value={form.familyid} onChange={handleChange} className="flex-1" required>
                                                            <option value={0}>{isCategoriesLoading ? "Memuat..." : "-- Pilih Kategori --"}</option>
                                                            {categories.map((cat) => (
                                                                <option key={cat.familyid} value={cat.familyid}>
                                                                    {cat.famno ? `${cat.famno} - ${cat.productfamily}` : cat.productfamily}
                                                                </option>
                                                            ))}
                                                        </FormSelect>
                                                        <FormInput name="productcode" value={readOnlyData?.productcode ?? ""} readOnly className="flex-1 bg-slate-100 text-slate-500 cursor-not-allowed" placeholder="Kode Barang (otomatis)" />
                                                    </div>
                                                </div>

                                                {/* 2. Barcode Luar ~ Dalam */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">Barcode Luar ~ Dalam</label>
                                                    <div className="sm:col-span-3 flex gap-2">
                                                        <FormInput name="barcodeno" value={form.barcodeno} onChange={handleChange} className="flex-1" placeholder="Barcode Luar" required />
                                                        <FormInput name="barcodeno2" value={form.barcodeno2} onChange={handleChange} className="flex-1" placeholder="Barcode Dalam" required />
                                                    </div>
                                                </div>

                                                {/* 3. Nama Barang (Bahasa) */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-start">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1 pt-2">Nama Barang (Bahasa)</label>
                                                    <div className="sm:col-span-3">
                                                        <FormInput name="productname" value={form.productname} onChange={handleChange} className="w-full" required maxLength={60} />
                                                        <p className="text-xs text-slate-400 mt-1">*max 60 karakter</p>
                                                    </div>
                                                </div>

                                                {/* 4. Nama Barang (English) */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-start">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1 pt-2">Nama Barang (English)</label>
                                                    <div className="sm:col-span-3">
                                                        <FormInput name="productname2" value={form.productname2} onChange={handleChange} className="w-full" />
                                                    </div>
                                                </div>

                                                {/* 5. SKU Code/Number */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-start">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1 pt-2">SKU Code/Number</label>
                                                    <div className="sm:col-span-3">
                                                        <FormInput name="prodtype" value={form.prodtype} onChange={handleChange} className="w-full" maxLength={20} />
                                                        <p className="text-xs text-slate-400 mt-1">*max 20 karakter</p>
                                                    </div>
                                                </div>

                                                {/* 6. Keterangan Tambahan */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-start">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1 pt-2">Keterangan Tambahan</label>
                                                    <div className="sm:col-span-3">
                                                        <FormInput name="productname3" value={form.productname3} onChange={handleChange} className="w-full" />
                                                    </div>
                                                </div>

                                                <div className="border-t border-slate-100 pt-4 space-y-4">
                                                    {/* 7. Isi Qty ~ UOM Satuan Besar */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">Isi Qty ~ UOM Satuan Besar</label>
                                                        <div className="sm:col-span-3 flex items-center gap-2">
                                                            <div className="w-20">
                                                                <FormInput name="qty_outer" type="number" step="0.01" value={form.qty_outer} onChange={handleChange} required />
                                                            </div>
                                                            <div className="w-32">
                                                                <FormSelect name="uom_inner_outer" value={form.uom_inner_outer} onChange={handleChange} required>
                                                                    <option value={0}>{isUnitsLoading ? "Memuat..." : "-- Pilih --"}</option>
                                                                    {units.map((u) => (
                                                                        <option key={u.unitid} value={u.unitid}>
                                                                            {u.unitname}
                                                                        </option>
                                                                    ))}
                                                                </FormSelect>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* 8. Berat Kotor Satuan Besar (KG) */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">Berat Kotor Satuan Besar (KG)</label>
                                                        <div className="sm:col-span-3 flex items-center gap-2">
                                                            <div className="w-24">
                                                                <FormInput name="prod_gw" type="number" step="0.01" value={form.prod_gw} onChange={handleChange} />
                                                            </div>
                                                            <span className="text-sm text-slate-500">(KG)</span>
                                                        </div>
                                                    </div>

                                                    {/* 9. Berat Bersih Satuan Besar (KG) */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">Berat Bersih Satuan Besar (KG)</label>
                                                        <div className="sm:col-span-3 flex items-center gap-2">
                                                            <div className="w-24">
                                                                <FormInput name="prod_nw" type="number" step="0.01" value={form.prod_nw} onChange={handleChange} />
                                                            </div>
                                                            <span className="text-sm text-slate-500">(KG)</span>
                                                        </div>
                                                    </div>

                                                    {/* 10. Isi Qty ~ UOM Satuan Kecil */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">Isi Qty ~ UOM Satuan Kecil</label>
                                                        <div className="sm:col-span-3 flex items-center gap-2">
                                                            <div className="w-20">
                                                                <FormInput name="qty_inner" type="number" step="0.01" value={form.qty_inner} onChange={handleChange} required />
                                                            </div>
                                                            <div className="w-32">
                                                                <FormSelect name="uom_id_prod" value={form.uom_id_prod} onChange={handleChange} required>
                                                                    <option value={0}>{isUnitsLoading ? "Memuat..." : "-- Pilih --"}</option>
                                                                    {units.map((u) => (
                                                                        <option key={u.unitid} value={u.unitid}>
                                                                            {u.unitname}
                                                                        </option>
                                                                    ))}
                                                                </FormSelect>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* 11. Berat Satuan Kecil ~ UOM */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">Berat Satuan Kecil ~ UOM</label>
                                                        <div className="sm:col-span-3 flex items-center gap-2">
                                                            <div className="w-20">
                                                                <FormInput name="qty_gram" type="number" step="0.01" value={form.qty_gram} onChange={handleChange} />
                                                            </div>
                                                            <div className="w-32">
                                                                <FormSelect name="uom_berat" value={form.uom_berat} onChange={handleChange}>
                                                                    <option value={0}>{isUnitsLoading ? "Memuat..." : "-- Pilih --"}</option>
                                                                    {units.map((u) => (
                                                                        <option key={u.unitid} value={u.unitid}>
                                                                            {u.unitname}
                                                                        </option>
                                                                    ))}
                                                                </FormSelect>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* 12. P X L X T */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">P X L X T</label>
                                                        <div className="sm:col-span-3 flex items-center gap-2 flex-wrap">
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
                                                                <FormInput name="volume" value={((Number(form.prod_p) || 0) * (Number(form.prod_l) || 0) * (Number(form.prod_t) || 0) / 1000000).toFixed(8)} readOnly className="bg-slate-100 text-slate-500 cursor-not-allowed" />
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-700">(M3)</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border-t border-slate-100 pt-4 space-y-4">
                                                    {/* 13. Mata Uang */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">Mata Uang</label>
                                                        <div className="sm:col-span-3">
                                                            <FormSelect name="prodcur" value={form.prodcur} onChange={handleChange} className="w-40">
                                                                <option value="IDR">Rupiah</option>
                                                                <option value="USD">US Dollar</option>
                                                                <option value="EUR">Euro</option>
                                                                <option value="SGD">SGD</option>
                                                            </FormSelect>
                                                        </div>
                                                    </div>

                                                    {/* 14. Harga Jual ~ Min ~ Beli */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">Harga Jual ~ Min ~ Beli</label>
                                                        <div className="sm:col-span-3 flex items-center gap-2 flex-wrap">
                                                            <div className="w-28">
                                                                <FormInput name="sellprice" type="number" step="0.01" value={form.sellprice} onChange={handleChange} placeholder="Jual" />
                                                            </div>
                                                            <span className="text-slate-400 font-medium">~</span>
                                                            <div className="w-28">
                                                                <FormInput name="minprice" type="number" step="0.01" value={form.minprice} onChange={handleChange} placeholder="Min" />
                                                            </div>
                                                            <span className="text-slate-400 font-medium">~</span>
                                                            <div className="w-28">
                                                                <FormInput name="maxprice" type="number" step="0.01" value={form.maxprice} onChange={handleChange} className="bg-slate-50" placeholder="Beli" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* 15. Min Order ~ Limit Warning Stock */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">Min Order ~ Limit Warning Stock</label>
                                                        <div className="sm:col-span-3 flex gap-2">
                                                            <FormInput name="minorder" type="number" value={form.minorder} onChange={handleChange} className="w-24" />
                                                            <FormInput name="limitstok" type="number" value={form.limitstok} onChange={handleChange} className="w-24" />
                                                        </div>
                                                    </div>

                                                    {/* 16. Stok saat ini */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">Stok saat ini</label>
                                                        <div className="sm:col-span-3">
                                                            <FormInput name="sizeprod" type="number" value={form.sizeprod} readOnly className="w-24 bg-slate-100 text-slate-500 cursor-not-allowed" />
                                                        </div>
                                                    </div>

                                                    {/* 17. Jasa ? */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">Jasa ?</label>
                                                        <div className="sm:col-span-3 flex items-center gap-2 flex-wrap">
                                                            <FormSelect name="isjasa" value={form.isjasa} onChange={handleChange} className="w-32">
                                                                <option value={0}>Bukan</option>
                                                                <option value={1}>Ya</option>
                                                            </FormSelect>
                                                            <span className="text-xs text-slate-400">(Pilih : &apos;Bukan&apos;, jika barang ini memerlukan stok untuk dapat dijual)</span>
                                                        </div>
                                                    </div>

                                                    {/* 18. Tampilkan ? */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">Tampilkan ?</label>
                                                        <div className="sm:col-span-3">
                                                            <FormSelect name="iscontinue" value={form.iscontinue} onChange={handleChange} className="w-40">
                                                                <option value={1}>Tampilkan</option>
                                                                <option value={0}>Sembunyikan</option>
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
