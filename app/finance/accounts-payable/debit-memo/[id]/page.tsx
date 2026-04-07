"use client";

import { useRouter } from "next/navigation";
import { use, useState } from "react";
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import StatusBar from "../../../../components/StatusBar";
import FormField from "../../../../components/FormField";
import FormInput from "../../../../components/FormInput";
import FormSelect from "../../../../components/FormSelect";
import FormTextarea from "../../../../components/FormTextarea";

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusType = "Approved" | "Pending" | "Draft" | "Closed";
type TipeType   = "Potongan" | "Retur";

const statusStyles: Record<StatusType, string> = {
    Approved: "bg-green-100 text-green-700 border-green-200",
    Pending:  "bg-yellow-100 text-yellow-700 border-yellow-200",
    Draft:    "bg-slate-100 text-slate-700 border-slate-200",
    Closed:   "bg-emerald-100 text-emerald-700 border-emerald-200",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

interface DebitMemoDetail {
    noTransaksi: string;
    tanggal: string;
    pemasok: string;
    mataUang: string;
    kurs: string;
    refKodeAkun: string;
    keterangan: string;
    jumlah: number;
    ppnPersen: number;
    ppn: number;
    grandTotal: number;
    tipe: TipeType;
    status: StatusType;
}

const mockData: Record<string, DebitMemoDetail> = {
    "DBN2206-0001": {
        noTransaksi: "DBN 2206-0001",
        tanggal: "2022-06-30",
        pemasok: "UNILEVER",
        mataUang: "Rupiah",
        kurs: "1.00",
        refKodeAkun: "600.10.06 - POTONGAN PEMBELIAN",
        keterangan: "Debit Memo atas UNILEVER",
        jumlah: 216461.32,
        ppnPersen: 10,
        ppn: 21646.13,
        grandTotal: 238107.45,
        tipe: "Potongan",
        status: "Approved",
    },
    "DBN1911-0005": {
        noTransaksi: "DBN 1911-0005",
        tanggal: "2019-11-15",
        pemasok: "UNILEVER",
        mataUang: "Rupiah",
        kurs: "1.00",
        refKodeAkun: "600.10.06 - POTONGAN PEMBELIAN",
        keterangan: "Debit Memo atas UNILEVER",
        jumlah: 85560955.00,
        ppnPersen: 10,
        ppn: 8556095.50,
        grandTotal: 94117050.50,
        tipe: "Potongan",
        status: "Approved",
    },
    "DBN1911-0004": {
        noTransaksi: "DBN 1911-0004",
        tanggal: "2019-11-15",
        pemasok: "UNILEVER",
        mataUang: "Rupiah",
        kurs: "1.00",
        refKodeAkun: "600.10.06 - POTONGAN PEMBELIAN",
        keterangan: "Debit Memo atas UNILEVER",
        jumlah: 83252369.00,
        ppnPersen: 10,
        ppn: 8325236.90,
        grandTotal: 91577605.90,
        tipe: "Potongan",
        status: "Approved",
    },
    "DBN1907-0002": {
        noTransaksi: "DBN 1907-0002",
        tanggal: "2019-07-31",
        pemasok: "UNILEVER",
        mataUang: "Rupiah",
        kurs: "1.00",
        refKodeAkun: "600.10.06 - POTONGAN PEMBELIAN",
        keterangan: "Debit Memo atas UNILEVER",
        jumlah: 342474700.00,
        ppnPersen: 10,
        ppn: 34247470.00,
        grandTotal: 376722170.00,
        tipe: "Potongan",
        status: "Closed",
    },
    new: {
        noTransaksi: "[Auto]",
        tanggal: new Date().toISOString().slice(0, 10),
        pemasok: "",
        mataUang: "Rupiah",
        kurs: "1.00",
        refKodeAkun: "",
        keterangan: "",
        jumlah: 0,
        ppnPersen: 10,
        ppn: 0,
        grandTotal: 0,
        tipe: "Potongan",
        status: "Draft",
    },
};

const fmtCur = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Tabs ──────────────────────────────────────────────────────────────────────

type TabKey = "header" | "attachments";

const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "header",      label: "Data Debit Memo", icon: "description" },
    { key: "attachments", label: "Lampiran",         icon: "attachment" },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function DebitMemoDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id }  = use(params);
    const router  = useRouter();
    const isNew   = id === "new";
    const data    = mockData[id] ?? mockData["new"];

    const [activeTab, setActiveTab] = useState<TabKey>("header");

    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            <Navbar />

            <main className="flex-1 flex overflow-hidden">
                <Sidebar />

                <section className="flex-1 flex flex-col bg-background-light overflow-hidden">
                    {/* ── Action Header ── */}
                    <div className="px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/5 bg-white/50 backdrop-blur-sm shrink-0">
                        {/* Left: Back + title + status */}
                        <div className="flex items-start md:items-center gap-3 md:gap-4 w-full md:w-auto">
                            <button
                                onClick={() => router.push("/finance/accounts-payable/debit-memo")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        {isNew ? "Tambah Debit Memo" : data.noTransaksi}
                                    </h1>
                                    <span className={`px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest border ${statusStyles[data.status]}`}>
                                        {data.status}
                                    </span>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    Input Pencatatan Debit Memo
                                </p>
                            </div>
                        </div>

                        {/* Right: Action buttons */}
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-200/50 rounded-lg transition-all border border-slate-200 md:border-transparent flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">refresh</span>
                                Reset
                            </button>
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold bg-white text-slate-700 border border-slate-200 hover:border-primary rounded-lg transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">help</span>
                                Info
                            </button>
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold bg-white text-primary border border-primary/20 hover:border-primary rounded-lg transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">print</span>
                                Print
                            </button>
                            <button className="w-full md:w-auto justify-center px-4 md:px-5 py-2 text-xs md:text-sm font-bold bg-primary text-white hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">save</span>
                                Simpan
                            </button>
                        </div>
                    </div>

                    {/* ── Tab System Container ── */}
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

                        {/* ── Tab: Data Debit Memo ── */}
                        {activeTab === "header" && (
                            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                                    {/* Left: Form Cards */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Card: Informasi Transaksi */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">info</span>
                                                <h3 className="font-bold text-slate-800">Informasi Transaksi</h3>
                                            </div>
                                            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                                <FormField label="Transaksi #">
                                                    <FormInput
                                                        defaultValue={data.noTransaksi}
                                                        readOnly={!isNew}
                                                        placeholder="[Auto]"
                                                    />
                                                </FormField>
                                                <FormField label="Tanggal">
                                                    <FormInput
                                                        type="date"
                                                        defaultValue={data.tanggal}
                                                    />
                                                </FormField>
                                                <FormField label="Tipe">
                                                    <FormSelect defaultValue={data.tipe}>
                                                        <option value="Potongan">Potongan</option>
                                                        <option value="Retur">Retur</option>
                                                    </FormSelect>
                                                </FormField>
                                                <FormField label="Pemasok" className="sm:col-span-2">
                                                    <FormSelect defaultValue={data.pemasok}>
                                                        <option value="">— Pilih Pemasok —</option>
                                                        <option value="UNILEVER">UNILEVER</option>
                                                        <option value="CV CITRA HARAPAN JAYA">CV CITRA HARAPAN JAYA</option>
                                                        <option value="HUTANG P. SAHAM 2017">HUTANG P. SAHAM 2017</option>
                                                    </FormSelect>
                                                </FormField>
                                            </div>
                                        </div>

                                        {/* Card: Informasi Pembayaran */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">payments</span>
                                                <h3 className="font-bold text-slate-800">Informasi Pembayaran</h3>
                                            </div>
                                            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                                <FormField label="Mata Uang">
                                                    <FormSelect defaultValue={data.mataUang}>
                                                        <option value="Rupiah">Rupiah</option>
                                                        <option value="USD">USD</option>
                                                        <option value="EUR">EUR</option>
                                                        <option value="SGD">SGD</option>
                                                    </FormSelect>
                                                </FormField>
                                                <FormField label="Kurs">
                                                    <FormInput
                                                        type="number"
                                                        defaultValue={data.kurs}
                                                    />
                                                </FormField>
                                                <FormField label="Ref Kode Akun" className="sm:col-span-2">
                                                    <FormSelect defaultValue={data.refKodeAkun}>
                                                        <option value="">— Pilih Kode Akun —</option>
                                                        <option value="600.10.06 - POTONGAN PEMBELIAN">600.10.06 - POTONGAN PEMBELIAN</option>
                                                        <option value="600.10.07 - RETUR PEMBELIAN">600.10.07 - RETUR PEMBELIAN</option>
                                                        <option value="600.20.01 - DISKON PEMBELIAN">600.20.01 - DISKON PEMBELIAN</option>
                                                    </FormSelect>
                                                </FormField>
                                                <FormField label="Keterangan" className="sm:col-span-2">
                                                    <FormTextarea
                                                        defaultValue={data.keterangan}
                                                        placeholder="Masukkan keterangan debit memo..."
                                                        rows={3}
                                                    />
                                                </FormField>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Sidebar Summary */}
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-0">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">receipt_long</span>
                                                <h3 className="font-bold text-slate-800">Ringkasan Biaya</h3>
                                            </div>
                                            <div className="p-4 md:p-6 space-y-4">
                                                <FormField label="Jumlah">
                                                    <FormInput
                                                        type="number"
                                                        defaultValue={String(data.jumlah)}
                                                        placeholder="0.00"
                                                    />
                                                </FormField>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1">
                                                        <FormField label="PPN %">
                                                            <FormInput
                                                                type="number"
                                                                defaultValue={String(data.ppnPersen)}
                                                                placeholder="10"
                                                            />
                                                        </FormField>
                                                    </div>
                                                    <div className="flex-1 mt-5">
                                                        <FormInput
                                                            type="number"
                                                            defaultValue={String(data.ppn)}
                                                            readOnly
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="pt-4 border-t border-slate-100">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm md:text-base font-bold text-slate-900">Grand Total</span>
                                                        <span className="text-lg md:text-xl font-black text-primary">
                                                            Rp {fmtCur(data.grandTotal)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2">
                                                <button className="col-span-2 py-3 bg-primary text-white rounded font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                                                    <span className="material-symbols-outlined">save</span>
                                                    SIMPAN
                                                </button>
                                                <button className="py-2 bg-white border border-slate-200 text-slate-600 rounded text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined !text-sm">refresh</span>
                                                    RESET
                                                </button>
                                                <button className="py-2 bg-white border border-slate-200 text-slate-600 rounded text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined !text-sm">help</span>
                                                    INFO
                                                </button>
                                                {!isNew && data.status !== "Approved" && (
                                                    <button className="col-span-2 py-2 bg-emerald-500 text-white rounded text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1">
                                                        <span className="material-symbols-outlined !text-sm">verified</span>
                                                        APPROVE
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Tab: Lampiran ── */}
                        {activeTab === "attachments" && (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <span className="material-symbols-outlined text-5xl text-slate-300">attachment</span>
                                    <p className="mt-2 text-sm text-slate-500">Belum ada lampiran.</p>
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
        </div>
    );
}
