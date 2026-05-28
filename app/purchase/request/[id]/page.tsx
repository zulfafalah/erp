"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import ItemTable, { ProductItem, ColumnDef } from "../../../components/ItemTable";
import FormField from "../../../components/FormField";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
import Modal from "../../../components/Modal";
import ProductSearchBar, { ProductSearchResult } from "../../../components/ProductSearchBar";

// ── Supplier Type ──────────────────────────────────────────────────────────────
interface SupplierListItem {
    supplierid: number;
    suppcode: string;
    companyname: string;
}

// ── Unit (Tipe Pengiriman) Type ────────────────────────────────────────────────
interface UnitListItem {
    unitid: number;
    unit: string;
    unitname: string;
}


// ── Item Detail Modal State ────────────────────────────────────────────────
interface ItemDetailForm {
    namaBarang: string;
    productDescription: string;
    uom: string;
    kuantitas: number;
    hargaDasar: number;
    diskon1Pct: number;
    diskon2Pct: number;
    diskon3Pct: number;
    diskon4Pct: number;
    ppnPct: number;
    additionalNotes: string;
}

const defaultItemForm: ItemDetailForm = {
    namaBarang: "",
    productDescription: "",
    uom: "PCS",
    kuantitas: 0,
    hargaDasar: 0,
    diskon1Pct: 0,
    diskon2Pct: 0,
    diskon3Pct: 0,
    diskon4Pct: 0,
    ppnPct: 0,
    additionalNotes: "",
};

// ── Helpers ────────────────────────────────────────────────────────────────
function applyDiscount(price: number, pct: number) {
    return price - (price * pct) / 100;
}

function useItemCalc(form: ItemDetailForm) {
    const setelah1 = applyDiscount(form.hargaDasar, form.diskon1Pct);
    const setelah2 = applyDiscount(setelah1, form.diskon2Pct);
    const setelah3 = applyDiscount(setelah2, form.diskon3Pct);
    const setelah4 = applyDiscount(setelah3, form.diskon4Pct);
    const ppnNominal = (setelah4 * form.ppnPct) / 100;
    const hargaFinal = setelah4 + ppnNominal;
    const jumlah = hargaFinal * form.kuantitas;
    return { setelah1, setelah2, setelah3, setelah4, ppnNominal, hargaFinal, jumlah };
}

const defaultProductItems: ProductItem[] = [];

// ── Column definition for this page ───────────────────────────────────────
const _fmt = (v: number) =>
    v.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const purchaseRequestColumns: ColumnDef<ProductItem>[] = [
    { key: "barcode", label: "Barcode", width: "w-28", align: "left" },
    {
        key: "name",
        label: "Nama Barang",
        render: (v) => (
            <p className="font-semibold text-slate-800 leading-tight">{String(v || "—")}</p>
        ),
    },
    { key: "uom", label: "UOM", width: "w-20", align: "center" },
    {
        key: "qty",
        label: "Qty",
        width: "w-24",
        align: "right",
        editable: true,
        editType: "number",
        footer: "sum",
    },
    {
        key: "hargaDasar",
        label: "Harga Dasar",
        width: "w-32",
        align: "right",
        render: (v) => _fmt(v as number),
    },
    {
        key: "discount",
        label: "Discount",
        width: "w-28",
        align: "right",
        render: (v) => _fmt(v as number),
    },
    {
        key: "ppn",
        label: "PPN",
        width: "w-28",
        align: "right",
        render: (v) => _fmt(v as number),
    },
    {
        key: "hargaFinal",
        label: "Harga Final",
        width: "w-32",
        align: "right",
        render: (v) => <span className="font-medium">{_fmt(v as number)}</span>,
    },
    {
        key: "jumlah",
        label: "Jumlah",
        width: "w-36",
        align: "right",
        render: (v) => <span className="font-bold">{_fmt(v as number)}</span>,
        footer: "sum",
    },
];

type TabKey = "header" | "request-details" | "attachments";

const tabs: { key: TabKey; label: string; icon: string; badge?: string }[] = [
    { key: "header", label: "Header Info", icon: "description" },
    { key: "request-details", label: "Detail Permintaan", icon: "list_alt"},
    { key: "attachments", label: "Lampiran", icon: "attachment" },
];

const statusBadgeStyles: Record<string, string> = {
    Approved: "bg-green-100 text-green-700 border-green-200",
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Draft: "bg-slate-100 text-slate-600 border-slate-200",
    Rejected: "bg-red-100 text-red-700 border-red-200",
};

export default function PurchaseRequestDetailPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("header");
    const [productItems, setProductItems] = useState<ProductItem[]>(defaultProductItems);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    // ── Product Search (controlled value for ProductSearchBar) ────────────────
    const [productSearch, setProductSearch] = useState("");

    // ── Modal Tab & Extra Fields ───────────────────────────────────────────────
    const [activeModalTab, setActiveModalTab] = useState<"rincian" | "info">("rincian");
    const [selectedProductCode, setSelectedProductCode] = useState("");
    const [itemPpnChecked, setItemPpnChecked] = useState(true);
    const [itemDiskonPct, setItemDiskonPct] = useState(0);
    const [itemGudang, setItemGudang] = useState("");

    // ── Suppliers ─────────────────────────────────────────────────────────────
    const [suppliers, setSuppliers] = useState<SupplierListItem[]>([]);
    const [loadingSuppliers, setLoadingSuppliers] = useState(false);

    useEffect(() => {
        setLoadingSuppliers(true);
        fetch("/api/master-data/suppliers?limit=200")
            .then((res) => res.json())
            .then((json) => {
                if (json.ok && Array.isArray(json.data)) {
                    setSuppliers(json.data);
                }
            })
            .catch((err) => console.error("[suppliers fetch]", err))
            .finally(() => setLoadingSuppliers(false));
    }, []);

    // ── Tipe Pengiriman (Units isplat=1) ───────────────────────────────────────
    const [tipePengiriman, setTipePengiriman] = useState<UnitListItem[]>([]);
    const [loadingTipePengiriman, setLoadingTipePengiriman] = useState(false);

    useEffect(() => {
        setLoadingTipePengiriman(true);
        fetch("/api/master-data/units?isplat=1")
            .then((res) => res.json())
            .then((json) => {
                if (json.ok && Array.isArray(json.data)) {
                    setTipePengiriman(json.data);
                }
            })
            .catch((err) => console.error("[tipePengiriman fetch]", err))
            .finally(() => setLoadingTipePengiriman(false));
    }, []);

    // ── Products — fetched on-demand via ProductSearchBar (no pre-fetch needed) ─

    // ── Item Detail Modal State ───────────────────────────────────────────
    const [itemForm, setItemForm] = useState<ItemDetailForm>(defaultItemForm);
    const calc = useItemCalc(itemForm);

    const setItemField = <K extends keyof ItemDetailForm>(key: K, val: ItemDetailForm[K]) =>
        setItemForm((f) => ({ ...f, [key]: val }));

    // ── Handle product selected from ProductSearchBar ───────────────────────────
    const handleProductSelected = (p: ProductSearchResult) => {
        setItemField("namaBarang", p.productname);
        if (p.produnit) setItemField("uom", p.produnit);
        setSelectedProductCode(p.productcode);
        setProductSearch(p.productname);
        setActiveModalTab("rincian");
        setIsProductModalOpen(true);
    };

    // ── Item discount / total computed ────────────────────────────────────────
    const itemDiskonRp = (itemForm.hargaDasar * itemDiskonPct) / 100;
    const itemTotalHarga =
        (itemForm.hargaDasar - itemDiskonRp) * itemForm.kuantitas * (1 + (itemPpnChecked ? 0.11 : 0));

    const resetModalState = () => {
        setItemForm(defaultItemForm);
        setSelectedProductCode("");
        setActiveModalTab("rincian");
        setItemDiskonPct(0);
        setItemGudang("");
        setItemPpnChecked(true);
        setProductSearch("");
        setEditingIndex(null);
    };

    const router = useRouter();
    const params = useParams();
    const isNew = params?.id === "new";

    const currentStatus = "Draft";

    const handleInsertQuickRow = () => {
        setProductItems([
            ...productItems,
            {
                name: "",
                barcode: "",
                uom: "PCS",
                qty: 1,
                hargaDasar: 0,
                discount: 0,
                ppn: 0,
                hargaFinal: 0,
                jumlah: 0,
            },
        ]);
    };

    const handleUpdateItem = (index: number, field: keyof ProductItem, value: any) => {
        const newItems = [...productItems];
        newItems[index] = { ...newItems[index], [field]: value };

        if (field === "qty") {
            newItems[index].jumlah = newItems[index].qty * newItems[index].hargaFinal;
        }

        setProductItems(newItems);
    };

    const handleRemoveItem = (index: number) => {
        setProductItems(productItems.filter((_, i) => i !== index));
    };

    const handleEditItem = (index: number) => {
        const item = productItems[index];
        setItemForm((f) => ({
            ...f,
            namaBarang: item.name,
            uom: item.uom,
            kuantitas: item.qty,
            hargaDasar: item.hargaDasar,
        }));
        setActiveModalTab("rincian");
        setIsProductModalOpen(true);
        // mark which index is being edited
        setEditingIndex(index);
    };

    const subTotal = productItems.reduce((acc, item) => acc + item.jumlah, 0);
    const formatRupiah = (value: number) =>
        new Intl.NumberFormat("id-ID", { style: "decimal", minimumFractionDigits: 2 }).format(value);

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
                        <div className="flex items-start md:items-center gap-3 md:gap-4 w-full md:w-auto">
                            <button
                                onClick={() => router.push("/purchase/request")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">
                                    arrow_back
                                </span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        Permintaan Pembelian Barang
                                    </h1>
                                    <span
                                        className={`px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest border ${statusBadgeStyles[currentStatus]}`}
                                    >
                                        {currentStatus}
                                    </span>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    Buat dan kelola permintaan pembelian barang ke departemen terkait.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-200/50 rounded-lg transition-all border border-slate-200 md:border-transparent">
                                Save Draft
                            </button>
                            <button disabled={isNew} className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold bg-white text-primary border border-primary/20 hover:border-primary rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-primary/20 disabled:hover:bg-white">
                                <span className="material-symbols-outlined text-sm">print</span>
                                Print
                            </button>
                            {!isNew && (
                                <button className="w-full md:w-auto justify-center px-4 md:px-5 py-2 text-xs md:text-sm font-bold bg-primary text-white hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">
                                        check_circle
                                    </span>
                                    Approve Request
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Tab System Container */}
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
                                    <span className="material-symbols-outlined text-lg">
                                        {tab.icon}
                                    </span>
                                    {tab.label}
                                    {tab.badge && (
                                        <span className="size-5 rounded-full bg-slate-100 text-[10px] flex items-center justify-center font-bold">
                                            {tab.badge}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content: Header */}
                        {activeTab === "header" && (
                            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                                    {/* Left: Form Cards */}
                                    <div className="lg:col-span-2 space-y-6">

                                        {/* Informasi Dasar Card */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">info</span>
                                                <h3 className="font-bold text-slate-800">Informasi Dasar</h3>
                                            </div>
                                            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                                {/* No. + Lokal dropdown */}
                                                <FormField label="No.">
                                                    <div className="flex gap-2">
                                                        <FormInput defaultValue="Generate" readOnly />
                                                        <FormSelect>
                                                            <option>Lokal</option>
                                                            <option>Import</option>
                                                        </FormSelect>
                                                    </div>
                                                </FormField>

                                                {/* Tanggal */}
                                                <FormField label="Tanggal">
                                                    <FormInput type="date" defaultValue="2026-04-01" />
                                                </FormField>

                                                {/* No.Invoice ~ No. Shipment Supplier */}
                                                <FormField label="No.Invoice ~ No. Shipment Supplier" className="sm:col-span-2">
                                                    <div className="flex gap-2">
                                                        <FormInput placeholder="No. Invoice..." />
                                                        <FormInput placeholder="No. Shipment Supplier..." />
                                                    </div>
                                                </FormField>

                                                {/* Faktur. Pajak No. ~ Tgl Faktur */}
                                                <FormField label="Faktur. Pajak No. ~ Tgl Faktur" className="sm:col-span-2">
                                                    <div className="flex gap-2">
                                                        <FormInput placeholder="No. Faktur Pajak..." />
                                                        <FormInput type="date" defaultValue="2026-04-01" />
                                                    </div>
                                                </FormField>
                                            </div>
                                        </div>

                                        {/* Data Pemasok & Pengiriman Card */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">local_shipping</span>
                                                <h3 className="font-bold text-slate-800">Data Pemasok &amp; Pengiriman</h3>
                                            </div>
                                            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                                {/* Pemasok */}
                                                <FormField label="Pemasok" className="sm:col-span-2">
                                                    <FormSelect disabled={loadingSuppliers}>
                                                        <option value="">
                                                            {loadingSuppliers ? "Memuat data pemasok..." : "-- Pilih Pemasok --"}
                                                        </option>
                                                        {suppliers.map((s) => (
                                                            <option key={s.supplierid} value={s.supplierid}>
                                                                {s.companyname}
                                                            </option>
                                                        ))}
                                                    </FormSelect>
                                                </FormField>

                                                {/* Tipe Pengiriman */}
                                                <FormField label="Tipe Pengiriman" className="sm:col-span-2">
                                                    <FormSelect disabled={loadingTipePengiriman}>
                                                        <option value="">
                                                            {loadingTipePengiriman ? "Memuat tipe pengiriman..." : ":: Pilih Tipe Pengiriman ::"}
                                                        </option>
                                                        {tipePengiriman.map((u) => (
                                                            <option key={u.unitid} value={u.unitid}>
                                                                {u.unitname || u.unit}
                                                            </option>
                                                        ))}
                                                    </FormSelect>
                                                </FormField>

                                                {/* Keterangan */}
                                                <FormField label="Keterangan" className="sm:col-span-2">
                                                    <FormInput placeholder="Keterangan..." />
                                                </FormField>

                                                {/* Tempo Bayar */}
                                                <FormField label="Tempo Bayar">
                                                    <div className="flex items-center gap-2">
                                                        <FormInput type="number" defaultValue="0" readOnly />
                                                        <span className="text-sm text-slate-500 whitespace-nowrap">Hari</span>
                                                    </div>
                                                </FormField>

                                                {/* Status */}
                                                <FormField label="Status">
                                                    <div className="flex gap-2">
                                                        <FormInput
                                                            readOnly
                                                            value="Draft"
                                                            className="flex-1 !bg-yellow-100 !opacity-100 !text-slate-800 font-bold text-center tracking-wide"
                                                        />
                                                        <FormInput
                                                            readOnly
                                                            value=""
                                                            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-400 cursor-not-allowed"
                                                            placeholder="Keterangan status..."
                                                        />
                                                    </div>
                                                </FormField>

                                                {/* Kurs Lokal */}
                                                <FormField label="Kurs Lokal" className="sm:col-span-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 whitespace-nowrap">
                                                            RP
                                                        </span>
                                                        <FormInput readOnly type="number" defaultValue="1.00" />
                                                    </div>
                                                </FormField>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Sidebar Ringkasan */}
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-0">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">receipt_long</span>
                                                <h3 className="font-bold text-slate-800">Ringkasan Biaya</h3>
                                            </div>
                                            <div className="p-4 md:p-6 space-y-3">
                                                {/* Sub Total */}
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500 w-28 shrink-0">Sub Total</span>
                                                    <FormInput
                                                        readOnly
                                                        value={formatRupiah(subTotal)}
                                                        className="!flex-1 text-right !py-1.5 !px-2 font-semibold text-slate-700"
                                                    />
                                                </div>

                                                {/* Disc % */}
                                                <div className="flex justify-between items-center text-sm gap-2">
                                                    <div className="flex items-center gap-1 w-28 shrink-0">
                                                        <span className="text-slate-500">Disc</span>
                                                        <FormInput
                                                            className="!w-10 !h-7 !px-1 !py-0 text-center !rounded text-xs"
                                                            type="text"
                                                            defaultValue="0"
                                                        />
                                                        <span className="text-slate-400 text-xs">%</span>
                                                    </div>
                                                    <FormInput
                                                        readOnly
                                                        value="0.00"
                                                        className="!flex-1 text-right !py-1.5 !px-2 font-semibold text-red-500"
                                                    />
                                                </div>

                                                {/* PPN % */}
                                                <div className="flex justify-between items-center text-sm gap-2">
                                                    <div className="flex items-center gap-1 w-28 shrink-0">
                                                        <span className="text-slate-500">PPN</span>
                                                        <FormInput
                                                            className="!w-10 !h-7 !px-1 !py-0 text-center !rounded text-xs"
                                                            type="text"
                                                            defaultValue="11"
                                                        />
                                                        <span className="text-slate-400 text-xs">%</span>
                                                    </div>
                                                    <FormInput
                                                        readOnly
                                                        value={formatRupiah(subTotal * 0.11)}
                                                        className="!flex-1 text-right !py-1.5 !px-2 font-semibold text-slate-700"
                                                    />
                                                </div>

                                                {/* Grand Total ~ Total Konversi */}
                                                <div className="pt-3 border-t border-slate-100 space-y-1">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        Grand Total ~ Total Konversi
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <FormInput
                                                            readOnly
                                                            value={formatRupiah(subTotal * 1.11)}
                                                            className="!flex-1 text-right !bg-primary/5 !border-primary/20 !py-1.5 !px-2 font-black !text-primary !opacity-100"
                                                        />
                                                        <FormInput
                                                            readOnly
                                                            value={formatRupiah(subTotal * 1.11)}
                                                            className="!flex-1 text-right !py-1.5 !px-2 font-semibold text-slate-700"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Total Uang Muka ~ Biaya */}
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        Total Uang Muka ~ Biaya
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <FormInput
                                                            type="text"
                                                            defaultValue="0.00"
                                                            className="!flex-1 text-right !bg-white !py-1.5 !px-2 font-semibold text-slate-700"
                                                        />
                                                        <FormInput
                                                            readOnly
                                                            value="0.00"
                                                            className="!flex-1 text-right !py-1.5 !px-2 font-semibold text-slate-700"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2">
                                                <button className="col-span-2 py-3 bg-primary text-white rounded font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                                                    <span className="material-symbols-outlined">save</span> SIMPAN PERMINTAAN
                                                </button>
                                                <button className="py-2 bg-white border border-slate-200 text-slate-600 rounded text-xs px-1 md:px-0 font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined !text-sm">refresh</span> RESET
                                                </button>
                                                <button disabled={isNew} className="py-2 bg-white border border-slate-200 text-slate-600 rounded text-xs px-1 md:px-0 font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white">
                                                    <span className="material-symbols-outlined !text-sm">print</span> PRINT
                                                </button>
                                                {!isNew && (
                                                    <>
                                                        <button className="col-span-1 py-2 bg-emerald-500 text-white rounded text-[10px] md:text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1">
                                                            <span className="material-symbols-outlined !text-sm">verified</span> APPROVE
                                                        </button>
                                                        <button className="col-span-1 py-2 bg-amber-500 text-white rounded text-[10px] md:text-xs font-bold hover:bg-amber-600 transition-colors flex items-center justify-center gap-1 text-center leading-tight">
                                                            <span className="material-symbols-outlined !text-sm">question_answer</span> ASK CONFIRM
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Request Details */}
                        {activeTab === "request-details" && (
                            <div className="flex-1 flex flex-col overflow-hidden gap-3">
                                {/* ── Product Search Bar ─────────────────────── */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 shrink-0 flex items-center gap-3">
                                    <ProductSearchBar
                                        className="flex-1"
                                        value={productSearch}
                                        onChange={setProductSearch}
                                        onSelect={handleProductSelected}
                                        placeholder="Cari/Pilih Barang & Jasa..."
                                        minChars={2}
                                        debounceMs={350}
                                        maxResults={8}
                                    />
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                        <span className="material-symbols-outlined text-slate-400 text-lg">inventory_2</span>
                                        <span className="text-sm font-semibold text-slate-700">
                                            Rincian Barang{" "}
                                            <span className="text-red-500">*</span>
                                        </span>
                                    </div>
                                </div>

                                {/* ── Item Table ────────────────────────────── */}
                                <ItemTable
                                    items={productItems}
                                    columns={purchaseRequestColumns}
                                    onUpdateItem={handleUpdateItem}
                                    onRemoveItem={handleRemoveItem}
                                    onEditItem={handleEditItem}
                                    emptyMessage="Belum ada item. Cari & pilih produk di atas."
                                />
                            </div>
                        )}

                        {/* Tab Content: Attachments */}
                        {activeTab === "attachments" && (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <span className="material-symbols-outlined text-5xl text-slate-300">
                                        attachment
                                    </span>
                                    <p className="mt-2 text-sm text-slate-500">
                                        Belum ada lampiran
                                    </p>
                                    <button className="mt-4 px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto">
                                        <span className="material-symbols-outlined text-sm">
                                            upload_file
                                        </span>
                                        Upload File
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Footer StatusBar */}
            <StatusBar />

            {/* ── Item Detail Modal ───────────────────────────────────────── */}
            <Modal
                isOpen={isProductModalOpen}
                onClose={() => {
                    setIsProductModalOpen(false);
                    resetModalState();
                }}
                title={editingIndex !== null ? "Edit Detil Item Pembelian" : "Input Detil Pemesanan Pembelian Barang"}
                icon="inventory_2"
                size="xl"
                footer={
                    <>
                        <button
                            onClick={() => {
                                setIsProductModalOpen(false);
                                resetModalState();
                            }}
                            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            onClick={() => {
                                if (!itemForm.namaBarang) return;
                                const newItem: ProductItem = {
                                    name: itemForm.namaBarang,
                                    barcode: selectedProductCode,
                                    uom: itemForm.uom,
                                    qty: itemForm.kuantitas,
                                    hargaDasar: itemForm.hargaDasar,
                                    discount: itemForm.hargaDasar - calc.setelah4,
                                    ppn: calc.ppnNominal,
                                    hargaFinal: calc.hargaFinal,
                                    jumlah: calc.jumlah,
                                };
                                if (editingIndex !== null) {
                                    setProductItems((prev) =>
                                        prev.map((item, i) => (i === editingIndex ? newItem : item))
                                    );
                                } else {
                                    setProductItems((prev) => [...prev, newItem]);
                                }
                                setIsProductModalOpen(false);
                                resetModalState();
                            }}
                            className="px-4 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">
                                {editingIndex !== null ? "save" : "add_circle"}
                            </span>
                            {editingIndex !== null ? "Simpan Perubahan" : "Tambah Item"}
                        </button>
                    </>
                }
            >
                {/* ── Layout: 2-col table-like form ─────────────────────── */}
                <div className="divide-y divide-slate-100 -mx-5 -mt-4 px-1">

                    {/* Nama Barang */}
                    <div className="grid grid-cols-[160px_1fr] items-center gap-3 px-4 py-2.5">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Nama Barang</span>
                        <ProductSearchBar
                            value={itemForm.namaBarang}
                            onChange={(val) => setItemField("namaBarang", val)}
                            onSelect={(p) => {
                                setItemField("namaBarang", p.productname);
                                setSelectedProductCode(p.productcode);
                                if (p.produnit) setItemField("uom", p.produnit);
                            }}
                            placeholder="Cari produk..."
                            minChars={2}
                            debounceMs={350}
                            maxResults={8}
                        />
                    </div>

                    {/* Product Description */}
                    <div className="grid grid-cols-[160px_1fr] items-center gap-3 px-4 py-2.5">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Product Description</span>
                        <input
                            type="text"
                            value={itemForm.productDescription}
                            onChange={(e) => setItemField("productDescription", e.target.value)}
                            className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-primary bg-slate-50"
                        />
                    </div>

                    {/* UOM */}
                    <div className="grid grid-cols-[160px_1fr] items-center gap-3 px-4 py-2.5">
                        <span className="text-xs font-semibold text-slate-500 uppercase">UOM</span>
                        <div className="flex items-center gap-2">
                            <select
                                value={itemForm.uom}
                                onChange={(e) => setItemField("uom", e.target.value)}
                                className="border border-slate-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-primary bg-white"
                            >
                                {["PCS", "DUS", "BOX", "KG", "LITER", "RIM", "UNIT", "SET"].map((u) => (
                                    <option key={u}>{u}</option>
                                ))}
                            </select>
                            <span className="text-xs text-slate-400">0 {itemForm.uom} @ 0 PCS</span>
                        </div>
                    </div>

                    {/* Kuantitas */}
                    <div className="grid grid-cols-[160px_1fr] items-center gap-3 px-4 py-2.5">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Kuantitas</span>
                        <input
                            type="number"
                            value={itemForm.kuantitas}
                            onChange={(e) => setItemField("kuantitas", parseFloat(e.target.value) || 0)}
                            className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm text-right focus:outline-none focus:border-primary bg-white"
                        />
                    </div>

                    {/* Harga Dasar */}
                    <div className="grid grid-cols-[160px_1fr] items-center gap-3 px-4 py-2.5">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Harga Dasar</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={itemForm.hargaDasar}
                                onChange={(e) => setItemField("hargaDasar", parseFloat(e.target.value) || 0)}
                                className="flex-1 border border-slate-200 rounded px-3 py-1.5 text-sm text-right focus:outline-none focus:border-primary bg-white"
                            />
                            <button className="size-8 flex items-center justify-center rounded border border-slate-200 hover:bg-primary/5 text-slate-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-base">search</span>
                            </button>
                            <button className="size-8 flex items-center justify-center rounded bg-amber-500 text-white hover:bg-amber-600 transition-colors">
                                <span className="material-symbols-outlined text-base">calculate</span>
                            </button>
                        </div>
                    </div>

                    {/* ── Cascade Discounts ────────────────────────── */}
                    {([1, 2, 3, 4] as const).map((n) => {
                        const pctKey = `diskon${n}Pct` as keyof ItemDetailForm;
                        const pct = itemForm[pctKey] as number;
                        const setPct = (v: number) => setItemField(pctKey, v);
                        const beforeArr = [itemForm.hargaDasar, calc.setelah1, calc.setelah2, calc.setelah3];
                        const setelahArr = [calc.setelah1, calc.setelah2, calc.setelah3, calc.setelah4];
                        const before = beforeArr[n - 1];
                        const after = setelahArr[n - 1];
                        const diskonNominal = before - after;
                        const fmt = (v: number) =>
                            v.toLocaleString("id-ID", { minimumFractionDigits: 4, maximumFractionDigits: 4 });

                        return (
                            <div key={n}>
                                {/* Discount row */}
                                <div className="grid grid-cols-[160px_1fr] items-center gap-3 px-4 py-2">
                                    <span className="text-xs font-semibold text-slate-500 uppercase">
                                        Potongan ke-{n}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={pct}
                                            onChange={(e) => setPct(parseFloat(e.target.value) || 0)}
                                            className="w-16 border border-slate-200 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:border-primary bg-white"
                                        />
                                        <input
                                            readOnly
                                            value={fmt(diskonNominal)}
                                            className="flex-1 border border-slate-100 rounded px-3 py-1.5 text-sm text-right bg-slate-50 text-red-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                {/* After-discount readonly row */}
                                <div className="grid grid-cols-[160px_1fr] items-center gap-3 px-4 py-1.5 bg-slate-50/60">
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase pl-2">
                                        Harga Setelah Potongan ke-{n}
                                    </span>
                                    <input
                                        readOnly
                                        value={fmt(after)}
                                        className="w-full border border-slate-100 rounded px-3 py-1.5 text-sm text-right bg-slate-100 text-slate-600 cursor-not-allowed font-medium"
                                    />
                                </div>
                            </div>
                        );
                    })}

                    {/* PPN */}
                    <div className="grid grid-cols-[160px_1fr] items-center gap-3 px-4 py-2.5">
                        <span className="text-xs font-semibold text-slate-500 uppercase">PPN</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={itemForm.ppnPct}
                                onChange={(e) => setItemField("ppnPct", parseFloat(e.target.value) || 0)}
                                className="w-16 border border-slate-200 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:border-primary bg-white"
                            />
                            <input
                                readOnly
                                value={calc.ppnNominal.toLocaleString("id-ID", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                                className="flex-1 border border-slate-100 rounded px-3 py-1.5 text-sm text-right bg-slate-50 text-slate-500 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Harga Final */}
                    <div className="grid grid-cols-[160px_1fr] items-center gap-3 px-4 py-2.5 bg-primary/5">
                        <span className="text-xs font-bold text-slate-600 uppercase">Harga Final</span>
                        <input
                            readOnly
                            value={calc.hargaFinal.toLocaleString("id-ID", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                            className="w-full border border-primary/20 rounded px-3 py-1.5 text-sm text-right bg-primary/5 text-primary font-bold cursor-not-allowed"
                        />
                    </div>

                    {/* Jumlah */}
                    <div className="grid grid-cols-[160px_1fr] items-center gap-3 px-4 py-2.5 bg-primary/5">
                        <span className="text-xs font-bold text-slate-600 uppercase">Jumlah</span>
                        <input
                            readOnly
                            value={calc.jumlah.toLocaleString("id-ID", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                            className="w-full border border-primary/20 rounded px-3 py-1.5 text-sm text-right bg-primary/10 text-primary font-black cursor-not-allowed"
                        />
                    </div>

                    {/* Additional Notes */}
                    <div className="grid grid-cols-[160px_1fr] items-start gap-3 px-4 py-2.5">
                        <span className="text-xs font-semibold text-slate-500 uppercase pt-2">Additional Notes</span>
                        <input
                            type="text"
                            value={itemForm.additionalNotes}
                            onChange={(e) => setItemField("additionalNotes", e.target.value)}
                            className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-primary bg-white"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}
