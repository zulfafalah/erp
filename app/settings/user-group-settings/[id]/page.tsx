"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import FormField from "../../../components/FormField";
import FormInput from "../../../components/FormInput";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockGroups: Record<string, { namaGrup: string; namaUser: string[] }> = {
    "1":  { namaGrup: "Administrator",  namaUser: ["ADMIN", "MOMO", "MOMO2", "TESTER"] },
    "2":  { namaGrup: "Admin_SO",       namaUser: ["ADMINSO"] },
    "3":  { namaGrup: "Akunting",       namaUser: ["HENRY"] },
    "4":  { namaGrup: "Boss",           namaUser: ["CATHERINE", "STEVAN", "BOSS", "UPPY"] },
    "5":  { namaGrup: "Gudang",         namaUser: ["GUDANG", "KAPUK", "AFRIZA"] },
    "6":  { namaGrup: "gudang_kasir",   namaUser: ["MELV"] },
    "7":  { namaGrup: "Kasir",          namaUser: ["EVA"] },
    "8":  { namaGrup: "Keuangan",       namaUser: ["NELLY", "ADMPLTANG", "LISA"] },
    "9":  { namaGrup: "Manager",        namaUser: ["STDR", "FERRY"] },
    "10": { namaGrup: "Pembelian",      namaUser: ["PEMBELIAN", "AGUSTINA"] },
    "11": { namaGrup: "Penjualan",      namaUser: ["KEVIN", "JESSICA", "LINA"] },
    "12": { namaGrup: "Staf",           namaUser: ["HANAFI"] },
    "13": { namaGrup: "Akuntansi_2",    namaUser: ["AQUALINA"] },
    "14": { namaGrup: "IT",             namaUser: ["DEV", "SUPPORT"] },
    "new": { namaGrup: "", namaUser: [] },
};



// ─── Detail Page ──────────────────────────────────────────────────────────────

export default function UserGroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const isNew = id === "new";
    const existing = mockGroups[id] ?? { namaGrup: "", namaUser: [] };

    const [namaGrup, setNamaGrup] = useState(existing.namaGrup);
    const [saved, setSaved]       = useState(false);

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
                        {/* Left: Back button + title */}
                        <div className="flex items-start md:items-center gap-3 md:gap-4 w-full md:w-auto">
                            <button
                                onClick={() => router.push("/settings/user-group-settings")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        {isNew ? "Tambah Grup Pengguna" : `Grup: ${namaGrup || "—"}`}
                                    </h1>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    {isNew
                                        ? "Isi keterangan nama grup dan pilih anggota pengguna."
                                        : "Edit data grup pengguna dan kelola keanggotaannya."}
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
                                onClick={() => router.push("/settings/user-group-settings")}
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
                                <p className="text-sm text-green-700 font-medium">Data grup pengguna berhasil disimpan.</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Left: Form */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Data Grup Card */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">group</span>
                                        <h3 className="font-bold text-slate-800">Data Grup Pengguna</h3>
                                    </div>
                                    <div className="p-4 md:p-6">
                                        <FormField label="Keterangan">
                                            <FormInput
                                                value={namaGrup}
                                                placeholder="Nama grup pengguna..."
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNamaGrup(e.target.value)}
                                            />
                                        </FormField>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Summary Sidebar */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-0">
                                    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">info</span>
                                        <h3 className="font-bold text-slate-800">Ringkasan Grup</h3>
                                    </div>
                                    <div className="p-4 md:p-6 space-y-4">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nama Grup</p>
                                            <p className="text-sm font-bold text-slate-800">{namaGrup || "—"}</p>
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
                                            onClick={() => setNamaGrup(existing.namaGrup)}
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
