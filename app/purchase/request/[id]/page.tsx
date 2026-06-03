"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import ItemTable, { ProductItem } from "../../../components/ItemTable";
import FormField from "../../../components/FormField";
import FormInput from "@/app/components/FormInput";
import ModalFormInput from "@/app/components/ModalFormInput";
import FormSelect from "../../../components/FormSelect";
import Modal from "../../../components/Modal";
import ProductSearchBar, { ProductSearchResult } from "../../../components/ProductSearchBar";
import Button from "@/app/components/Button";
import PercentNominalInput from "@/app/components/PercentNominalInput";

import { TabKey, ExtendedProductItem, ItemDetailForm } from "../types";
import { tabs, statusBadgeStyles, purchaseRequestColumns } from "../constants";
import { usePurchaseRequestForm } from "../hooks/usePurchaseRequestForm";
import { useItemModal } from "../hooks/useItemModal";

export default function PurchaseRequestDetailPage() {
    const router = useRouter();
    const params = useParams();
    const isNew = params?.id === "new";
    const currentStatus = "Draft";

    const [activeTab, setActiveTab] = useState<TabKey>("header");
    const [productItems, setProductItems] = useState<ExtendedProductItem[]>([]);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [productSearch, setProductSearch] = useState("");

    const form = usePurchaseRequestForm({ productItems, router });
    const modal = useItemModal();

    // Auto-switch to request-details tab when item errors arrive from API
    useEffect(() => {
        if (form.itemDetailErrors.length > 0 || form.itemsError) {
            setActiveTab("request-details");
        }
    }, [form.itemDetailErrors, form.itemsError]);

    const handleProductSelected = (p: ProductSearchResult) => {
        modal.handleProductSelected(p);
        setProductSearch(p.productname);
        setIsProductModalOpen(true);
    };

    const handleUpdateItem = (index: number, field: keyof ExtendedProductItem, value: any) => {
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
        modal.setItemForm((f) => ({
            ...f,
            namaBarang: item.name,
            uom: item.uom,
            kuantitas: item.qty,
            hargaDasar: item.hargaDasar,
        }));
        modal.setActiveModalTab("rincian");
        modal.setSelectedProductCode(item.barcode);
        setIsProductModalOpen(true);
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
                            <Button
                                variant="secondary-border"
                                size="icon-sm"
                                onClick={() => router.push("/purchase/request")}
                                className="mt-1 md:mt-0"
                                icon="arrow_back"
                            />
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        Permintaan Pembelian Barang
                                    </h1>
                                    <span
                                        className={`px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest border ${statusBadgeStyles[currentStatus] || statusBadgeStyles.Draft
                                            }`}
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
                            {form.apiError && (
                                <span className="text-xs text-red-500 font-medium bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-sm">error</span>
                                    {form.apiError}
                                </span>
                            )}
                            <Button
                                variant="primary"
                                icon="save"
                                onClick={form.handleSave}
                                loading={form.isSaving}
                                loadingText="Menyimpan..."
                                className="flex-1 md:flex-none px-4 md:px-5 py-2 text-xs md:text-sm font-bold shadow-lg shadow-primary/25"
                            >
                                Simpan
                            </Button>
                            <Button
                                variant="outline"
                                disabled={isNew}
                                icon="print"
                                className="flex-1 md:flex-none px-3 md:px-4 py-2 text-xs md:text-sm"
                            >
                                Print
                            </Button>
                            {!isNew && (
                                <Button
                                    variant="primary"
                                    icon="check_circle"
                                    className="w-full md:w-auto px-4 md:px-5 py-2 text-xs md:text-sm"
                                >
                                    Approve Request
                                </Button>
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
                                                        <FormSelect
                                                            value={form.ispolokal}
                                                            onChange={(e) => form.setIspolokal(Number(e.target.value))}
                                                        >
                                                            <option value={0}>Lokal</option>
                                                            <option value={1}>Import</option>
                                                        </FormSelect>
                                                    </div>
                                                </FormField>

                                                {/* Tanggal */}
                                                <FormField label="Tanggal">
                                                    <FormInput
                                                        type="date"
                                                        value={form.podate}
                                                        onChange={(e) => form.setPodate(e.target.value)}
                                                    />
                                                </FormField>

                                                {/* No.Invoice ~ No. Shipment Supplier */}
                                                <FormField label="No.Invoice ~ No. Shipment Supplier" className="sm:col-span-2">
                                                    <div className="flex gap-2">
                                                        <FormInput
                                                            placeholder="No. Invoice..."
                                                            value={form.poInvNo}
                                                            onChange={(e) => form.setPoInvNo(e.target.value)}
                                                        />
                                                        <FormInput
                                                            placeholder="No. Shipment Supplier..."
                                                            value={form.poSjNo}
                                                            onChange={(e) => form.setPoSjNo(e.target.value)}
                                                        />
                                                    </div>
                                                </FormField>

                                                {/* Faktur. Pajak No. ~ Tgl Faktur */}
                                                <FormField label="Faktur. Pajak No. ~ Tgl Faktur" className="sm:col-span-2">
                                                    <div className="flex gap-2">
                                                        <FormInput
                                                            placeholder="No. Faktur Pajak..."
                                                            value={form.poFpajaktno}
                                                            onChange={(e) => form.setPoFpajaktno(e.target.value)}
                                                        />
                                                        <FormInput
                                                            type="date"
                                                            value={form.poFpajaktgl}
                                                            onChange={(e) => form.setPoFpajaktgl(e.target.value)}
                                                        />
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
                                                    <FormSelect
                                                        disabled={form.loadingSuppliers}
                                                        value={form.supplierIdForm}
                                                        onChange={(e) => {
                                                            form.setSupplierIdForm(e.target.value ? Number(e.target.value) : "");
                                                            if (e.target.value) form.clearSupplierError();
                                                        }}
                                                        className={form.supplierError ? "!border-red-400 !ring-1 !ring-red-400" : ""}
                                                    >
                                                        <option value="">
                                                            {form.loadingSuppliers ? "Memuat data pemasok..." : "-- Pilih Pemasok --"}
                                                        </option>
                                                        {form.suppliers.map((s) => (
                                                            <option key={s.supplierid} value={s.supplierid}>
                                                                {s.companyname}
                                                            </option>
                                                        ))}
                                                    </FormSelect>
                                                    {form.supplierError && (
                                                        <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-sm">error</span>
                                                            {form.supplierError}
                                                        </p>
                                                    )}
                                                </FormField>

                                                {/* Tipe Pengiriman */}
                                                <FormField label="Tipe Pengiriman" className="sm:col-span-2">
                                                    <FormSelect
                                                        disabled={form.loadingTipePengiriman}
                                                        value={form.tipePengirimanId}
                                                        onChange={(e) => {
                                                            form.setTipePengirimanId(e.target.value ? Number(e.target.value) : "");
                                                            if (e.target.value) form.clearTipePengirimanError();
                                                        }}
                                                        className={form.tipePengirimanError ? "!border-red-400 !ring-1 !ring-red-400" : ""}
                                                    >
                                                        <option value="">
                                                            {form.loadingTipePengiriman ? "Memuat tipe pengiriman..." : ":: Pilih Tipe Pengiriman ::"}
                                                        </option>
                                                        {form.tipePengiriman.map((u) => (
                                                            <option key={u.unitid} value={u.unitid}>
                                                                {u.unitname || u.unit}
                                                            </option>
                                                        ))}
                                                    </FormSelect>
                                                    {form.tipePengirimanError && (
                                                        <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-sm">error</span>
                                                            {form.tipePengirimanError}
                                                        </p>
                                                    )}
                                                </FormField>

                                                {/* Keterangan */}
                                                <FormField label="Keterangan" className="sm:col-span-2">
                                                    <FormInput
                                                        placeholder="Keterangan..."
                                                        value={form.poket1}
                                                        onChange={(e) => form.setPoket1(e.target.value)}
                                                    />
                                                </FormField>

                                                {/* Tempo Bayar */}
                                                <FormField label="Tempo Bayar">
                                                    <div className="flex items-center gap-2">
                                                        <FormInput
                                                            type="number"
                                                            value={form.potop}
                                                            onChange={(e) => form.setPotop(Number(e.target.value) || 0)}
                                                        />
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

                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Request Details */}
                        {activeTab === "request-details" && (
                            <div className="flex-1 flex flex-col overflow-hidden gap-3">
                                {/* ── Items Error Banner ───────────────────── */}
                                {(form.itemsError || form.itemDetailErrors.length > 0) && (
                                    <div className="shrink-0 bg-red-50 border border-red-300 text-red-700 rounded-xl px-4 py-3 space-y-1.5">
                                        {form.itemsError && (
                                            <div className="flex items-center gap-2 text-sm font-semibold">
                                                <span className="material-symbols-outlined text-lg text-red-500">error</span>
                                                {form.itemsError}
                                            </div>
                                        )}
                                        {form.itemDetailErrors.map((msg, i) => (
                                            <div key={i} className="flex items-start gap-2 text-xs font-medium">
                                                <span className="material-symbols-outlined text-sm text-red-400 mt-0.5">arrow_right</span>
                                                {msg}
                                            </div>
                                        ))}
                                    </div>
                                )}

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
                                            Rincian Barang <span className="text-red-500">*</span>
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
                                    <Button
                                        variant="primary"
                                        icon="upload_file"
                                        className="mt-4 mx-auto"
                                    >
                                        Upload File
                                    </Button>
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
                    modal.resetModalState();
                    setEditingIndex(null);
                }}
                title={editingIndex !== null ? "Edit Detil Item Pembelian" : "Input Detil Pemesanan Pembelian Barang"}
                icon="inventory_2"
                size="xl"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setIsProductModalOpen(false);
                                modal.resetModalState();
                                setEditingIndex(null);
                            }}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            icon={editingIndex !== null ? "save" : "add_circle"}
                            onClick={() => {
                                if (!modal.itemForm.namaBarang) return;
                                const newItem: ExtendedProductItem = {
                                    name: modal.itemForm.namaBarang,
                                    barcode: modal.selectedProductCode,
                                    uom: modal.itemForm.uom,
                                    qty: modal.itemForm.kuantitas,
                                    hargaDasar: modal.itemForm.hargaDasar,
                                    discount: modal.itemForm.hargaDasar - modal.calc.setelah4,
                                    ppn: modal.calc.ppnNominal,
                                    hargaFinal: modal.calc.hargaFinal,
                                    jumlah: modal.calc.jumlah,
                                    productid: modal.itemForm.productid,
                                    uomid: modal.itemForm.uomid,
                                };
                                if (editingIndex !== null) {
                                    setProductItems((prev) =>
                                        prev.map((item, i) => (i === editingIndex ? newItem : item))
                                    );
                                } else {
                                    setProductItems((prev) => [...prev, newItem]);
                                }
                                setIsProductModalOpen(false);
                                modal.resetModalState();
                                setEditingIndex(null);
                            }}
                        >
                            {editingIndex !== null ? "Simpan Perubahan" : "Tambah Item"}
                        </Button>
                    </>
                }
            >
                {/* ── Layout: 2-col table-like form ─────────────────────── */}
                <div className="divide-y divide-slate-100 -mx-5 -mt-4 px-1">
                    {/* Nama Barang */}
                    <div className="grid grid-cols-[160px_1fr] items-center gap-3 px-4 py-2.5">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Nama Barang</span>
                        <ProductSearchBar
                            value={modal.itemForm.namaBarang}
                            onChange={(val) => modal.setItemField("namaBarang", val)}
                            onSelect={(p) => {
                                modal.setItemField("namaBarang", p.productname);
                                modal.setItemField("productDescription", p.productname2 ?? "");
                                if (p.uom_id_prod) modal.setItemField("uomid", p.uom_id_prod);
                                if (p.produnit) modal.setItemField("uom", p.produnit);
                                modal.setItemField("qtyOuter", p.qty_outer ?? "0");
                                modal.setItemField("qtyInner", p.qty_inner ?? "0");
                                modal.setItemField("uomInnerName", p.uom_inner_outer_name ?? "");
                                modal.setSelectedProductCode(p.productcode);
                            }}
                            placeholder="Cari produk..."
                            minChars={2}
                            debounceMs={350}
                            maxResults={8}
                        />
                    </div>

                    {/* Product Description */}
                    <ModalFormInput
                        label="Product Description"
                        type="text"
                        value={modal.itemForm.productDescription}
                        onChange={(e) => modal.setItemField("productDescription", e.target.value)}
                        className="bg-slate-50"
                    />

                    {/* UOM */}
                    <div className="grid grid-cols-[160px_1fr] items-center gap-3 px-4 py-2.5">
                        <span className="text-xs font-semibold text-slate-500 uppercase">UOM</span>
                        <div className="flex items-center gap-2">
                            <FormSelect
                                value={modal.itemForm.uomid ?? ""}
                                onChange={(e) => {
                                    const selected = modal.units.find(
                                        (u) => u.unitid === Number(e.target.value)
                                    );
                                    if (selected) {
                                        modal.setItemField("uomid", selected.unitid);
                                        modal.setItemField("uom", selected.unit || selected.unitname);
                                    }
                                }}
                                disabled={modal.loadingUnits}
                                className="w-auto"
                            >
                                <option value="">
                                    {modal.loadingUnits ? "Memuat satuan..." : "-- Pilih UOM --"}
                                </option>
                                {modal.units.map((u) => (
                                    <option key={u.unitid} value={u.unitid}>
                                        {u.unit || u.unitname}
                                    </option>
                                ))}
                            </FormSelect>
                            <span className="text-xs text-slate-400">
                                {`${modal.itemForm.qtyOuter ? parseFloat(modal.itemForm.qtyOuter).toLocaleString("id-ID") : "0"} ${modal.itemForm.uom || "—"} @ ${modal.itemForm.qtyInner ? parseFloat(modal.itemForm.qtyInner).toLocaleString("id-ID") : "0"} ${modal.itemForm.uomInnerName || "PCS"}`}
                            </span>
                        </div>
                    </div>

                    {/* Kuantitas */}
                    <ModalFormInput
                        label="Kuantitas"
                        type="number"
                        value={modal.itemForm.kuantitas}
                        onChange={(e) => modal.setItemField("kuantitas", parseFloat(e.target.value) || 0)}
                        textRight
                        selectOnFocus
                    />

                    {/* Harga Dasar */}
                    <div className="grid grid-cols-[160px_1fr] items-center gap-3 px-4 py-2.5">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Harga Dasar</span>
                        <div className="flex items-center gap-2">
                            <ModalFormInput
                                type="number"
                                value={modal.itemForm.hargaDasar}
                                onChange={(e) => modal.setItemField("hargaDasar", parseFloat(e.target.value) || 0)}
                                textRight
                                selectOnFocus
                                className="flex-1"
                            />
                            <Button
                                variant="plain"
                                size="icon-sm"
                                icon="search"
                                className="border border-slate-200 text-slate-400 hover:text-primary hover:bg-primary/5"
                            />
                            <Button
                                variant="amber"
                                size="icon-sm"
                                icon="calculate"
                            />
                        </div>
                    </div>

                    {/* ── Cascade Discounts ────────────────────────── */}
                    {([1, 2, 3, 4] as const).map((n) => {
                        const pctKey = `diskon${n}Pct` as keyof ItemDetailForm;
                        const pct = modal.itemForm[pctKey] as number;
                        const setPct = (v: number) => modal.setItemField(pctKey, v);
                        const beforeArr = [modal.itemForm.hargaDasar, modal.calc.setelah1, modal.calc.setelah2, modal.calc.setelah3];
                        const setelahArr = [modal.calc.setelah1, modal.calc.setelah2, modal.calc.setelah3, modal.calc.setelah4];
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
                                    <PercentNominalInput
                                        pctValue={pct}
                                        onChangePct={setPct}
                                        nominalValue={fmt(diskonNominal)}
                                        nominalClassName="text-red-500"
                                    />
                                </div>
                                {/* After-discount readonly row */}
                                <ModalFormInput
                                    label={`Harga Setelah Potongan ke-${n}`}
                                    labelClassName="text-[10px] font-semibold text-slate-400 uppercase pl-2"
                                    wrapperClassName="py-1.5 bg-slate-50/60"
                                    readOnly
                                    value={fmt(after)}
                                    textRight
                                    className="!bg-slate-100 !text-slate-600 !border-slate-100 font-medium"
                                />
                            </div>
                        );
                    })}

                    {/* PPN */}
                    <div className="grid grid-cols-[160px_1fr] items-center gap-3 px-4 py-2.5">
                        <span className="text-xs font-semibold text-slate-500 uppercase">PPN</span>
                        <PercentNominalInput
                            pctValue={modal.itemForm.ppnPct}
                            onChangePct={(v) => modal.setItemField("ppnPct", v)}
                            nominalValue={modal.calc.ppnNominal.toLocaleString("id-ID", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                            nominalClassName="text-slate-500"
                        />
                    </div>

                    {/* Harga Final */}
                    <ModalFormInput
                        label="Harga Final"
                        labelClassName="text-xs font-bold text-slate-600"
                        wrapperClassName="bg-primary/5"
                        readOnly
                        value={modal.calc.hargaFinal.toLocaleString("id-ID", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                        textRight
                        className="!bg-primary/5 !text-primary !border-primary/20 font-bold"
                    />

                    {/* Jumlah */}
                    <ModalFormInput
                        label="Jumlah"
                        labelClassName="text-xs font-bold text-slate-600"
                        wrapperClassName="bg-primary/5"
                        readOnly
                        value={modal.calc.jumlah.toLocaleString("id-ID", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                        textRight
                        className="!bg-primary/10 !text-primary !border-primary/20 font-black"
                    />

                    {/* Additional Notes */}
                    <ModalFormInput
                        label="Additional Notes"
                        wrapperClassName="items-start"
                        labelClassName="pt-2"
                        type="text"
                        value={modal.itemForm.additionalNotes}
                        onChange={(e) => modal.setItemField("additionalNotes", e.target.value)}
                    />
                </div>
            </Modal>
        </div>
    );
}
