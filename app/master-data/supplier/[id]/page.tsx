"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import FormField from "../../../components/FormField";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
import FormTextarea from "../../../components/FormTextarea";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Response shape dari GET /api/v1/suppliers/{id}/ */
interface SupplierDetail {
    supplierid: number;
    suppcode: string;
    companyname: string;
    contactname: string;
    contacttitle: string;
    address: string;
    phone: string;
    islocal: number;
    region: string;
    coa21: number;
    tempobyr: number;
    email: string;
    fax: string;
    homepage: string;
    currencyid: string;
    isactive: number;
    created: string;
    createdby: string;
    modified: string;
    modifiedby: string;
}

/** State form — field yang dikirim saat POST/PUT */
interface SupplierFormState {
    companyname: string;
    contacttitle: string;
    contactname: string;
    address: string;
    phone: string;
    /** 1 = Lokal, 0 = Importir */
    islocal: number;
    region: number;
    coa21: number;
}

const INITIAL_FORM: SupplierFormState = {
    companyname: "",
    contacttitle: "",
    contactname: "",
    address: "",
    phone: "",
    islocal: 1,
    region: 0,
    coa21: 0,
};

// ─── Dropdown option types ────────────────────────────────────────────────────

interface RegionOption {
    value: number;
    label: string;
}

interface AccountOption {
    value: number;
    label: string;
}

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
                {Array.from({ length: 6 }).map((_, i) => <FieldSkeleton key={i} />)}
            </div>
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PemasokFormPage() {
    const router = useRouter();
    const params = useParams();

    // id dari URL — "new" untuk create, angka/string untuk edit
    const rawId = Array.isArray(params.id) ? params.id[0] : (params.id ?? "new");
    const isNew = rawId === "new";

    // ── UI State ──────────────────────────────────────────────────────────────
    const [form, setForm]               = useState<SupplierFormState>(INITIAL_FORM);
    const [detail, setDetail]           = useState<SupplierDetail | null>(null);
    const [isFetching, setIsFetching]   = useState(!isNew);   // skeleton awal
    const [isLoading, setIsLoading]     = useState(false);    // submit
    const [error, setError]             = useState<string | null>(null);
    const [success, setSuccess]         = useState(false);

    // ── Regions dari API ──────────────────────────────────────────────────────
    const [regions, setRegions]                   = useState<RegionOption[]>([]);
    const [isFetchingRegions, setIsFetchingRegions] = useState(true);

    // ── Accounts (COA) dari API ───────────────────────────────────────────────
    const [accounts, setAccounts]               = useState<AccountOption[]>([]);
    const [isFetchingAccounts, setIsFetchingAccounts] = useState(true);

    // ── Helpers ───────────────────────────────────────────────────────────────

    const handleChange = (field: keyof SupplierFormState, value: string | number) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setError(null);
        setSuccess(false);
    };

    const handleReset = () => {
        if (detail) {
            // Edit mode: kembalikan ke data asli dari server
            setForm({
                companyname:  detail.companyname,
                contacttitle: detail.contacttitle,
                contactname:  detail.contactname,
                address:      detail.address,
                phone:        detail.phone,
                islocal:      detail.islocal,
                region:       parseInt(detail.region) || 0,
                coa21:        detail.coa21,
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
            const res = await fetch(`/api/master-data/suppliers/${rawId}`);
            const json = await res.json() as { ok: boolean; data?: SupplierDetail; message?: string };

            if (!res.ok || !json.ok || !json.data) {
                setError(json.message ?? "Gagal memuat data pemasok.");
                return;
            }

            const d = json.data;
            setDetail(d);
            setForm({
                companyname:  d.companyname,
                contacttitle: d.contacttitle,
                contactname:  d.contactname,
                address:      d.address,
                phone:        d.phone,
                islocal:      d.islocal,
                region:       parseInt(d.region) || 0,
                coa21:        d.coa21,
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

    // ── Fetch regions untuk dropdown ──────────────────────────────────────────

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setIsFetchingRegions(true);
            try {
                const res  = await fetch("/api/master-data/regions?limit=500");
                const json = await res.json() as {
                    ok: boolean;
                    data?: { regionid: number; regionname: string; regioncode: string }[];
                };
                if (!cancelled && json.ok && json.data) {
                    const opts: RegionOption[] = [
                        { value: 0, label: ":: Pilih Wilayah ::" },
                        ...json.data.map((r) => ({
                            value: r.regionid,
                            label: r.regionname,
                        })),
                    ];
                    setRegions(opts);
                }
            } catch {
                // Gagal fetch regions — dropdown tetap kosong dengan placeholder
            } finally {
                if (!cancelled) setIsFetchingRegions(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // ── Fetch accounts (COA) untuk dropdown ───────────────────────────────────

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setIsFetchingAccounts(true);
            try {
                const res  = await fetch("/api/accounting/accounts?page_size=500");
                const json = await res.json() as { ok: boolean; data?: { primarykey: number; code: string; name: string }[] };
                if (!cancelled && json.ok && json.data) {
                    const opts: AccountOption[] = [
                        { value: 0, label: ":: Pilih Account ::" },
                        ...json.data.map((a) => ({
                            value: a.primarykey,
                            label: `${a.code} - ${a.name}`,
                        })),
                    ];
                    setAccounts(opts);
                }
            } catch {
                // Gagal fetch accounts — dropdown tetap kosong dengan placeholder
            } finally {
                if (!cancelled) setIsFetchingAccounts(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // ── Submit ────────────────────────────────────────────────────────────────

    const handleSave = async () => {
        if (!form.companyname.trim()) {
            setError("Nama pemasok tidak boleh kosong.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const url    = isNew
                ? "/api/master-data/suppliers"
                : `/api/master-data/suppliers/${rawId}`;
            const method = isNew ? "POST" : "PUT";

            const res  = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const json = await res.json() as { ok: boolean; message?: string };

            if (!res.ok || !json.ok) {
                setError(json.message ?? "Gagal menyimpan data pemasok.");
                return;
            }

            setSuccess(true);
            setTimeout(() => router.push("/master-data/supplier"), 800);
        } catch {
            setError("Terjadi kesalahan koneksi. Pastikan server berjalan.");
        } finally {
            setIsLoading(false);
        }
    };

    // ── Derived display values ────────────────────────────────────────────────

    const pageTitle = isNew
        ? ":: Data Pemasok Baru"
        : `:: ${detail?.suppcode ?? "Memuat..."}`;

    const badgeClass  = detail?.isactive === 1
        ? "bg-green-100 text-green-700 border-green-200"
        : isNew
            ? "bg-yellow-100 text-yellow-700 border-yellow-200"
            : "bg-slate-100 text-slate-600 border-slate-200";

    const badgeLabel  = detail?.isactive === 1 ? "Aktif" : isNew ? "Draft" : "Nonaktif";

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
                                onClick={() => router.push("/master-data/supplier")}
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
                                        <span className={`px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest border ${badgeClass}`}>
                                            {badgeLabel}
                                        </span>
                                    )}
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    {isNew
                                        ? "Tambah pemasok/supplier baru ke dalam sistem."
                                        : "Edit data master pemasok/supplier."
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
                            Data pemasok berhasil disimpan. Mengalihkan...
                        </div>
                    )}

                    {/* ── Content Container ────────────────────────────────── */}
                    <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-6 pb-28 md:pb-6 gap-4 md:gap-6">
                        <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

                                {/* ── Left: Form (2/3) ────────────────────── */}
                                <div className="lg:col-span-2 space-y-6">

                                    {isFetching ? (
                                        <>
                                            <CardSkeleton />
                                            <CardSkeleton />
                                        </>
                                    ) : (
                                        <>
                                            {/* Card: Informasi Perusahaan */}
                                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                                <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-primary">local_shipping</span>
                                                    <h3 className="font-bold text-slate-800">Informasi Perusahaan</h3>
                                                </div>
                                                <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">

                                                    {/* Kode Pemasok — read-only */}
                                                    <FormField label="Kode Pemasok">
                                                        <FormInput
                                                            value={detail?.suppcode ?? ""}
                                                            placeholder="— Di-generate otomatis —"
                                                            disabled
                                                        />
                                                    </FormField>

                                                    {/* Nama Perusahaan */}
                                                    <FormField label="Nama Pemasok *">
                                                        <FormInput
                                                            value={form.companyname}
                                                            placeholder="Nama perusahaan"
                                                            onChange={(e) => handleChange("companyname", e.target.value)}
                                                        />
                                                    </FormField>

                                                    {/* Gelar Kontak */}
                                                    <FormField label="Gelar Kontak">
                                                        <FormInput
                                                            value={form.contacttitle}
                                                            placeholder="Contoh: Bapak / Ibu / Dr."
                                                            onChange={(e) => handleChange("contacttitle", e.target.value)}
                                                        />
                                                    </FormField>

                                                    {/* Nama Kontak */}
                                                    <FormField label="Nama Kontak">
                                                        <FormInput
                                                            value={form.contactname}
                                                            placeholder="Nama PIC"
                                                            onChange={(e) => handleChange("contactname", e.target.value)}
                                                        />
                                                    </FormField>

                                                    {/* Telepon */}
                                                    <FormField label="Telepon">
                                                        <FormInput
                                                            value={form.phone}
                                                            placeholder="Nomor telepon"
                                                            type="tel"
                                                            onChange={(e) => handleChange("phone", e.target.value)}
                                                        />
                                                    </FormField>

                                                    {/* Jenis Pemasok */}
                                                    <FormField label="Jenis Pemasok">
                                                        <FormSelect
                                                            value={String(form.islocal)}
                                                            onChange={(e) => handleChange("islocal", Number(e.target.value))}
                                                        >
                                                            <option value="1">Lokal</option>
                                                            <option value="0">Importir</option>
                                                        </FormSelect>
                                                    </FormField>

                                                    {/* Alamat — full width */}
                                                    <FormField label="Alamat" className="sm:col-span-2">
                                                        <FormTextarea
                                                            value={form.address}
                                                            placeholder="Alamat lengkap"
                                                            rows={3}
                                                            onChange={(e) => handleChange("address", e.target.value)}
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
                                            <span className="material-symbols-outlined text-primary">payments</span>
                                            <h3 className="font-bold text-slate-800">Pengaturan Akuntansi</h3>
                                        </div>

                                        {isFetching ? (
                                            <div className="p-4 md:p-6 space-y-4">
                                                {Array.from({ length: 2 }).map((_, i) => (
                                                    <FieldSkeleton key={i} />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-4 md:p-6 space-y-4">

                                                {/* Wilayah / Region */}
                                                <FormField label="Wilayah">
                                                    {isFetchingRegions ? (
                                                        <div className="h-9 w-full bg-slate-100 rounded-lg animate-pulse" />
                                                    ) : (
                                                        <FormSelect
                                                            value={String(form.region)}
                                                            onChange={(e) => handleChange("region", Number(e.target.value))}
                                                        >
                                                            {regions.map((opt) => (
                                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                            ))}
                                                        </FormSelect>
                                                    )}
                                                </FormField>

                                                {/* Account Code (coa21) */}
                                                <FormField label="Account Code (COA)">
                                                    {isFetchingAccounts ? (
                                                        <div className="h-9 w-full bg-slate-100 rounded-lg animate-pulse" />
                                                    ) : (
                                                        <FormSelect
                                                            value={String(form.coa21)}
                                                            onChange={(e) => handleChange("coa21", Number(e.target.value))}
                                                        >
                                                            {accounts.map((opt) => (
                                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                            ))}
                                                        </FormSelect>
                                                    )}
                                                </FormField>

                                            </div>
                                        )}


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
