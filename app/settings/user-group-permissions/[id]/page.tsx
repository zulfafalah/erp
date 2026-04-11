"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import FormField from "../../../components/FormField";
import FormSelect from "../../../components/FormSelect";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PermissionData {
    level: string;
    form: string;
    open: boolean;
    save: boolean;
    edit: boolean;
    filter: boolean;
    approve: boolean;
    unApprove: boolean;
    delete: boolean;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const mockPermissions: Record<string, PermissionData> = {
    "1":  { level: "1 - Administrator", form: "Data Perpindahan Barang Antar Gudang (Terima)", open: true,  save: true,  edit: true,  filter: true,  approve: false, unApprove: false, delete: false },
    "2":  { level: "1 - Administrator", form: "Laporan Rekapitulasi Posang Dagang",            open: true,  save: false, edit: false, filter: false, approve: false, unApprove: false, delete: false },
    "3":  { level: "1 - Administrator", form: "Jurna Transfer",                                 open: true,  save: false, edit: false, filter: true,  approve: false, unApprove: false, delete: false },
    "4":  { level: "1 - Administrator", form: "Menu Laporan Utl Kas",                           open: true,  save: false, edit: false, filter: false, approve: false, unApprove: false, delete: false },
    "5":  { level: "1 - Administrator", form: "Pengguna",                                       open: true,  save: true,  edit: true,  filter: false, approve: false, unApprove: false, delete: false },
    "19": { level: "1 - Administrator", form: "Pencetakan Permintaan Dana",                     open: true,  save: true,  edit: true,  filter: true,  approve: true,  unApprove: false, delete: true  },
    "new": { level: "1 - Administrator", form: "", open: false, save: false, edit: false, filter: false, approve: false, unApprove: false, delete: false },
};

const LEVEL_OPTIONS = [
    "1 - Administrator",
    "2 - Admin_SO",
    "3 - Akunting",
    "4 - Boss",
    "5 - Gudang",
    "6 - Kasir",
    "7 - Keuangan",
];

const FORM_OPTIONS = [
    "Data Perpindahan Barang Antar Gudang (Terima)",
    "Laporan Rekapitulasi Posang Dagang",
    "Jurna Transfer",
    "Menu Laporan Utl Kas",
    "Pengguna",
    "Dokumen Pengeluaran Pembayaran Ke Pemasok",
    "Menu Pengguna",
    "Pengaturan Harga Penjualan Barang / Wilayah",
    "Monthly Posting-Unposting Keuangan",
    "Laporan Rekapitulasi Nota Pembelian Barang (PIV)",
    "Laporan Laba Rugi",
    "Form Debit Memo",
    "Pencetakan Permintaan Dana",
    "Mata Uang",
    "Pesanan Penjualan",
    "Faktur Penjualan",
    "Jurnal Umum",
    "Chart of Accounts",
];

// ─── Permission columns config ────────────────────────────────────────────────

const PERM_COLS: { key: keyof PermissionData; label: string; description: string; icon: string }[] = [
    { key: "open",      label: "Open",      description: "Izin membuka / melihat halaman ini",                  icon: "visibility"         },
    { key: "save",      label: "Save",      description: "Izin menyimpan data baru",                            icon: "save"               },
    { key: "edit",      label: "Edit",      description: "Izin mengubah data yang sudah ada",                   icon: "edit"               },
    { key: "filter",    label: "Filter",    description: "Izin menggunakan fitur filter / pencarian",           icon: "filter_list"        },
    { key: "approve",   label: "Approve",   description: "Izin melakukan approval / persetujuan",               icon: "check_circle"       },
    { key: "unApprove", label: "UnApprove", description: "Izin membatalkan approval (unapprove)",              icon: "cancel"             },
    { key: "delete",    label: "Delete",    description: "Izin menghapus data",                                  icon: "delete"             },
];

// ─── Detail Page ───────────────────────────────────────────────────────────────

export default function UserGroupPermissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const isNew  = id === "new";

    const defaultData: PermissionData = mockPermissions[id] ?? {
        level: "1 - Administrator",
        form: "",
        open: false, save: false, edit: false, filter: false,
        approve: false, unApprove: false, delete: false,
    };

    const [data, setData] = useState<PermissionData>(defaultData);
    const [saved, setSaved] = useState(false);

    const togglePerm = (key: keyof PermissionData) => {
        setData((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
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
                        {/* Left: Back + Title */}
                        <div className="flex items-start md:items-center gap-3 md:gap-4 w-full md:w-auto">
                            <button
                                onClick={() => router.push("/settings/user-group-permissions")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        {isNew ? "Tambah Hak Akses Baru" : `Hak Akses: ${data.form || "—"}`}
                                    </h1>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    {isNew
                                        ? "Pilih grup, form, dan atur permission yang diberikan."
                                        : `Level: ${data.level}`}
                                </p>
                            </div>
                        </div>
                        {/* Right: Action buttons */}
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                            <button
                                onClick={handleSave}
                                className="w-full md:w-auto justify-center px-4 md:px-5 py-2 text-xs md:text-sm font-bold bg-primary text-white hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">save</span>
                                Simpan
                            </button>
                            <button
                                onClick={() => router.push("/settings/user-group-permissions")}
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
                                <p className="text-sm text-green-700 font-medium">Hak akses berhasil disimpan.</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Left: Form */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Data Hak Akses Card */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                                        <h3 className="font-bold text-slate-800">Data Hak Akses</h3>
                                    </div>
                                    <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">

                                        <FormField label="Grup / Level">
                                            <FormSelect
                                                value={data.level}
                                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                                    setData((prev) => ({ ...prev, level: e.target.value }))
                                                }
                                            >
                                                {LEVEL_OPTIONS.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </FormSelect>
                                        </FormField>

                                        <FormField label="Nama Form">
                                            <FormSelect
                                                value={data.form}
                                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                                    setData((prev) => ({ ...prev, form: e.target.value }))
                                                }
                                            >
                                                <option value="">-- Pilih Form --</option>
                                                {FORM_OPTIONS.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </FormSelect>
                                        </FormField>

                                    </div>
                                </div>

                                {/* Permissions Card */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">lock_open</span>
                                        <h3 className="font-bold text-slate-800">Permission</h3>
                                    </div>
                                    <div className="p-4 md:p-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {PERM_COLS.map((col) => {
                                                const isChecked = data[col.key] as boolean;
                                                return (
                                                    <label
                                                        key={col.key}
                                                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                                            isChecked
                                                                ? "border-primary/40 bg-primary/5"
                                                                : "border-slate-200 bg-slate-50 hover:border-slate-300"
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => togglePerm(col.key)}
                                                            className="sr-only"
                                                        />
                                                        {/* Custom checkbox visual */}
                                                        <div className={`size-5 rounded flex items-center justify-center border-2 shrink-0 transition-all ${
                                                            isChecked
                                                                ? "border-primary bg-primary"
                                                                : "border-slate-300 bg-white"
                                                        }`}>
                                                            {isChecked && (
                                                                <span className="material-symbols-outlined text-white !text-[12px]">check</span>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`material-symbols-outlined text-base ${isChecked ? "text-primary" : "text-slate-400"}`}>
                                                                    {col.icon}
                                                                </span>
                                                                <span className={`text-sm font-bold ${isChecked ? "text-primary" : "text-slate-600"}`}>
                                                                    {col.label}
                                                                </span>
                                                            </div>
                                                            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{col.description}</p>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Right: Summary Sidebar */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-0">
                                    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">info</span>
                                        <h3 className="font-bold text-slate-800">Ringkasan</h3>
                                    </div>
                                    <div className="p-4 md:p-6 space-y-4">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Grup / Level</p>
                                            <p className="text-sm font-bold text-slate-800">{data.level || "—"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nama Form</p>
                                            <p className="text-sm font-bold text-slate-800">{data.form || "—"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Permission Aktif</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {PERM_COLS.filter((col) => data[col.key] as boolean).map((col) => (
                                                    <span key={col.key} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                                                        <span className="material-symbols-outlined !text-[11px]">{col.icon}</span>
                                                        {col.label}
                                                    </span>
                                                ))}
                                                {PERM_COLS.filter((col) => data[col.key] as boolean).length === 0 && (
                                                    <span className="text-xs text-slate-400 italic">Tidak ada permission aktif</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-1 gap-2">
                                        <button
                                            onClick={handleSave}
                                            className="py-3 bg-primary text-white rounded font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                        >
                                            <span className="material-symbols-outlined">save</span>
                                            SIMPAN
                                        </button>
                                        <button
                                            onClick={() => setData(defaultData)}
                                            className="py-2 bg-white border border-slate-200 text-slate-600 rounded text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <span className="material-symbols-outlined !text-sm">refresh</span>
                                            RESET
                                        </button>
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
