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

import { ExtendedInvoiceItem } from "../types";
import { tabs, statusBadgeStyles, purchaseInvoiceColumns } from "../constants";
import { useInvoiceForm, useItemCalc } from "../hooks/useInvoiceForm";
import { TabKey } from "../types";

export default function PurchaseInvoiceDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = String(params?.id ?? "new");

    const [activeTab,         setActiveTab]         = useState<TabKey>("header");
    const [productItems,      setProductItems]      = useState<ExtendedInvoiceItem[]>([]);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingIndex,      setEditingIndex]      = useState<number | null>(null);
    const [productSearch,     setProductSearch]     = useState("");

    const form   = useInvoiceForm({ productItems, setProductItems, router, id });
    const isNew  = form.isNew;
    const calc   = useItemCalc(form.itemForm);

    useEffect(() => {
        if (form.itemDetailErrors.length > 0 || form.itemsError) {
            setActiveTab("invoice-details");
        }
    }, [form.itemDetailErrors, form.itemsError]);

    const handleProductSelected = (p: ProductSearchResult) => {
        form.setItemField("namaBarang", p.productname);
        if (p.uom_id_prod) form.setItemField("uomid", p.uom_id_prod);
        if (p.produnit)    form.setItemField("uom",   p.produnit);
        setProductSearch(p.productname);
        setIsProductModalOpen(true);
    };

    const handleUpdateItem = (index: number, field: keyof ExtendedInvoiceItem, value: unknown) => {
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
        form.setItemField("uom",        item.uom);
        form.setItemField("kuantitas",  item.qty);
        form.setItemField("hargaDasar", item.hargaDasar);
        form.setItemField("productid",  item.productid);
        form.setItemField("uomid",      item.uomid);
        form.setItemField("poid_d_idf", item.poid_d_idf);
        form.setItemField("rinvoiceid", item.rinvoiceid);
        setEditingIndex(index);
        setIsProductModalOpen(true);
    };

    const fmtN = (v: number) =>
        v.toLocaleString("id-ID", { minimumFractionDigits: 4, maximumFractionDigits: 4 });

    const formatRupiah = (value: number) =>
        new Intl.NumberFormat("id-ID", { style: "decimal", minimumFractionDigits: 2 }).format(value);

    // Summary totals — use API values when editing, computed when creating
    const subTotal   = form.pivDetail ? parseFloat(form.pivDetail.subtotalrcv    ?? "0") : productItems.reduce((a, i) => a + i.jumlah, 0);
    const discVal    = form.pivDetail ? parseFloat(form.pivDetail.discvalrcvh    ?? "0") : 0;
    const ppnVal     = form.pivDetail ? parseFloat(form.pivDetail.ppnvalue       ?? "0") : 0;
    const grandTotal = form.pivDetail ? parseFloat(form.pivDetail.grandtotalrcv  ?? "0") : subTotal - discVal + ppnVal;
    const tkonversi  = form.pivDetail ? parseFloat(form.pivDetail.tkonversibeli  ?? "0") : grandTotal;
    const totalQty   = form.pivDetail ? parseFloat(form.pivDetail.totalrcvq      ?? "0") : productItems.reduce((a, i) => a + i.qty, 0);

    const currentStatus = form.pivDetail?.statusrcv_display ?? "Draft";
    const currentRcvNo  = form.pivDetail?.rcvno ?? (isNew ? "Baru" : id);

    // ── Loading skeleton ─────────────────────────────────────────────────────
    if (form.isLoadingDetail) {
        return (
            <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
                <Navbar />
                <main className="flex-1 flex overflow-hidden">
                    <Sidebar />
                    <section className="flex-1 flex flex-col items-center justify-center gap-4">
                        <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
                        <p className="text-sm text-slate-500 font-medium">Memuat data nota pembelian…</p>
                    </section>
                </main>
                <StatusBar />
            </div>
        );
    }

    // ── Detail load error ────────────────────────────────────────────────────
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
                            onClick={() => router.push("/purchase/invoice")}
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
                                onClick={() => router.push("/purchase/invoice")}
                                className="mt-1 md:mt-0"
                                icon="arrow_back"
                            />
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        {isNew ? "Nota Pembelian Baru" : `PIV: ${currentRcvNo}`}
                                    </h1>
                                    <span
                                        className={`px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest border ${statusBadgeStyles[currentStatus] || statusBadgeStyles.Draft}`}
                                    >
                                        {currentStatus}
                                    </span>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    Buat dan kelola nota pembelian barang (purchase invoice) dari pemasok.
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
                                Print PIV
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

                        {/* ── Tab: Header ──────────────────────────────────────────────────────── */}
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

                                                {/* Tanggal Invoice */}
                                                <FormField label="Tanggal Invoice">
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

                                                {/* No. PO */}
                                                <FormField label="No. PO">
                                                    <FormSelect
                                                        disabled={form.loadingPoList}
                                                        value={form.poidh === "" ? "" : String(form.poidh)}
                                                        onChange={(e) => {
                                                            const val = e.target.value ? Number(e.target.value) : "";
                                                            form.handlePoSelect(val);
                                                            if (e.target.value) form.clearPoidhError();
                                                        }}
                                                        className={form.poidhError ? "!border-red-400 !ring-1 !ring-red-400" : ""}
                                                    >
                                                        <option value="">
                                                            {form.loadingPoList
                                                                ? "Memuat PO..."
                                                                : !form.supplierIdForm
                                                                    ? "(Pilih supplier dahulu)"
                                                                    : "-- Pilih No. PO --"}
                                                        </option>
                                                        {form.poList.map((p) => (
                                                            <option key={p.poid} value={p.poid}>
                                                                {p.pono}
                                                            </option>
                                                        ))}
                                                        {!isNew && form.poidh && !form.poList.find((p) => p.poid === form.poidh) && (
                                                            <option value={String(form.poidh)}>
                                                                PO #{form.poidh}
                                                            </option>
                                                        )}
                                                    </FormSelect>
                                                    {form.poidhError && (
                                                        <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-sm">error</span>
                                                            {form.poidhError}
                                                        </p>
                                                    )}
                                                </FormField>

                                                {/* No. BPB (Referensi Penerimaan Barang) */}
                                                <FormField label="No. BPB Referensi">
                                                    <FormSelect
                                                        disabled={form.loadingBpbList || !form.poidh}
                                                        value={form.bpbIdh === "" ? "" : String(form.bpbIdh)}
                                                        onChange={(e) => {
                                                            const val = e.target.value ? Number(e.target.value) : "";
                                                            form.handleBpbSelect(val);
                                                        }}
                                                    >
                                                        <option value="">
                                                            {form.loadingBpbList
                                                                ? "Memuat BPB..."
                                                                : !form.poidh
                                                                    ? "(Pilih PO dahulu)"
                                                                    : "-- Pilih No. BPB --"}
                                                        </option>
                                                        {form.bpbList.map((b) => (
                                                            <option key={b.rcvid} value={b.rcvid}>
                                                                {b.rcvno}
                                                            </option>
                                                        ))}
                                                        {!isNew && form.bpbIdh && !form.bpbList.find((b) => b.rcvid === form.bpbIdh) && (
                                                            <option value={String(form.bpbIdh)}>
                                                                BPB #{form.bpbIdh}
                                                            </option>
                                                        )}
                                                    </FormSelect>
                                                </FormField>

                                                {/* Masuk Gudang */}
                                                <FormField label="Masuk Gudang" className="sm:col-span-2">
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

                                                {/* Faktur Pajak No. ~ Tgl Faktur */}
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

                                        {/* Card Pembayaran */}
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
                                                        placeholder="Keterangan nota pembelian..."
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
                                                            className="!flex-1 text-right !py-1.5 !px-2 font-black text-primary bg-primary/5 border-primary/20"
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
                                                        Total Qty
                                                    </p>
                                                    <FormInput
                                                        readOnly
                                                        value={totalQty.toLocaleString("id-ID", { minimumFractionDigits: 2 })}
                                                        className="w-full text-right !py-1.5 !px-2 font-semibold text-slate-700"
                                                    />
                                                </div>
                                            </div>

                                            <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={form.handleSave}
                                                    disabled={form.isSaving}
                                                    className="col-span-2 py-3 bg-primary text-white rounded font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-60"
                                                >
                                                    {form.isSaving ? (
                                                        <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                                    ) : (
                                                        <span className="material-symbols-outlined">save</span>
                                                    )}
                                                    {form.isSaving ? "Menyimpan..." : "SIMPAN PIV"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Tab: Invoice Details ──────────────────────────────────────────── */}
                        {activeTab === "invoice-details" && (
                            <div className="flex-1 flex flex-col overflow-hidden gap-3">

                                {/* Item errors */}
                                {(form.itemsError || form.itemDetailErrors.length > 0) && (
                                    <div className="flex flex-col gap-1 bg-red-50 border border-red-300 rounded-xl px-4 py-3 text-sm text-red-700">
                                        {form.itemsError && (
                                            <p className="font-medium flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">error</span>
                                                {form.itemsError}
                                            </p>
                                        )}
                                        {form.itemDetailErrors.map((msg, i) => (
                                            <p key={i} className="text-xs">• {msg}</p>
                                        ))}
                                    </div>
                                )}

                                {/* Product Search + Add Button */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 shrink-0 flex items-center gap-3">
                                    <div className="flex-1">
                                        <ProductSearchBar
                                            value={productSearch}
                                            onChange={setProductSearch}
                                            onSelect={handleProductSelected}
                                            placeholder="Cari/Pilih Barang & Jasa..."
                                        />
                                    </div>
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
                                    columns={purchaseInvoiceColumns}
                                    onUpdateItem={handleUpdateItem}
                                    onRemoveItem={handleRemoveItem}
                                    onEditItem={handleEditItem}
                                    emptyMessage="Belum ada item. Pilih BPB di Header Info atau tambah produk secara manual."
                                />
                            </div>
                        )}

                        {/* ── Tab: Attachments ─────────────────────────────────────────────── */}
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

            {/* ── Item Detail Modal ──────────────────────────────────────────────────── */}
            <Modal
                isOpen={isProductModalOpen}
                onClose={() => {
                    setIsProductModalOpen(false);
                    form.resetItemForm();
                    setEditingIndex(null);
                }}
                title={editingIndex !== null ? "Edit Item Invoice" : "Tambah Item Invoice"}
                icon="receipt"
                size="xl"
                footer={
                    <>
                        <button
                            onClick={() => {
                                form.resetItemForm();
                            }}
                            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">refresh</span>
                            Reset
                        </button>
                        <button
                            onClick={() => {
                                if (!form.itemForm.namaBarang) return;
                                const newItem: ExtendedInvoiceItem = {
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
                                    poid_d_idf: form.itemForm.poid_d_idf,
                                    rinvoiceid: form.itemForm.rinvoiceid ?? (typeof form.bpbIdh === "number" ? form.bpbIdh : undefined),
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
                <div className="divide-y divide-slate-100 -mx-5 -mt-4 px-1">

                    {/* Nama Barang */}
                    <div className="grid grid-cols-[180px_1fr] items-center gap-3 px-4 py-2.5">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Nama Barang</span>
                        <input
                            type="text"
                            value={form.itemForm.namaBarang}
                            onChange={(e) => form.setItemField("namaBarang", e.target.value)}
                            placeholder="Ketik Nama Barang/Kode/Barcode/SKU"
                            className="flex-1 border border-primary/40 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 bg-white"
                        />
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
                        const pctKey  = `diskon${n}Pct` as keyof typeof form.itemForm;
                        const pct     = form.itemForm[pctKey] as number;
                        const setPct  = (v: number) => form.setItemField(pctKey, v);
                        const beforeArr = [form.itemForm.hargaDasar, calc.setelah1, calc.setelah2, calc.setelah3];
                        const afterArr  = [calc.setelah1, calc.setelah2, calc.setelah3, calc.setelah4];
                        const before    = beforeArr[n - 1];
                        const after     = afterArr[n - 1];
                        const discNominal = before - after;

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
                                            value={fmtN(discNominal)}
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
                        <span className="text-xs font-semibold text-slate-500 uppercase">PPN %</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={form.itemForm.ppnPct}
                                onChange={(e) => form.setItemField("ppnPct", parseFloat(e.target.value) || 0)}
                                className="w-16 border border-slate-200 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:border-primary bg-white"
                            />
                            <input
                                readOnly
                                value={fmtN(calc.ppnNominal)}
                                className="flex-1 border border-slate-100 rounded px-3 py-1.5 text-sm text-right bg-slate-50 text-slate-500 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Harga Final */}
                    <div className="grid grid-cols-[180px_1fr] items-center gap-3 px-4 py-2.5 bg-primary/5">
                        <span className="text-xs font-bold text-slate-600 uppercase">Harga Final</span>
                        <input
                            readOnly
                            value={fmtN(calc.hargaFinal)}
                            className="w-full border border-primary/20 rounded px-3 py-1.5 text-sm text-right bg-primary/5 text-primary font-bold cursor-not-allowed"
                        />
                    </div>

                    {/* Jumlah */}
                    <div className="grid grid-cols-[180px_1fr] items-center gap-3 px-4 py-2.5 bg-primary/5">
                        <span className="text-xs font-bold text-slate-600 uppercase">Jumlah</span>
                        <input
                            readOnly
                            value={fmtN(calc.jumlah)}
                            className="w-full border border-primary/20 rounded px-3 py-1.5 text-sm text-right bg-primary/10 text-primary font-black cursor-not-allowed"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}
