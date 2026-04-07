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

type TransferStatus = "Draft" | "In Tran" | "Approved";

interface TransferItem {
    id: number;
    kodeBarang: string;
    barcodeNo: string;
    namaBarang: string;
    notes: string;
    uom: string;
    dusPcs: number;
    qtyFisikSistem: number;
    qtyKirim: number;
    qtyTerima: number;
}

// ─── Default Items ────────────────────────────────────────────────────────────

const defaultItems: TransferItem[] = [
    {
        id: 1,
        kodeBarang: "B.0011",
        barcodeNo: "08999999380600",
        namaBarang: "BANGO BIM48 MNS MINI 48X135ML",
        notes: "BANGO BIM48 MNS MINI 48X135ML",
        uom: "DUS",
        dusPcs: 48,
        qtyFisikSistem: 52,
        qtyKirim: 5,
        qtyTerima: 5,
    },
];

// ─── Empty Item Template ─────────────────────────────────────────────────────

function blankItem(id: number): TransferItem {
    return {
        id,
        kodeBarang: "",
        barcodeNo: "",
        namaBarang: "",
        notes: "",
        uom: "DUS",
        dusPcs: 0,
        qtyFisikSistem: 0,
        qtyKirim: 0,
        qtyTerima: 0,
    };
}

// ─── Status Config ────────────────────────────────────────────────────────────

const statusStyles: Record<TransferStatus, string> = {
    Approved:  "bg-green-100 text-green-700 border-green-200",
    Draft:     "bg-slate-100 text-slate-700 border-slate-200",
    "In Tran": "bg-blue-100 text-blue-700 border-blue-200",
};

// ─── Tab Config ───────────────────────────────────────────────────────────────

type TabKey = "header" | "item-details" | "attachments";

const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "header",       label: "Header Info",           icon: "description" },
    { key: "item-details", label: "Detail Penerimaan",     icon: "move_to_inbox" },
    { key: "attachments",  label: "Lampiran",              icon: "attachment" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt2 = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StockTransferInboundDetailPage() {
    const [activeTab, setActiveTab]             = useState<TabKey>("header");
    const [items, setItems]                     = useState<TransferItem[]>(defaultItems);
    const [selectedItem, setSelectedItem]       = useState<TransferItem | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen]   = useState(false);
    const [newItem, setNewItem]                 = useState<TransferItem>(blankItem(0));
    const status: TransferStatus                = "In Tran";
    const router = useRouter();

    // ── helpers ─────────────────────────────────────────────────────────────
    const updateNew = (patch: Partial<TransferItem>) =>
        setNewItem((prev) => ({ ...prev, ...patch }));

    const updateItem = (id: number, patch: Partial<TransferItem>) =>
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
        );

    const removeItem = (id: number) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
        if (selectedItem?.id === id) {
            setSelectedItem(null);
            setIsDetailModalOpen(false);
        }
    };

    const openDetailModal = (item: TransferItem) => {
        setSelectedItem(item);
        setIsDetailModalOpen(true);
    };

    const updateSelectedItem = (patch: Partial<TransferItem>) => {
        if (!selectedItem) return;
        const updated = { ...selectedItem, ...patch };
        setSelectedItem(updated);
        updateItem(updated.id, patch);
    };

    const addItem = () => {
        const newId = Math.max(0, ...items.map((i) => i.id)) + 1;
        const created = { ...newItem, id: newId };
        setItems((prev) => [...prev, created]);
        openDetailModal(created);
        setNewItem(blankItem(0));
        setIsAddModalOpen(false);
    };

    // ── totals ───────────────────────────────────────────────────────────────
    const totalQtyKirim  = items.reduce((s, i) => s + i.qtyKirim,  0);
    const totalQtyTerima = items.reduce((s, i) => s + i.qtyTerima, 0);

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
                                onClick={() => router.push("/inventory/stock-transfer-inbound")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        Perpindahan Barang Antar Gudang (Terima)
                                    </h1>
                                    <span className={`px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest border ${statusStyles[status]}`}>
                                        {status}
                                    </span>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    Input dan kelola penerimaan perpindahan barang antar gudang (inbound).
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
                                <span className="material-symbols-outlined text-sm">move_to_inbox</span>
                                Process This Receive
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
                                                <FormField label="No.">
                                                    <FormInput defaultValue="SIN 2206-0001" />
                                                </FormField>
                                                <FormField label="Tanggal">
                                                    <FormInput type="date" defaultValue="2022-06-30" />
                                                </FormField>
                                                <FormField label="Status">
                                                    <FormInput defaultValue="In Tran" readOnly />
                                                </FormField>
                                                <FormField label="Ref Transfer#">
                                                    <FormSelect>
                                                        <option value="sou-2206-0001">SOU 2206-0001</option>
                                                        <option value="sou-2107-0001">SOU 2107-0001</option>
                                                        <option value="sou-1912-0014">SOU 1912-0014</option>
                                                        <option value="sou-1912-0013">SOU 1912-0013</option>
                                                    </FormSelect>
                                                </FormField>
                                                <FormField label="Gudang Asal">
                                                    <FormSelect>
                                                        <option value="kapuk">GUDANG KAPUK</option>
                                                        <option value="dadap-a8">GUDANG DADAP A8</option>
                                                        <option value="dadap-b2">GUDANG DADAP B2 AB</option>
                                                        <option value="dadap-c7">GUDANG DADAP C7</option>
                                                        <option value="rawa-bebek">GUDANG RAWA BEBEK</option>
                                                        <option value="kapuk-b3">GUDANG KAPUK B3</option>
                                                    </FormSelect>
                                                </FormField>
                                                <FormField label="Gudang Tujuan">
                                                    <FormSelect>
                                                        <option value="dadap-a8">GUDANG DADAP A8</option>
                                                        <option value="kapuk">GUDANG KAPUK</option>
                                                        <option value="dadap-b2">GUDANG DADAP B2 AB</option>
                                                        <option value="dadap-c7">GUDANG DADAP C7</option>
                                                        <option value="rawa-bebek">GUDANG RAWA BEBEK</option>
                                                        <option value="kapuk-b3">GUDANG KAPUK B3</option>
                                                    </FormSelect>
                                                </FormField>
                                                <FormField label="Alasan">
                                                    <FormSelect>
                                                        <option value="booking-customer">BOOKING CUSTOMER</option>
                                                        <option value="mutasi-stok">MUTASI STOK</option>
                                                        <option value="penyesuaian">PENYESUAIAN</option>
                                                        <option value="restock">RESTOCK</option>
                                                    </FormSelect>
                                                </FormField>
                                                <FormField label="Ref #">
                                                    <FormInput placeholder="Nomor referensi..." />
                                                </FormField>
                                                <FormField label="Catatan Tambahan" className="sm:col-span-2">
                                                    <FormTextarea
                                                        placeholder="Tambahkan catatan untuk penerimaan ini..."
                                                        rows={3}
                                                        defaultValue="T.IN dari SOU 2206-0001"
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
                                                <h3 className="font-bold text-slate-800">Ringkasan Penerimaan</h3>
                                            </div>
                                            <div className="p-4 md:p-6 space-y-4">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500">Total Item</span>
                                                    <span className="font-semibold">{items.length} item</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500">Total Qty Kirim</span>
                                                    <span className="font-semibold">{fmt2(totalQtyKirim)}</span>
                                                </div>
                                                <div className="pt-4 border-t border-slate-100">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm md:text-base font-bold text-slate-900">Total Qty Terima</span>
                                                        <span className="text-lg md:text-xl font-black text-primary">
                                                            {fmt2(totalQtyTerima)}
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
                                                <button className="col-span-2 py-2 bg-emerald-500 text-white rounded text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined !text-sm">move_to_inbox</span> PROCESS THIS RECEIVE
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
                                            <span className="material-symbols-outlined text-primary">move_to_inbox</span>
                                            <h3 className="text-sm font-bold text-slate-900">
                                                Daftar Perpindahan Barang Antar Gudang (Terima)
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
                                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-right w-28">Qty Kirim</th>
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
                                                        <td className="px-4 py-3 text-right text-sm font-medium">{fmt2(item.qtyFisikSistem)}</td>
                                                        <td className="px-4 py-3 text-right text-sm font-medium">{fmt2(item.qtyKirim)}</td>
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
                                                        <td className="px-4 py-3 text-right text-sm font-bold">
                                                            {fmt2(items.reduce((s, i) => s + i.qtyFisikSistem, 0))}
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-sm font-bold text-primary">
                                                            {fmt2(totalQtyKirim)}
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
                title="Input Detil Perpindahan Barang Antar Gudang (Terima)"
                icon="move_to_inbox"
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
                    <div className="flex gap-2 items-center">
                        <FormSelect>
                            <option>DUS</option>
                            <option>PCS</option>
                            <option>KG</option>
                            <option>LITER</option>
                            <option>BOX</option>
                        </FormSelect>
                        <span className="text-sm text-slate-500 whitespace-nowrap">@</span>
                        <FormInput
                            type="number"
                            value={String(newItem.dusPcs)}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNew({ dusPcs: Number(e.target.value) })}
                            placeholder="0"
                        />
                        <span className="text-sm text-slate-500">PCS</span>
                    </div>
                </FormField>

                {/* Qty Fisik Sistem */}
                <FormField label="Qty Fisik [Sistem]">
                    <input
                        type="number"
                        readOnly
                        className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right text-slate-600 font-medium cursor-default outline-none"
                        value={newItem.qtyFisikSistem}
                    />
                </FormField>

                {/* Qty Transfer */}
                <FormField label="Qty Transfer">
                    <input
                        type="number"
                        readOnly
                        className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right text-slate-600 font-medium cursor-default outline-none"
                        value={newItem.qtyKirim}
                    />
                </FormField>

                {/* Qty Terima */}
                <FormField label="Qty Terima">
                    <FormInput
                        type="number"
                        value={String(newItem.qtyTerima)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNew({ qtyTerima: Number(e.target.value) })}
                    />
                </FormField>
            </Modal>

            {/* ── Item Detail / Edit Modal ── */}
            {selectedItem && (
                <Modal
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    title={`Input Detil Perpindahan Barang Antar Gudang (Terima)->${selectedItem.namaBarang}`}
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
                        <div className="flex gap-2">
                            <FormInput defaultValue={selectedItem.namaBarang} />
                            <button className="text-slate-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">search</span>
                            </button>
                        </div>
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
                        <div className="flex gap-2 items-center">
                            <FormSelect defaultValue={selectedItem.uom}>
                                <option value="DUS">DUS</option>
                                <option value="PCS">PCS</option>
                                <option value="KG">KG</option>
                                <option value="LITER">LITER</option>
                                <option value="BOX">BOX</option>
                            </FormSelect>
                            <span className="text-sm text-slate-500 whitespace-nowrap">@</span>
                            <input
                                type="number"
                                readOnly
                                className="w-20 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right text-slate-600 font-medium cursor-default outline-none"
                                value={selectedItem.dusPcs}
                            />
                            <span className="text-sm text-slate-500">PCS</span>
                        </div>
                    </FormField>

                    {/* Qty Fisik Sistem */}
                    <FormField label="Qty Fisik [Sistem]">
                        <input
                            type="number"
                            readOnly
                            className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right text-slate-600 font-medium cursor-default outline-none"
                            value={selectedItem.qtyFisikSistem}
                        />
                    </FormField>

                    {/* Qty Transfer */}
                    <FormField label="Qty Transfer">
                        <input
                            type="number"
                            readOnly
                            className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right text-slate-600 font-medium cursor-default outline-none"
                            value={selectedItem.qtyKirim}
                        />
                    </FormField>

                    {/* Qty Terima */}
                    <FormField label="Qty Terima">
                        <FormInput
                            type="number"
                            value={String(selectedItem.qtyTerima)}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSelectedItem({ qtyTerima: Number(e.target.value) })}
                        />
                    </FormField>
                </Modal>
            )}
        </div>
    );
}
