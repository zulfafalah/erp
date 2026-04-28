"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = "header";

const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "header", label: "Data Akun Perkiraan", icon: "account_tree" },
];

interface AccountDetail {
    primarykey: number;
    code: string;
    name: string;
    accounttype: string;
    accounttypekey: number | null;
    groupkey: number | null;
    groupname: string;
    parentkey: number | null;
    parentname: string | null;
    currac_idf: number | null;
    currencyname: string | null;
    isbank: number;
    coa0: number;
    limit_saldo_val: string | null;
    createdby: string;
    modifiedby: string;
    created: string;
    modified: string;
}

interface FormState {
    code: string;
    name: string;
    accounttypekey: string;
    groupkey: string;
    parentkey: string;
    currac_idf: string;
    limit_saldo_val: string;
    isbank: boolean;
    coa0: boolean;
}

const emptyForm: FormState = {
    code: "",
    name: "",
    accounttypekey: "",
    groupkey: "",
    parentkey: "",
    currac_idf: "",
    limit_saldo_val: "",
    isbank: false,
    coa0: false,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChartOfAccountDetailPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = params?.id ?? "";
    const isNew = id === "new";

    const [activeTab, setActiveTab] = useState<TabKey>("header");
    const [form,      setForm]      = useState<FormState>(emptyForm);
    const [detail,    setDetail]    = useState<AccountDetail | null>(null);
    const [loading,   setLoading]   = useState(!isNew);
    const [saving,    setSaving]    = useState(false);
    const [deleting,  setDeleting]  = useState(false);
    const [error,     setError]     = useState<string | null>(null);
    const [saved,     setSaved]     = useState(false);

    // ── Fetch detail (edit mode) ──────────────────────────────────────────────

    useEffect(() => {
        if (isNew) return;
        setLoading(true);
        fetch(`/api/accounting/accounts/${id}`)
            .then((r) => r.json())
            .then((json: { ok: boolean; data?: AccountDetail; message?: string }) => {
                if (!json.ok || !json.data) throw new Error(json.message ?? "Data tidak ditemukan.");
                const d = json.data;
                setDetail(d);
                setForm({
                    code:          d.code ?? "",
                    name:          d.name ?? "",
                    accounttypekey: d.accounttypekey != null ? String(d.accounttypekey) : "",
                    groupkey:      d.groupkey != null ? String(d.groupkey) : "",
                    parentkey:     d.parentkey != null ? String(d.parentkey) : "",
                    currac_idf:    d.currac_idf != null ? String(d.currac_idf) : "",
                    limit_saldo_val: d.limit_saldo_val ?? "",
                    isbank:        d.isbank === 1,
                    coa0:          d.coa0 === 1,
                });
            })
            .catch((e: Error) => setError(e.message))
            .finally(() => setLoading(false));
    }, [id, isNew]);

    // ── Form helpers ──────────────────────────────────────────────────────────

    const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const buildPayload = () => ({
        code:           form.code,
        name:           form.name,
        accounttypekey: form.accounttypekey ? Number(form.accounttypekey) : null,
        groupkey:       form.groupkey       ? Number(form.groupkey)       : null,
        parentkey:      form.parentkey      ? Number(form.parentkey)      : null,
        currac_idf:     form.currac_idf     ? Number(form.currac_idf)     : null,
        limit_saldo_val: form.limit_saldo_val || null,
        isbank:         form.isbank ? 1 : 0,
        coa0:           form.coa0   ? 1 : 0,
    });

    // ── Save ──────────────────────────────────────────────────────────────────

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const url    = isNew ? "/api/accounting/accounts" : `/api/accounting/accounts/${id}`;
            const method = isNew ? "POST" : "PATCH";
            const res    = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(buildPayload()),
            });
            const json = await res.json() as { ok: boolean; data?: AccountDetail; message?: string };
            if (!json.ok) throw new Error(json.message ?? "Gagal menyimpan.");
            setSaved(true);
            if (isNew && json.data) {
                router.push(`/accounting/chart-of-accounts/${json.data.primarykey}`);
            }
        } catch (e: unknown) {
            const err = e as Error;
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    // ── Delete (soft) ─────────────────────────────────────────────────────────

    const handleDelete = async () => {
        if (!confirm(`Nonaktifkan akun "${detail?.name}"?`)) return;
        setDeleting(true);
        try {
            const res  = await fetch(`/api/accounting/accounts/${id}`, { method: "DELETE" });
            const json = await res.json() as { ok: boolean; message?: string };
            if (!json.ok) throw new Error(json.message);
            router.push("/accounting/chart-of-accounts");
        } catch (e: unknown) {
            const err = e as Error;
            setError(err.message);
        } finally {
            setDeleting(false);
        }
    };

    // ── Status helpers ────────────────────────────────────────────────────────

    const isActive = !form.coa0;
    const statusLabel = isActive ? "Aktif" : "Non Aktif";
    const statusClass = isActive
        ? "bg-green-100 text-green-700 border-green-200"
        : "bg-red-100 text-red-700 border-red-200";

    // ─────────────────────────────────────────────────────────────────────────

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
                                onClick={() => router.push("/accounting/chart-of-accounts")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        {isNew ? "Tambah Akun Baru" : (detail?.name || "Data Akun Perkiraan")}
                                    </h1>
                                    {!isNew && (
                                        <span className={`px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest border ${statusClass}`}>
                                            {statusLabel}
                                        </span>
                                    )}
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    {isNew
                                        ? "Buat entri akun baru dalam Chart of Accounts."
                                        : `Kode: ${detail?.code ?? "—"} · Grup: ${detail?.groupname ?? "—"}`}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                            {!isNew && (
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-sm">
                                        {deleting ? "hourglass_top" : "delete"}
                                    </span>
                                    {deleting ? "Menghapus…" : "Nonaktifkan"}
                                </button>
                            )}
                            <button
                                onClick={() => { setForm(emptyForm); setSaved(false); setError(null); }}
                                className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-200/50 rounded-lg transition-all border border-slate-200 md:border-transparent flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">refresh</span>
                                Reset
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full md:w-auto justify-center px-4 md:px-5 py-2 text-xs md:text-sm font-bold bg-primary text-white hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-60"
                            >
                                <span className="material-symbols-outlined text-sm">
                                    {saving ? "hourglass_top" : "save"}
                                </span>
                                {saving ? "Menyimpan…" : "Simpan"}
                            </button>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="mx-4 md:mx-6 mt-4 flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm shrink-0">
                            <span className="material-symbols-outlined text-base">error</span>
                            {error}
                        </div>
                    )}

                    {/* Success Banner */}
                    {saved && !error && (
                        <div className="mx-4 md:mx-6 mt-4 flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm shrink-0">
                            <span className="material-symbols-outlined text-base">check_circle</span>
                            Data berhasil disimpan.
                        </div>
                    )}

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

                        {/* ── Tab: Header ─────────────────────────────────────── */}
                        {activeTab === "header" && (
                            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                                {loading ? (
                                    <div className="space-y-3">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="h-10 bg-slate-100 rounded animate-pulse" />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4 md:gap-6">
                                        {/* Form */}
                                        <div className="space-y-6">
                                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                                <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-primary">account_tree</span>
                                                    <h3 className="font-bold text-slate-800">Informasi Akun</h3>
                                                </div>
                                                <div className="p-4 md:p-6 space-y-4">

                                                    {/* Kode Akun */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">Kode Akun</label>
                                                        <div className="sm:col-span-3">
                                                            <FormInput
                                                                value={form.code}
                                                                onChange={(e) => setField("code", e.target.value)}
                                                                placeholder="mis. 110.01.01"
                                                                className="w-40"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Keterangan Akun */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">Keterangan Akun</label>
                                                        <div className="sm:col-span-3">
                                                            <FormInput
                                                                value={form.name}
                                                                onChange={(e) => setField("name", e.target.value)}
                                                                placeholder="Nama akun"
                                                                className="w-full"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Tipe Akun (accounttypekey) */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">Tipe Akun</label>
                                                        <div className="sm:col-span-3">
                                                            <FormInput
                                                                value={form.accounttypekey}
                                                                onChange={(e) => setField("accounttypekey", e.target.value)}
                                                                placeholder="ID tipe akun"
                                                                type="number"
                                                                className="w-36"
                                                            />
                                                            {detail?.accounttype && (
                                                                <p className="text-xs text-slate-400 mt-1">{detail.accounttype}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Grup Akun (groupkey) */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">Grup Akun</label>
                                                        <div className="sm:col-span-3">
                                                            <FormInput
                                                                value={form.groupkey}
                                                                onChange={(e) => setField("groupkey", e.target.value)}
                                                                placeholder="ID grup akun"
                                                                type="number"
                                                                className="w-36"
                                                            />
                                                            {detail?.groupname && (
                                                                <p className="text-xs text-slate-400 mt-1">{detail.groupname}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Parent Key */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">Parent Key</label>
                                                        <div className="sm:col-span-3">
                                                            <FormInput
                                                                value={form.parentkey}
                                                                onChange={(e) => setField("parentkey", e.target.value)}
                                                                placeholder="ID parent (kosongkan jika tidak ada)"
                                                                type="number"
                                                                className="w-48"
                                                            />
                                                            {detail?.parentname && (
                                                                <p className="text-xs text-slate-400 mt-1">{detail.parentname}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Mata Uang (currac_idf) */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">Mata Uang</label>
                                                        <div className="sm:col-span-3">
                                                            <FormInput
                                                                value={form.currac_idf}
                                                                onChange={(e) => setField("currac_idf", e.target.value)}
                                                                placeholder="ID mata uang"
                                                                type="number"
                                                                className="w-36"
                                                            />
                                                            {detail?.currencyname && (
                                                                <p className="text-xs text-slate-400 mt-1">{detail.currencyname}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Limit Saldo */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">Limit Saldo</label>
                                                        <div className="sm:col-span-3">
                                                            <FormInput
                                                                value={form.limit_saldo_val}
                                                                onChange={(e) => setField("limit_saldo_val", e.target.value)}
                                                                placeholder="0.00"
                                                                type="number"
                                                                className="w-full max-w-xs"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Bank */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">Bank</label>
                                                        <div className="sm:col-span-3 flex items-center gap-3">
                                                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={form.isbank}
                                                                    onChange={(e) => setField("isbank", e.target.checked)}
                                                                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/50"
                                                                />
                                                                <span className="text-sm text-slate-600">
                                                                    {form.isbank ? "Ya, ini akun bank" : "Bukan akun bank"}
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>

                                                    {/* Non Aktif (coa0) */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">Non Aktif</label>
                                                        <div className="sm:col-span-3 flex items-center gap-3">
                                                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={form.coa0}
                                                                    onChange={(e) => setField("coa0", e.target.checked)}
                                                                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/50"
                                                                />
                                                                <span className="text-sm text-slate-600">
                                                                    {form.coa0 ? "Akun non aktif (soft-deleted)" : "Akun aktif"}
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <StatusBar />
        </div>
    );
}
