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

// ─── Types ────────────────────────────────────────────────────────────────────

interface InvoiceItem {
    id: number;
    barcodeLuar: string;
    namaBarang: string;
    uom: string;
    qty: number;
    hargaDasar: number;
    discPct: number;
    discVal: number;
    ppnPct: number;
    ppnVal: number;
    hargaFinal: number;
    jumlah: number;
}

interface DeliveryItem {
    id: number;
    noPolisi: string;
    namaBarang: string;
    jumlah: number;
    dicetakTanggal: string;
    dicetakOleh: string;
    kodeUnik: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcInvoiceItem(item: InvoiceItem): InvoiceItem {
    const discVal = item.hargaDasar * (item.discPct / 100);
    const hargaAfterDisc = item.hargaDasar - discVal;
    const ppnVal = hargaAfterDisc * (item.ppnPct / 100);
    const hargaFinal = hargaAfterDisc + ppnVal;
    return {
        ...item,
        discVal,
        ppnVal,
        hargaFinal,
        jumlah: hargaFinal * item.qty,
    };
}

const fmt = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Mock Data ────────────────────────────────────────────────────────────────

const defaultItems: InvoiceItem[] = [
    calcInvoiceItem({
        id: 1,
        barcodeLuar: "1030830018564",
        namaBarang: "AXE DEO DORANT BLACK 12X150ML",
        uom: "DUS",
        qty: 2,
        hargaDasar: 304545.45,
        discPct: 2.98,
        discVal: 0,
        ppnPct: 11,
        ppnVal: 0,
        hargaFinal: 0,
        jumlah: 0,
    }),
];

const defaultDelivery: DeliveryItem[] = [
    {
        id: 1,
        noPolisi: "BE_8139_CE",
        namaBarang: "AXE DEO DORANT BLACK 12X150ML",
        jumlah: 2,
        dicetakTanggal: "",
        dicetakOleh: "",
        kodeUnik: "",
    },
];

function blankItem(id: number): InvoiceItem {
    return calcInvoiceItem({
        id,
        barcodeLuar: "",
        namaBarang: "",
        uom: "DUS",
        qty: 0,
        hargaDasar: 0,
        discPct: 0,
        discVal: 0,
        ppnPct: 11,
        ppnVal: 0,
        hargaFinal: 0,
        jumlah: 0,
    });
}

function blankDelivery(id: number): DeliveryItem {
    return {
        id,
        noPolisi: "",
        namaBarang: "",
        jumlah: 0,
        dicetakTanggal: "",
        dicetakOleh: "",
        kodeUnik: "",
    };
}

// ─── Tab Config ───────────────────────────────────────────────────────────────

type TabKey = "header" | "detail-barang" | "detail-pengiriman" | "attachments";

const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "header", label: "Header Info", icon: "description" },
    { key: "detail-barang", label: "Detail Barang", icon: "inventory_2" },
    { key: "detail-pengiriman", label: "Detail Pengiriman", icon: "local_shipping" },
    { key: "attachments", label: "Attachments", icon: "attachment" },
];

// ─── Inline Cell ─────────────────────────────────────────────────────────────

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

export default function SalesInvoiceDetailPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("header");
    const router = useRouter();

    // — Invoice Items state —
    const [items, setItems] = useState<InvoiceItem[]>(defaultItems.map(calcInvoiceItem));
    const [isAddItemOpen, setIsAddItemOpen] = useState(false);
    const [newItem, setNewItem] = useState<InvoiceItem>(blankItem(0));
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    // — Delivery Items state —
    const [deliveries, setDeliveries] = useState<DeliveryItem[]>(defaultDelivery);
    const [isAddDeliveryOpen, setIsAddDeliveryOpen] = useState(false);
    const [newDelivery, setNewDelivery] = useState<DeliveryItem>(blankDelivery(0));

    // — Helpers —
    const updateItem = (id: number, patch: Partial<InvoiceItem>) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? calcInvoiceItem({ ...item, ...patch }) : item))
        );
    };
    const removeItem = (id: number) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
        if (expandedRow === id) setExpandedRow(null);
    };
    const addItem = () => {
        const newId = Math.max(0, ...items.map((i) => i.id)) + 1;
        setItems((prev) => [...prev, calcInvoiceItem({ ...newItem, id: newId })]);
        setNewItem(blankItem(0));
        setIsAddItemOpen(false);
    };

    const updateDelivery = (id: number, patch: Partial<DeliveryItem>) => {
        setDeliveries((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
    };
    const removeDelivery = (id: number) => {
        setDeliveries((prev) => prev.filter((d) => d.id !== id));
    };
    const addDelivery = () => {
        const newId = Math.max(0, ...deliveries.map((d) => d.id)) + 1;
        setDeliveries((prev) => [...prev, { ...newDelivery, id: newId }]);
        setNewDelivery(blankDelivery(0));
        setIsAddDeliveryOpen(false);
    };

    // — Totals —
    const subTotal = items.reduce((s, i) => s + i.hargaDasar * i.qty, 0);
    const totalDisc = items.reduce((s, i) => s + i.discVal * i.qty, 0);
    const totalPPN = items.reduce((s, i) => s + i.ppnVal * i.qty, 0);
    const grandTotal = items.reduce((s, i) => s + i.jumlah, 0);
    const totalQty = items.reduce((s, i) => s + i.qty, 0);
    const totalQtyDelivery = deliveries.reduce((s, d) => s + d.jumlah, 0);

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
                                onClick={() => router.push("/sales/invoice")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        Faktur Penjualan Barang
                                    </h1>
                                    <span className="px-2 md:px-3 py-0.5 md:py-1 bg-green-100 text-green-700 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest border border-green-200">
                                        Approved
                                    </span>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    SIL 2601-0001 · Input dan kelola faktur penjualan barang lokal.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-200/50 rounded-lg transition-all border border-slate-200 md:border-transparent">
                                Save Draft
                            </button>
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold bg-white text-primary border border-primary/20 hover:border-primary rounded-lg transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">print</span>
                                Print SI
                            </button>
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold bg-amber-500 text-white hover:bg-amber-600 rounded-lg transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">cancel</span>
                                Un-Approve
                            </button>
                            <button className="w-full md:w-auto justify-center px-4 md:px-5 py-2 text-xs md:text-sm font-bold bg-primary text-white hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                Approve
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
                                </button>
                            ))}
                        </div>

                        {/* ══════════ TAB: HEADER ══════════ */}
                        {activeTab === "header" && (
                            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                                    {/* Left */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Informasi Faktur */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">info</span>
                                                <h3 className="font-bold text-slate-800">Informasi Faktur</h3>
                                            </div>
                                            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                                <FormField label="Tanggal Nota ~ Invoice#">
                                                    <div className="flex items-center gap-2">
                                                        <FormInput type="date" defaultValue="2026-01-06" />
                                                        <FormInput defaultValue="SIL 2601-0001" />
                                                    </div>
                                                </FormField>
                                                <FormField label="Tanggal Kirim ~ SJ#">
                                                    <div className="flex items-center gap-2">
                                                        <FormInput type="date" defaultValue="2026-01-06" />
                                                        <FormInput defaultValue="SJL 2601-0001" />
                                                    </div>
                                                </FormField>
                                                <FormField label="Jenis Surat">
                                                    <FormSelect>
                                                        <option>Tanpa Kop Surat</option>
                                                        <option>Dengan Kop Surat</option>
                                                    </FormSelect>
                                                </FormField>
                                                <FormField label="SO No.">
                                                    <FormSelect>
                                                        <option>SOL 2601-0001</option>
                                                        <option>SOL 2601-0002</option>
                                                    </FormSelect>
                                                </FormField>
                                                <FormField label="Mata Uang ~ Kurs Jual">
                                                    <div className="flex items-center gap-2">
                                                        <FormSelect>
                                                            <option>Rupiah</option>
                                                            <option>Dollar</option>
                                                            <option>Euro</option>
                                                        </FormSelect>
                                                        <FormInput type="number" defaultValue="1.00" />
                                                    </div>
                                                </FormField>
                                                <FormField label="Jenis Bayar">
                                                    <FormSelect>
                                                        <option>Transfer</option>
                                                        <option>Tunai</option>
                                                        <option>Cek / Giro</option>
                                                    </FormSelect>
                                                </FormField>
                                                <FormField label="Tempo Bayar (Hari)">
                                                    <div className="flex items-center gap-2">
                                                        <FormInput type="number" defaultValue="0" />
                                                        <span className="text-sm text-slate-500 shrink-0">Hari</span>
                                                    </div>
                                                </FormField>
                                                <FormField label="Barang Keluar dari Gudang">
                                                    <FormSelect>
                                                        <option>GUDANG KAPUK</option>
                                                        <option>GUDANG JAKARTA</option>
                                                        <option>GUDANG SURABAYA</option>
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
                                                <FormField label="Penjual">
                                                    <FormInput defaultValue="TOKO" />
                                                </FormField>
                                                <FormField label="Status">
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-800 text-xs font-bold rounded-lg border border-green-200">
                                                            Approved
                                                        </span>
                                                    </div>
                                                </FormField>
                                                <div className="sm:col-span-2">
                                                    <FormField label="Catatan Tambahan">
                                                        <FormTextarea
                                                            placeholder="Tambahkan catatan untuk faktur ini..."
                                                            rows={3}
                                                            defaultValue="Penjualan kepada AYU"
                                                        />
                                                    </FormField>
                                                </div>
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
                                                    <span className="font-semibold">{fmt(subTotal)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-slate-500">Disc %</span>
                                                        <input className="w-12 h-7 py-0 px-1 text-center bg-slate-50 border border-slate-200 rounded text-xs" type="number" defaultValue="0" />
                                                        <span className="text-slate-400">%</span>
                                                    </div>
                                                    <span className="font-semibold text-red-500">-{fmt(totalDisc)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-slate-500">PPN %</span>
                                                        <input className="w-12 h-7 py-0 px-1 text-center bg-slate-50 border border-slate-200 rounded text-xs" type="number" defaultValue="11" />
                                                        <span className="text-slate-400">%</span>
                                                    </div>
                                                    <span className="font-semibold text-slate-700">{fmt(totalPPN)}</span>
                                                </div>
                                                <div className="pt-4 border-t border-slate-100 space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm md:text-base font-bold text-slate-900">Grand Total</span>
                                                        <span className="text-lg md:text-xl font-black text-primary">{fmt(grandTotal)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-slate-500">Total Konversi</span>
                                                        <span className="font-semibold">{fmt(grandTotal)}</span>
                                                    </div>
                                                </div>
                                                <div className="pt-2 space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment ~ Retur ~ Komisi ~ Item</label>
                                                    <div className="grid grid-cols-4 gap-1">
                                                        {[fmt(0), fmt(327971.70), fmt(0), items.length.toString()].map((d, i) => (
                                                            <input key={i} className="w-full bg-slate-50 border border-slate-200 rounded text-center font-bold text-xs text-slate-700 px-1 py-1.5" readOnly value={d} />
                                                        ))}
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
                                                <button className="col-span-1 py-2 bg-red-500 text-white rounded text-xs font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined !text-sm">block</span> CANCEL
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ══════════ TAB: DETAIL BARANG ══════════ */}
                        {activeTab === "detail-barang" && (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                                    {/* Table header bar */}
                                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">inventory_2</span>
                                            <h3 className="text-sm font-bold text-slate-900">
                                                Daftar Item Invoice
                                                <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-semibold">{items.length} item</span>
                                            </h3>
                                        </div>
                                        <button
                                            onClick={() => setIsAddItemOpen(true)}
                                            className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-primary/90 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-base">add</span>
                                            Tambah Barang
                                        </button>
                                    </div>

                                    {/* Scrollable table */}
                                    <div className="flex-1 overflow-auto no-scrollbar">
                                        <table className="w-full text-left border-collapse text-xs" style={{ minWidth: "1100px" }}>
                                            <thead className="bg-slate-50 sticky top-0 z-10">
                                                <tr>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-8">#</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-32">Barcode Luar</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider min-w-[200px]">Nama Barang</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-16">UOM</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-16 text-right">Qty</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-28 text-right">Harga Dasar</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-16 text-right">Disc</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-16 text-right">PPN</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-28 text-right">Harga Final</th>
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
                                                            <td className="px-3 py-2 font-mono text-slate-500">{item.barcodeLuar || "—"}</td>
                                                            <td className="px-3 py-2">
                                                                <div className="font-semibold text-slate-900 truncate max-w-[200px]">
                                                                    {item.namaBarang || <span className="text-slate-400 italic">—</span>}
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">{item.uom}</span>
                                                            </td>
                                                            <td className="px-3 py-2 text-right font-medium">{item.qty.toFixed(2)}</td>
                                                            <td className="px-3 py-2 text-right">{fmt(item.hargaDasar)}</td>
                                                            <td className="px-3 py-2 text-right text-rose-500">{item.discPct}%</td>
                                                            <td className="px-3 py-2 text-right text-blue-500">{item.ppnPct}%</td>
                                                            <td className="px-3 py-2 text-right font-semibold">{fmt(item.hargaFinal)}</td>
                                                            <td className="px-3 py-2 text-right font-bold text-primary">{fmt(item.jumlah)}</td>
                                                            <td className="px-3 py-2">
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                                                                    className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1 rounded hover:bg-red-50"
                                                                >
                                                                    <span className="material-symbols-outlined text-base">delete</span>
                                                                </button>
                                                            </td>
                                                        </tr>

                                                        {/* Expanded edit row */}
                                                        {expandedRow === item.id && (
                                                            <tr key={`exp-${item.id}`}>
                                                                <td colSpan={11} className="p-0 border-b-2 border-primary/20">
                                                                    <div className="bg-slate-50/80 backdrop-blur-sm p-4 md:p-6">
                                                                        <div className="flex items-center gap-2 mb-4">
                                                                            <span className="material-symbols-outlined text-primary text-lg">edit_square</span>
                                                                            <h4 className="text-sm font-bold text-slate-700">Edit Item #{idx + 1}</h4>
                                                                            <button onClick={() => setExpandedRow(null)} className="ml-auto text-slate-400 hover:text-slate-600">
                                                                                <span className="material-symbols-outlined text-lg">close</span>
                                                                            </button>
                                                                        </div>
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                            <div className="lg:col-span-2">
                                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nama Barang</label>
                                                                                <input className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" value={item.namaBarang} onChange={(e) => updateItem(item.id, { namaBarang: e.target.value })} />
                                                                            </div>
                                                                            <div>
                                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Barcode Luar</label>
                                                                                <input className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" value={item.barcodeLuar} onChange={(e) => updateItem(item.id, { barcodeLuar: e.target.value })} />
                                                                            </div>
                                                                            <div>
                                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">UOM</label>
                                                                                <select className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" value={item.uom} onChange={(e) => updateItem(item.id, { uom: e.target.value })}>
                                                                                    <option>DUS</option><option>PCS</option><option>KG</option><option>LITER</option><option>BOX</option>
                                                                                </select>
                                                                            </div>
                                                                            <div>
                                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qty</label>
                                                                                <input type="number" className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-right focus:ring-2 focus:ring-primary/20 outline-none" value={item.qty} onChange={(e) => updateItem(item.id, { qty: Number(e.target.value) })} />
                                                                            </div>
                                                                            <div>
                                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Harga Dasar</label>
                                                                                <input type="number" className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-right focus:ring-2 focus:ring-primary/20 outline-none" value={item.hargaDasar} onChange={(e) => updateItem(item.id, { hargaDasar: Number(e.target.value) })} />
                                                                            </div>
                                                                            <div>
                                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Disc %</label>
                                                                                <div className="mt-1 flex items-center gap-2">
                                                                                    <input type="number" className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-center focus:ring-2 focus:ring-primary/20 outline-none" value={item.discPct} onChange={(e) => updateItem(item.id, { discPct: Number(e.target.value) })} />
                                                                                    <span className="text-slate-400 text-xs">%</span>
                                                                                    <input readOnly type="number" className="flex-1 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right text-slate-500 cursor-default outline-none" value={item.discVal.toFixed(2)} />
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PPN %</label>
                                                                                <div className="mt-1 flex items-center gap-2">
                                                                                    <input type="number" className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-center focus:ring-2 focus:ring-primary/20 outline-none" value={item.ppnPct} onChange={(e) => updateItem(item.id, { ppnPct: Number(e.target.value) })} />
                                                                                    <span className="text-slate-400 text-xs">%</span>
                                                                                    <input readOnly type="number" className="flex-1 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right text-slate-500 cursor-default outline-none" value={item.ppnVal.toFixed(2)} />
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Harga Final</label>
                                                                                <input readOnly type="number" className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right font-semibold text-slate-700 cursor-default outline-none" value={item.hargaFinal.toFixed(2)} />
                                                                            </div>
                                                                            <div>
                                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jumlah</label>
                                                                                <input readOnly type="number" className="mt-1 w-full rounded-lg border border-slate-200 bg-primary/5 px-3 py-2 text-sm text-right font-bold text-primary cursor-default outline-none" value={item.jumlah.toFixed(2)} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </>
                                                ))}
                                                {/* Quick add */}
                                                <tr className="bg-slate-50/50">
                                                    <td className="px-3 py-3" colSpan={11}>
                                                        <button onClick={() => { const id = Math.max(0, ...items.map(i => i.id)) + 1; setItems(prev => [...prev, blankItem(id)]); }} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
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
                                            <span>Total Qty: <strong className="text-slate-900">{totalQty.toFixed(2)}</strong></span>
                                        </div>
                                        <div className="text-xs font-bold text-primary">
                                            Grand Total: {fmt(grandTotal)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ══════════ TAB: DETAIL PENGIRIMAN ══════════ */}
                        {activeTab === "detail-pengiriman" && (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                                    {/* Table header bar */}
                                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">local_shipping</span>
                                            <h3 className="text-sm font-bold text-slate-900">
                                                Daftar Detail Pengiriman / Kendaraan
                                                <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-semibold">{deliveries.length} item</span>
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setIsAddDeliveryOpen(true)}
                                                className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-primary/90 transition-all"
                                            >
                                                <span className="material-symbols-outlined text-base">add</span>
                                                Add New
                                            </button>
                                            <button className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-600 transition-all">
                                                <span className="material-symbols-outlined text-base">auto_mode</span>
                                                Auto Add
                                            </button>
                                            <button className="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-amber-600 transition-all">
                                                <span className="material-symbols-outlined text-base">undo</span>
                                                Auto Undo
                                            </button>
                                        </div>
                                    </div>

                                    {/* Scrollable table */}
                                    <div className="flex-1 overflow-auto no-scrollbar">
                                        <table className="w-full text-left border-collapse text-xs" style={{ minWidth: "900px" }}>
                                            <thead className="bg-slate-50 sticky top-0 z-10">
                                                <tr>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-8">No.</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-32">No. Polisi</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider min-w-[200px]">Nama Produk</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-20 text-right">Jumlah</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-32">Dicetak Tanggal</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-32">Dicetak Oleh</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-28">Kode Unik</th>
                                                    <th className="px-3 py-3 font-bold text-slate-500 uppercase tracking-wider w-24 text-right">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {deliveries.map((del, idx) => (
                                                    <tr key={del.id} className="hover:bg-primary/5 transition-colors group">
                                                        <td className="px-3 py-2 text-slate-400 font-mono">{idx + 1}</td>
                                                        <td className="px-3 py-2">
                                                            <Cell value={del.noPolisi} onChange={(v) => updateDelivery(del.id, { noPolisi: v })} className="font-mono" />
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <Cell value={del.namaBarang} onChange={(v) => updateDelivery(del.id, { namaBarang: v })} className="font-medium" />
                                                        </td>
                                                        <td className="px-3 py-2 text-right">
                                                            <Cell value={del.jumlah} type="number" onChange={(v) => updateDelivery(del.id, { jumlah: Number(v) })} className="text-right font-medium" />
                                                        </td>
                                                        <td className="px-3 py-2 text-slate-500">{del.dicetakTanggal || "—"}</td>
                                                        <td className="px-3 py-2 text-slate-500">{del.dicetakOleh || "—"}</td>
                                                        <td className="px-3 py-2 text-slate-500 font-mono">{del.kodeUnik || "—"}</td>
                                                        <td className="px-3 py-2">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <button className="px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-[10px] font-bold transition-colors">View</button>
                                                                <button className="px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-[10px] font-bold transition-colors" onClick={() => removeDelivery(del.id)}>Delete</button>
                                                                <button className="px-2 py-1 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded text-[10px] font-bold transition-colors">Undo</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {/* Quick add */}
                                                <tr className="bg-slate-50/50">
                                                    <td className="px-3 py-3" colSpan={8}>
                                                        <button onClick={() => { const id = Math.max(0, ...deliveries.map(d => d.id)) + 1; setDeliveries(prev => [...prev, blankDelivery(id)]); }} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
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
                                            <span>Rows: <strong className="text-slate-900">{deliveries.length}</strong></span>
                                            <span>Total: <strong className="text-slate-900">{totalQtyDelivery.toFixed(2)}</strong></span>
                                        </div>
                                        <p className="text-xs text-slate-400">Klik baris untuk mengedit inline</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ══════════ TAB: ATTACHMENTS ══════════ */}
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
                isOpen={isAddItemOpen}
                onClose={() => setIsAddItemOpen(false)}
                title="Tambah Item Faktur Penjualan"
                icon="inventory_2"
                size="xl"
                footer={
                    <>
                        <button onClick={() => setIsAddItemOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            Batal
                        </button>
                        <button onClick={addItem} className="px-4 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">add_circle</span>
                            Tambah Barang
                        </button>
                    </>
                }
            >
                <FormField label="Nama Barang">
                    <FormInput value={newItem.namaBarang} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => calcInvoiceItem({ ...prev, namaBarang: e.target.value }))} placeholder="Masukkan nama barang..." />
                </FormField>
                <FormField label="Barcode Luar">
                    <FormInput value={newItem.barcodeLuar} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, barcodeLuar: e.target.value }))} placeholder="Barcode luar..." />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="UOM">
                        <FormSelect value={newItem.uom} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewItem(prev => calcInvoiceItem({ ...prev, uom: e.target.value }))}>
                            <option>DUS</option><option>PCS</option><option>KG</option><option>LITER</option><option>BOX</option>
                        </FormSelect>
                    </FormField>
                    <FormField label="Qty">
                        <FormInput type="number" value={newItem.qty} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => calcInvoiceItem({ ...prev, qty: Number(e.target.value) }))} placeholder="0.00" />
                    </FormField>
                </div>
                <FormField label="Harga Dasar">
                    <FormInput type="number" value={newItem.hargaDasar} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => calcInvoiceItem({ ...prev, hargaDasar: Number(e.target.value) }))} placeholder="0.00" />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Disc %">
                        <div className="flex items-center gap-2">
                            <FormInput type="number" value={newItem.discPct} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => calcInvoiceItem({ ...prev, discPct: Number(e.target.value) }))} placeholder="0" />
                            <span className="text-slate-400 text-xs shrink-0">%</span>
                        </div>
                    </FormField>
                    <FormField label="PPN %">
                        <div className="flex items-center gap-2">
                            <FormInput type="number" value={newItem.ppnPct} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => calcInvoiceItem({ ...prev, ppnPct: Number(e.target.value) }))} placeholder="11" />
                            <span className="text-slate-400 text-xs shrink-0">%</span>
                        </div>
                    </FormField>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Harga Final">
                        <input readOnly value={newItem.hargaFinal.toFixed(2)} className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-right font-semibold text-slate-700 cursor-default outline-none" />
                    </FormField>
                    <FormField label="Jumlah">
                        <input readOnly value={newItem.jumlah.toFixed(2)} className="w-full rounded-lg border border-slate-200 bg-primary/5 px-3 py-2 text-sm text-right font-bold text-primary cursor-default outline-none" />
                    </FormField>
                </div>
            </Modal>

            {/* ── Add Delivery Modal ── */}
            <Modal
                isOpen={isAddDeliveryOpen}
                onClose={() => setIsAddDeliveryOpen(false)}
                title="Tambah Detail Pengiriman / Kendaraan"
                icon="local_shipping"
                size="lg"
                footer={
                    <>
                        <button onClick={() => setIsAddDeliveryOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            Batal
                        </button>
                        <button onClick={addDelivery} className="px-4 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">add_circle</span>
                            Tambah Pengiriman
                        </button>
                    </>
                }
            >
                <FormField label="No. Polisi Kendaraan">
                    <FormInput value={newDelivery.noPolisi} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDelivery(prev => ({ ...prev, noPolisi: e.target.value }))} placeholder="Contoh: BE 8139 CE" />
                </FormField>
                <FormField label="Nama Produk">
                    <FormInput value={newDelivery.namaBarang} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDelivery(prev => ({ ...prev, namaBarang: e.target.value }))} placeholder="Nama produk yang dikirim..." />
                </FormField>
                <FormField label="Jumlah">
                    <FormInput type="number" value={newDelivery.jumlah} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDelivery(prev => ({ ...prev, jumlah: Number(e.target.value) }))} placeholder="0.00" />
                </FormField>
                <FormField label="Kode Unik">
                    <FormInput value={newDelivery.kodeUnik} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDelivery(prev => ({ ...prev, kodeUnik: e.target.value }))} placeholder="Kode unik pengiriman..." />
                </FormField>
            </Modal>
        </div>
    );
}
