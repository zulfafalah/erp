"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import ItemTable, { ProductItem, ColumnDef } from "../../../components/ItemTable";
import FormField from "../../../components/FormField";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
import FormTextarea from "../../../components/FormTextarea";
import Modal from "../../../components/Modal";

const defaultProductItems: ProductItem[] = [];

// ── Column definition for Purchase Order ──────────────────────────────────
const _fmt = (v: number) =>
    v.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const purchaseOrderColumns: ColumnDef<ProductItem>[] = [
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

type TabKey = "header" | "order-details" | "attachments";

const tabs: { key: TabKey; label: string; icon: string; badge?: string }[] = [
    { key: "header", label: "Header Info", icon: "description" },
    { key: "order-details", label: "Order Details", icon: "list_alt", badge: "3" },
    { key: "attachments", label: "Attachments", icon: "attachment" },
];

export default function PurchaseOrderDetailPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("header");
    const [productItems, setProductItems] = useState<ProductItem[]>(defaultProductItems);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    // ── Product Search ────────────────────────────────────────────────────────
    const [productSearch, setProductSearch] = useState("");
    const [showProductDropdown, setShowProductDropdown] = useState(false);

    const router = useRouter();

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
        setEditingIndex(index);
        setActiveTab("order-details");
        setIsProductModalOpen(true);
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
                                onClick={() => router.push("/purchase/order")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">
                                    arrow_back
                                </span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        Pemesanan Pembelian Barang
                                    </h1>
                                    <span className="px-2 md:px-3 py-0.5 md:py-1 bg-yellow-100 text-yellow-700 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest border border-yellow-200">
                                        Draft
                                    </span>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    Buat dan kelola pesanan pembelian ke pemasok Anda.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-200/50 rounded-lg transition-all border border-slate-200 md:border-transparent">
                                Save Draft
                            </button>
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold bg-white text-primary border border-primary/20 hover:border-primary rounded-lg transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">print</span>
                                Print
                            </button>
                            <button className="w-full md:w-auto justify-center px-4 md:px-5 py-2 text-xs md:text-sm font-bold bg-primary text-white hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">
                                    check_circle
                                </span>
                                Approve Order
                            </button>
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

                        {/* Tab Content */}
                        {activeTab === "header" && (
                            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                                    {/* Left Section: Basic & Supplier Info */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Basic Info Card */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">info</span>
                                                <h3 className="font-bold text-slate-800">Informasi Dasar</h3>
                                            </div>
                                            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                                <FormField label="No. Purchase Order">
                                                    <FormInput defaultValue="POB 2603-0001" />
                                                </FormField>
                                                <FormField label="Tanggal">
                                                    <FormInput type="date" defaultValue="2023-10-27" />
                                                </FormField>
                                                <FormField label="Tipe Pembelian">
                                                    <FormSelect>
                                                        <option>Lokal</option>
                                                        <option>Import</option>
                                                    </FormSelect>
                                                </FormField>
                                                <FormField label="Mata Uang">
                                                    <div className="flex gap-2">
                                                        <FormSelect>
                                                            <option>IDR</option>
                                                            <option>USD</option>
                                                        </FormSelect>
                                                        <FormInput placeholder="Kurs" defaultValue="1.00" />
                                                    </div>
                                                </FormField>
                                            </div>
                                        </div>

                                        {/* Supplier Info Card */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">local_shipping</span>
                                                <h3 className="font-bold text-slate-800">Data Pemasok &amp; Pengiriman</h3>
                                            </div>
                                            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                                    <div className="md:col-span-2">
                                                        <FormField label="Pemasok (Supplier)">
                                                            <div className="relative">
                                                                <FormInput defaultValue="Carrefour Denpasar" />
                                                                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary">
                                                                    <span className="material-symbols-outlined">search</span>
                                                                </button>
                                                            </div>
                                                        </FormField>
                                                    </div>
                                                    <FormField label="No. Invoice Supplier">
                                                        <FormInput placeholder="Masukkan no. invoice..." />
                                                    </FormField>
                                                    <FormField label="No. Faktur Pajak">
                                                        <FormInput placeholder="Masukkan no. faktur pajak..." />
                                                    </FormField>
                                                    <FormField label="Tipe Pengiriman">
                                                        <FormSelect>
                                                            <option>Normal</option>
                                                            <option>Express</option>
                                                            <option>Cargo</option>
                                                        </FormSelect>
                                                    </FormField>
                                                    <FormField label="Tempo Pembayaran (Hari)">
                                                        <div className="flex items-center gap-2">
                                                            <FormInput type="number" defaultValue="10" />
                                                            <span className="text-sm text-slate-500">Hari</span>
                                                        </div>
                                                    </FormField>
                                                </div>
                                                <FormField label="Keterangan">
                                                    <FormTextarea
                                                        placeholder="Tambahkan catatan untuk pesanan ini..."
                                                        rows={3}
                                                        defaultValue="Pemesanan Pembelian ke Carrefour Denpasar untuk stok gudang utama..."
                                                    />
                                                </FormField>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Section: Financial Summary & Actions */}
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-0">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-primary">receipt_long</span>
                                                    <h3 className="font-bold text-slate-800">Ringkasan Biaya</h3>
                                                </div>
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

                                                {/* Uang Muka */}
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Uang Muka (DP)</p>
                                                    <div className="flex gap-2">
                                                        <FormInput
                                                            type="text"
                                                            defaultValue="0.00"
                                                            className="!flex-1 text-right !bg-white !py-1.5 !px-2 font-semibold text-slate-700"
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2">
                                                <button className="col-span-2 py-3 bg-primary text-white rounded font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                                                    <span className="material-symbols-outlined">save</span> SIMPAN PESANAN
                                                </button>
                                                <button className="py-2 bg-white border border-slate-200 text-slate-600 rounded text-xs px-1 md:px-0 font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined !text-sm">refresh</span> RESET
                                                </button>
                                                <button className="py-2 bg-white border border-slate-200 text-slate-600 rounded text-xs px-1 md:px-0 font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined !text-sm">help</span> INFO
                                                </button>
                                                <button className="col-span-1 py-2 bg-emerald-500 text-white rounded text-[10px] md:text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined !text-sm">verified</span> APPROVE
                                                </button>
                                                <button className="col-span-1 py-2 bg-amber-500 text-white rounded text-[10px] md:text-xs font-bold hover:bg-amber-600 transition-colors flex items-center justify-center gap-1 text-center leading-tight">
                                                    <span className="material-symbols-outlined !text-sm">question_answer</span> ASK CONFIRM
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "order-details" && (
                            <div className="flex-1 flex flex-col overflow-hidden gap-3">
                                {/* ── Product Search Bar ─────────────────────── */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 shrink-0 flex items-center gap-3">
                                    <div className="flex-1 relative">
                                        <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 bg-white">
                                            <input
                                                type="text"
                                                value={productSearch}
                                                onChange={(e) => {
                                                    setProductSearch(e.target.value);
                                                    setShowProductDropdown(true);
                                                }}
                                                onFocus={() => setShowProductDropdown(true)}
                                                onBlur={() =>
                                                    setTimeout(() => setShowProductDropdown(false), 150)
                                                }
                                                placeholder="Cari/Pilih Barang & Jasa..."
                                                className="flex-1 px-3 py-2 text-sm outline-none bg-transparent"
                                            />
                                            <span className="px-3 text-slate-400">
                                                <span className="material-symbols-outlined text-lg">search</span>
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setEditingIndex(null);
                                            setIsProductModalOpen(true);
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex-shrink-0"
                                    >
                                        <span className="material-symbols-outlined text-sm">add_circle</span>
                                        Tambah Item
                                    </button>
                                </div>

                                {/* ── Item Table ────────────────────────────── */}
                                <ItemTable
                                    items={productItems}
                                    columns={purchaseOrderColumns}
                                    onUpdateItem={handleUpdateItem}
                                    onRemoveItem={handleRemoveItem}
                                    onEditItem={handleEditItem}
                                    emptyMessage="Belum ada item. Tambah produk untuk pesanan ini."
                                />
                            </div>
                        )}

                        {activeTab === "attachments" && (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <span className="material-symbols-outlined text-5xl text-slate-300">
                                        attachment
                                    </span>
                                    <p className="mt-2 text-sm text-slate-500">
                                        No attachments yet
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

            {/* Product Modal — menggunakan komponen Modal reusable */}
            <Modal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                title="Tambah Produk Baru"
                icon="inventory_2"
                size="md"
                footer={
                    <>
                        <button
                            onClick={() => setIsProductModalOpen(false)}
                            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            onClick={() => {
                                handleInsertQuickRow();
                                setIsProductModalOpen(false);
                            }}
                            className="px-4 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">add_circle</span>
                            Tambah Produk
                        </button>
                    </>
                }
            >
                <FormField label="Nama Produk">
                    <FormInput placeholder="Masukkan nama produk..." />
                </FormField>
                <FormField label="SKU">
                    <FormInput placeholder="Masukkan kode SKU..." />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Jumlah (Qty)">
                        <FormInput type="number" defaultValue="1" />
                    </FormField>
                    <FormField label="Harga Satuan">
                        <FormInput type="number" defaultValue="0" />
                    </FormField>
                </div>
                <FormField label="Satuan">
                    <FormSelect>
                        <option>Pcs</option>
                        <option>Unit</option>
                        <option>Box</option>
                        <option>Kg</option>
                        <option>Liter</option>
                    </FormSelect>
                </FormField>
                <FormField label="Keterangan">
                    <FormInput placeholder="Catatan tambahan (opsional)..." />
                </FormField>
            </Modal>
        </div>
    );
}
