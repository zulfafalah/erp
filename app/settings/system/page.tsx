"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import FormField from "../../components/FormField";
import FormInput from "../../components/FormInput";
import FormSelect from "../../components/FormSelect";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = "umum" | "master" | "pembelian" | "penjualan" | "persediaan" | "keuangan" | "akunting" | "lain-lain";

const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "umum",       label: "Umum",       icon: "settings"              },
    { key: "master",     label: "Master",     icon: "storage"               },
    { key: "pembelian",  label: "Pembelian",  icon: "shopping_cart"         },
    { key: "penjualan",  label: "Penjualan",  icon: "storefront"            },
    { key: "persediaan", label: "Persediaan", icon: "inventory_2"           },
    { key: "keuangan",   label: "Keuangan",   icon: "account_balance_wallet"},
    { key: "akunting",   label: "Akunting",   icon: "receipt_long"          },
    { key: "lain-lain",  label: "Lain-lain",  icon: "more_horiz"            },
];

// ─── Shared ───────────────────────────────────────────────────────────────────

const COA_OPTIONS = [
    "110.01.01 - KAS KECIL",
    "110.02.01 - KAS BESAR",
    "120.01.01 - BCA 194-398-7878",
    "130.01.01 - PIUTANG DAGANG CUSTOMER - IDR",
    "131.04.01 - DEPOSIT PEMBELIAN BARANG",
    "140.01.01 - PERSEDIAAN BARANG DAGANGAN",
    "180.01.01 - PAJAK PPN MASUKAN",
    "210.01.01 - HUTANG DAGANG PEMB./LOKAL",
    "210.01.02 - HUTANG DAGANG LOKAL BELUM DITAGIH",
    "210.03.01 - DEPOSIT PENJUALAN BARANG",
    "240.00.00 - PAJAK PPN KELUARAN",
    "320.00.00 - R/L DITAHAN TAHUN LALU",
    "330.00.00 - R/L TAHUN BERJALAN",
    "400.01.02 - RETUR PENJUALAN LOKAL",
    "400.01.03 - POTONGAN PENJUALAN",
    "400.02.01 - PENJUALAN BARANG LOKAL",
    "400.02.02 - PENJUALAN BARANG EXPORT",
    "410.02.02 - RETUR PEMBELIAN",
    "420.01.01 - HPP",
    "500.00.25 - BIAYA SELISIH BAYAR PEMBELIAN & PENJUALAN",
    "500.10.02 - BIAYA SELISIH KURS",
    "500.10.03 - BIAYA SELISIH KURS",
    "500.10.17 - BIAYA BARANG RUSAK /IJEK",
    "500.10.20 - BIAYA LAIN - LAIN",
    "550.00.17 - BIAYA PROMOSI & SAMPLE",
    "600.10.00 - POTONGAN PEMBELIAN",
    "600.10.08 - POTONGAN PEMBELIAN",
    "600.20.01 - R/L TEREALISIR",
    "600.20.02 - BIAYA SELISIH KURS",
    "600.10.01 - PENDAPATAN DARI USAHA LAINNYA",
];

function CoaSelect({ defaultValue }: { defaultValue: string }) {
    return (
        <FormSelect defaultValue={defaultValue}>
            {COA_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
        </FormSelect>
    );
}

function SaveResetBar({ onSave, saved }: { onSave: () => void; saved: boolean }) {
    return (
        <>
            {saved && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <span className="material-symbols-outlined text-green-600 text-base">check_circle</span>
                    <p className="text-sm text-green-700 font-medium">Pengaturan berhasil disimpan.</p>
                </div>
            )}
            <div className="flex items-center gap-3">
                <button
                    onClick={onSave}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
                >
                    <span className="material-symbols-outlined text-base">save</span>
                    Simpan
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-all">
                    <span className="material-symbols-outlined text-base">refresh</span>
                    Reset
                </button>
            </div>
        </>
    );
}

// ─── Tab: Umum ────────────────────────────────────────────────────────────────

function TabUmum() {
    const [saved, setSaved] = useState(false);
    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

    return (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-6 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">tune</span>
                    <h3 className="font-bold text-slate-800">Pengaturan Umum</h3>
                </div>
                <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <FormField label="Aktifkan Waktu Penggunaan Aplikasi">
                        <FormSelect defaultValue="NO">
                            <option value="NO">NO</option>
                            <option value="YES">YES</option>
                        </FormSelect>
                    </FormField>
                    <FormField label="Kode Aplikasi">
                        <FormInput defaultValue="Date Trial" />
                    </FormField>
                    <FormField label="Waktu Mulai Larangan Penggunaan Aplikasi">
                        <div className="flex gap-2 items-center">
                            <FormInput defaultValue="19" type="number" />
                            <span className="text-slate-400 text-sm">:</span>
                            <FormInput defaultValue="00" type="number" />
                        </div>
                    </FormField>
                    <FormField label="PPN Default Value">
                        <FormInput defaultValue="11" type="number" />
                    </FormField>
                    <FormField label="URL for Approval" className="sm:col-span-2">
                        <FormInput defaultValue="https://verified.esmart.apombs.net/a.php" />
                    </FormField>
                    <FormField label="Database Code">
                        <div className="flex gap-2 items-center">
                            <FormInput defaultValue="chip_t_U0TAV1DY7DF1" />
                            <span className="text-xs text-red-400 whitespace-nowrap font-medium">*Prohibited to make changes</span>
                        </div>
                    </FormField>
                    <FormField label="EMAIL Sender Alias">
                        <FormInput defaultValue="ADMIN" />
                    </FormField>
                </div>
            </div>
            <SaveResetBar onSave={handleSave} saved={saved} />
        </div>
    );
}

// ─── Tab: Master ──────────────────────────────────────────────────────────────

function TabMaster() {
    const [saved, setSaved] = useState(false);
    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

    return (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-6 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">storage</span>
                    <h3 className="font-bold text-slate-800">Pengaturan Data Master</h3>
                </div>
                <div className="p-4 md:p-6 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider sm:w-64 shrink-0">
                            Max Length Product Name
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="w-28"><FormInput defaultValue="50" type="number" /></div>
                            <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 shadow-sm shadow-primary/20 transition-all">
                                <span className="material-symbols-outlined !text-sm">check</span>Submit
                            </button>
                        </div>
                    </div>
                    <div className="border-t border-slate-100 pt-5 space-y-4">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Urutan Kode (Reset)</p>
                        {["Urutan Kode Produk", "Urutan Kode Pemasok", "Urutan Kode Pelanggan"].map((lbl) => (
                            <div key={lbl} className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider sm:w-64 shrink-0">{lbl}</label>
                                <button className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200 transition-all border border-slate-200 w-fit">
                                    <span className="material-symbols-outlined !text-sm">refresh</span>Submit
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <SaveResetBar onSave={handleSave} saved={saved} />
        </div>
    );
}

// ─── Tab: Pembelian ───────────────────────────────────────────────────────────

function TabPembelian() {
    const [saved, setSaved] = useState(false);
    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

    return (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-6 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">shopping_cart</span>
                    <h3 className="font-bold text-slate-800">Pengaturan Data Pembelian</h3>
                </div>
                <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <FormField label="Purchase Approval Email" className="sm:col-span-2">
                        <FormInput defaultValue="tomywibowo1104@gmail.com" type="email" />
                    </FormField>
                    <FormField label="Auto Insert Purchase Invoice From BPB">
                        <div className="flex gap-2 items-center">
                            <FormSelect defaultValue="NO">
                                <option value="NO">NO</option>
                                <option value="YES">YES</option>
                            </FormSelect>
                            <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 shadow-sm shadow-primary/20 transition-all shrink-0">
                                <span className="material-symbols-outlined !text-sm">check</span>Submit
                            </button>
                        </div>
                    </FormField>
                    <FormField label="Auto Update BPB Pricing From PIV">
                        <FormSelect defaultValue="YES">
                            <option value="NO">NO</option>
                            <option value="YES">YES</option>
                        </FormSelect>
                    </FormField>
                    <FormField label="Source PIV Pricing">
                        <FormSelect defaultValue="POB">
                            <option value="POB">POB</option>
                            <option value="PIV">PIV</option>
                        </FormSelect>
                    </FormField>
                    <FormField label="In PO Detail Limit Product List w/ Supplier">
                        <FormSelect defaultValue="YES">
                            <option value="NO">NO</option>
                            <option value="YES">YES</option>
                        </FormSelect>
                    </FormField>
                    <FormField label="PCB → Staff">
                        <FormInput defaultValue="PEMBELIAN" />
                    </FormField>
                    <FormField label="PCB → Manager">
                        <FormInput defaultValue="MANAGER" />
                    </FormField>
                </div>
            </div>
            <SaveResetBar onSave={handleSave} saved={saved} />
        </div>
    );
}

// ─── Tab: Penjualan ───────────────────────────────────────────────────────────

function TabPenjualan() {
    const [saved, setSaved] = useState(false);
    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

    const yesNoField = (label: string, defaultVal: "YES" | "NO", span2 = false) => (
        <FormField label={label} className={span2 ? "sm:col-span-2" : ""}>
            <FormSelect defaultValue={defaultVal}>
                <option value="NO">NO</option>
                <option value="YES">YES</option>
            </FormSelect>
        </FormField>
    );

    return (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-6 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">storefront</span>
                    <h3 className="font-bold text-slate-800">Pengaturan Penjualan</h3>
                </div>
                <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {yesNoField("Allow Over Credit Limit on SO?", "YES")}
                    {yesNoField("Allow Over TOP Limit on SO?", "YES")}
                    {yesNoField("Allow Over Credit Limit on Invoice?", "YES")}
                    {yesNoField("Allow Over TOP Limit on Invoice?", "YES")}
                    {yesNoField("Allow Minus Stock by SO on Invoice?", "YES")}
                    {yesNoField("Hide Company Letter Head on SJ?", "YES")}
                    <FormField label="SJ Mode?">
                        <FormSelect defaultValue="Tanpa Ekspedisi">
                            <option>Tanpa Ekspedisi</option>
                            <option>Dengan Ekspedisi</option>
                        </FormSelect>
                    </FormField>
                    {yesNoField("Allow Sales Price Lower Than Minimum?", "NO")}
                    {yesNoField("Activate Auto Insert Bank Account?", "NO")}
                    <FormField label="Default Bank Account on Sales Invoice" className="sm:col-span-2">
                        <FormSelect defaultValue="120.01.01 - BCA 194-398-7878">
                            <option>120.01.01 - BCA 194-398-7878</option>
                            <option>120.01.02 - BCA 999-000-1234</option>
                        </FormSelect>
                    </FormField>
                    {yesNoField("Local Sales?", "YES")}
                    {yesNoField("Export Sales?", "NO")}
                    {yesNoField("Allow Accept Non Invoiced on Sales Return?", "YES")}
                    {yesNoField("Only Accept Sales Return from Existing Customer?", "YES")}
                    <FormField label="Typing Qty on Invoice?">
                        <FormSelect defaultValue="FREE (Bebas Ketik Qty)">
                            <option>FREE (Bebas Ketik Qty)</option>
                            <option>STRICT</option>
                        </FormSelect>
                    </FormField>
                    <FormField label="Default Warehouse on Sales Invoice">
                        <FormSelect defaultValue="Gudang Kapuk">
                            <option>Gudang Kapuk</option>
                            <option>Gudang Pusat</option>
                        </FormSelect>
                    </FormField>
                    <FormField label="Default Warehouse on Sales Return">
                        <FormSelect defaultValue="Gudang Kapuk">
                            <option>Gudang Kapuk</option>
                            <option>Gudang Pusat</option>
                        </FormSelect>
                    </FormField>
                    {yesNoField("Show Last Purchase Price on Filter?", "NO")}
                    {yesNoField("Show Qty 0 (Zero) Invoice DO Printed?", "NO")}
                    {yesNoField("Allow Copy SO?", "YES")}
                    {yesNoField("Allow Auto Create Sales Invoice?", "NO")}
                    <FormField label="Void Dokumen SO?">
                        <FormSelect defaultValue="Langsung (Lokal)">
                            <option>Langsung (Lokal)</option>
                            <option>Dengan Approval</option>
                        </FormSelect>
                    </FormField>
                    {yesNoField("Use Proforma Invoice on SO?", "NO")}
                    {yesNoField("Use Reject Module?", "YES")}
                    <FormField label="Additional Notes on SJ" className="sm:col-span-2">
                        <textarea
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                            rows={3}
                            defaultValue="Barang yg telah diterima, tidak dapat diretur pada hari kerja"
                        />
                    </FormField>
                    <FormField label="Email on Loss Events">
                        <FormInput defaultValue="ys7025@gmail.com" type="email" />
                    </FormField>
                    {yesNoField("Use CC Email?", "NO")}
                    <FormField label="CC Email (Optional)">
                        <FormInput defaultValue="ys7025@gmail.com" type="email" />
                    </FormField>
                </div>
            </div>
            <SaveResetBar onSave={handleSave} saved={saved} />
        </div>
    );
}

// ─── Tab: Persediaan ──────────────────────────────────────────────────────────

function TabPersediaan() {
    const [saved, setSaved] = useState(false);
    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

    return (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-6 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">inventory_2</span>
                    <h3 className="font-bold text-slate-800">Pengaturan Persediaan Barang</h3>
                </div>
                <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <FormField label="Allow Minus On Stock">
                        <div className="space-y-1">
                            <FormSelect defaultValue="YES">
                                <option value="NO">NO</option>
                                <option value="YES">YES</option>
                            </FormSelect>
                            <p className="text-xs text-slate-400 mt-1">When Using Sales Invoice &amp; Warehouse Transfer Modules</p>
                        </div>
                    </FormField>
                    <FormField label="Allow Zero On Stock">
                        <div className="space-y-1">
                            <FormSelect defaultValue="YES">
                                <option value="NO">NO</option>
                                <option value="YES">YES</option>
                            </FormSelect>
                            <p className="text-xs text-slate-400 mt-1">When Using Warehouse Transfer Modules</p>
                        </div>
                    </FormField>
                    <FormField label="Default Warehouse on Inventory Adjustment/Transfer">
                        <FormSelect defaultValue="Gudang Kapuk">
                            <option>Gudang Kapuk</option>
                            <option>Gudang Pusat</option>
                        </FormSelect>
                    </FormField>
                    <FormField label="Multiply Weight Factor on SJ">
                        <FormInput defaultValue="1000" type="number" />
                    </FormField>
                </div>
            </div>
            <SaveResetBar onSave={handleSave} saved={saved} />
        </div>
    );
}

// ─── Tab: Keuangan ────────────────────────────────────────────────────────────

function TabKeuangan() {
    const [saved, setSaved] = useState(false);
    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

    const coaFields: { label: string; defaultValue: string }[] = [
        { label: "Akun Kas / Bank Utama",                defaultValue: "120.01.01 - BCA 194-398-7878" },
        { label: "Akun Hutang Dagang",                   defaultValue: "210.01.01 - HUTANG DAGANG PEMB./LOKAL" },
        { label: "Akun Piutang Dagang",                  defaultValue: "130.01.01 - PIUTANG DAGANG CUSTOMER - IDR" },
        { label: "Akun Deposit Pembelian Barang",        defaultValue: "131.04.01 - DEPOSIT PEMBELIAN BARANG" },
        { label: "Akun Deposit Penjualan Barang",        defaultValue: "210.03.01 - DEPOSIT PENJUALAN BARANG" },
        { label: "Akun PPN Masukan (Pembelian)",         defaultValue: "180.01.01 - PAJAK PPN MASUKAN" },
        { label: "Akun PPN Keluaran (Penjualan)",        defaultValue: "240.00.00 - PAJAK PPN KELUARAN" },
        { label: "Akun Retur Pembelian",                 defaultValue: "410.02.02 - RETUR PEMBELIAN" },
        { label: "Akun Potongan Pembelian",              defaultValue: "600.10.08 - POTONGAN PEMBELIAN" },
        { label: "Akun Potongan Penjualan",              defaultValue: "400.01.03 - POTONGAN PENJUALAN" },
        { label: "Akun Retur Penjualan",                 defaultValue: "400.01.02 - RETUR PENJUALAN LOKAL" },
        { label: "Akun Penjualan Barang Lokal",          defaultValue: "400.02.01 - PENJUALAN BARANG LOKAL" },
        { label: "Akun Harga Pokok Penjualan (HPP)",     defaultValue: "420.01.01 - HPP" },
        { label: "Akun Persediaan Barang",               defaultValue: "140.01.01 - PERSEDIAAN BARANG DAGANGAN" },
        { label: "Akun Selisih Kurs",                    defaultValue: "600.20.01 - R/L TEREALISIR" },
        { label: "Akun Selisih Retur Beli",              defaultValue: "600.20.02 - BIAYA SELISIH KURS" },
        { label: "Akun Selisih Bayar Pembelian/Penjualan", defaultValue: "500.00.25 - BIAYA SELISIH BAYAR PEMBELIAN & PENJUALAN" },
        { label: "Akun R/L Tahun Berjalan",              defaultValue: "330.00.00 - R/L TAHUN BERJALAN" },
        { label: "Akun R/L Tahun Lalu",                  defaultValue: "320.00.00 - R/L DITAHAN TAHUN LALU" },
        { label: "Akun Biaya Promosi & Sample",          defaultValue: "550.00.17 - BIAYA PROMOSI & SAMPLE" },
        { label: "Akun Biaya Barang Rusak & Reject",     defaultValue: "500.10.17 - BIAYA BARANG RUSAK /IJEK" },
        { label: "Akun Biaya Lain & Lain",               defaultValue: "500.10.20 - BIAYA LAIN - LAIN" },
        { label: "Akun Pendapatan Lain & Lain",          defaultValue: "600.10.01 - PENDAPATAN DARI USAHA LAINNYA" },
    ];

    return (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-6 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                    <h3 className="font-bold text-slate-800">Pengaturan Keuangan</h3>
                </div>
                <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {coaFields.map((f) => (
                        <FormField key={f.label} label={f.label}>
                            <CoaSelect defaultValue={f.defaultValue} />
                        </FormField>
                    ))}
                </div>
            </div>
            <SaveResetBar onSave={handleSave} saved={saved} />
        </div>
    );
}

// ─── Tab: Akunting ────────────────────────────────────────────────────────────

function TabAkunting() {
    const [saved, setSaved] = useState(false);
    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

    const akuntingFields: { label: string; defaultValue: string }[] = [
        { label: "Pembelian PPN",                    defaultValue: "180.01.01 - PAJAK PPN MASUKAN" },
        { label: "Retur Pembelian",                  defaultValue: "410.02.02 - RETUR PEMBELIAN" },
        { label: "Potongan Pembelian",               defaultValue: "600.10.08 - POTONGAN PEMBELIAN" },
        { label: "Penjualan PPN",                    defaultValue: "240.00.00 - PAJAK PPN KELUARAN" },
        { label: "Retur Penjualan",                  defaultValue: "400.01.02 - RETUR PENJUALAN LOKAL" },
        { label: "Potongan Penjualan",               defaultValue: "400.01.03 - POTONGAN PENJUALAN" },
        { label: "Hutang Dagang",                    defaultValue: "130.01.01 - PIUTANG DAGANG CUSTOMER - IDR" },
        { label: "Hutang Dagang Belum Ditagih",      defaultValue: "210.01.02 - HUTANG DAGANG LOKAL BELUM DITAGIH" },
        { label: "Penjualan Saring Lokal",           defaultValue: "210.01.01 - HUTANG DAGANG PEMB./LOKAL" },
        { label: "Penjualan Barang Lokal",           defaultValue: "400.02.01 - PENJUALAN BARANG LOKAL" },
        { label: "Penjualan Barang Ekspor",          defaultValue: "400.02.02 - PENJUALAN BARANG EXPORT" },
        { label: "Harga Pokok Penjualan",            defaultValue: "420.01.01 - HPP" },
        { label: "Persediaan Barang",                defaultValue: "140.01.01 - PERSEDIAAN BARANG DAGANGAN" },
        { label: "Deposit Pembelian Barang",         defaultValue: "131.04.01 - DEPOSIT PEMBELIAN BARANG" },
        { label: "Deposit Penjualan Barang",         defaultValue: "210.03.01 - DEPOSIT PENJUALAN BARANG" },
        { label: "Selisih Kurs",                     defaultValue: "600.20.01 - R/L TEREALISIR" },
        { label: "Selisih Retur Beli",               defaultValue: "600.20.02 - BIAYA SELISIH KURS" },
        { label: "Selisih Bayar Pembelian/Penjualan", defaultValue: "500.00.25 - BIAYA SELISIH BAYAR PEMBELIAN & PENJUALAN" },
        { label: "R/L Tahun Berjalan",               defaultValue: "330.00.00 - R/L TAHUN BERJALAN" },
        { label: "R/L Tahun Lalu",                   defaultValue: "320.00.00 - R/L DITAHAN TAHUN LALU" },
        { label: "Biaya Promosi & Sample",           defaultValue: "550.00.17 - BIAYA PROMOSI & SAMPLE" },
        { label: "Biaya Barang Rusak & Reject",      defaultValue: "500.10.17 - BIAYA BARANG RUSAK /IJEK" },
        { label: "Biaya Lain & Lain",                defaultValue: "500.10.20 - BIAYA LAIN - LAIN" },
        { label: "Pendapatan Lain & Lain",           defaultValue: "600.10.01 - PENDAPATAN DARI USAHA LAINNYA" },
    ];

    return (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-6 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">receipt_long</span>
                    <h3 className="font-bold text-slate-800">Pengaturan Akunting</h3>
                </div>

                {/* Fitur Tanggal Terakhir */}
                <div className="px-4 md:px-6 py-4 border-b border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider sm:w-64 shrink-0">
                            Fitur Tanggal Terakhir
                        </label>
                        <div className="flex items-center gap-3">
                            <FormSelect defaultValue="NO">
                                <option value="NO">NO</option>
                                <option value="YES">YES</option>
                            </FormSelect>
                            <span className="text-xs text-slate-400 italic">*pada Form Jurnal Umum</span>
                        </div>
                    </div>
                </div>

                {/* COA Mappings */}
                <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {akuntingFields.map((f) => (
                        <FormField key={f.label} label={f.label}>
                            <CoaSelect defaultValue={f.defaultValue} />
                        </FormField>
                    ))}
                </div>
            </div>
            <SaveResetBar onSave={handleSave} saved={saved} />
        </div>
    );
}

// ─── Tab: Lain-lain ───────────────────────────────────────────────────────────

interface PrefixField { label: string; code: string; extras?: { label: string; code: string }[] }

function PrefixRow({ label, code, extras }: PrefixField) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider sm:w-56 shrink-0">{label}</span>
            <div className="flex flex-wrap items-center gap-2">
                <div className="w-20"><FormInput defaultValue={code} /></div>
                {extras?.map((ex) => (
                    <div key={ex.label} className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 whitespace-nowrap">{ex.label} :</span>
                        <div className="w-20"><FormInput defaultValue={ex.code} /></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SectionCard({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">{icon}</span>
                <h3 className="font-bold text-slate-800">{title}</h3>
            </div>
            <div className="px-4 md:px-6 py-2 divide-y divide-slate-100">
                {children}
            </div>
        </div>
    );
}

function TabLainLain() {
    const [saved, setSaved] = useState(false);
    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

    return (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-6 space-y-6">
            {/* Pengaturan Lain-lain */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">more_horiz</span>
                    <h3 className="font-bold text-slate-800">Pengaturan Lain-lain</h3>
                </div>
                <div className="px-4 md:px-6 py-4 border-b border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider sm:w-56 shrink-0">
                            Jumlah Baris yang ditampilkan
                        </label>
                        <div className="w-24"><FormInput defaultValue="25" type="number" /></div>
                    </div>
                </div>
            </div>

            {/* Pembelian */}
            <SectionCard icon="shopping_cart" title="Pembelian — Prefix Kode Dokumen">
                <PrefixRow label="Pemesanan Pembelian" code="POB" />
                <PrefixRow label="Penerimaan Pembelian Barang" code="BPB" />
                <PrefixRow label="Nota Pembelian Barang" code="PIV" />
                <PrefixRow label="Retur Pembelian Barang" code="BRB" />
            </SectionCard>

            {/* Penjualan */}
            <SectionCard icon="storefront" title="Penjualan — Prefix Kode Dokumen">
                <PrefixRow
                    label="Pemesanan Penjualan Lokal"
                    code="SOL"
                    extras={[
                        { label: "Sample Pemesanan Penjualan Barang Lokal", code: "OSL" },
                        { label: "Reject Pemesanan Penjualan Barang Lokal", code: "ORL" },
                    ]}
                />
                <PrefixRow
                    label="Penjualan Barang Lokal"
                    code="SIL"
                    extras={[
                        { label: "Sample Penjualan Barang Lokal", code: "ISL" },
                        { label: "Reject Penjualan Barang Lokal", code: "IRL" },
                    ]}
                />
                <PrefixRow label="Retur Penjualan Barang Lokal" code="BRL" />
                <PrefixRow
                    label="Pemesanan Penjualan Barang Ekspor"
                    code="SOE"
                    extras={[
                        { label: "Sample Pemesanan Penjualan Barang Ekspor", code: "OSE" },
                        { label: "Reject Pemesanan Penjualan Barang Ekspor", code: "ORE" },
                    ]}
                />
                <PrefixRow
                    label="Penjualan Barang Ekspor"
                    code="SIE"
                    extras={[
                        { label: "Sample Penjualan Barang Ekspor", code: "ISF" },
                        { label: "Reject Penjualan Barang Ekspor", code: "IRF" },
                    ]}
                />
                <PrefixRow label="Retur Penjualan Barang Ekspor" code="BRE" />
            </SectionCard>

            {/* Persediaan Barang */}
            <SectionCard icon="inventory_2" title="Persediaan Barang — Prefix Kode Dokumen">
                <PrefixRow
                    label="Surat Jalan Lokal"
                    code="SJL"
                    extras={[
                        { label: "Sample Surat Jalan Lokal", code: "SSL" },
                        { label: "Reject Surat Jalan Lokal", code: "SRL" },
                    ]}
                />
                <PrefixRow
                    label="Surat Jalan Ekspor"
                    code="SJE"
                    extras={[
                        { label: "Sample Surat Jalan Ekspor", code: "SSE" },
                        { label: "Reject Surat Jalan Ekspor", code: "SRE" },
                    ]}
                />
                <PrefixRow label="Penyesuaian Persediaan Barang" code="AJB" />
                <PrefixRow label="Pengiriman Pemindahan Barang Antar Gudang" code="SOU" />
                <PrefixRow label="Penerimaan Pemindahan Barang Antar Gudang" code="SIN" />
            </SectionCard>

            {/* Hutang Dagang */}
            <SectionCard icon="account_balance" title="Hutang Dagang — Prefix Kode Dokumen">
                <PrefixRow label="Saldo Awal Hutang" code="SAH" />
                <PrefixRow label="Uang Muka Pembelian" code="DFP" />
                <PrefixRow label="Biaya Giro Keluar" code="BGO" />
                <PrefixRow label="Alokasi Pembayaran Atas Biaya Keluar" code="APP" />
                <PrefixRow label="Debit Note" code="DBN" />
            </SectionCard>

            {/* Piutang Dagang */}
            <SectionCard icon="account_balance_wallet" title="Piutang Dagang — Prefix Kode Dokumen">
                <PrefixRow label="Saldo Awal Piutang" code="SAP" />
                <PrefixRow label="Uang Muka Penjualan" code="DFJ" />
                <PrefixRow label="Biaya Giro Masuk" code="BGI" />
                <PrefixRow label="Alokasi Pembayaran Atas Biaya Masuk" code="ARS" />
                <PrefixRow label="Credit Note" code="CRN" />
            </SectionCard>

            {/* Akunting */}
            <SectionCard icon="receipt_long" title="Akunting — Prefix Kode Dokumen">
                <PrefixRow label="Jurnal Umum" code="GLD" />
                <PrefixRow label="Bukti Kas Masuk" code="BKM" />
                <PrefixRow label="Bukti Kas Keluar" code="BKK" />
                <PrefixRow label="Bukti Bank Masuk" code="BBM" />
                <PrefixRow label="Bukti Bank Keluar" code="BBK" />
            </SectionCard>

            <SaveResetBar onSave={handleSave} saved={saved} />
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SystemSettingsPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("umum");

    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            {/* Top Navigation Bar */}
            <Navbar />

            <main className="flex-1 flex overflow-hidden">
                {/* Sidebar Navigation */}
                <Sidebar />

                {/* Main Content Area */}
                <section className="flex-1 flex flex-col bg-background-light overflow-hidden">
                    {/* Page Header */}
                    <div className="px-4 md:px-8 pt-6 md:pt-8 pb-0 shrink-0">
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                            Pengaturan Program
                        </h2>
                        <p className="text-slate-500 mt-1 text-sm">
                            Konfigurasi pengaturan sistem, master data, pembelian, penjualan, persediaan, keuangan, akunting, dan lain-lain.
                        </p>
                    </div>

                    {/* Tab System Container */}
                    <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-8 pb-28 md:pb-8 gap-4 md:gap-6">
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

                        {/* Tab Content */}
                        {activeTab === "umum"       && <TabUmum />}
                        {activeTab === "master"     && <TabMaster />}
                        {activeTab === "pembelian"  && <TabPembelian />}
                        {activeTab === "penjualan"  && <TabPenjualan />}
                        {activeTab === "persediaan" && <TabPersediaan />}
                        {activeTab === "keuangan"   && <TabKeuangan />}
                        {activeTab === "akunting"   && <TabAkunting />}
                        {activeTab === "lain-lain"  && <TabLainLain />}
                    </div>
                </section>
            </main>

            {/* Footer StatusBar */}
            <StatusBar />
        </div>
    );
}
