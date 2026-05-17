"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import FormInput from "../../../components/FormInput";

interface ProductCategoryDetail {
    familyid?: number;
    famno: string | null;
    productfamily: string;
    created?: string | null;
    createdby?: string | null;
    modified?: string | null;
    modifiedby?: string | null;
}

export default function ProductCategoryFormPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const isNew = id === "new";

    const [formData, setFormData] = useState<ProductCategoryDetail>({
        famno: "",
        productfamily: "",
    });

    const [isLoading, setIsLoading] = useState(!isNew);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

    // ─── Fetch Data ───────────────────────────────────────────────────────────

    useEffect(() => {
        if (isNew) return;

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/master-data/product-category/${id}`);
                const json = await res.json();
                if (!res.ok || !json.ok) {
                    setError(json.message ?? "Gagal memuat data kategori.");
                    return;
                }
                setFormData(json.data);
            } catch {
                setError("Terjadi kesalahan koneksi.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, isNew]);

    // ─── Handlers ─────────────────────────────────────────────────────────────

    const handleChange = (field: keyof ProductCategoryDetail, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear specific validation error if user types
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const newErr = { ...prev };
                delete newErr[field];
                return newErr;
            });
        }
    };

    const handleSave = async () => {
        if (!formData.productfamily?.trim()) {
            setValidationErrors({ productfamily: ["Nama Kategori tidak boleh kosong."] });
            return;
        }

        setIsSaving(true);
        setError(null);
        setValidationErrors({});

        try {
            const method = isNew ? "POST" : "PUT";
            const url = isNew
                ? `/api/master-data/product-category`
                : `/api/master-data/product-category/${id}`;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productfamily: formData.productfamily,
                }),
            });

            const json = await res.json();

            if (!res.ok || !json.ok) {
                if (json.errors && typeof json.errors === "object") {
                    setValidationErrors(json.errors as Record<string, string[]>);
                    setError("Harap periksa kembali input Anda.");
                } else {
                    setError(json.message ?? "Gagal menyimpan data.");
                }
                return;
            }

            alert("Data berhasil disimpan!");
            router.push("/master-data/product-category");
        } catch {
            setError("Terjadi kesalahan koneksi saat menyimpan.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        if (isNew) {
            setFormData({ famno: "", productfamily: "" });
            setValidationErrors({});
            setError(null);
        } else {
            router.refresh(); // Or reload window
            window.location.reload();
        }
    };

    // ─── Formatting helpers ───────────────────────────────────────────────────

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return "—";
        try {
            return new Date(dateStr).toLocaleString("id-ID", {
                year: "numeric", month: "short", day: "numeric",
                hour: "2-digit", minute: "2-digit"
            });
        } catch {
            return dateStr;
        }
    };

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
                                onClick={() => router.push("/master-data/product-category")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight flex items-center gap-2">
                                    :: Data Kategori Produk
                                    {isNew && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase">Baru</span>}
                                </h1>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    Kelola master data grup/kategori produk di sistem.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                            <button 
                                onClick={handleReset}
                                disabled={isLoading || isSaving}
                                className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-200/50 rounded-lg transition-all border border-slate-200 md:border-transparent flex items-center gap-2 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-sm">refresh</span>
                                Reset
                            </button>
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold bg-white text-slate-700 border border-slate-200 hover:border-slate-400 rounded-lg transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">help</span>
                                Info
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={isLoading || isSaving}
                                className="w-full md:w-auto justify-center px-4 md:px-5 py-2 text-xs md:text-sm font-bold bg-primary text-white hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                ) : (
                                    <span className="material-symbols-outlined text-sm">save</span>
                                )}
                                Simpan
                            </button>
                        </div>
                    </div>

                    {/* Content Container */}
                    <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-6 pb-28 md:pb-6 gap-4 md:gap-6">
                        
                        {/* Error Banner */}
                        {error && (
                            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                                <span className="material-symbols-outlined text-base shrink-0">error</span>
                                {error}
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                            
                            {isLoading ? (
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-12 text-center">
                                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                                    <p className="text-slate-500 text-sm">Memuat data...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

                                    {/* Left Section: Form */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            {/* Card Header */}
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">category</span>
                                                <h3 className="font-bold text-slate-800">Informasi Kategori Produk</h3>
                                            </div>

                                            {/* Card Body */}
                                            <div className="p-4 md:p-6 space-y-4 md:space-y-5">

                                                {/* Kode */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Kode
                                                    </label>
                                                    <div className="sm:col-span-3 w-2/3">
                                                        <FormInput
                                                            placeholder={isNew ? "Dibuat otomatis oleh sistem" : "Kode"}
                                                            value={formData.famno ?? ""}
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>

                                                {/* Nama */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-start sm:items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1 mt-2 sm:mt-0">
                                                        Nama <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="sm:col-span-3 w-2/3">
                                                        <FormInput
                                                            placeholder="Masukkan nama kategori produk"
                                                            value={formData.productfamily}
                                                            onChange={(e) => handleChange("productfamily", e.target.value)}
                                                            className={validationErrors.productfamily?.[0] ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
                                                        />
                                                        {validationErrors.productfamily?.[0] && (
                                                            <p className="text-xs text-red-500 mt-1.5">{validationErrors.productfamily[0]}</p>
                                                        )}
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Section: Info Summary */}
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-0">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">info</span>
                                                <h3 className="font-bold text-slate-800">Informasi</h3>
                                            </div>
                                            <div className="p-4 md:p-6 space-y-3">
                                                <p className="text-xs text-slate-500 leading-relaxed">
                                                    Kategori produk digunakan sebagai pengelompokan barang dalam transaksi penjualan, pembelian, dan laporan persediaan.
                                                </p>
                                                {!isNew && (
                                                    <div className="pt-3 border-t border-slate-100 space-y-2">
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="text-slate-500">Dibuat oleh</span>
                                                            <span className="font-semibold text-slate-700">{formData.createdby ?? "—"}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="text-slate-500">Tanggal Buat</span>
                                                            <span className="font-semibold text-slate-700">{formatDate(formData.created)}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-xs mt-2 pt-2 border-t border-slate-50">
                                                            <span className="text-slate-500">Diubah oleh</span>
                                                            <span className="font-semibold text-slate-700">{formData.modifiedby ?? "—"}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="text-slate-500">Tanggal Ubah</span>
                                                            <span className="font-semibold text-slate-700">{formatDate(formData.modified)}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer StatusBar */}
            <StatusBar />
        </div>
    );
}
