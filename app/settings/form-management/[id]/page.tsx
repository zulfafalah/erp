"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import FormField from "../../../components/FormField";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";

// ─── Types ────────────────────────────────────────────────────────────────────

type TipeModule = "Detil Menu" | "Menu Utama" | "Sub Menu" | "Laporan";

interface FormEntry {
    namaForm:    string;
    keterangan:  string;
    url:         string;
    tipeModule:  TipeModule;
    reportGroup: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockForms: Record<string, FormEntry> = {
    "1":  { namaForm: "menuakunting",    keterangan: "Menu Akunting",       url: "",                              tipeModule: "Detil Menu",  reportGroup: "" },
    "2":  { namaForm: "menukeuangan",    keterangan: "Menu Keuangan",       url: "",                              tipeModule: "Menu Utama",  reportGroup: "" },
    "3":  { namaForm: "menulaporan",     keterangan: "Menu Laporan",        url: "",                              tipeModule: "Menu Utama",  reportGroup: "" },
    "4":  { namaForm: "menupanel",       keterangan: "Menu Panel Utama",    url: "",                              tipeModule: "Menu Utama",  reportGroup: "" },
    "5":  { namaForm: "menupembelian",   keterangan: "Menu Pembelian",      url: "",                              tipeModule: "Menu Utama",  reportGroup: "" },
    "6":  { namaForm: "menupenerimaan",  keterangan: "Menu Penerimaan",     url: "",                              tipeModule: "Sub Menu",    reportGroup: "" },
    "7":  { namaForm: "menupengaturan",  keterangan: "Menu Pengaturan",     url: "",                              tipeModule: "Menu Utama",  reportGroup: "" },
    "8":  { namaForm: "menupengguna",    keterangan: "Menu Pengguna",       url: "",                              tipeModule: "Sub Menu",    reportGroup: "" },
    "9":  { namaForm: "menupengiriman",  keterangan: "Menu Pengiriman",     url: "",                              tipeModule: "Sub Menu",    reportGroup: "" },
    "10": { namaForm: "menupenjualan",   keterangan: "Menu Penjualan",      url: "",                              tipeModule: "Menu Utama",  reportGroup: "" },
    "12": { namaForm: "formchartofacc",  keterangan: "Chart of Accounts",   url: "/accounting/chart-of-accounts", tipeModule: "Detil Menu",  reportGroup: "Akunting" },
    "20": { namaForm: "formoutlet",      keterangan: "Data Outlet",          url: "/master-data/outlet",           tipeModule: "Detil Menu",  reportGroup: "Master Data" },
};

const emptyForm: FormEntry = {
    namaForm:    "",
    keterangan:  "",
    url:         "",
    tipeModule:  "Detil Menu",
    reportGroup: "",
};

const reportGroupOptions = [
    ":: Pilih Kode Akun ::",
    "Akunting",
    "Keuangan",
    "Penjualan",
    "Pembelian",
    "Persediaan",
    "Master Data",
    "Pengaturan",
    "Laporan",
];

// ─── Detail / Form Page ───────────────────────────────────────────────────────

export default function FormManagementDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id }  = use(params);
    const router  = useRouter();
    const isNew   = id === "new";
    const existing = mockForms[id] ?? emptyForm;

    const [form, setForm] = useState<FormEntry>({ ...existing });
    const [saved, setSaved] = useState(false);

    const set = (key: keyof FormEntry) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const pageTitle = isNew ? "Pembuatan Form Baru" : `Edit Form: ${existing.namaForm || id}`;

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
                        {/* Left: Back + title */}
                        <div className="flex items-start md:items-center gap-3 md:gap-4 w-full md:w-auto">
                            <button
                                onClick={() => router.push("/settings/form-management")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        {pageTitle}
                                    </h1>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    {isNew
                                        ? "Isi form di bawah untuk mendaftarkan form / modul baru ke dalam sistem."
                                        : "Edit informasi form / modul ini."}
                                </p>
                            </div>
                        </div>
                        {/* Right: Actions */}
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                            <button
                                onClick={handleSave}
                                className="w-full md:w-auto justify-center px-4 md:px-5 py-2 text-xs md:text-sm font-bold bg-primary text-white hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">save</span>
                                Simpan
                            </button>
                            <button
                                onClick={() => router.push("/settings/form-management")}
                                className="w-full md:w-auto justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-200/50 rounded-lg transition-all border border-slate-200 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">close</span>
                                Batal
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-8 pb-28 md:pb-8 space-y-6">

                        {/* Success Toast */}
                        {saved && (
                            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                                <span className="material-symbols-outlined text-green-600 text-base">check_circle</span>
                                <p className="text-sm text-green-700 font-medium">Data form berhasil disimpan.</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Left: Form Card */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Informasi Form */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">description</span>
                                        <h3 className="font-bold text-slate-800">Informasi Form</h3>
                                    </div>
                                    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                                        <FormField label="Nama Form">
                                            <FormInput
                                                value={form.namaForm}
                                                onChange={set("namaForm")}
                                                placeholder="Contoh: menuakunting"
                                            />
                                        </FormField>
                                        <FormField label="Keterangan">
                                            <FormInput
                                                value={form.keterangan}
                                                onChange={set("keterangan")}
                                                placeholder="Deskripsi singkat form ini"
                                            />
                                        </FormField>
                                        <FormField label="URL">
                                            <FormInput
                                                value={form.url}
                                                onChange={set("url")}
                                                placeholder="Contoh: /settings/form-management"
                                            />
                                        </FormField>
                                        <FormField label="Tipe Module">
                                            <FormSelect
                                                value={form.tipeModule}
                                                onChange={set("tipeModule")}
                                            >
                                                <option value="Detil Menu">Detil Menu</option>
                                                <option value="Menu Utama">Menu Utama</option>
                                                <option value="Sub Menu">Sub Menu</option>
                                                <option value="Laporan">Laporan</option>
                                            </FormSelect>
                                        </FormField>
                                        <FormField label="Report Group">
                                            <FormSelect
                                                value={form.reportGroup}
                                                onChange={set("reportGroup")}
                                            >
                                                {reportGroupOptions.map((opt) => (
                                                    <option
                                                        key={opt}
                                                        value={opt === ":: Pilih Kode Akun ::" ? "" : opt}
                                                    >
                                                        {opt}
                                                    </option>
                                                ))}
                                            </FormSelect>
                                        </FormField>
                                    </div>
                                </div>

                            </div>

                            {/* Right: Sidebar */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-0">
                                    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">settings</span>
                                        <h3 className="font-bold text-slate-800">Aksi</h3>
                                    </div>

                                    {saved && (
                                        <div className="mx-4 mt-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                                            <span className="material-symbols-outlined text-green-600 text-base">check_circle</span>
                                            <p className="text-xs text-green-700 font-medium">Data berhasil disimpan.</p>
                                        </div>
                                    )}

                                    <div className="p-4 grid grid-cols-2 gap-2">
                                        <button
                                            onClick={handleSave}
                                            className="col-span-2 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                        >
                                            <span className="material-symbols-outlined">save</span>
                                            SIMPAN
                                        </button>
                                        <button
                                            onClick={() => setForm({ ...existing })}
                                            className="py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <span className="material-symbols-outlined !text-sm">refresh</span>
                                            RESET
                                        </button>
                                        <button className="py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                                            <span className="material-symbols-outlined !text-sm">help</span>
                                            INFO
                                        </button>
                                    </div>

                                    {/* Summary Info */}
                                    <div className="px-4 pb-4">
                                        <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 space-y-3">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ringkasan</p>
                                            <div className="flex items-start gap-2 text-xs text-slate-600">
                                                <span className="material-symbols-outlined !text-sm text-slate-400 mt-0.5">badge</span>
                                                <div>
                                                    <span className="text-slate-400">Nama Form</span>
                                                    <p className="font-semibold text-slate-800">{form.namaForm || "—"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2 text-xs text-slate-600">
                                                <span className="material-symbols-outlined !text-sm text-slate-400 mt-0.5">category</span>
                                                <div>
                                                    <span className="text-slate-400">Tipe Module</span>
                                                    <p className="font-semibold text-slate-800">{form.tipeModule}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2 text-xs text-slate-600">
                                                <span className="material-symbols-outlined !text-sm text-slate-400 mt-0.5">link</span>
                                                <div>
                                                    <span className="text-slate-400">URL</span>
                                                    <p className="font-semibold text-slate-800 truncate">{form.url || "—"}</p>
                                                </div>
                                            </div>
                                            {form.reportGroup && (
                                                <div className="flex items-start gap-2 text-xs text-slate-600">
                                                    <span className="material-symbols-outlined !text-sm text-slate-400 mt-0.5">folder</span>
                                                    <div>
                                                        <span className="text-slate-400">Report Group</span>
                                                        <p className="font-semibold text-slate-800">{form.reportGroup}</p>
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

            {/* Footer StatusBar */}
            <StatusBar />
        </div>
    );
}
