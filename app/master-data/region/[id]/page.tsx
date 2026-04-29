"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import FormField from "../../../components/FormField";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Response shape dari GET /api/v1/regions/{id}/ */
interface RegionDetail {
    regionid: number;
    regioncode: string;
    regionname: string;
    cityid: number;
    cityname: string;
    coa19: number;
    created: string;
    createdby: string;
    modified: string;
    modifiedby: string;
}

/** State form — field yang dikirim saat POST/PUT */
interface RegionFormState {
    cityid: number;
    regioncode: string;
    regionname: string;
}

interface CityOption {
    value: number;
    label: string;
}

const INITIAL_FORM: RegionFormState = {
    cityid:     0,
    regioncode: "",
    regionname: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateTime(iso?: string): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("id-ID", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function FieldSkeleton() {
    return (
        <div className="space-y-1.5">
            <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
            <div className="h-9 w-full bg-slate-100 rounded-lg animate-pulse" />
        </div>
    );
}

function CardSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                <div className="size-5 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {Array.from({ length: 3 }).map((_, i) => <FieldSkeleton key={i} />)}
            </div>
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RegionFormPage() {
    const router = useRouter();
    const params = useParams();

    // id dari URL — "new" untuk create, angka untuk edit
    const rawId = Array.isArray(params.id) ? params.id[0] : (params.id ?? "new");
    const isNew = rawId === "new";

    // ── UI State ──────────────────────────────────────────────────────────────
    const [form, setForm]             = useState<RegionFormState>(INITIAL_FORM);
    const [detail, setDetail]         = useState<RegionDetail | null>(null);
    const [isFetching, setIsFetching] = useState(!isNew);
    const [isLoading, setIsLoading]   = useState(false);
    const [error, setError]           = useState<string | null>(null);
    const [success, setSuccess]       = useState(false);

    // Cities dropdown
    const [cities, setCities]                   = useState<CityOption[]>([]);
    const [isFetchingCities, setIsFetchingCities] = useState(true);

    // ── Helpers ───────────────────────────────────────────────────────────────

    const handleChange = (field: keyof RegionFormState, value: string | number) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setError(null);
        setSuccess(false);
    };

    const handleReset = () => {
        if (detail) {
            setForm({
                cityid:     detail.cityid,
                regioncode: detail.regioncode,
                regionname: detail.regionname,
            });
        } else {
            setForm(INITIAL_FORM);
        }
        setError(null);
        setSuccess(false);
    };

    // ── Fetch detail (edit mode) ───────────────────────────────────────────────

    const fetchDetail = useCallback(async () => {
        setIsFetching(true);
        setError(null);
        try {
            const res  = await fetch(`/api/master-data/regions/${rawId}`);
            const json = await res.json() as { ok: boolean; data?: RegionDetail; message?: string };

            if (!res.ok || !json.ok || !json.data) {
                setError(json.message ?? "Gagal memuat data wilayah.");
                return;
            }

            const d = json.data;
            setDetail(d);
            setForm({
                cityid:     d.cityid,
                regioncode: d.regioncode,
                regionname: d.regionname,
            });
        } catch {
            setError("Terjadi kesalahan koneksi. Pastikan server berjalan.");
        } finally {
            setIsFetching(false);
        }
    }, [rawId]);

    useEffect(() => {
        if (!isNew) fetchDetail();
    }, [isNew, fetchDetail]);

    // ── Fetch cities untuk dropdown ───────────────────────────────────────────

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setIsFetchingCities(true);
            try {
                const res  = await fetch("/api/master-data/cities?limit=500");
                const json = await res.json() as { ok: boolean; data?: { cityid: number; cityname: string }[] };
                if (!cancelled && json.ok && json.data) {
                    const opts: CityOption[] = [
                        { value: 0, label: ":: Pilih Kota ::" },
                        ...json.data.map((c) => ({ value: c.cityid, label: c.cityname })),
                    ];
                    setCities(opts);
                }
            } catch {
                // Gagal fetch cities — dropdown tetap dengan placeholder saja
            } finally {
                if (!cancelled) setIsFetchingCities(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // ── Submit ────────────────────────────────────────────────────────────────

    const handleSave = async () => {
        if (!form.regionname.trim()) {
            setError("Nama wilayah tidak boleh kosong.");
            return;
        }
        if (!form.regioncode.trim()) {
            setError("Kode wilayah tidak boleh kosong.");
            return;
        }
        if (!form.cityid) {
            setError("Silakan pilih kota terlebih dahulu.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const url    = isNew
                ? "/api/master-data/regions"
                : `/api/master-data/regions/${rawId}`;
            const method = isNew ? "POST" : "PUT";

            const res  = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const json = await res.json() as { ok: boolean; message?: string };

            if (!res.ok || !json.ok) {
                setError(json.message ?? "Gagal menyimpan data wilayah.");
                return;
            }

            setSuccess(true);
            setTimeout(() => router.push("/master-data/region"), 800);
        } catch {
            setError("Terjadi kesalahan koneksi. Pastikan server berjalan.");
        } finally {
            setIsLoading(false);
        }
    };

    // ── Derived display values ────────────────────────────────────────────────

    const pageTitle = isNew
        ? ":: Wilayah Baru"
        : `:: ${detail?.regionname ?? "Memuat..."}`;

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            <Navbar />

            <main className="flex-1 flex overflow-hidden">
                <Sidebar />

                <section className="flex-1 flex flex-col bg-background-light overflow-hidden">

                    {/* ── Action Header ───────────────────────────────────── */}
                    <div className="px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/5 bg-white/50 backdrop-blur-sm shrink-0">
                        <div className="flex items-start md:items-center gap-3 md:gap-4 w-full md:w-auto">
                            <button
                                onClick={() => router.push("/master-data/region")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        {isFetching
                                            ? <span className="inline-block h-5 w-48 bg-slate-200 rounded animate-pulse align-middle" />
                                            : pageTitle
                                        }
                                    </h1>
                                    {!isFetching && (
                                        <span className={`px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest border ${
                                            isNew
                                                ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                                : "bg-green-100 text-green-700 border-green-200"
                                        }`}>
                                            {isNew ? "Draft" : "Aktif"}
                                        </span>
                                    )}
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    {isNew
                                        ? "Tambah wilayah baru ke dalam sistem."
                                        : "Edit data master wilayah."
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                            <button
                                onClick={handleReset}
                                disabled={isLoading || isFetching}
                                className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-200/50 rounded-lg transition-all border border-slate-200 md:border-transparent flex items-center gap-2 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-sm">refresh</span>
                                Reset
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isLoading || isFetching}
                                className="w-full md:w-auto justify-center px-4 md:px-5 py-2 text-xs md:text-sm font-bold bg-primary text-white hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-60 transition-all"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-sm">save</span>
                                        Simpan
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* ── Feedback Banner ─────────────────────────────────── */}
                    {error && (
                        <div className="mx-4 md:mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                            <span className="material-symbols-outlined text-base shrink-0">error</span>
                            {error}
                            {!isNew && (
                                <button
                                    onClick={fetchDetail}
                                    className="ml-auto text-xs font-semibold underline hover:no-underline"
                                >
                                    Coba lagi
                                </button>
                            )}
                        </div>
                    )}
                    {success && (
                        <div className="mx-4 md:mx-6 mt-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-700 text-sm">
                            <span className="material-symbols-outlined text-base shrink-0">check_circle</span>
                            Data wilayah berhasil disimpan. Mengalihkan...
                        </div>
                    )}

                    {/* ── Content Container ────────────────────────────────── */}
                    <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-6 pb-28 md:pb-6 gap-4 md:gap-6">
                        <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

                                {/* ── Left: Form (2/3) ────────────────────── */}
                                <div className="lg:col-span-2 space-y-6">

                                    {isFetching ? (
                                        <CardSkeleton />
                                    ) : (
                                        <>
                                            {/* Card: Informasi Wilayah */}
                                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                                <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-primary">map</span>
                                                    <h3 className="font-bold text-slate-800">Informasi Wilayah</h3>
                                                </div>
                                                <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">

                                                    {/* Kota */}
                                                    <FormField label="Kota *" className="sm:col-span-2">
                                                        {isFetchingCities ? (
                                                            <div className="h-9 w-full bg-slate-100 rounded-lg animate-pulse" />
                                                        ) : (
                                                            <FormSelect
                                                                value={String(form.cityid)}
                                                                onChange={(e) => handleChange("cityid", Number(e.target.value))}
                                                            >
                                                                {cities.map((c) => (
                                                                    <option key={c.value} value={c.value}>{c.label}</option>
                                                                ))}
                                                            </FormSelect>
                                                        )}
                                                    </FormField>

                                                    {/* Kode Wilayah */}
                                                    <FormField label="Kode Wilayah *">
                                                        <FormInput
                                                            value={form.regioncode}
                                                            placeholder="Contoh: JKT, JWB, SBY"
                                                            onChange={(e) => handleChange("regioncode", e.target.value)}
                                                        />
                                                    </FormField>

                                                    {/* Nama Wilayah */}
                                                    <FormField label="Nama Wilayah *">
                                                        <FormInput
                                                            value={form.regionname}
                                                            placeholder="Contoh: JAKARTA, JAWA BARAT"
                                                            onChange={(e) => handleChange("regionname", e.target.value)}
                                                        />
                                                    </FormField>

                                                </div>
                                            </div>

                                            {/* Card: Audit Info — hanya tampil di mode edit */}
                                            {!isNew && detail && (
                                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                                    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-primary">history</span>
                                                        <h3 className="font-bold text-slate-800">Informasi Audit</h3>
                                                    </div>
                                                    <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Dibuat</p>
                                                            <p className="font-medium text-slate-700">{formatDateTime(detail.created)}</p>
                                                            <p className="text-xs text-slate-500 mt-0.5">oleh {detail.createdby || "—"}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Diubah Terakhir</p>
                                                            <p className="font-medium text-slate-700">{formatDateTime(detail.modified)}</p>
                                                            <p className="text-xs text-slate-500 mt-0.5">oleh {detail.modifiedby || "—"}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* ── Right: Sidebar (1/3) ────────────────── */}
                                <div className="space-y-6">
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-0">
                                        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">info</span>
                                            <h3 className="font-bold text-slate-800">Informasi</h3>
                                        </div>
                                        <div className="p-4 md:p-6 space-y-3">
                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                Data wilayah digunakan sebagai referensi dalam transaksi penjualan, pelanggan, dan pengiriman barang berdasarkan area kota.
                                            </p>
                                            {!isNew && detail && (
                                                <div className="pt-3 border-t border-slate-100 space-y-2">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">ID Wilayah</span>
                                                        <span className="font-semibold text-slate-700">{detail.regionid}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">Dibuat oleh</span>
                                                        <span className="font-semibold text-slate-700">{detail.createdby || "—"}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">Status</span>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Aktif
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            {isNew && (
                                                <div className="pt-3 border-t border-slate-100">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">Status</span>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                            Draft
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <StatusBar />
        </div>
    );
}
