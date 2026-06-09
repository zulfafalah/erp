"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import ItemTable from "../../../components/ItemTable";
import FormField from "../../../components/FormField";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
import Modal from "../../../components/Modal";
import Button from "@/app/components/Button";
import ProductSearchBar, { ProductSearchResult } from "../../../components/ProductSearchBar";

import { ExtendedReturnItem } from "../types";
import { tabs, statusBadgeStyles, purchaseReturnColumns } from "../constants";
import { useReturnForm, useItemCalc } from "../hooks/useReturnForm";
import { TabKey } from "../types";

export default function PurchaseReturnDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = String(params?.id ?? "new");

    const [activeTab, setActiveTab]           = useState<TabKey>("header");
    const [productItems, setProductItems]     = useState<ExtendedReturnItem[]>([]);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingIndex, setEditingIndex]     = useState<number | null>(null);
    const [productSearch, setProductSearch]   = useState("");

    const form  = useReturnForm({ productItems, setProductItems, router, id });
    const isNew = form.isNew;
    const calc  = useItemCalc(form.itemForm);

    // Auto-switch to return-details tab when item errors arrive
    useEffect(() => {
        if (form.itemDetailErrors.length > 0 || form.itemsError) {
            setActiveTab("return-details");
        }
    }, [form.itemDetailErrors, form.itemsError]);

    const handleProductSelected = (p: ProductSearchResult) => {
        form.setItemField("namaBarang", p.productname);
        if (p.uom_id_prod) form.setItemField("uomid", p.uom_id_prod);
        if (p.produnit)    form.setItemField("uom", p.produnit);
        if (p.productid)   form.setItemField("productid", p.productid);
        setProductSearch(p.productname);
        setIsProductModalOpen(true);
    };

    const handleUpdateItem = (index: number, field: keyof ExtendedReturnItem, value: unknown) => {
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
        form.setItemField("namaBarang", item.name);
        form.setItemField("uom", item.uom);
        form.setItemField("kuantitas", item.qty);
        form.setItemField("hargaDasar", item.hargaDasar);
        if (item.productid) form.setItemField("productid", item.productid);
        if (item.uomid)     form.setItemField("uomid", item.uomid);
        if (item.expireddate) form.setItemField("tglKadaluarsa", item.expireddate);
        setEditingIndex(index);
        setIsProductModalOpen(true);
    };

    const fmtN = (v: number) =>
        v.toLocaleString("id-ID", { minimumFractionDigits: 4, maximumFractionDigits: 4 });

    const formatRupiah = (value: number) =>
        new Intl.NumberFormat("id-ID", { style: "decimal", minimumFractionDigits: 2 }).format(value);

    // Summary totals from API detail (edit) or computed from local items (new)
    const subTotal   = form.rcvDetail ? parseFloat(form.rcvDetail.subtotalrcv ?? "0") : productItems.reduce((a, i) => a + i.jumlah, 0);
    const discVal    = form.rcvDetail ? parseFloat(form.rcvDetail.discvalrcvh ?? "0") : 0;
    const ppnVal     = form.rcvDetail ? parseFloat(form.rcvDetail.ppnvalue    ?? "0") : 0;
    const grandTotal = form.rcvDetail ? parseFloat(form.rcvDetail.grandtotalrcv ?? "0") : subTotal - discVal + ppnVal;
    const tkonversi  = form.rcvDetail ? parseFloat(form.rcvDetail.tkonversibeli ?? "0") : grandTotal;
    const totalQtyRetur = form.rcvDetail
        ? parseFloat(form.rcvDetail.totalrcvq ?? "0")
        : productItems.reduce((a, i) => a + i.qty, 0);

    const currentStatus = form.rcvDetail?.statusrcv_display ?? "Draft";
    const currentRcvNo  = form.rcvDetail?.rcvno ?? (isNew ? "Baru" : id);

    // ── Loading skeleton ─────────────────────────────────────────────────────
    if (form.isLoadingDetail) {
        return (
            <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
                <Navbar />
                <main className="flex-1 flex overflow-hidden">
                    <Sidebar />
                    <section className="flex-1 flex flex-col items-center justify-center gap-4">
                        <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
                        <p className="text-sm text-slate-500 font-medium">Memuat data retur pembelian…</p>
                    </section>
                </main>
                <StatusBar />
            </div>
        );
    }

    // ── Detail load error ─────────────────────────────────────────────────────
    if (form.detailLoadError) {
        return (
            <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
                <Navbar />
                <main className="flex-1 flex overflow-hidden">
                    <Sidebar />
                    <section className="flex-1 flex flex-col items-center justify-center gap-4">
                        <span className="material-symbols-outlined text-5xl text-red-400">error</span>
                        <p className="text-sm font-semibold text-red-600">{form.detailLoadError}</p>
                        <button
                            onClick={() => router.push("/purchase/return")}
                            className="mt-2 px-4 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Kembali ke Daftar
                        </button>
                    </section>
                </main>
                <StatusBar />
            </div>
        );
    }

    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            <Navbar />

            <main className="flex-1 flex overflow-hidden">
                <Sidebar />

                <section className="flex-1 flex flex-col bg-background-light overflow-hidden">
                    {/* Action Header */}
                    <div className="px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/5 bg-white/50 backdrop-blur-sm shrink-0">
                        <div className="flex items-start md:items-center gap-3 md:gap-4 w-full md:w-auto">
                            <Button
                                variant="secondary-border"
                                size="icon-sm"
                                onClick={() => router.push("/purchase/return")}
                                className="mt-1 md:mt-0"
                                icon="arrow_back"
                            />
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        {isNew ? "Retur Pembelian Barang" : `BRB: ${currentRcvNo}`}
                                    </h1>
                                    <span
                                        className={`px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest border ${statusBadgeStyles[currentStatus] || statusBadgeStyles.Draft}`}
                                    >
                                        {currentStatus}
                                    </span>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    Buat dan kelola retur pembelian barang ke pemasok.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
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
                                Print BRB
                            </Button>
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

                        {/* ── Tab Content: Header ── */}
                        {activeTab === "header" && (
                            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                                {form.apiError && (
                                    <div className="mb-4 flex items-start gap-2.5 bg-red-50 border border-red-300 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
                                        <span className="material-symbols-outlined text-lg text-red-500 mt-0.5">error</span>
                                        <span>{form.apiError}</span>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                                    {/* Left: Form Cards */}
                                    <div className="lg:col-span-2 space-y-6">

                                        {/* Card Informasi Dasar */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">info</span>
                                                <h3 className="font-bold text-slate-800">Informasi Dasar</h3>
                                            </div>
                                            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">

                                                {/* No. ~ Status */}
                                                <FormField label="No. ~ Status">
                                                    <div className="flex gap-2">
                                                        <FormInput
                                                            defaultValue={isNew ? "Auto Generate" : currentRcvNo}
                                                            readOnly
                                                        />
                                                        <FormInput
                                                            defaultValue={currentStatus}
                                                            readOnly
                                                            className="w-28"
                                                        />
                                                    </div>
                                                </FormField>

                                                {/* Tanggal Retur */}
                                                <FormField label="Tanggal Retur">
                                                    <FormInput
                                                        type="date"
                                                        value={form.rcvdate}
                                                        onChange={(e) => form.setRcvdate(e.target.value)}
                                                    />
                                                </FormField>

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

                                                {/* Keluar dari Gudang */}
                                                <FormField label="Keluar dari Gudang" className="sm:col-span-2">
                                                    <FormSelect
                                                        disabled={form.loadingWarehouses}
                                                        value={form.rcvwhs === "" ? "" : String(form.rcvwhs)}
                                                        onChange={(e) => {
                                                            form.setRcvwhs(e.target.value ? Number(e.target.value) : "");
                                                            if (e.target.value) form.clearRcvwhsError();
                                                        }}
                                                        className={form.rcvwhsError ? "!border-red-400 !ring-1 !ring-red-400" : ""}
                                                    >
                                                        <option value="">
                                                            {form.loadingWarehouses ? "Memuat gudang..." : "-- Pilih Gudang --"}
                                                        </option>
                                                        {form.warehouses.map((w) => (
                                                            <option key={w.whsid} value={w.whsid}>
                                                                {w.whsname}
                                                            </option>
                                                        ))}
                                                    </FormSelect>
                                                    {form.rcvwhsError && (
                                                        <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-sm">error</span>
                                                            {form.rcvwhsError}
                                                        </p>
                                                    )}
                                                </FormField>

                                                {/* No. Invoice ~ No. SJ Supplier */}
                                                <FormField label="No. Invoice ~ No. SJ Supplier" className="sm:col-span-2">
                                                    <div className="flex gap-2">
                                                        <FormInput
                                                            placeholder="No. Invoice Supplier..."
                                                            value={form.invNoSupplier}
                                                            onChange={(e) => form.setInvNoSupplier(e.target.value)}
                                                        />
                                                        <FormInput
                                                            placeholder="No. SJ Supplier..."
                                                            value={form.sjNoSupplier}
                                                            onChange={(e) => form.setSjNoSupplier(e.target.value)}
                                                        />
                                                    </div>
                                                </FormField>

                                                {/* No. Faktur Pajak ~ Tgl Faktur */}
                                                <FormField label="No. Faktur Pajak ~ Tgl Faktur" className="sm:col-span-2">
                                                    <div className="flex gap-2">
                                                        <FormInput
                                                            placeholder="No. Faktur Pajak..."
                                                            value={form.fpajaknorcv}
                                                            onChange={(e) => form.setFpajaknorcv(e.target.value)}
                                                        />
                                                        <FormInput
                                                            type="date"
                                                            value={form.fpajaktglrcv}
                                                            onChange={(e) => form.setFpajaktglrcv(e.target.value)}
                                                        />
                                                    </div>
                                                </FormField>
                                            </div>
                                        </div>

                                        {/* Card Informasi Pembayaran */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">payments</span>
                                                <h3 className="font-bold text-slate-800">Informasi Pembayaran</h3>
                                            </div>
                                            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">

                                                {/* Mata Uang ~ Kurs Beli */}
                                                <FormField label="Mata Uang ~ Kurs Beli">
                                                    <div className="flex gap-2 items-center">
                                                        <FormSelect
                                                            value={form.currencyid}
                                                            onChange={(e) => form.setCurrencyid(e.target.value)}
                                                            disabled={form.loadingCurrencies}
                                                        >
                                                            {form.currencies.length === 0 && (
                                                                <option value={form.currencyid}>{form.currencyid}</option>
                                                            )}
                                                            {form.currencies.map((c) => (
                                                                <option key={c.currencyid} value={c.currencyid}>
                                                                    {c.currencyid} — {c.currencyname}
                                                                </option>
                                                            ))}
                                                        </FormSelect>
                                                        <FormInput
                                                            type="number"
                                                            value={form.kursbeli}
                                                            onChange={(e) => form.setKursbeli(e.target.value)}
                                                            className="w-28"
                                                        />
                                                    </div>
                                                </FormField>

                                                {/* Jenis Bayar ~ Tempo Bayar */}
                                                <FormField label="Jenis Bayar ~ Tempo Bayar">
                                                    <div className="flex gap-2 items-center">
                                                        <FormSelect
                                                            value={form.iscashrcv}
                                                            onChange={(e) => form.setIscashrcv(Number(e.target.value))}
                                                        >
                                                            <option value={0}>Kredit</option>
                                                            <option value={1}>Tunai</option>
                                                        </FormSelect>
                                                        <FormInput
                                                            type="number"
                                                            value={form.apod}
                                                            onChange={(e) => form.setApod(Number(e.target.value) || 0)}
                                                            className="w-16"
                                                        />
                                                        <span className="text-sm text-slate-500 whitespace-nowrap">Hari</span>
                                                    </div>
                                                </FormField>

                                                {/* Keterangan */}
                                                <FormField label="Keterangan" className="sm:col-span-2">
                                                    <FormInput
                                                        placeholder="Keterangan retur pembelian..."
                                                        value={form.rcvnote}
                                                        onChange={(e) => form.setRcvnote(e.target.value)}
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
                                            <div className="p-4 md:p-6 space-y-3">

                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500 w-28 shrink-0">Sub Total</span>
                                                    <FormInput
                                                        readOnly
                                                        value={formatRupiah(subTotal)}
                                                        className="!flex-1 text-right !py-1.5 !px-2 font-semibold text-slate-700"
                                                    />
                                                </div>

                                                <div className="flex justify-between items-center text-sm gap-2">
                                                    <span className="text-slate-500 w-28 shrink-0">Disc</span>
                                                    <FormInput
                                                        readOnly
                                                        value={formatRupiah(discVal)}
                                                        className="!flex-1 text-right !py-1.5 !px-2 font-semibold text-red-500"
                                                    />
                                                </div>

                                                <div className="flex justify-between items-center text-sm gap-2">
                                                    <span className="text-slate-500 w-28 shrink-0">PPN</span>
                                                    <FormInput
                                                        readOnly
                                                        value={formatRupiah(ppnVal)}
                                                        className="!flex-1 text-right !py-1.5 !px-2 font-semibold text-slate-700"
                                                    />
                                                </div>

                                                <div className="pt-3 border-t border-slate-100 space-y-1">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        Grand Total ~ Total Konversi
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <FormInput
                                                            readOnly
                                                            value={formatRupiah(grandTotal)}
                                                            className="!flex-1 text-right !bg-primary/5 !border-primary/20 !py-1.5 !px-2 font-black !text-primary !opacity-100"
                                                        />
                                                        <FormInput
                                                            readOnly
                                                            value={formatRupiah(tkonversi)}
                                                            className="!flex-1 text-right !py-1.5 !px-2 font-semibold text-slate-700"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        Total Qty Diretur
                                                    </p>
                                                    <FormInput
                                                        readOnly
                                                        value={totalQtyRetur.toLocaleString("id-ID")}
                                                        className="!w-full text-right !py-1.5 !px-2 font-semibold text-slate-700"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Tab Content: Return Details ── */}
                        {activeTab === "return-details" && (
                            <div className="flex-1 flex flex-col overflow-hidden gap-3">
                                {/* Items Error Banner */}
                                {(form.itemsError || form.itemDetailErrors.length > 0) && (
                                    <div className="shrink-0 bg-red-50 border border-red-200 rounded-xl overflow-hidden">
                                        <div className="flex items-center gap-2 bg-red-100 border-b border-red-200 px-4 py-2.5">
                                            <span className="material-symbols-outlined text-base text-red-600">error</span>
                                            <p className="text-xs font-bold text-red-700 uppercase tracking-wider">
                                                {form.itemsError
                                                    ? "Periksa data barang"
                                                    : `${form.itemDetailErrors.length} kesalahan ditemukan — periksa data barang`}
                                            </p>
                                        </div>
                                        <ul className="px-4 py-3 space-y-1.5">
                                            {form.itemsError && (
                                                <li className="flex items-center gap-2 text-sm text-red-700 font-medium">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                                    {form.itemsError}
                                                </li>
                                            )}
                                            {form.itemDetailErrors.map((msg, i) => (
                                                <li key={i} className="flex items-start gap-2 text-xs text-red-600">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" />
                                                    {msg}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Product Search Bar */}
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
                                    <button
                                        onClick={() => {
                                            form.resetItemForm();
                                            setEditingIndex(null);
                                            setIsProductModalOpen(true);
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex-shrink-0"
                                    >
                                        <span className="material-symbols-outlined text-sm">add_circle</span>
                                        Tambah Item
                                    </button>
                                </div>

                                {/* Item Table */}
                                <ItemTable
                                    items={productItems}
                                    columns={purchaseReturnColumns}
                                    onUpdateItem={handleUpdateItem}
                                    onRemoveItem={handleRemoveItem}
                                    onEditItem={handleEditItem}
                                    emptyMessage="Belum ada item. Cari & pilih produk di atas."
                                />
                            </div>
                        )}

                        {/* ── Tab Content: Attachments ── */}
                        {activeTab === "attachments" && (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <span className="material-symbols-outlined text-5xl text-slate-300">attachment</span>
                                    <p className="mt-2 text-sm text-slate-500">Belum ada lampiran</p>
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

            {/* ── Item Detail Modal ─────────────────────────────────────────── */}
            <Modal
                isOpen={isProductModalOpen}
                onClose={() => {
                    setIsProductModalOpen(false);
                    form.resetItemForm();
                    setEditingIndex(null);
                    setProductSearch("");
                }}
                title={editingIndex !== null ? "Edit Detail Item Retur" : "Input Detail Retur Pembelian Barang"}
                icon="assignment_return"
                size="xl"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            icon="refresh"
                            onClick={() => {
                                setIsProductModalOpen(false);
                                form.resetItemForm();
                                setEditingIndex(null);
                                setProductSearch("");
                            }}
                        >
                            Reset
                        </Button>
                        <Button
                            variant="primary"
                            icon={editingIndex !== null ? "save" : "add_circle"}
                            onClick={() => {
                                if (!form.itemForm.namaBarang) return;
                                const newItem: ExtendedReturnItem = {
                                    name:       form.itemForm.namaBarang,
                                    barcode:    "",
                                    uom:        form.itemForm.uom,
                                    qty:        form.itemForm.kuantitas,
                                    hargaDasar: form.itemForm.hargaDasar,
                                    discount:   form.itemForm.hargaDasar - calc.setelah4,
                                    ppn:        calc.ppnNominal,
                                    hargaFinal: calc.hargaFinal,
                                    jumlah:     calc.jumlah,
                                    productid:  form.itemForm.productid,
                                    uomid:      form.itemForm.uomid,
                                    expireddate: form.itemForm.tglKadaluarsa || undefined,
                                };
                                if (editingIndex !== null) {
                                    setProductItems((prev) =>
                                        prev.map((item, i) => (i === editingIndex ? newItem : item))
                                    );
                                } else {
                                    setProductItems((prev) => [...prev, newItem]);
                                }
                                setIsProductModalOpen(false);
                                form.resetItemForm();
                                setEditingIndex(null);
                                setProductSearch("");
                            }}
                        >
                            {editingIndex !== null ? "Simpan Perubahan" : "Tambah Item"}
                        </Button>
                    </>
                }
            >
                <div className="divide-y divide-slate-100 -mx-5 -mt-4 px-1">

                    {/* Nama Barang */}
                    <div className="grid grid-cols-[180px_1fr] items-center gap-3 px-4 py-2.5">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Nama Barang</span>
                        <div className="relative flex gap-2">
                            <input
                                type="text"
                                value={form.itemForm.namaBarang}
                                onChange={(e) => form.setItemField("namaBarang", e.target.value)}
                                placeholder="Ketik Nama Barang/Kode/Barcode/SKU"
                                className="flex-1 border border-primary/40 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 bg-white"
                            />
                        </div>
                    </div>

                    {/* Keterangan */}
                    <div className="grid grid-cols-[180px_1fr] items-center gap-3 px-4 py-2.5">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Keterangan</span>
                        <input
                            type="text"
                            value={form.itemForm.keterangan}
                            onChange={(e) => form.setItemField("keterangan", e.target.value)}
                            className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-primary bg-slate-50"
                        />
                    </div>

                    {/* UOM */}
                    <div className="grid grid-cols-[180px_1fr] items-center gap-3 px-4 py-2.5">
                        <span className="text-xs font-semibold text-slate-500 uppercase">UOM</span>
                        <input
                            type="text"
                            value={form.itemForm.uom}
                            onChange={(e) => form.setItemField("uom", e.target.value)}
                            placeholder="Satuan..."
                            className="border border-slate-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-primary bg-white"
                        />
                    </div>

                    {/* Kuantitas */}
                    <div className="grid grid-cols-[180px_1fr] items-center gap-3 px-4 py-2.5">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Kuantitas</span>
                        <input
                            type="number"
                            value={form.itemForm.kuantitas}
                            onChange={(e) => form.setItemField("kuantitas", parseFloat(e.target.value) || 0)}
                            className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm text-right focus:outline-none focus:border-primary bg-white"
                        />
                    </div>

                    {/* Harga Dasar */}
                    <div className="grid grid-cols-[180px_1fr] items-center gap-3 px-4 py-2.5">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Harga Dasar</span>
                        <input
                            type="number"
                            value={form.itemForm.hargaDasar}
                            onChange={(e) => form.setItemField("hargaDasar", parseFloat(e.target.value) || 0)}
                            className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm text-right focus:outline-none focus:border-primary bg-white"
                        />
                    </div>

                    {/* Cascade Discounts */}
                    {([1, 2, 3, 4] as const).map((n) => {
                        const pctKey = `diskon${n}Pct` as keyof typeof form.itemForm;
                        const pct    = form.itemForm[pctKey] as number;
                        const setPct = (v: number) => form.setItemField(pctKey, v);
                        const beforeArr  = [form.itemForm.hargaDasar, calc.setelah1, calc.setelah2, calc.setelah3];
                        const setelahArr = [calc.setelah1, calc.setelah2, calc.setelah3, calc.setelah4];
                        const before = beforeArr[n - 1];
                        const after  = setelahArr[n - 1];
                        const diskonNominal = before - after;

                        return (
                            <div key={n}>
                                <div className="grid grid-cols-[180px_1fr] items-center gap-3 px-4 py-2">
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
                                            value={fmtN(diskonNominal)}
                                            className="flex-1 border border-slate-100 rounded px-3 py-1.5 text-sm text-right bg-slate-50 text-red-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[180px_1fr] items-center gap-3 px-4 py-1.5 bg-slate-50/60">
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase pl-2">
                                        Harga Setelah Potongan ke-{n}
                                    </span>
                                    <input
                                        readOnly
                                        value={fmtN(after)}
                                        className="w-full border border-slate-100 rounded px-3 py-1.5 text-sm text-right bg-slate-100 text-slate-600 cursor-not-allowed font-medium"
                                    />
                                </div>
                            </div>
                        );
                    })}

                    {/* PPN */}
                    <div className="grid grid-cols-[180px_1fr] items-center gap-3 px-4 py-2.5">
                        <span className="text-xs font-semibold text-slate-500 uppercase">PPN</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={form.itemForm.ppnPct}
                                onChange={(e) => form.setItemField("ppnPct", parseFloat(e.target.value) || 0)}
                                className="w-16 border border-slate-200 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:border-primary bg-white"
                            />
                            <input
                                readOnly
                                value={calc.ppnNominal.toLocaleString("id-ID", {
                                    minimumFractionDigits: 4,
                                    maximumFractionDigits: 4,
                                })}
                                className="flex-1 border border-slate-100 rounded px-3 py-1.5 text-sm text-right bg-slate-50 text-slate-500 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Harga Final */}
                    <div className="grid grid-cols-[180px_1fr] items-center gap-3 px-4 py-2.5 bg-primary/5">
                        <span className="text-xs font-bold text-slate-600 uppercase">Harga Final</span>
                        <input
                            readOnly
                            value={calc.hargaFinal.toLocaleString("id-ID", {
                                minimumFractionDigits: 4,
                                maximumFractionDigits: 4,
                            })}
                            className="w-full border border-primary/20 rounded px-3 py-1.5 text-sm text-right bg-primary/5 text-primary font-bold cursor-not-allowed"
                        />
                    </div>

                    {/* Jumlah */}
                    <div className="grid grid-cols-[180px_1fr] items-center gap-3 px-4 py-2.5 bg-primary/5">
                        <span className="text-xs font-bold text-slate-600 uppercase">Jumlah</span>
                        <input
                            readOnly
                            value={calc.jumlah.toLocaleString("id-ID", {
                                minimumFractionDigits: 4,
                                maximumFractionDigits: 4,
                            })}
                            className="w-full border border-primary/20 rounded px-3 py-1.5 text-sm text-right bg-primary/10 text-primary font-black cursor-not-allowed"
                        />
                    </div>

                    {/* Tgl. Kadaluarsa */}
                    <div className="grid grid-cols-[180px_1fr] items-center gap-3 px-4 py-2.5">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Tgl. Kadaluarsa</span>
                        <input
                            type="date"
                            value={form.itemForm.tglKadaluarsa}
                            onChange={(e) => form.setItemField("tglKadaluarsa", e.target.value)}
                            className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-primary bg-white"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}
