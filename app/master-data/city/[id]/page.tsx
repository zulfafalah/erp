"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import FormInput from "../../../components/FormInput";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CityDetail {
    cityid: number;
    cityname: string;
    bunitid: number;
    created?: string;
    createdby?: string;
    modified?: string;
    modifiedby?: string;
}

interface DetailApiResponse {
    ok: boolean;
    data: CityDetail;
    message?: string;
}

interface MutateApiResponse {
    ok: boolean;
    message?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CityFormPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const isNew  = id === "new";
    const router = useRouter();

    const [cityname, setCityname]   = useState("");
    const [bunitid, setBunitid]     = useState<number>(0);
    const [detail, setDetail]       = useState<CityDetail | null>(null);
    const [isLoading, setIsLoading] = useState(!isNew);
    const [isSaving, setIsSaving]   = useState(false);
    const [error, setError]         = useState<string | null>(null);

    // ── Fetch detail (edit mode) ───────────────────────────────────────────────

    useEffect(() => {
        if (isNew) return;

        const fetchDetail = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res  = await fetch(`/api/master-data/cities/${id}`);
                const json = await res.json() as DetailApiResponse;

                if (!res.ok || !json.ok) {
                    setError(json.message ?? "Gagal memuat data kota.");
                    return;
                }

                const d = json.data;
                setCityname(d?.cityname ?? "");
                setBunitid(d?.bunitid ?? 0);
                setDetail(d ?? null);
            } catch {
                setError("Terjadi kesalahan koneksi. Pastikan server berjalan.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetail();
    }, [id, isNew]);

    // ── Save (create / update) ─────────────────────────────────────────────────

    const handleSave = async () => {
        if (!cityname.trim()) {
            alert("Nama kota tidak boleh kosong.");
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            const res = await fetch(
                isNew
                    ? "/api/master-data/cities"
                    : `/api/master-data/cities/${id}`,
                {
                    method: isNew ? "POST" : "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        cityname: cityname.trim(),
                        bunitid: Number(bunitid),
                    }),
                },
            );

            const json = await res.json() as MutateApiResponse;

            if (!res.ok || !json.ok) {
                setError(json.message ?? "Gagal menyimpan data kota.");
                return;
            }

            router.push("/master-data/city");
        } catch {
            setError("Terjadi kesalahan koneksi saat menyimpan data.");
        } finally {
            setIsSaving(false);
        }
    };

    // ── Reset ──────────────────────────────────────────────────────────────────

    const handleReset = () => {
        if (isNew) {
            setCityname("");
            setBunitid(0);
        } else {
            setIsLoading(true);
            setError(null);
            fetch(`/api/master-data/cities/${id}`)
                .then(r => r.json() as Promise<DetailApiResponse>)
                .then(json => {
                    if (json.ok) {
                        setCityname(json.data?.cityname ?? "");
                        setBunitid(json.data?.bunitid ?? 0);
                        setDetail(json.data ?? null);
                    }
                })
                .catch(() => setError("Gagal memuat ulang data."))
                .finally(() => setIsLoading(false));
        }
    };

    // ─── Helpers ──────────────────────────────────────────────────────────────

    const formatDate = (iso?: string) => {
        if (!iso) return "—";
        return new Date(iso).toLocaleString("id-ID", {
            day:    "2-digit",
            month:  "short",
            year:   "numeric",
            hour:   "2-digit",
            minute: "2-digit",
        });
    };

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            <Navbar />

            <main className="flex-1 flex overflow-hidden">
                <Sidebar />

                <section className="flex-1 flex flex-col bg-background-light overflow-hidden">

                    {/* ── Action Header ────────────────────────────────── */}
                    <div className="px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/5 bg-white/50 backdrop-blur-sm shrink-0">
                        <div className="flex items-start md:items-center gap-3 md:gap-4 w-full md:w-auto">
                            <button
                                onClick={() => router.push("/master-data/city")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                    {isNew ? "Tambah Kota Baru" : (isLoading ? "Memuat…" : cityname || "Data Kota")}
                                </h1>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    {isNew ? "Buat data kota baru di sistem." : "Edit data kota yang tersimpan."}
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
                            <button
                                onClick={handleSave}
                                disabled={isLoading || isSaving}
                                className="w-full md:w-auto justify-center px-4 md:px-5 py-2 text-xs md:text-sm font-bold bg-primary text-white hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-60"
                            >
                                {isSaving ? (
                                    <>
                                        <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                        Menyimpan…
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

                    {/* ── Content ──────────────────────────────────────── */}
                    <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-6 pb-28 md:pb-6 gap-4 md:gap-6">
                        <div className="flex-1 overflow-y-auto no-scrollbar pb-6">

                            {/* Error Banner */}
                            {error && (
                                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                                    <span className="material-symbols-outlined text-base shrink-0">error</span>
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

                                {/* Left: Form Card */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                        {/* Card Header */}
                                        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">location_city</span>
                                            <h3 className="font-bold text-slate-800">Informasi Kota</h3>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-4 md:p-6 space-y-4 md:space-y-5">
                                            {isLoading ? (
                                                <div className="space-y-3">
                                                    <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
                                                    <div className="h-10 bg-slate-100 rounded animate-pulse" />
                                                    <div className="h-4 w-24 bg-slate-100 rounded animate-pulse mt-4" />
                                                    <div className="h-10 bg-slate-100 rounded animate-pulse" />
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Nama Kota */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                            Nama Kota
                                                        </label>
                                                        <div className="sm:col-span-3 w-2/3">
                                                            <FormInput
                                                                placeholder="Masukkan nama kota"
                                                                value={cityname}
                                                                onChange={(e) => setCityname(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Business Unit ID */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                            Business Unit ID
                                                        </label>
                                                        <div className="sm:col-span-3 w-2/3">
                                                            <FormInput
                                                                type="number"
                                                                placeholder="Masukkan business unit ID"
                                                                value={String(bunitid)}
                                                                onChange={(e) => setBunitid(Number(e.target.value))}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Info Summary */}
                                <div className="space-y-6">
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-0">
                                        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">info</span>
                                            <h3 className="font-bold text-slate-800">Informasi</h3>
                                        </div>
                                        <div className="p-4 md:p-6 space-y-3">
                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                Data kota digunakan sebagai referensi dalam transaksi penjualan, pelanggan, dan pengiriman barang.
                                            </p>
                                            {!isNew && (
                                                <div className="pt-3 border-t border-slate-100 space-y-2">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">ID</span>
                                                        <span className="font-semibold text-slate-700">{id}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">Dibuat oleh</span>
                                                        <span className="font-semibold text-slate-700">{detail?.createdby ?? "—"}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">Dibuat pada</span>
                                                        <span className="font-semibold text-slate-700">{formatDate(detail?.created)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">Diubah oleh</span>
                                                        <span className="font-semibold text-slate-700">{detail?.modifiedby ?? "—"}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">Diubah pada</span>
                                                        <span className="font-semibold text-slate-700">{formatDate(detail?.modified)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">Status</span>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Aktif
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
