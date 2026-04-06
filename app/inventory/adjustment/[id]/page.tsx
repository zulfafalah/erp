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

interface AdjustmentItem {
    id: number;
    kodeBarang: string;
    barcodeNo: string;
    namaBarang: string;
    notes: string;
    uom: string;
    qtyFisikSistem: number;
    qtyFisikLapangan: number;
    qtyPenyesuaian: number;
    hargaUnit: number;
    jumlah: number;
}

// ─── Calculations ─────────────────────────────────────────────────────────────

function calcItem(item: AdjustmentItem): AdjustmentItem {
    const qtyPenyesuaian = item.qtyFisikLapangan - item.qtyFisikSistem;
    const jumlah = qtyPenyesuaian * item.hargaUnit;
    return { ...item, qtyPenyesuaian, jumlah };
}

// ─── Default Items ────────────────────────────────────────────────────────────

const defaultItems: AdjustmentItem[] = [
    calcItem({
        id: 1,
        kodeBarang: "B.0011",
        barcodeNo: "08999995080500",
        namaBarang: "BANGO BIM48 MNS MINI 48X135ML",
        notes: "BANGO BIM48 MNS MINI 48X135ML",
        uom: "DUS",
        qtyFisikSistem: 0,
        qtyFisikLapangan: 1,
        qtyPenyesuaian: 0,
        hargaUnit: 311394.18,
        jumlah: 0,
    }),
    calcItem({
        id: 2,
        kodeBarang: "M.0018",
        barcodeNo: "08999995115791",
        namaBarang: "MOLTO WHITE MUSK SCH 360X12ML",
        notes: "MOLTO WHITE MUSK SCH 360X12ML",
        uom: "DUS",
        qtyFisikSistem: 25,
        qtyFisikLapangan: 49,
        qtyPenyesuaian: 0,
        hargaUnit: 114391.49,
        jumlah: 0,
    }),
];

// ─── Empty Item Template ──────────────────────────────────────────────────────

function blankItem(id: number): AdjustmentItem {
    return calcItem({
        id,
        kodeBarang: "",
        barcodeNo: "",
        namaBarang: "",
        notes: "",
        uom: "DUS",
        qtyFisikSistem: 0,
        qtyFisikLapangan: 0,
        qtyPenyesuaian: 0,
        hargaUnit: 0,
        jumlah: 0,
    });
}

// ─── Tab Config ───────────────────────────────────────────────────────────────

type TabKey = "header" | "item-details" | "attachments";

const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "header",       label: "Header Info",        icon: "description" },
    { key: "item-details", label: "Detail Penyesuaian", icon: "tune" },
    { key: "attachments",  label: "Lampiran",            icon: "attachment" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt2 = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmt4 = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 4, maximumFractionDigits: 4 });

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InventoryAdjustmentDetailPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("header");
    const [items, setItems] = useState<AdjustmentItem[]>(defaultItems.map(calcItem));
    const [selectedItem, setSelectedItem] = useState<AdjustmentItem | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newItem, setNewItem] = useState<AdjustmentItem>(blankItem(0));
    const router = useRouter();

    // ── helpers ─────────────────────────────────────────────────────────────
    const updateNew = (patch: Partial<AdjustmentItem>) =>
        setNewItem((prev) => calcItem({ ...prev, ...patch }));

    const updateItem = (id: number, patch: Partial<AdjustmentItem>) =>
        setItems((prev) =>
            prev.map((item) => (item.id === id ? calcItem({ ...item, ...patch }) : item))
        );

    const removeItem = (id: number) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
        if (selectedItem?.id === id) {
            setSelectedItem(null);
            setIsDetailModalOpen(false);
        }
    };

    const openDetailModal = (item: AdjustmentItem) => {
        setSelectedItem(item);
        setIsDetailModalOpen(true);
    };

    const updateSelectedItem = (patch: Partial<AdjustmentItem>) => {
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
    const totalQtyFisik = items.reduce((s, i) => s + i.qtyFisikLapangan, 0);
    const totalQtyAdj   = items.reduce((s, i) => s + i.qtyPenyesuaian, 0);
    const totalJumlah   = items.reduce((s, i) => s + i.jumlah, 0);

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
                                onClick={() => router.push("/inventory/adjustment")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        Penyesuaian Persediaan Barang
                                    </h1>
                                    <span className="px-2 md:px-3 py-0.5 md:py-1 bg-green-100 text-green-700 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest border border-green-200">
                                        Approved
                                    </span>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    Input dan kelola penyesuaian stok persediaan barang di gudang.
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
                            <button className="w-full md:w-auto justify-center px-4 md:px-5 py-2 text-xs md:text-sm font-bold bg-primary text-white hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                Approve
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
                                    {tab.key === "item-details" && (
                                        <span className="size-5 rounded-full bg-slate-100 text-[10px] flex items-center justify-center font-bold">
                                            {items.length}
                                        </span>
                                    )}
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
                                                <FormField label="No. Adjustment">
                                                    <FormInput defaultValue="AJB 1912-0008" />
                                                </FormField>
                                                <FormField label="Tanggal">
                                                    <FormInput type="date" defaultValue="2019-12-31" />
                                                </FormField>
                                                <FormField label="Status">
                                                    <FormInput defaultValue="Approved" readOnly />
                                                </FormField>
                                                <FormField label="Gudang">
                                                    <FormSelect>
                                                        <option value="kapuk">GUDANG KAPUK</option>
                                                        <option value="dadap-a8">GUDANG DADAP A8</option>
                                                        <option value="dadap-b2">GUDANG DADAP B2 AB</option>
                                                        <option value="rawa-bebek">GUDANG RAWA BEBEK</option>
                                                        <option value="kapuk-b3">GUDANG KAPUK B3</option>
                                                    </FormSelect>
                                                </FormField>
                                                <FormField label="Alasan">
                                                    <FormSelect>
                                                        <option value="penyesuaian">PENYESUAIAN</option>
                                                        <option value="stock-opname">STOCK OPNAME</option>
                                                        <option value="reject">BARANG REJECT</option>
                                                        <option value="promosi">BARANG PROMOSI</option>
                                                    </FormSelect>
                                                </FormField>
                                                <FormField label="Alokasi Biaya">
                                                    <FormSelect>
                                                        <option value="normal">Normal</option>
                                                        <option value="langsung">Langsung</option>
                                                        <option value="tidak">Tidak</option>
                                                    </FormSelect>
                                                </FormField>
                                                <FormField label="Catatan Tambahan" className="sm:col-span-2">
                                                    <FormTextarea
                                                        placeholder="Tambahkan catatan untuk penyesuaian ini..."
                                                        rows={3}
                                                        defaultValue="Penyesuaian Stok karena PENYESUAIAN"
                                                    />
                                                </FormField>
                                                <FormField label="Total Qty">
                                                    <FormInput
                                                        type="number"
                                                        defaultValue="0.00"
                                                        readOnly
                                                    />
                                                </FormField>
                                                <FormField label="Total Jumlah (Rp)">
                                                    <FormInput
                                                        type="number"
                                                        defaultValue="0.00"
                                                        readOnly
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
                                                <h3 className="font-bold text-slate-800">Ringkasan Adjustment</h3>
                                            </div>
                                            <div className="p-4 md:p-6 space-y-4">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500">Total Item</span>
                                                    <span className="font-semibold">{items.length} item</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500">Total Qty Fisik</span>
                                                    <span className="font-semibold">{fmt2(totalQtyFisik)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500">Total Qty Adj</span>
                                                    <span className={`font-semibold ${totalQtyAdj < 0 ? "text-red-600" : "text-slate-700"}`}>
                                                        {fmt2(totalQtyAdj)}
                                                    </span>
                                                </div>
                                                <div className="pt-4 border-t border-slate-100">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm md:text-base font-bold text-slate-900">Total Jumlah</span>
                                                        <span className={`text-lg md:text-xl font-black ${totalJumlah < 0 ? "text-red-600" : "text-primary"}`}>
                                                            IDR {fmt2(totalJumlah)}
                                                        </span>
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

                        {/* ══════ TAB: ITEM DETAILS ══════ */}
                        {activeTab === "item-details" && (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                                    {/* Table header bar */}
                                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">tune</span>
                                            <h3 className="text-sm font-bold text-slate-900">
                                                Daftar Detail Penyesuaian Persediaan Barang
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

                                    {/* Items table */}
                                    <div className="overflow-x-auto flex-1">
                                        <table className="w-full text-left border-collapse text-sm">
                                            <thead className="bg-slate-50 border-b border-slate-200">
                                                <tr>
                                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 w-10">#</th>
                                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Kode Barang</th>
                                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Barcode No.</th>
                                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Nama Barang</th>
                                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 w-20">UOM</th>
                                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-right w-28">Qty Fisik</th>
                                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-right w-28">Qty Adj</th>
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
                                                            <span className="text-sm font-medium text-primary">{item.kodeBarang || "—"}</span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="text-sm text-slate-600 font-mono">{item.barcodeNo || "—"}</span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="text-sm font-semibold text-slate-900">{item.namaBarang || "—"}</span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600 font-medium">{item.uom}</span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-sm font-medium">{fmt2(item.qtyFisikLapangan)}</td>
                                                        <td className={`px-4 py-3 text-right text-sm font-medium ${item.qtyPenyesuaian < 0 ? "text-red-600" : ""}`}>
                                                            {fmt2(item.qtyPenyesuaian)}
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-sm">{fmt2(item.hargaUnit)}</td>
                                                        <td className={`px-4 py-3 text-right text-sm font-bold ${item.jumlah < 0 ? "text-red-600" : "text-primary"}`}>
                                                            {fmt2(item.jumlah)}
                                                        </td>
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
                                            {items.length > 0 && (
                                                <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                                                    <tr>
                                                        <td colSpan={5} className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                                                            Total
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-sm font-bold">{fmt2(totalQtyFisik)}</td>
                                                        <td className={`px-4 py-3 text-right text-sm font-bold ${totalQtyAdj < 0 ? "text-red-600" : ""}`}>
                                                            {fmt2(totalQtyAdj)}
                                                        </td>
                                                        <td className="px-4 py-3"></td>
                                                        <td className={`px-4 py-3 text-right text-sm font-black ${totalJumlah < 0 ? "text-red-600" : "text-primary"}`}>
                                                            {fmt2(totalJumlah)}
                                                        </td>
                                                        <td className="px-4 py-3"></td>
                                                    </tr>
                                                </tfoot>
                                            )}
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

            {/* ── Add Item Modal ── */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Input Detail Penyesuaian Persediaan Barang"
                icon="tune"
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
                            Tambah Item
                        </button>
                    </>
                }
            >
                {/* Nama Barang */}
                <FormField label="Nama Barang">
                    <div className="flex gap-2">
                        <FormInput
                            value={newItem.namaBarang}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNew({ namaBarang: e.target.value })}
                            placeholder="Cari nama barang..."
                        />
                        <button className="text-slate-400 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">search</span>
                        </button>
                    </div>
                </FormField>

                {/* Notes */}
                <FormField label="Notes">
                    <FormInput
                        value={newItem.notes}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNew({ notes: e.target.value })}
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

                {/* Qty Fisik Sistem & Lapangan */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Qty Fisik [Sistem]">
                        <input
                            type="number"
                            readOnly
                            className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right text-slate-600 font-medium cursor-default outline-none"
                            value={newItem.qtyFisikSistem}
                        />
                    </FormField>
                    <FormField label="Qty Fisik [Lapangan]">
                        <FormInput
                            type="number"
                            value={String(newItem.qtyFisikLapangan)}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNew({ qtyFisikLapangan: Number(e.target.value) })}
                        />
                    </FormField>
                </div>

                {/* Qty Penyesuaian (read-only, auto-calc) */}
                <FormField label="Qty Penyesuaian">
                    <input
                        type="number"
                        readOnly
                        className={`w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right font-semibold cursor-default outline-none ${newItem.qtyPenyesuaian < 0 ? "text-red-600" : "text-slate-600"}`}
                        value={fmt2(newItem.qtyPenyesuaian)}
                    />
                </FormField>

                {/* Harga Unit */}
                <FormField label="Harga Unit">
                    <FormInput
                        type="number"
                        value={String(newItem.hargaUnit)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNew({ hargaUnit: Number(e.target.value) })}
                    />
                </FormField>

                {/* Jumlah (read-only) */}
                <FormField label="Jumlah">
                    <input
                        type="number"
                        readOnly
                        className={`w-full rounded-lg border border-slate-200 bg-primary/5 px-3 py-2 text-sm text-right font-bold cursor-default outline-none ${newItem.jumlah < 0 ? "text-red-600" : "text-primary"}`}
                        value={fmt4(newItem.jumlah)}
                    />
                </FormField>
            </Modal>

            {/* ── Item Detail / Edit Modal ── */}
            {selectedItem && (
                <Modal
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    title={`Detail Penyesuaian — ${selectedItem.namaBarang}`}
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
                    {/* Nama Barang */}
                    <FormField label="Nama Barang">
                        <FormInput defaultValue={selectedItem.namaBarang} />
                    </FormField>

                    {/* Notes */}
                    <FormField label="Notes">
                        <FormInput
                            value={selectedItem.notes}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSelectedItem({ notes: e.target.value })}
                        />
                    </FormField>

                    {/* UOM */}
                    <FormField label="UOM">
                        <FormSelect defaultValue={selectedItem.uom}>
                            <option value="DUS">DUS</option>
                            <option value="PCS">PCS</option>
                            <option value="KG">KG</option>
                            <option value="LITER">LITER</option>
                            <option value="BOX">BOX</option>
                        </FormSelect>
                    </FormField>

                    {/* Qty Fisik Sistem & Lapangan */}
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Qty Fisik [Sistem]">
                            <input
                                type="number"
                                readOnly
                                className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right text-slate-600 font-medium cursor-default outline-none"
                                value={selectedItem.qtyFisikSistem}
                            />
                        </FormField>
                        <FormField label="Qty Fisik [Lapangan]">
                            <FormInput
                                type="number"
                                value={String(selectedItem.qtyFisikLapangan)}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSelectedItem({ qtyFisikLapangan: Number(e.target.value) })}
                            />
                        </FormField>
                    </div>

                    {/* Qty Penyesuaian */}
                    <FormField label="Qty Penyesuaian">
                        <input
                            type="number"
                            readOnly
                            className={`w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right font-semibold cursor-default outline-none ${selectedItem.qtyPenyesuaian < 0 ? "text-red-600" : "text-slate-600"}`}
                            value={fmt2(selectedItem.qtyPenyesuaian)}
                        />
                    </FormField>

                    {/* Harga Unit */}
                    <FormField label="Harga Unit">
                        <FormInput
                            type="number"
                            value={String(selectedItem.hargaUnit)}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSelectedItem({ hargaUnit: Number(e.target.value) })}
                        />
                    </FormField>

                    {/* Jumlah */}
                    <FormField label="Jumlah">
                        <input
                            type="number"
                            readOnly
                            className={`w-full rounded-lg border border-slate-200 bg-primary/5 px-3 py-2 text-sm text-right font-bold cursor-default outline-none ${selectedItem.jumlah < 0 ? "text-red-600" : "text-primary"}`}
                            value={fmt4(selectedItem.jumlah)}
                        />
                    </FormField>
                </Modal>
            )}
        </div>
    );
}
