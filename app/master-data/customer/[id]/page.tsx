"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import FormField from "../../../components/FormField";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";

// ── Types ──────────────────────────────────────────────────────────────────
type TabKey = "header" | "keuangan" | "attachments";

const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "header", label: "Data Pelanggan", icon: "person" },
    { key: "keuangan", label: "Konfigurasi Keuangan", icon: "account_balance" },
];

const fmt = (v: number) =>
    new Intl.NumberFormat("id-ID", { style: "decimal", minimumFractionDigits: 2 }).format(v);

// ── Mock summary values ────────────────────────────────────────────────────
const sisaPiutang = 3960000;
const limitKredit = 5000000;
const totalTransaksi = 8185000;

export default function CustomerDetailPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabKey>("header");

    // ── Controlled state ──────────────────────────────────────────────────
    const [isEksportir, setIsEksportir] = useState(false);
    const [blocked, setBlocked] = useState(false);

    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            {/* Top Navigation Bar */}
            <Navbar />

            <main className="flex-1 flex overflow-hidden">
                {/* Sidebar Navigation */}
                <Sidebar />

                {/* Main Content Area */}
                <section className="flex-1 flex flex-col bg-background-light overflow-hidden">

                    {/* ── Action Header ── */}
                    <div className="px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/5 bg-white/50 backdrop-blur-sm shrink-0">
                        <div className="flex items-start md:items-center gap-3 md:gap-4 w-full md:w-auto">
                            <button
                                onClick={() => router.push("/master-data/customer")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        Data Pelanggan
                                    </h1>
                                    <span className={`px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest border ${blocked
                                        ? "bg-red-100 text-red-700 border-red-200"
                                        : "bg-green-100 text-green-700 border-green-200"
                                        }`}>
                                        {blocked ? "Blocked" : "Aktif"}
                                    </span>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    A.0001 — Kelola &amp; perbarui informasi master data pelanggan.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-200/50 rounded-lg transition-all border border-slate-200 md:border-transparent flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">refresh</span>
                                Reset
                            </button>
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold bg-white text-primary border border-primary/20 hover:border-primary rounded-lg transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">print</span>
                                Print
                            </button>
                            <button className="w-full md:w-auto justify-center px-4 md:px-5 py-2 text-xs md:text-sm font-bold bg-primary text-white hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">save</span>
                                Simpan Pelanggan
                            </button>
                        </div>
                    </div>

                    {/* ── Tab System Container ── */}
                    <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-6 pb-28 md:pb-6 gap-4 md:gap-6">

                        {/* Tabs Selector */}
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

                        {/* ═══════════════════════════════════════════════════════
                            TAB 1: Data Pelanggan (identitas & lokasi)
                        ═══════════════════════════════════════════════════════ */}
                        {activeTab === "header" && (
                            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

                                    {/* ── Left: Form Cards ── */}
                                    <div className="lg:col-span-2 space-y-6">

                                        {/* Card: Identitas Pelanggan */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">person</span>
                                                <h3 className="font-bold text-slate-800">Identitas Pelanggan</h3>
                                            </div>
                                            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">

                                                {/* Kode + Is Eksportir */}
                                                <FormField label="Kode">
                                                    <div className="flex items-center gap-3">
                                                        <FormInput defaultValue="A.0001" className="flex-1" />
                                                        <label className="flex items-center gap-1.5 whitespace-nowrap cursor-pointer select-none">
                                                            <input
                                                                type="checkbox"
                                                                checked={isEksportir}
                                                                onChange={(e) => setIsEksportir(e.target.checked)}
                                                                className="w-3.5 h-3.5 accent-primary"
                                                            />
                                                            <span className="text-xs font-medium text-slate-600">Is Eksportir?</span>
                                                        </label>
                                                    </div>
                                                </FormField>

                                                {/* Nama ~ Gelar */}
                                                <FormField label="Nama ~ Gelar">
                                                    <div className="flex gap-2">
                                                        <FormInput placeholder="Nama Pelanggan..." className="flex-1" />
                                                        <FormSelect className="w-24">
                                                            <option>BPK</option>
                                                            <option>IBU</option>
                                                            <option>PT.</option>
                                                            <option>CV.</option>
                                                            <option>UD.</option>
                                                            <option>TK.</option>
                                                        </FormSelect>
                                                    </div>
                                                </FormField>

                                                {/* Kontak */}
                                                <FormField label="Kontak">
                                                    <FormInput placeholder="Nama kontak person..." />
                                                </FormField>

                                                {/* Kategori Pelanggan */}
                                                <FormField label="Kategori Pelanggan">
                                                    <div className="flex gap-2 items-center">
                                                        <FormSelect className="flex-1">
                                                            <option value="">:: Pilih Kategori ::</option>
                                                            <option>Kategori A</option>
                                                            <option>Kategori B</option>
                                                            <option>Kategori C</option>
                                                        </FormSelect>
                                                        <span className="text-[10px] text-slate-400 whitespace-nowrap">[* Klasifikasi Harga Jual]</span>
                                                    </div>
                                                </FormField>

                                                {/* Penjual */}
                                                <FormField label="Penjual" className="sm:col-span-2">
                                                    <FormSelect>
                                                        <option value="">:: Pilih Nama Penjual ::</option>
                                                        <option>Mariana</option>
                                                        <option>SANDRY</option>
                                                        <option>ANGGUN</option>
                                                        <option>DHANI</option>
                                                    </FormSelect>
                                                </FormField>

                                                {/* Telp & Whatsapp No. & Email */}
                                                <FormField label="Telp &amp; Whatsapp &amp; Email" className="sm:col-span-2">
                                                    <div className="flex gap-2">
                                                        <FormInput placeholder="No. Telepon..." className="flex-1" />
                                                        <FormInput placeholder="No. Whatsapp..." className="flex-1" />
                                                        <FormInput placeholder="Email..." className="flex-1" />
                                                    </div>
                                                </FormField>

                                            </div>
                                        </div>

                                    </div>

                                    {/* ── Right: Lokasi & Alamat ── */}
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-0">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">location_on</span>
                                                <h3 className="font-bold text-slate-800">Lokasi &amp; Alamat</h3>
                                            </div>
                                            <div className="p-4 md:p-6 space-y-4">

                                                <FormField label="Alamat Lengkap">
                                                    <FormInput placeholder="Alamat lengkap pelanggan..." />
                                                </FormField>

                                                <FormField label="Kode Pos">
                                                    <FormInput defaultValue="000000" className="w-32" />
                                                </FormField>

                                                <FormField label="Negara">
                                                    <FormSelect>
                                                        <option value="">:: Pilih Negara ::</option>
                                                        <option>Indonesia</option>
                                                        <option>Malaysia</option>
                                                        <option>Singapura</option>
                                                        <option>Amerika Serikat</option>
                                                    </FormSelect>
                                                </FormField>

                                                <FormField label="Wilayah">
                                                    <FormSelect>
                                                        <option value="">:: Pilih Wilayah ::</option>
                                                        <option>Jawa Barat</option>
                                                        <option>Jawa Tengah</option>
                                                        <option>Jawa Timur</option>
                                                        <option>Sumatera Utara</option>
                                                        <option>DKI Jakarta</option>
                                                    </FormSelect>
                                                </FormField>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}

                        {/* ═══════════════════════════════════════════════════════
                            TAB 2: Konfigurasi Keuangan
                        ═══════════════════════════════════════════════════════ */}
                        {activeTab === "keuangan" && (
                            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

                                    {/* ── Left: Konfigurasi Cards ── */}
                                    <div className="lg:col-span-2 space-y-6">

                                        {/* Card: Pembayaran & Kredit */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">payments</span>
                                                <h3 className="font-bold text-slate-800">Pembayaran &amp; Kredit</h3>
                                            </div>
                                            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">

                                                {/* Mata Uang */}
                                                <FormField label="Mata Uang">
                                                    <FormSelect>
                                                        <option>Rupiah</option>
                                                        <option>USD</option>
                                                        <option>EUR</option>
                                                        <option>SGD</option>
                                                    </FormSelect>
                                                </FormField>

                                                {/* Tanggal Daftar */}
                                                <FormField label="Tanggal Daftar">
                                                    <FormInput type="date" defaultValue="2026-04-03" />
                                                </FormField>

                                                {/* Tempo Bayar & TOP Limit */}
                                                <FormField label="Tempo Bayar & TOP Limit" className="sm:col-span-2">
                                                    <div className="flex items-center gap-2">
                                                        <FormInput type="number" defaultValue="0" className="w-24" />
                                                        <span className="text-sm text-slate-500 whitespace-nowrap">Hari</span>
                                                        <FormInput type="number" defaultValue="0" className="w-24" />
                                                        <span className="text-sm text-slate-500 whitespace-nowrap">Hari (TOP)</span>
                                                    </div>
                                                </FormField>

                                                {/* Limit Kredit & Sisa Piutang */}
                                                <FormField label="Limit Kredit &amp; Sisa Piutang" className="sm:col-span-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1">
                                                            <FormInput type="number" defaultValue="5000000" />
                                                        </div>
                                                        <input
                                                            readOnly
                                                            value={fmt(sisaPiutang)}
                                                            className="flex-1 text-right bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-sm font-semibold text-primary cursor-not-allowed"
                                                        />
                                                    </div>
                                                </FormField>

                                                {/* Account Code */}
                                                <FormField label="Account Code" className="sm:col-span-2">
                                                    <FormSelect>
                                                        <option>130.01.01 - PIUTANG DAGANG CUSTOMER - IDR</option>
                                                        <option>130.01.02 - PIUTANG DAGANG CUSTOMER - USD</option>
                                                        <option>130.02.01 - PIUTANG LAIN-LAIN</option>
                                                    </FormSelect>
                                                </FormField>

                                            </div>
                                        </div>


                                    </div>

                                    {/* ── Right: Pengiriman & Status ── */}
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-0">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">local_shipping</span>
                                                <h3 className="font-bold text-slate-800">Pengiriman &amp; Status</h3>
                                            </div>
                                            <div className="p-4 md:p-6 space-y-4">

                                                <FormField label="Tipe Surat Jalan?">
                                                    <FormSelect>
                                                        <option>MODEL NORMAL (Volume + Berat Kotor)</option>
                                                        <option>MODEL BERSIH (Volume + Berat Bersih)</option>
                                                        <option>MODEL SIMPLE</option>
                                                    </FormSelect>
                                                </FormField>

                                                <FormField label="Blocked?">
                                                    <FormSelect
                                                        value={blocked ? "YES" : "NO"}
                                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBlocked(e.target.value === "YES")}
                                                    >
                                                        <option value="NO">NO</option>
                                                        <option value="YES">YES</option>
                                                    </FormSelect>
                                                </FormField>

                                                <FormField label="Alasan Blocked">
                                                    <FormInput
                                                        placeholder="Isi jika pelanggan diblokir..."
                                                        readOnly={!blocked}
                                                        className={!blocked ? "opacity-50 cursor-not-allowed" : ""}
                                                    />
                                                </FormField>

                                                {/* Status badge */}
                                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                                    <span className="text-xs text-slate-500">Status Pelanggan</span>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${blocked
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-green-100 text-green-700"
                                                        }`}>
                                                        {blocked ? "BLOCKED" : "AKTIF"}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Footer StatusBar */}
            <StatusBar />
        </div>
    );
}
