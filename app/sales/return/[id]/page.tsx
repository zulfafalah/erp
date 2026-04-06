"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import FormField from "../../../components/FormField";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
import FormTextarea from "../../../components/FormTextarea";
import Modal from "../../../components/Modal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReturnItem {
    id: number;
    refInvoice: string;
    namaBarang: string;
    keterangan: string;
    uom: string;
    kuantitas: number;
    maxRetur: number;
    hargaDasar: number;
    potongan1Pct: number;
    potongan1Val: number;
    hargaSetelah1: number;
    potongan2Pct: number;
    potongan2Val: number;
    hargaSetelah2: number;
    potongan3Pct: number;
    potongan3Val: number;
    hargaSetelah3: number;
    potongan4Pct: number;
    potongan4Val: number;
    hargaSetelah4: number;
    ppnPct: number;
    ppnVal: number;
    hargaFinal: number;
    jumlah: number;
}

// ─── Calculations ─────────────────────────────────────────────────────────────

function calcItem(item: ReturnItem): ReturnItem {
    const h1 = item.hargaDasar * (1 - item.potongan1Pct / 100);
    const p1 = item.hargaDasar - h1;
    const h2 = h1 * (1 - item.potongan2Pct / 100);
    const p2 = h1 - h2;
    const h3 = h2 * (1 - item.potongan3Pct / 100);
    const p3 = h2 - h3;
    const h4 = h3 * (1 - item.potongan4Pct / 100);
    const p4 = h3 - h4;
    const ppnVal = h4 * (item.ppnPct / 100);
    const hargaFinal = h4 + ppnVal;
    return {
        ...item,
        potongan1Val: p1,
        hargaSetelah1: h1,
        potongan2Val: p2,
        hargaSetelah2: h2,
        potongan3Val: p3,
        hargaSetelah3: h3,
        potongan4Val: p4,
        hargaSetelah4: h4,
        ppnVal,
        hargaFinal,
        jumlah: hargaFinal * item.kuantitas,
    };
}

// ─── Default items ────────────────────────────────────────────────────────────

const defaultItems: ReturnItem[] = [
    calcItem({
        id: 1,
        refInvoice: "SIL 2601-0001",
        namaBarang: "AXE DEO DORANT BLACK 12X150ML~SIL 2601-0001~2026-01-06",
        keterangan: "AXE DEO DORANT BLACK 12X150ML",
        uom: "DUS",
        kuantitas: 1.0,
        maxRetur: 2.0,
        hargaDasar: 304545.45,
        potongan1Pct: 1.0,
        potongan1Val: 0,
        hargaSetelah1: 0,
        potongan2Pct: 2.0,
        potongan2Val: 0,
        hargaSetelah2: 0,
        potongan3Pct: 0,
        potongan3Val: 0,
        hargaSetelah3: 0,
        potongan4Pct: 0,
        potongan4Val: 0,
        hargaSetelah4: 0,
        ppnPct: 11,
        ppnVal: 0,
        hargaFinal: 0,
        jumlah: 0,
    }),
];

// ─── Empty item template ──────────────────────────────────────────────────────

function blankItem(id: number): ReturnItem {
    return calcItem({
        id,
        refInvoice: "",
        namaBarang: "",
        keterangan: "",
        uom: "DUS",
        kuantitas: 0,
        maxRetur: 0,
        hargaDasar: 0,
        potongan1Pct: 0, potongan1Val: 0, hargaSetelah1: 0,
        potongan2Pct: 0, potongan2Val: 0, hargaSetelah2: 0,
        potongan3Pct: 0, potongan3Val: 0, hargaSetelah3: 0,
        potongan4Pct: 0, potongan4Val: 0, hargaSetelah4: 0,
        ppnPct: 11, ppnVal: 0, hargaFinal: 0, jumlah: 0,
    });
}

// ─── Tab config ───────────────────────────────────────────────────────────────

type TabKey = "header" | "return-details" | "attachments";

const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "header",         label: "Header Info",    icon: "description" },
    { key: "return-details", label: "Detail Retur",   icon: "assignment_return" },
    { key: "attachments",    label: "Lampiran",        icon: "attachment" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt4 = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 4, maximumFractionDigits: 4 });

const fmt2 = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SalesReturnDetailPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("header");
    const [items, setItems] = useState<ReturnItem[]>(defaultItems.map(calcItem));
    const [selectedItem, setSelectedItem] = useState<ReturnItem | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newItem, setNewItem] = useState<ReturnItem>(blankItem(0));
    const router = useRouter();

    // ── helpers ─────────────────────────────────────────────────────────────
    const updateNew = (patch: Partial<ReturnItem>) =>
        setNewItem((prev) => calcItem({ ...prev, ...patch }));

    const updateItem = (id: number, patch: Partial<ReturnItem>) =>
        setItems((prev) =>
            prev.map((item) => (item.id === id ? calcItem({ ...item, ...patch }) : item))
        );

    const removeItem = (id: number) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
        if (selectedItem?.id === id) { setSelectedItem(null); setIsDetailModalOpen(false); }
    };

    const openDetailModal = (item: ReturnItem) => {
        setSelectedItem(item);
        setIsDetailModalOpen(true);
    };

    const updateSelectedItem = (patch: Partial<ReturnItem>) => {
        if (!selectedItem) return;
        const updated = calcItem({ ...selectedItem, ...patch });
        setSelectedItem(updated);
        updateItem(updated.id, patch);
    };

    const addItem = () => {
        const newId = Math.max(0, ...items.map((i) => i.id)) + 1;
        const calculated = calcItem({ ...newItem, id: newId });
        setItems((prev) => [...prev, calculated]);
        openDetailModal(calculated);
        setNewItem(blankItem(0));
        setIsAddModalOpen(false);
    };

    // ── totals ───────────────────────────────────────────────────────────────
    const subTotal    = items.reduce((s, i) => s + i.hargaSetelah4 * i.kuantitas, 0);
    const totalPPN    = items.reduce((s, i) => s + i.ppnVal * i.kuantitas, 0);
    const grandTotal  = items.reduce((s, i) => s + i.jumlah, 0);
    const totalQty    = items.reduce((s, i) => s + i.kuantitas, 0);

    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            <Navbar />

            <main className="flex-1 flex overflow-hidden">
                <Sidebar />

                <section className="flex-1 flex flex-col bg-background-light overflow-hidden">
                    {/* ── Action Header ────────────────────────────────────── */}
                    <div className="px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/5 bg-white/50 backdrop-blur-sm shrink-0">
                        <div className="flex items-start md:items-center gap-3 md:gap-4 w-full md:w-auto">
                            <button
                                onClick={() => router.push("/sales/return")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        Retur Penjualan Barang
                                    </h1>
                                    <span className="px-2 md:px-3 py-0.5 md:py-1 bg-green-100 text-green-700 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest border border-green-200">
                                        Approved
                                    </span>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    Input dan kelola retur penjualan barang dari pelanggan.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-200/50 rounded-lg transition-all border border-slate-200 md:border-transparent">
                                Info
                            </button>
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold bg-white text-primary border border-primary/20 hover:border-primary rounded-lg transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">print</span>
                                Print
                            </button>
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-bold bg-slate-700 text-white hover:bg-slate-800 rounded-lg flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">lock</span>
                                Tutup Transaksi
                            </button>
                            <button className="w-full md:w-auto justify-center px-4 md:px-5 py-2 text-xs md:text-sm font-bold bg-primary text-white hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">note_add</span>
                                Credit Memo
                            </button>
                        </div>
                    </div>

                    {/* ── Tab System ───────────────────────────────────────── */}
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

                        {/* ══════ TAB: HEADER ══════ */}
                        {activeTab === "header" && (
                            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                                    {/* Left: Form */}
                                    <div className="lg:col-span-2 space-y-6">

                                        {/* Informasi Dasar */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">info</span>
                                                <h3 className="font-bold text-slate-800">Informasi Dasar</h3>
                                            </div>
                                            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                                <FormField label="No. Retur">
                                                    <FormInput defaultValue="BRL 2601-0001" />
                                                </FormField>
                                                <FormField label="Tanggal">
                                                    <FormInput type="date" defaultValue="2026-01-06" />
                                                </FormField>
                                                <FormField label="Tipe Retur">
                                                    <FormSelect>
                                                        <option value="nota-barang">Nota &amp; Barang</option>
                                                        <option value="nota">Nota</option>
                                                        <option value="barang">Barang</option>
                                                    </FormSelect>
                                                </FormField>
                                                <FormField label="Mata Uang">
                                                    <div className="flex gap-2">
                                                        <FormSelect>
                                                            <option>Rupiah</option>
                                                            <option>USD</option>
                                                            <option>EUR</option>
                                                        </FormSelect>
                                                        <FormInput placeholder="Kurs" defaultValue="1.00" />
                                                    </div>
                                                </FormField>
                                                <FormField label="Barang Diterima di Gudang" className="sm:col-span-2">
                                                    <FormSelect>
                                                        <option>Gudang Kapuk</option>
                                                        <option>Gudang Utama</option>
                                                        <option>Gudang 2</option>
                                                    </FormSelect>
                                                </FormField>
                                            </div>
                                        </div>

                                        {/* Data Pelanggan */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">person</span>
                                                <h3 className="font-bold text-slate-800">Data Pelanggan</h3>
                                            </div>
                                            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                                <div className="sm:col-span-2">
                                                    <FormField label="Pelanggan">
                                                        <div className="relative">
                                                            <FormInput defaultValue="AYU" />
                                                            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary">
                                                                <span className="material-symbols-outlined">search</span>
                                                            </button>
                                                        </div>
                                                    </FormField>
                                                </div>
                                                <FormField label="Catatan" className="sm:col-span-2">
                                                    <FormTextarea
                                                        placeholder="Tambahkan catatan untuk retur ini..."
                                                        rows={3}
                                                        defaultValue="Retur Penjualan dari AYU"
                                                    />
                                                </FormField>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Ringkasan */}
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-0">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">receipt_long</span>
                                                <h3 className="font-bold text-slate-800">Ringkasan Retur</h3>
                                            </div>
                                            <div className="p-4 md:p-6 space-y-4">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500">Sub Total</span>
                                                    <span className="font-semibold">IDR {fmt2(subTotal)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-slate-500">Disc %</span>
                                                        <input
                                                            className="w-12 h-7 py-0 px-1 text-center bg-slate-50 border border-slate-200 rounded text-xs"
                                                            type="text"
                                                            defaultValue="0"
                                                        />
                                                        <span className="text-slate-400">%</span>
                                                    </div>
                                                    <span className="font-semibold text-red-500">0,00</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-slate-500">PPN %</span>
                                                        <input
                                                            className="w-12 h-7 py-0 px-1 text-center bg-slate-50 border border-slate-200 rounded text-xs"
                                                            type="text"
                                                            defaultValue="11"
                                                        />
                                                        <span className="text-slate-400">%</span>
                                                    </div>
                                                    <span className="font-semibold text-slate-700">IDR {fmt2(totalPPN)}</span>
                                                </div>
                                                <div className="pt-4 border-t border-slate-100 space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm md:text-base font-bold text-slate-900">Grand Total</span>
                                                        <span className="text-lg md:text-xl font-black text-primary">IDR {fmt2(grandTotal)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-slate-500">Total Konversi</span>
                                                        <span className="font-semibold">IDR {fmt2(grandTotal)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-slate-500">Total Qty</span>
                                                        <span className="font-semibold">{fmt2(totalQty)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2">
                                                <button className="col-span-2 py-3 bg-primary text-white rounded font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                                                    <span className="material-symbols-outlined">save</span> SIMPAN
                                                </button>
                                                <button className="py-2 bg-white border border-slate-200 text-slate-600 rounded text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined !text-sm">refresh</span> RESET
                                                </button>
                                                <button className="py-2 bg-white border border-slate-200 text-slate-600 rounded text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined !text-sm">help</span> INFO
                                                </button>
                                                <button className="col-span-1 py-2 bg-emerald-500 text-white rounded text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined !text-sm">verified</span> APPROVE
                                                </button>
                                                <button className="col-span-1 py-2 bg-amber-500 text-white rounded text-xs font-bold hover:bg-amber-600 transition-colors flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined !text-sm">cancel</span> UN-APPROVE
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ══════ TAB: RETURN DETAILS ══════ */}
                        {activeTab === "return-details" && (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                                    {/* Table header bar */}
                                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">assignment_return</span>
                                            <h3 className="text-sm font-bold text-slate-900">
                                                Daftar Detail Retur Penjualan Barang
                                                <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-semibold">
                                                    {items.length} item
                                                </span>
                                            </h3>
                                        </div>
                                        <button
                                            onClick={() => setIsAddModalOpen(true)}
                                            className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-primary/90 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-base">add</span>
                                            Add New
                                        </button>
                                    </div>

                                    {/* Simple summary table */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse text-sm">
                                            <thead className="bg-slate-50 border-b border-slate-200">
                                                <tr>
                                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 w-10">#</th>
                                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Invoice#</th>
                                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Nama Barang</th>
                                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 w-20">UOM</th>
                                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-right w-24">Qty</th>
                                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-right w-36">Harga</th>
                                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-right w-36">Jumlah</th>
                                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-right w-20">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {items.map((item, idx) => (
                                                    <tr key={item.id} className="hover:bg-primary/5 transition-colors group">
                                                        <td className="px-4 py-3 text-slate-400 font-mono text-sm">{idx + 1}.</td>
                                                        <td className="px-4 py-3">
                                                            <span className="text-sm font-medium text-primary">{item.refInvoice || "—"}</span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="text-sm font-semibold text-slate-900">{item.keterangan || item.namaBarang || "—"}</span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600 font-medium">{item.uom}</span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-sm font-medium">{item.kuantitas.toFixed(2)}</td>
                                                        <td className="px-4 py-3 text-right text-sm">{fmt2(item.hargaFinal)}</td>
                                                        <td className="px-4 py-3 text-right text-sm font-bold text-primary">{fmt2(item.jumlah)}</td>
                                                        <td className="px-4 py-3 text-right">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <button
                                                                    onClick={() => openDetailModal(item)}
                                                                    className="px-2.5 py-1 text-xs font-bold text-primary border border-primary/30 rounded hover:bg-primary hover:text-white transition-all"
                                                                >
                                                                    View
                                                                </button>
                                                                <button
                                                                    onClick={() => removeItem(item.id)}
                                                                    className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded hover:bg-red-50"
                                                                >
                                                                    <span className="material-symbols-outlined text-base">delete</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ══════ TAB: ATTACHMENTS ══════ */}
                        {activeTab === "attachments" && (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <span className="material-symbols-outlined text-5xl text-slate-300">attachment</span>
                                    <p className="mt-2 text-sm text-slate-500">No attachments yet</p>
                                    <button className="mt-4 px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto">
                                        <span className="material-symbols-outlined text-sm">upload_file</span>
                                        Upload File
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <StatusBar />

            {/* ── Add Item Retur Modal ── */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Input Detail Retur Penjualan Barang"
                icon="assignment_return"
                size="xl"
                footer={
                    <>
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            onClick={addItem}
                            className="px-4 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">add_circle</span>
                            Tambah Item Retur
                        </button>
                    </>
                }
            >
                {/* Ref Invoice */}
                <FormField label="Ref Invoice#">
                    <div className="flex gap-2">
                        <FormSelect>
                            <option>SIL 2601-0001</option>
                            <option>SIL 2601-0002</option>
                            <option>SIL 2601-0003</option>
                        </FormSelect>
                        <button className="text-slate-400 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">search</span>
                        </button>
                    </div>
                </FormField>

                {/* Nama Barang */}
                <FormField label="Nama Barang">
                    <div className="flex gap-2">
                        <FormSelect>
                            <option>AXE DEO DORANT BLACK 12X150ML~SIL 2601-0001~2026-01-06</option>
                            <option>DOVE SHAMPOO~SIL 2601-0002~2026-01-06</option>
                        </FormSelect>
                        <button className="text-slate-400 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">search</span>
                        </button>
                    </div>
                </FormField>

                {/* Keterangan */}
                <FormField label="Keterangan">
                    <FormInput
                        value={newItem.keterangan}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNew({ keterangan: e.target.value })}
                        placeholder="Keterangan barang..."
                    />
                </FormField>

                {/* UOM */}
                <FormField label="UOM">
                    <FormSelect>
                        <option>DUS</option>
                        <option>PCS</option>
                        <option>KG</option>
                        <option>LITER</option>
                        <option>BOX</option>
                    </FormSelect>
                </FormField>

                {/* Kuantitas & Max Retur */}
                <FormField label="Kuantitas (Retur)">
                    <div className="flex items-center gap-2">
                        <FormInput
                            type="number"
                            value={String(newItem.kuantitas)}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNew({ kuantitas: Number(e.target.value) })}
                        />
                        <span className="text-slate-400 text-sm whitespace-nowrap">Max Retur :</span>
                        <input
                            type="number"
                            readOnly
                            className="w-20 rounded-lg border border-slate-200 bg-slate-100 px-2 py-2 text-sm text-center text-slate-500 cursor-default outline-none"
                            value={newItem.maxRetur.toFixed(4)}
                        />
                    </div>
                </FormField>

                {/* Harga Dasar (read-only from ref) */}
                <FormField label="Harga Dasar">
                    <input
                        type="number"
                        readOnly
                        className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right text-slate-600 font-medium cursor-default outline-none"
                        value={newItem.hargaDasar.toFixed(4)}
                    />
                </FormField>

                {/* Potongan 1-4 */}
                <div className="grid grid-cols-2 gap-4">
                    {([1, 2, 3, 4] as const).map((n) => {
                        const pKey = `potongan${n}Pct` as keyof ReturnItem;
                        const vKey = `potongan${n}Val` as keyof ReturnItem;
                        const hKey = `hargaSetelah${n}` as keyof ReturnItem;
                        return (
                            <div key={n} className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Potongan ke-{n}</label>
                                <div className="flex items-center gap-1">
                                    <input
                                        type="number"
                                        className="w-14 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-center focus:ring-2 focus:ring-primary/20 outline-none"
                                        value={newItem[pKey] as number}
                                        onChange={(e) => updateNew({ [pKey]: Number(e.target.value) } as any)}
                                    />
                                    <span className="text-slate-400 text-xs">%</span>
                                    <input
                                        type="number"
                                        readOnly
                                        className="flex-1 rounded-lg border border-slate-200 bg-slate-100 px-2 py-2 text-xs text-right text-slate-500 cursor-default outline-none"
                                        value={(newItem[vKey] as number).toFixed(4)}
                                    />
                                </div>
                                <input
                                    type="number"
                                    readOnly
                                    className="w-full rounded-lg border border-slate-200 bg-slate-100 px-2 py-1.5 text-xs text-right text-slate-600 cursor-default outline-none"
                                    value={(newItem[hKey] as number).toFixed(4)}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* PPN */}
                <FormField label="PPN">
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-center focus:ring-2 focus:ring-primary/20 outline-none"
                            value={newItem.ppnPct}
                            onChange={(e) => updateNew({ ppnPct: Number(e.target.value) })}
                        />
                        <span className="text-slate-400 text-sm">%</span>
                        <input
                            type="number"
                            readOnly
                            className="flex-1 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right text-slate-500 cursor-default outline-none"
                            value={newItem.ppnVal.toFixed(4)}
                        />
                    </div>
                </FormField>

                {/* Harga Final & Jumlah */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Harga Final">
                        <input
                            type="number"
                            readOnly
                            className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right font-semibold text-slate-700 cursor-default outline-none"
                            value={newItem.hargaFinal.toFixed(4)}
                        />
                    </FormField>
                    <FormField label="Jumlah">
                        <input
                            type="number"
                            readOnly
                            className="w-full rounded-lg border border-slate-200 bg-primary/5 px-3 py-2 text-sm text-right font-bold text-primary cursor-default outline-none"
                            value={newItem.jumlah.toFixed(4)}
                        />
                    </FormField>
                </div>
            </Modal>

            {/* ── Item Detail / Edit Modal ── */}
            {selectedItem && (
                <Modal
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    title={`Detail Retur — ${selectedItem.keterangan || selectedItem.namaBarang}`}
                    icon="edit_square"
                    size="xl"
                    footer={
                        <>
                            <button
                                onClick={() => setIsDetailModalOpen(false)}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={() => setIsDetailModalOpen(false)}
                                className="px-4 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">save</span>
                                Simpan
                            </button>
                        </>
                    }
                >
                    {/* Ref Invoice */}
                    <FormField label="Ref Invoice#">
                        <div className="flex gap-2">
                            <FormSelect>
                                <option>{selectedItem.refInvoice}</option>
                                <option>SIL 2601-0001</option>
                                <option>SIL 2601-0002</option>
                                <option>SIL 2601-0003</option>
                            </FormSelect>
                            <button className="text-slate-400 hover:text-primary">
                                <span className="material-symbols-outlined">search</span>
                            </button>
                        </div>
                    </FormField>

                    {/* Nama Barang */}
                    <FormField label="Nama Barang">
                        <div className="flex gap-2">
                            <FormSelect>
                                <option>{selectedItem.namaBarang}</option>
                                <option>AXE DEO DORANT BLACK 12X150ML~SIL 2601-0001~2026-01-06</option>
                                <option>DOVE SHAMPOO~SIL 2601-0002~2026-01-06</option>
                            </FormSelect>
                            <button className="text-slate-400 hover:text-primary">
                                <span className="material-symbols-outlined">search</span>
                            </button>
                        </div>
                    </FormField>

                    {/* Keterangan */}
                    <FormField label="Keterangan">
                        <FormInput
                            value={selectedItem.keterangan}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSelectedItem({ keterangan: e.target.value })}
                        />
                    </FormField>

                    {/* UOM */}
                    <FormField label="UOM">
                        <FormSelect>
                            <option>DUS</option>
                            <option>PCS</option>
                            <option>KG</option>
                            <option>LITER</option>
                            <option>BOX</option>
                        </FormSelect>
                    </FormField>

                    {/* Kuantitas & Max Retur */}
                    <FormField label="Kuantitas (Retur)">
                        <div className="flex items-center gap-2">
                            <FormInput
                                type="number"
                                value={String(selectedItem.kuantitas)}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSelectedItem({ kuantitas: Number(e.target.value) })}
                            />
                            <span className="text-slate-400 text-sm whitespace-nowrap">Max Retur :</span>
                            <input
                                type="number"
                                readOnly
                                className="w-20 rounded-lg border border-slate-200 bg-slate-100 px-2 py-2 text-sm text-center text-slate-500 cursor-default outline-none"
                                value={selectedItem.maxRetur.toFixed(4)}
                            />
                        </div>
                    </FormField>

                    {/* Harga Dasar */}
                    <FormField label="Harga Dasar">
                        <input
                            type="number"
                            readOnly
                            className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right text-slate-600 font-medium cursor-default outline-none"
                            value={selectedItem.hargaDasar.toFixed(4)}
                        />
                    </FormField>

                    {/* Potongan 1-4 */}
                    <div className="grid grid-cols-2 gap-4">
                        {([1, 2, 3, 4] as const).map((n) => {
                            const pKey = `potongan${n}Pct` as keyof ReturnItem;
                            const vKey = `potongan${n}Val` as keyof ReturnItem;
                            const hKey = `hargaSetelah${n}` as keyof ReturnItem;
                            return (
                                <div key={n} className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Potongan ke-{n}</label>
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="number"
                                            className="w-14 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-center focus:ring-2 focus:ring-primary/20 outline-none"
                                            value={selectedItem[pKey] as number}
                                            onChange={(e) => updateSelectedItem({ [pKey]: Number(e.target.value) } as any)}
                                        />
                                        <span className="text-slate-400 text-xs">%</span>
                                        <input
                                            type="number"
                                            readOnly
                                            className="flex-1 rounded-lg border border-slate-200 bg-slate-100 px-2 py-2 text-xs text-right text-slate-500 cursor-default outline-none"
                                            value={(selectedItem[vKey] as number).toFixed(4)}
                                        />
                                    </div>
                                    <input
                                        type="number"
                                        readOnly
                                        className="w-full rounded-lg border border-slate-200 bg-slate-100 px-2 py-1.5 text-xs text-right text-slate-600 cursor-default outline-none"
                                        value={(selectedItem[hKey] as number).toFixed(4)}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* PPN */}
                    <FormField label="PPN">
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-center focus:ring-2 focus:ring-primary/20 outline-none"
                                value={selectedItem.ppnPct}
                                onChange={(e) => updateSelectedItem({ ppnPct: Number(e.target.value) })}
                            />
                            <span className="text-slate-400 text-sm">%</span>
                            <input
                                type="number"
                                readOnly
                                className="flex-1 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right text-slate-500 cursor-default outline-none"
                                value={selectedItem.ppnVal.toFixed(4)}
                            />
                        </div>
                    </FormField>

                    {/* Harga Final & Jumlah */}
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Harga Final">
                            <input
                                type="number"
                                readOnly
                                className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right font-semibold text-slate-700 cursor-default outline-none"
                                value={selectedItem.hargaFinal.toFixed(4)}
                            />
                        </FormField>
                        <FormField label="Jumlah">
                            <input
                                type="number"
                                readOnly
                                className="w-full rounded-lg border border-slate-200 bg-primary/5 px-3 py-2 text-sm text-right font-bold text-primary cursor-default outline-none"
                                value={selectedItem.jumlah.toFixed(4)}
                            />
                        </FormField>
                    </div>
                </Modal>
            )}
        </div>
    );
}
