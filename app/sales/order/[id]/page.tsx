"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import FormField from "../../../components/FormField";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
import FormTextarea from "../../../components/FormTextarea";
import Modal from "../../../components/Modal";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SalesOrderItem {
    id: number;
    namaBarang: string;
    barcodeLuar: string;
    barcodeDalam: string;
    productName: string;
    notes: string;
    uom: string;
    qtyDus: number;
    qtyPcs: number;
    qtyTersedia: number;
    kuantitas: number;
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
    hargaUnitNet: number;
    jumlah: number;
    additionalNotes: string;
}

function calcItem(item: SalesOrderItem): SalesOrderItem {
    const h1 = item.hargaDasar * (1 - item.potongan1Pct / 100);
    const p1 = item.hargaDasar - h1;
    const h2 = h1 * (1 - item.potongan2Pct / 100);
    const p2 = h1 - h2;
    const h3 = h2 * (1 - item.potongan3Pct / 100);
    const p3 = h2 - h3;
    const h4 = h3 * (1 - item.potongan4Pct / 100);
    const p4 = h3 - h4;
    const ppnVal = h4 * (item.ppnPct / 100);
    const net = h4 + ppnVal;
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
        hargaUnitNet: net,
        jumlah: net * item.kuantitas,
    };
}

const defaultItems: SalesOrderItem[] = [
    calcItem({
        id: 1,
        namaBarang: "AXE DEO DARK TEMPTATION 12 X 150 ML",
        barcodeLuar: "8999999049433",
        barcodeDalam: "8999999049433",
        productName: "AXE DEO DARK TEMPTATION 12 X 150 ML",
        notes: "AXE DEO DARK TEMPTATION 12 X 150 ML",
        uom: "DUS",
        qtyDus: 0,
        qtyPcs: 0,
        qtyTersedia: 19,
        kuantitas: 0,
        hargaDasar: 0,
        potongan1Pct: 0, potongan1Val: 0, hargaSetelah1: 0,
        potongan2Pct: 0, potongan2Val: 0, hargaSetelah2: 0,
        potongan3Pct: 0, potongan3Val: 0, hargaSetelah3: 0,
        potongan4Pct: 0, potongan4Val: 0, hargaSetelah4: 0,
        ppnPct: 0, ppnVal: 0,
        hargaUnitNet: 0,
        jumlah: 0,
        additionalNotes: "",
    }),
    calcItem({
        id: 2,
        namaBarang: "DOVE SHAMPOO INTENSIVE REPAIR 320 ML",
        barcodeLuar: "8712566393374",
        barcodeDalam: "8712566393374",
        productName: "DOVE SHAMPOO INTENSIVE REPAIR 320 ML",
        notes: "",
        uom: "DUS",
        qtyDus: 0,
        qtyPcs: 0,
        qtyTersedia: 45,
        kuantitas: 5,
        hargaDasar: 120000,
        potongan1Pct: 5, potongan1Val: 0, hargaSetelah1: 0,
        potongan2Pct: 2, potongan2Val: 0, hargaSetelah2: 0,
        potongan3Pct: 0, potongan3Val: 0, hargaSetelah3: 0,
        potongan4Pct: 0, potongan4Val: 0, hargaSetelah4: 0,
        ppnPct: 11, ppnVal: 0,
        hargaUnitNet: 0,
        jumlah: 0,
        additionalNotes: "",
    }),
];

// ─── Empty new item template ──────────────────────────────────────────────────

function emptyItem(id: number): SalesOrderItem {
    return calcItem({
        id,
        namaBarang: "", barcodeLuar: "", barcodeDalam: "", productName: "", notes: "",
        uom: "DUS", qtyDus: 0, qtyPcs: 0, qtyTersedia: 0, kuantitas: 0, hargaDasar: 0,
        potongan1Pct: 0, potongan1Val: 0, hargaSetelah1: 0,
        potongan2Pct: 0, potongan2Val: 0, hargaSetelah2: 0,
        potongan3Pct: 0, potongan3Val: 0, hargaSetelah3: 0,
        potongan4Pct: 0, potongan4Val: 0, hargaSetelah4: 0,
        ppnPct: 11, ppnVal: 0, hargaUnitNet: 0, jumlah: 0, additionalNotes: "",
    });
}

// ─── Tab config ───────────────────────────────────────────────────────────────

type TabKey = "header" | "order-details" | "attachments";

const tabs: { key: TabKey; label: string; icon: string; badge?: string }[] = [
    { key: "header", label: "Header Info", icon: "description" },
    { key: "order-details", label: "Order Details", icon: "list_alt" },
    { key: "attachments", label: "Attachments", icon: "attachment" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 4, maximumFractionDigits: 4 });

const fmtCur = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Inline editable cell ─────────────────────────────────────────────────────

function Cell({
    value,
    onChange,
    className = "",
    type = "text",
    readOnly = false,
}: {
    value: string | number;
    onChange?: (v: string) => void;
    className?: string;
    type?: string;
    readOnly?: boolean;
}) {
    return (
        <input
            type={type}
            value={value}
            readOnly={readOnly}
            onChange={(e) => onChange?.(e.target.value)}
            className={`w-full bg-transparent border-none focus:ring-1 focus:ring-primary/40 focus:bg-primary/5 rounded px-1.5 py-1 text-xs outline-none ${readOnly ? "text-slate-500 cursor-default" : "hover:bg-slate-50"} ${className}`}
        />
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const blankNewItem = (): SalesOrderItem => ({
    id: 0,
    namaBarang: "", barcodeLuar: "", barcodeDalam: "", productName: "", notes: "",
    uom: "DUS", qtyDus: 0, qtyPcs: 0, qtyTersedia: 0, kuantitas: 0, hargaDasar: 0,
    potongan1Pct: 0, potongan1Val: 0, hargaSetelah1: 0,
    potongan2Pct: 0, potongan2Val: 0, hargaSetelah2: 0,
    potongan3Pct: 0, potongan3Val: 0, hargaSetelah3: 0,
    potongan4Pct: 0, potongan4Val: 0, hargaSetelah4: 0,
    ppnPct: 11, ppnVal: 0, hargaUnitNet: 0, jumlah: 0, additionalNotes: "",
});

export default function SalesOrderDetailPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("header");
    const [items, setItems] = useState<SalesOrderItem[]>(defaultItems.map(calcItem));
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [newItem, setNewItem] = useState<SalesOrderItem>(blankNewItem());
    const router = useRouter();

    // ── update modal form helper ────────────────────────────────────────────
    const updateNew = (patch: Partial<SalesOrderItem>) => {
        setNewItem((prev) => calcItem({ ...prev, ...patch }));
    };

    // ── item update helper ──────────────────────────────────────────────────
    const updateItem = (id: number, patch: Partial<SalesOrderItem>) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? calcItem({ ...item, ...patch }) : item))
        );
    };

    const removeItem = (id: number) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
        if (expandedRow === id) setExpandedRow(null);
    };

    const addItem = () => {
        const newId = Math.max(0, ...items.map((i) => i.id)) + 1;
        const calculated = calcItem({ ...newItem, id: newId });
        setItems((prev) => [...prev, calculated]);
        setExpandedRow(newId);
        setNewItem(blankNewItem());
        setIsAddModalOpen(false);
    };

    const openAddModal = () => {
        setNewItem(blankNewItem());
        setIsAddModalOpen(true);
    };

    // ── totals ──────────────────────────────────────────────────────────────
    const grandTotal = items.reduce((s, i) => s + i.jumlah, 0);

    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            <Navbar />

            <main className="flex-1 flex overflow-hidden">
                <Sidebar />

                <section className="flex-1 flex flex-col bg-background-light overflow-hidden">
                    {/* ── Action Header ── */}
                    <div className="px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/5 bg-white/50 backdrop-blur-sm shrink-0">
                        <div className="flex items-start md:items-center gap-3 md:gap-4 w-full md:w-auto">
                            <button
                                onClick={() => router.push("/sales/order")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        Pesanan Penjualan Barang
                                    </h1>
                                    <span className="px-2 md:px-3 py-0.5 md:py-1 bg-green-100 text-green-700 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest border border-green-200">
                                        Approved
                                    </span>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    Buat dan kelola pesanan penjualan ke pelanggan Anda.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-200/50 rounded-lg transition-all border border-slate-200 md:border-transparent">
                                Save Draft
                            </button>
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold bg-white text-primary border border-primary/20 hover:border-primary rounded-lg transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">print</span>
                                Print SO
                            </button>
                            <button className="w-full md:w-auto justify-center px-4 md:px-5 py-2 text-xs md:text-sm font-bold bg-primary text-white hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                Request Approval
                            </button>
                        </div>
                    </div>

                    {/* ── Tab System ── */}
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
                                    {tab.badge && (
                                        <span className="size-5 rounded-full bg-slate-100 text-[10px] flex items-center justify-center font-bold">
                                            {tab.badge}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* ══════════════════ TAB: HEADER ══════════════════ */}
                        {activeTab === "header" && (
                            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                                    {/* Left */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Informasi Dasar */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">info</span>
                                                <h3 className="font-bold text-slate-800">Informasi Dasar</h3>
                                            </div>
                                            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                                <FormField label="No. Sales Order">
                                                    <FormInput defaultValue="SOL 2601-0001" />
                                                </FormField>
                                                <FormField label="Tanggal">
                                                    <FormInput type="date" defaultValue="2026-01-06" />
                                                </FormField>
                                                <FormField label="Mata Uang">
                                                    <div className="flex gap-2">
                                                        <FormSelect>
                                                            <option>IDR</option>
                                                            <option>USD</option>
                                                            <option>EUR</option>
                                                        </FormSelect>
                                                        <FormInput placeholder="Kurs" defaultValue="1.00" />
                                                    </div>
                                                </FormField>
                                                <FormField label="Tempo Bayar (Hari)">
                                                    <div className="flex items-center gap-2">
                                                        <FormInput type="number" defaultValue="0" />
                                                        <span className="text-sm text-slate-500">Hari</span>
                                                    </div>
                                                </FormField>
                                            </div>
                                        </div>

                                        {/* Data Pelanggan */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">person</span>
                                                <h3 className="font-bold text-slate-800">Data Pelanggan &amp; Pengiriman</h3>
                                            </div>
                                            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
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
                                                    <FormField label="Nama Alias">
                                                        <FormInput defaultValue="Ayu" />
                                                    </FormField>
                                                    <FormField label="Penjual">
                                                        <FormSelect>
                                                            <option>TOKO</option>
                                                            <option>ONLINE</option>
                                                            <option>AGEN</option>
                                                        </FormSelect>
                                                    </FormField>
                                                    <FormField label="PO No. Customer">
                                                        <FormInput placeholder="Masukkan no. PO customer..." />
                                                    </FormField>
                                                    <FormField label="Tipe Pengiriman">
                                                        <FormSelect>
                                                            <option>FRANCO [Diantar]</option>
                                                            <option>LOCO [Diambil]</option>
                                                        </FormSelect>
                                                    </FormField>
                                                </div>
                                                <FormField label="Keterangan">
                                                    <FormTextarea
                                                        placeholder="Tambahkan catatan untuk pesanan ini..."
                                                        rows={3}
                                                        defaultValue="Pemesanan Penjualan dari Ayu"
                                                    />
                                                </FormField>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Ringkasan Biaya */}
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-0">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">receipt_long</span>
                                                <h3 className="font-bold text-slate-800">Ringkasan Biaya</h3>
                                            </div>
                                            <div className="p-4 md:p-6 space-y-4">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500">Sub Total</span>
                                                    <span className="font-semibold">IDR 609.090,90</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-slate-500">Disc %</span>
                                                        <input className="w-12 h-7 py-0 px-1 text-center bg-slate-50 border border-slate-200 rounded text-xs" type="text" defaultValue="0" />
                                                        <span className="text-slate-400">%</span>
                                                    </div>
                                                    <span className="font-semibold text-red-500">-18.150,91</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-slate-500">PPN %</span>
                                                        <input className="w-12 h-7 py-0 px-1 text-center bg-slate-50 border border-slate-200 rounded text-xs" type="text" defaultValue="11" />
                                                        <span className="text-slate-400">%</span>
                                                    </div>
                                                    <span className="font-semibold text-slate-700">65.003,40</span>
                                                </div>
                                                <div className="pt-4 border-t border-slate-100">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-sm md:text-base font-bold text-slate-900">Grand Total</span>
                                                        <span className="text-lg md:text-xl font-black text-primary">IDR {fmtCur(grandTotal)}</span>
                                                    </div>
                                                </div>
                                                <div className="pt-2 space-y-3">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Karton / Volume / Berat</label>
                                                        <div className="grid grid-cols-3 gap-1">
                                                            {["0.00", "0.00", "0"].map((d, i) => (
                                                                <input key={i} className="w-full bg-slate-50 border border-slate-200 rounded text-center font-bold text-xs text-slate-700 px-2 py-1.5" type="text" defaultValue={d} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total COGS</label>
                                                        <input className="w-full bg-slate-50 border border-slate-200 rounded text-right font-bold text-sm text-slate-700 px-3 py-1.5" type="text" defaultValue="573.575,18" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2">
                                                <button className="col-span-2 py-3 bg-primary text-white rounded font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                                                    <span className="material-symbols-outlined">save</span> SIMPAN PESANAN
                                                </button>
                                                <button className="py-2 bg-white border border-slate-200 text-slate-600 rounded text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined !text-sm">refresh</span> RESET
                                                </button>
                                                <button className="py-2 bg-white border border-slate-200 text-slate-600 rounded text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined !text-sm">help</span> INFO
                                                </button>
                                                <button className="col-span-1 py-2 bg-emerald-500 text-white rounded text-[10px] md:text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined !text-sm">verified</span> APPROVE
                                                </button>
                                                <button className="col-span-1 py-2 bg-amber-500 text-white rounded text-[10px] md:text-xs font-bold hover:bg-amber-600 transition-colors flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined !text-sm">cancel</span> UN-APPROVE
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ══════════════════ TAB: ORDER DETAILS ══════════════════ */}
                        {activeTab === "order-details" && (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                                    {/* Table header bar */}
                                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">list_alt</span>
                                            <h3 className="text-sm font-bold text-slate-900">
                                                Detil Item Pesanan
                                                <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-semibold">{items.length} item</span>
                                            </h3>
                                        </div>
                                        <button
                                            onClick={() => setIsAddModalOpen(true)}
                                            className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-primary/90 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-base">add</span>
                                            Tambah Barang
                                        </button>
                                    </div>

                                    {/* Scrollable table */}
                                    <div className="flex-1 overflow-auto no-scrollbar">
                                        <table className="w-full text-left border-collapse text-xs" style={{ minWidth: "1400px" }}>
                                            <thead className="bg-slate-50 sticky top-0 z-10">
                                                <tr>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-8">#</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider min-w-[220px]">Nama Barang</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-32">Barcode</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-20">UOM</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-20 text-right">Qty</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-20 text-right">Qty Sedia</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-28 text-right">Harga Dasar</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-16 text-right">Pot-1 %</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-28 text-right">Harga Stlh-1</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-16 text-right">Pot-2 %</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-28 text-right">Harga Stlh-2</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-16 text-right">Pot-3 %</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-28 text-right">Harga Stlh-3</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-16 text-right">Pot-4 %</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-28 text-right">Harga Stlh-4</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-16 text-right">PPN %</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-28 text-right">Harga Net</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-32 text-right">Jumlah</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-8"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {items.map((item, idx) => (
                                                    <>
                                                        <tr
                                                            key={item.id}
                                                            className={`hover:bg-primary/5 transition-colors cursor-pointer group ${expandedRow === item.id ? "bg-primary/5" : ""}`}
                                                            onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}
                                                        >
                                                            <td className="px-3 py-2 text-slate-400 font-mono">{idx + 1}</td>
                                                            <td className="px-3 py-2">
                                                                <div className="font-semibold text-slate-900 truncate max-w-[200px]" title={item.namaBarang}>
                                                                    {item.namaBarang || <span className="text-slate-400 italic">—</span>}
                                                                </div>
                                                                {item.additionalNotes && (
                                                                    <div className="text-slate-400 text-[10px] truncate">{item.additionalNotes}</div>
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-2 text-slate-500 font-mono">{item.barcodeLuar || "—"}</td>
                                                            <td className="px-3 py-2">
                                                                <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">{item.uom}</span>
                                                            </td>
                                                            <td className="px-3 py-2 text-right font-medium">{item.kuantitas.toFixed(2)}</td>
                                                            <td className="px-3 py-2 text-right text-slate-500">{item.qtyTersedia}</td>
                                                            <td className="px-3 py-2 text-right">{fmt(item.hargaDasar)}</td>
                                                            <td className="px-3 py-2 text-right text-rose-500">{item.potongan1Pct}%</td>
                                                            <td className="px-3 py-2 text-right">{fmt(item.hargaSetelah1)}</td>
                                                            <td className="px-3 py-2 text-right text-rose-500">{item.potongan2Pct}%</td>
                                                            <td className="px-3 py-2 text-right">{fmt(item.hargaSetelah2)}</td>
                                                            <td className="px-3 py-2 text-right text-rose-500">{item.potongan3Pct}%</td>
                                                            <td className="px-3 py-2 text-right">{fmt(item.hargaSetelah3)}</td>
                                                            <td className="px-3 py-2 text-right text-rose-500">{item.potongan4Pct}%</td>
                                                            <td className="px-3 py-2 text-right">{fmt(item.hargaSetelah4)}</td>
                                                            <td className="px-3 py-2 text-right text-blue-500">{item.ppnPct}%</td>
                                                            <td className="px-3 py-2 text-right font-semibold">{fmt(item.hargaUnitNet)}</td>
                                                            <td className="px-3 py-2 text-right font-bold text-primary">{fmtCur(item.jumlah)}</td>
                                                            <td className="px-3 py-2 text-right">
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                                                                    className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1 rounded hover:bg-red-50"
                                                                >
                                                                    <span className="material-symbols-outlined text-base">delete</span>
                                                                </button>
                                                            </td>
                                                        </tr>

                                                        {/* ── Expanded edit row ── */}
                                                        {expandedRow === item.id && (
                                                            <tr key={`exp-${item.id}`}>
                                                                <td colSpan={19} className="p-0 border-b-2 border-primary/20">
                                                                    <div className="bg-slate-50/80 backdrop-blur-sm p-4 md:p-6">
                                                                        <div className="flex items-center gap-2 mb-4">
                                                                            <span className="material-symbols-outlined text-primary text-lg">edit_square</span>
                                                                            <h4 className="text-sm font-bold text-slate-700">
                                                                                Input Detil — Item #{idx + 1}
                                                                            </h4>
                                                                            <button
                                                                                onClick={() => setExpandedRow(null)}
                                                                                className="ml-auto text-slate-400 hover:text-slate-600"
                                                                            >
                                                                                <span className="material-symbols-outlined text-lg">close</span>
                                                                            </button>
                                                                        </div>

                                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                            {/* Nama & Barcode */}
                                                                            <div className="lg:col-span-3">
                                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nama Barang</label>
                                                                                <input
                                                                                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                                                                    value={item.namaBarang}
                                                                                    onChange={(e) => updateItem(item.id, { namaBarang: e.target.value, productName: e.target.value })}
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Barcode Luar</label>
                                                                                <input className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" value={item.barcodeLuar} onChange={(e) => updateItem(item.id, { barcodeLuar: e.target.value })} />
                                                                            </div>
                                                                            <div>
                                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Barcode Dalam</label>
                                                                                <input className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" value={item.barcodeDalam} onChange={(e) => updateItem(item.id, { barcodeDalam: e.target.value })} />
                                                                            </div>
                                                                            <div>
                                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Notes</label>
                                                                                <input className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" value={item.notes} onChange={(e) => updateItem(item.id, { notes: e.target.value })} />
                                                                            </div>

                                                                            {/* UOM & Qty */}
                                                                            <div>
                                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">UOM</label>
                                                                                <div className="mt-1 flex items-center gap-2">
                                                                                    <select
                                                                                        value={item.uom}
                                                                                        onChange={(e) => updateItem(item.id, { uom: e.target.value })}
                                                                                        className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                                                                    >
                                                                                        <option>DUS</option>
                                                                                        <option>PCS</option>
                                                                                        <option>KG</option>
                                                                                        <option>LITER</option>
                                                                                        <option>BOX</option>
                                                                                    </select>
                                                                                    <input type="number" className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-center focus:ring-2 focus:ring-primary/20 outline-none" value={item.qtyDus} onChange={(e) => updateItem(item.id, { qtyDus: Number(e.target.value) })} />
                                                                                    <span className="text-slate-400 text-xs">DUS @</span>
                                                                                    <input type="number" className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-center focus:ring-2 focus:ring-primary/20 outline-none" value={item.qtyPcs} onChange={(e) => updateItem(item.id, { qtyPcs: Number(e.target.value) })} />
                                                                                    <span className="text-slate-400 text-xs">PCS</span>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kuantitas</label>
                                                                                <div className="mt-1 flex items-center gap-2">
                                                                                    <input type="number" className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" value={item.kuantitas} onChange={(e) => updateItem(item.id, { kuantitas: Number(e.target.value) })} />
                                                                                    <span className="text-slate-400 text-xs whitespace-nowrap">Qty Tersedia :</span>
                                                                                    <input type="number" readOnly className="w-16 rounded-lg border border-slate-200 bg-slate-100 px-2 py-2 text-sm text-center text-slate-500 cursor-default outline-none" value={item.qtyTersedia} />
                                                                                </div>
                                                                            </div>

                                                                            {/* Harga Dasar */}
                                                                            <div>
                                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Harga Dasar</label>
                                                                                <div className="mt-1 flex items-center gap-2">
                                                                                    <input type="number" className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-right focus:ring-2 focus:ring-primary/20 outline-none" value={item.hargaDasar} onChange={(e) => updateItem(item.id, { hargaDasar: Number(e.target.value) })} />
                                                                                    <button className="text-slate-400 hover:text-primary transition-colors" title="Cari daftar harga">
                                                                                        <span className="material-symbols-outlined text-lg">search</span>
                                                                                    </button>
                                                                                    <button className="text-amber-500 hover:text-amber-600 transition-colors" title="Info harga">
                                                                                        <span className="material-symbols-outlined text-lg">info</span>
                                                                                    </button>
                                                                                </div>
                                                                                <p className="text-[10px] text-slate-400 mt-1">
                                                                                    Daftar Harga: {fmt(0)}, Harga terakhir: {fmt(item.hargaDasar)} [-,-]
                                                                                </p>
                                                                            </div>

                                                                            {/* Potongan 1-4 */}
                                                                            {([1, 2, 3, 4] as const).map((n) => {
                                                                                const pKey = `potongan${n}Pct` as keyof SalesOrderItem;
                                                                                const vKey = `potongan${n}Val` as keyof SalesOrderItem;
                                                                                const hKey = `hargaSetelah${n}` as keyof SalesOrderItem;
                                                                                return (
                                                                                    <div key={n} className="space-y-2">
                                                                                        <div>
                                                                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Potongan ke-{n}</label>
                                                                                            <div className="mt-1 flex items-center gap-2">
                                                                                                <input
                                                                                                    type="number"
                                                                                                    className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-center focus:ring-2 focus:ring-primary/20 outline-none"
                                                                                                    value={item[pKey] as number}
                                                                                                    onChange={(e) => updateItem(item.id, { [pKey]: Number(e.target.value) } as any)}
                                                                                                />
                                                                                                <span className="text-slate-400 text-xs">%</span>
                                                                                                <input type="number" readOnly className="flex-1 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right text-slate-500 cursor-default outline-none" value={(item[vKey] as number).toFixed(4)} />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div>
                                                                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Harga Setelah Potongan ke-{n}</label>
                                                                                            <input type="number" readOnly className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right text-slate-600 font-medium cursor-default outline-none" value={(item[hKey] as number).toFixed(4)} />
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            })}

                                                                            {/* PPN */}
                                                                            <div>
                                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PPN</label>
                                                                                <div className="mt-1 flex items-center gap-2">
                                                                                    <input type="number" className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-center focus:ring-2 focus:ring-primary/20 outline-none" value={item.ppnPct} onChange={(e) => updateItem(item.id, { ppnPct: Number(e.target.value) })} />
                                                                                    <span className="text-slate-400 text-xs">%</span>
                                                                                    <input type="number" readOnly className="flex-1 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right text-slate-500 cursor-default outline-none" value={item.ppnVal.toFixed(4)} />
                                                                                </div>
                                                                            </div>

                                                                            {/* Harga Unit Net & Jumlah */}
                                                                            <div>
                                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Harga Unit (Net)</label>
                                                                                <input type="number" readOnly className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right font-semibold text-slate-700 cursor-default outline-none" value={item.hargaUnitNet.toFixed(4)} />
                                                                            </div>
                                                                            <div>
                                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jumlah</label>
                                                                                <input type="number" readOnly className="mt-1 w-full rounded-lg border border-slate-200 bg-primary/5 px-3 py-2 text-sm text-right font-bold text-primary cursor-default outline-none" value={item.jumlah.toFixed(4)} />
                                                                            </div>
                                                                            <div className="lg:col-span-3">
                                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Additional Notes</label>
                                                                                <input className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" value={item.additionalNotes} onChange={(e) => updateItem(item.id, { additionalNotes: e.target.value })} placeholder="Catatan tambahan..." />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </>
                                                ))}

                                                {/* Quick add row */}
                                                <tr className="bg-slate-50/50">
                                                    <td className="px-3 py-3" colSpan={19}>
                                                        <button
                                                            onClick={addItem}
                                                            className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">add_circle</span>
                                                            Insert quick row
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Table footer */}
                                    <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
                                        <div className="flex gap-4 text-xs text-slate-500">
                                            <span>Rows: <strong className="text-slate-900">{items.length}</strong></span>
                                            <span>Total Qty: <strong className="text-slate-900">{items.reduce((s, i) => s + i.kuantitas, 0).toFixed(2)}</strong></span>
                                        </div>
                                        <div className="text-xs font-bold text-primary">
                                            Grand Total: IDR {fmtCur(grandTotal)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ══════════════════ TAB: ATTACHMENTS ══════════════════ */}
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

            {/* ── Add Barang Modal ── */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Input Detil Pemesanan Penjualan Barang"
                icon="inventory_2"
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
                            Tambah Barang
                        </button>
                    </>
                }
            >
                {/* ── Nama & Barcode ── */}
                <FormField label="Nama Barang">
                    <FormInput
                        value={newItem.namaBarang}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateNew({ namaBarang: e.target.value, productName: e.target.value })
                        }
                        placeholder="Masukkan nama barang..."
                    />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Barcode Luar ~ Barcode Dalam">
                        <div className="flex items-center gap-2">
                            <FormInput
                                value={newItem.barcodeLuar}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNew({ barcodeLuar: e.target.value })}
                                placeholder="Barcode luar"
                            />
                            <span className="text-slate-400 text-sm shrink-0">~</span>
                            <FormInput
                                value={newItem.barcodeDalam}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNew({ barcodeDalam: e.target.value })}
                                placeholder="Barcode dalam"
                            />
                        </div>
                    </FormField>
                    <FormField label="Product Name">
                        <FormInput
                            value={newItem.productName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNew({ productName: e.target.value })}
                            placeholder="Product name..."
                        />
                    </FormField>
                </div>
                <FormField label="Notes">
                    <FormInput
                        value={newItem.notes}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNew({ notes: e.target.value })}
                        placeholder="Notes..."
                    />
                </FormField>

                {/* ── UOM & Kuantitas ── */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="UOM">
                        <div className="flex items-center gap-2">
                            <FormSelect
                                value={newItem.uom}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateNew({ uom: e.target.value })}
                            >
                                <option>DUS</option>
                                <option>PCS</option>
                                <option>KG</option>
                                <option>LITER</option>
                                <option>BOX</option>
                            </FormSelect>
                            <FormInput
                                type="number"
                                value={newItem.qtyDus}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNew({ qtyDus: Number(e.target.value) })}
                                placeholder="0.00"
                            />
                            <span className="text-slate-400 text-xs whitespace-nowrap">DUS @</span>
                            <FormInput
                                type="number"
                                value={newItem.qtyPcs}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNew({ qtyPcs: Number(e.target.value) })}
                                placeholder="0.00"
                            />
                            <span className="text-slate-400 text-xs">PCS</span>
                        </div>
                    </FormField>
                    <FormField label="Kuantitas">
                        <div className="flex items-center gap-2">
                            <FormInput
                                type="number"
                                value={newItem.kuantitas}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNew({ kuantitas: Number(e.target.value) })}
                                placeholder="0.00"
                            />
                            <span className="text-slate-400 text-xs whitespace-nowrap">Qty Tersedia :</span>
                            <input
                                readOnly
                                type="number"
                                value={newItem.qtyTersedia}
                                className="w-20 rounded-lg border border-slate-200 bg-slate-100 px-2 py-2 text-sm text-center text-slate-500 cursor-default outline-none"
                            />
                        </div>
                    </FormField>
                </div>

                {/* ── Harga Dasar ── */}
                <FormField label="Harga Dasar">
                    <div className="flex items-center gap-2">
                        <FormInput
                            type="number"
                            value={newItem.hargaDasar}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNew({ hargaDasar: Number(e.target.value) })}
                            placeholder="0.0000"
                        />
                        <button className="text-slate-400 hover:text-primary transition-colors shrink-0" title="Cari daftar harga">
                            <span className="material-symbols-outlined text-lg">search</span>
                        </button>
                        <button className="text-amber-500 hover:text-amber-600 transition-colors shrink-0" title="Info harga">
                            <span className="material-symbols-outlined text-lg">info</span>
                        </button>
                        <span className="text-xs text-slate-400 whitespace-nowrap">
                            Daftar Harga: {fmt(0)}, Harga terakhir: {fmt(newItem.hargaDasar)} [-,-]
                        </span>
                    </div>
                </FormField>

                {/* ── Potongan 1–4 ── */}
                <div className="grid grid-cols-2 gap-4">
                    {([1, 2, 3, 4] as const).map((n) => {
                        const pKey = `potongan${n}Pct` as keyof SalesOrderItem;
                        const vKey = `potongan${n}Val` as keyof SalesOrderItem;
                        const hKey = `hargaSetelah${n}` as keyof SalesOrderItem;
                        const ni = newItem as SalesOrderItem;
                        return (
                            <div key={n} className="space-y-2">
                                <FormField label={`Potongan ke-${n}`}>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={ni[pKey] as number}
                                            onChange={(e) => updateNew({ [pKey]: Number(e.target.value) } as any)}
                                            className="w-20 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-center focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        />
                                        <span className="text-slate-400 text-xs">%</span>
                                        <input
                                            readOnly
                                            type="number"
                                            value={(ni[vKey] as number).toFixed(4)}
                                            className="flex-1 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right text-slate-500 cursor-default outline-none"
                                        />
                                    </div>
                                </FormField>
                                <FormField label={`Harga Setelah Potongan ke-${n}`}>
                                    <input
                                        readOnly
                                        type="number"
                                        value={(ni[hKey] as number).toFixed(4)}
                                        className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right font-medium text-slate-600 cursor-default outline-none"
                                    />
                                </FormField>
                            </div>
                        );
                    })}
                </div>

                {/* ── PPN ── */}
                <FormField label="PPN">
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            value={newItem.ppnPct}
                            onChange={(e) => updateNew({ ppnPct: Number(e.target.value) })}
                            className="w-20 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-center focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        />
                        <span className="text-slate-400 text-xs">%</span>
                        <input
                            readOnly
                            type="number"
                            value={newItem.ppnVal.toFixed(4)}
                            className="flex-1 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right text-slate-500 cursor-default outline-none"
                        />
                    </div>
                </FormField>

                {/* ── Hasil akhir ── */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Harga Unit (Net)">
                        <input
                            readOnly
                            type="number"
                            value={newItem.hargaUnitNet.toFixed(4)}
                            className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right font-semibold text-slate-700 cursor-default outline-none"
                        />
                    </FormField>
                    <FormField label="Jumlah">
                        <input
                            readOnly
                            type="number"
                            value={newItem.jumlah.toFixed(4)}
                            className="w-full rounded-lg border border-slate-200 bg-primary/5 px-3 py-2 text-sm text-right font-bold text-primary cursor-default outline-none"
                        />
                    </FormField>
                </div>

                <FormField label="Additional Notes">
                    <FormInput
                        value={newItem.additionalNotes}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNew({ additionalNotes: e.target.value })}
                        placeholder="Catatan tambahan (opsional)..."
                    />
                </FormField>
            </Modal>
        </div>
    );
}
