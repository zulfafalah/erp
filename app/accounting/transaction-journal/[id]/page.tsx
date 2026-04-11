"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../../components/MultiFilter";
import DataTable, { Column } from "../../../components/DataTable";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = "header" | "details";

type JurnalStatus = "Open" | "Posted" | "Cancelled";

interface JurnalHeader {
    journalNo: string;
    tanggal: string;
    kodeTransaksi: string;
    keterangan: string;
    mataUang: string;
    kursJurnal: string;
    status: JurnalStatus;
    totalDebetLocal: number;
    totalDebetOriginal: number;
    totalKreditLocal: number;
    totalKreditOriginal: number;
    totalKonversi: number;
}

interface JurnalDetail {
    id: string;
    akunPerkiraan: string;
    keterangan: string;
    voucherNo: string;
    dc: "Debet" | "Kredit";
    jumlahDebet: number;
    jumlahKredit: number;
}

// ─── Status Styles ────────────────────────────────────────────────────────────

const statusStyles: Record<JurnalStatus, string> = {
    Open:      "bg-yellow-100 text-yellow-700 border-yellow-200",
    Posted:    "bg-green-100 text-green-700 border-green-200",
    Cancelled: "bg-red-100 text-red-700 border-red-200",
};

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "header",  label: "Header",         icon: "description" },
    { key: "details", label: "Daftar Detail",   icon: "list_alt"    },
];

// ─── Mock Data ────────────────────────────────────────────────────────────────

const journalHeader: JurnalHeader = {
    journalNo:            "SIL 2401-0001",
    tanggal:              "2024-01-14",
    kodeTransaksi:        "GLD",
    keterangan:           "Penjualan Barang Lokal ke Berkah Jaya. TK",
    mataUang:             "IDR",
    kursJurnal:           "1.00",
    status:               "Open",
    totalDebetLocal:      12471590,
    totalDebetOriginal:   12471590,
    totalKreditLocal:     12471590,
    totalKreditOriginal:  12471590,
    totalKonversi:        12471590,
};

const allDetails: JurnalDetail[] = [
    {
        id: "1",
        akunPerkiraan: "130.01.01 - PIUTANG DAGANG CUSTOMER - IDR",
        keterangan:    "Piutang Dagang Berkah Jaya. TK-SIL 2401-0001",
        voucherNo:     "SIL 2401-0001",
        dc:            "Debet",
        jumlahDebet:   10545000,
        jumlahKredit:  0,
    },
    {
        id: "2",
        akunPerkiraan: "420.01.01 - HPP",
        keterangan:    "HPP Barang CLEAR SHP COMPLETE CARE MEN 36X160ML",
        voucherNo:     "SIL 2401-0001",
        dc:            "Debet",
        jumlahDebet:   0,
        jumlahKredit:  0,
    },
    {
        id: "3",
        akunPerkiraan: "420.01.01 - HPP",
        keterangan:    "HPP Barang MOLTO ALL IN 1 BLUE REF 6X1803ML",
        voucherNo:     "SIL 2401-0001",
        dc:            "Debet",
        jumlahDebet:   1926390,
        jumlahKredit:  0,
    },
    {
        id: "4",
        akunPerkiraan: "400.01.01 - PENJUALAN BARANG LOKAL",
        keterangan:    "Penjualan Barang CLEAR SHP COMPLETE CARE MEN 36X160ML",
        voucherNo:     "SIL 2401-0001",
        dc:            "Kredit",
        jumlahDebet:   0,
        jumlahKredit:  8500000,
    },
    {
        id: "5",
        akunPerkiraan: "140.01.01 - PERSEDIAAN BARANG DAGANGAN",
        keterangan:    "Persediaan Barang CLEAR SHP COMPLETE CARE MEN 36X160ML",
        voucherNo:     "SIL 2401-0001",
        dc:            "Kredit",
        jumlahDebet:   0,
        jumlahKredit:  0,
    },
    {
        id: "6",
        akunPerkiraan: "400.01.01 - PENJUALAN BARANG LOKAL",
        keterangan:    "Penjualan Barang MOLTO ALL IN 1 BLUE REF 6X1803ML",
        voucherNo:     "SIL 2401-0001",
        dc:            "Kredit",
        jumlahDebet:   0,
        jumlahKredit:  1000000,
    },
    {
        id: "7",
        akunPerkiraan: "140.01.01 - PERSEDIAAN BARANG DAGANGAN",
        keterangan:    "Persediaan Barang MOLTO ALL IN 1 BLUE REF 6X1800ML",
        voucherNo:     "SIL 2401-0001",
        dc:            "Kredit",
        jumlahDebet:   0,
        jumlahKredit:  1926590,
    },
    {
        id: "8",
        akunPerkiraan: "240.00.06 - PAJAK PPN KELUARAN",
        keterangan:    "PPN Penjualan SIL 2401-0001",
        voucherNo:     "SIL 2401-0001",
        dc:            "Kredit",
        jumlahDebet:   0,
        jumlahKredit:  1045000,
    },
];

// ─── Filter Fields ────────────────────────────────────────────────────────────

const DETAIL_FILTER_FIELDS: FilterField[] = [
    { key: "akunPerkiraan", label: "Akun Perkiraan", type: "text" },
    { key: "keterangan",    label: "Keterangan",     type: "text" },
    { key: "voucherNo",     label: "Voucher #",      type: "text" },
    {
        key: "dc", label: "D/C", type: "select", options: [
            { label: "Debet",  value: "Debet"  },
            { label: "Kredit", value: "Kredit" },
        ],
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatNumber = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 4, maximumFractionDigits: 4 });

const formatTotal = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TransactionJournalDetailPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabKey>("header");
    const [filteredDetails, setFilteredDetails] = useState<JurnalDetail[]>(allDetails);

    // Header form state
    const [tanggal,       setTanggal]       = useState(journalHeader.tanggal);
    const [kodeTransaksi, setKodeTransaksi] = useState(journalHeader.kodeTransaksi);
    const [keterangan,    setKeterangan]    = useState(journalHeader.keterangan);
    const [mataUang,      setMataUang]      = useState(journalHeader.mataUang);
    const [kursJurnal,    setKursJurnal]    = useState(journalHeader.kursJurnal);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredDetails(allDetails);
            return;
        }
        const result = allDetails.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof JurnalDetail];
                if (itemValue === undefined) return true;
                const itemStr = String(itemValue).toLowerCase();
                const valStr = value.toLowerCase();
                switch (operator) {
                    case "contains":    return itemStr.includes(valStr);
                    case "equals":      return itemStr === valStr;
                    case "not_equals":  return itemStr !== valStr;
                    case "starts_with": return itemStr.startsWith(valStr);
                    case "ends_with":   return itemStr.endsWith(valStr);
                    default:            return true;
                }
            })
        );
        setFilteredDetails(result);
    };

    // Totals
    const totalDebet  = filteredDetails.reduce((s, d) => s + d.jumlahDebet, 0);
    const totalKredit = filteredDetails.reduce((s, d) => s + d.jumlahKredit, 0);

    const detailColumns: Column<JurnalDetail>[] = [
        {
            header: "#",
            key: "id",
            render: (_item, idx) => (
                <span className="text-sm text-slate-400 font-medium">{(idx ?? 0) + 1}.</span>
            ),
        },
        {
            header: "Akun Perkiraan",
            key: "akunPerkiraan",
            render: (item) => (
                <Link
                    href={`/accounting/transaction-journal/1/${item.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {item.akunPerkiraan}
                </Link>
            ),
        },
        {
            header: "Keterangan",
            key: "keterangan",
            render: (item) => <span className="text-sm text-slate-600">{item.keterangan}</span>,
        },
        {
            header: "Voucher #",
            key: "voucherNo",
            render: (item) => <span className="text-sm text-slate-600">{item.voucherNo}</span>,
        },
        {
            header: "D/C",
            key: "dc",
            render: (item) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.dc === "Debet" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                }`}>
                    {item.dc}
                </span>
            ),
        },
        {
            header: "Jumlah Debet",
            key: "jumlahDebet",
            render: (item) => (
                <span className="text-sm font-medium text-slate-700">{formatNumber(item.jumlahDebet)}</span>
            ),
        },
        {
            header: "Jumlah Kredit",
            key: "jumlahKredit",
            render: (item) => (
                <span className="text-sm font-medium text-slate-700">{formatNumber(item.jumlahKredit)}</span>
            ),
        },
        {
            header: "Aksi",
            key: "aksi",
            align: "right",
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/accounting/transaction-journal/1/${item.id}`}
                        className="text-sm font-semibold text-primary hover:text-primary/70 transition-colors"
                        title="View"
                    >
                        View
                    </Link>
                    <button
                        className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors"
                        title="Delete"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    const renderDetailMobileCard = (item: JurnalDetail, idx?: number) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-medium">{(idx ?? 0) + 1}.</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.dc === "Debet" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                        }`}>
                            {item.dc}
                        </span>
                    </div>
                    <Link
                        href={`/accounting/transaction-journal/1/${item.id}`}
                        className="font-semibold text-primary text-sm hover:underline block mt-1"
                    >
                        {item.akunPerkiraan}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">
                        {item.keterangan} &middot; Voucher #{item.voucherNo}
                    </p>
                </div>
                <div className="text-right shrink-0 space-y-1">
                    <p className="text-xs text-slate-400">Debet</p>
                    <p className="text-xs font-semibold text-slate-700">{formatNumber(item.jumlahDebet)}</p>
                    <p className="text-xs text-slate-400">Kredit</p>
                    <p className="text-xs font-semibold text-slate-700">{formatNumber(item.jumlahKredit)}</p>
                </div>
            </div>
            <div className="flex justify-end items-center pt-2 border-t border-slate-100 gap-3">
                <Link
                    href={`/accounting/transaction-journal/1/${item.id}`}
                    className="text-sm font-semibold text-primary hover:text-primary/70 transition-colors"
                >
                    View
                </Link>
                <button className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors">
                    Delete
                </button>
            </div>
        </div>
    );

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
                                onClick={() => router.push("/accounting/transaction-journal")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        :: Input Jurnal Transaksi
                                    </h1>
                                    <span className={`px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest border ${statusStyles[journalHeader.status]}`}>
                                        {journalHeader.status}
                                    </span>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    {journalHeader.journalNo} &mdash; {journalHeader.tanggal}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-200/50 rounded-lg transition-all border border-slate-200 md:border-transparent flex items-center gap-2">
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
                                </button>
                            ))}
                        </div>

                        {/* ── Tab: Header ─────────────────────────────────────── */}
                        {activeTab === "header" && (
                            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                                    {/* Left: Form */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            {/* Card Header */}
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">receipt</span>
                                                <h3 className="font-bold text-slate-800">Informasi Jurnal Transaksi</h3>
                                            </div>
                                            {/* Card Body */}
                                            <div className="p-4 md:p-6 space-y-4">

                                                {/* No. */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        No.
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormInput
                                                            defaultValue={journalHeader.journalNo}
                                                            className="w-48"
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>

                                                {/* Tanggal */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Tanggal
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormInput
                                                            type="date"
                                                            value={tanggal}
                                                            onChange={(e) => setTanggal(e.target.value)}
                                                            className="w-44"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Kode Transaksi */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Kode Transaksi ?
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormSelect
                                                            value={kodeTransaksi}
                                                            onChange={(e) => setKodeTransaksi(e.target.value)}
                                                            className="w-64"
                                                        >
                                                            <option value="GLD">Jurnal Umum (GLD)</option>
                                                            <option value="SIL">Jurnal Penjualan (SIL)</option>
                                                            <option value="PIW">Jurnal Pembelian (PIW)</option>
                                                            <option value="BPB">Penerimaan Barang (BPB)</option>
                                                            <option value="BRB">Retur Pembelian (BRB)</option>
                                                            <option value="ARS">Alokasi Penerimaan (ARS)</option>
                                                            <option value="BGI">Penerimaan Pembayaran (BGI)</option>
                                                        </FormSelect>
                                                    </div>
                                                </div>

                                                {/* Keterangan */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Keterangan
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormInput
                                                            value={keterangan}
                                                            onChange={(e) => setKeterangan(e.target.value)}
                                                            className="w-full max-w-lg"
                                                            placeholder="Masukkan keterangan jurnal..."
                                                        />
                                                    </div>
                                                </div>

                                                {/* Mata Uang */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Mata Uang
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormSelect
                                                            value={mataUang}
                                                            onChange={(e) => setMataUang(e.target.value)}
                                                            className="w-40"
                                                        >
                                                            <option value="IDR">Rupiah</option>
                                                            <option value="USD">US Dollar</option>
                                                            <option value="EUR">Euro</option>
                                                            <option value="YEN">Yen</option>
                                                        </FormSelect>
                                                    </div>
                                                </div>

                                                {/* Kurs Jurnal */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Kurs Jurnal
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormInput
                                                            type="number"
                                                            value={kursJurnal}
                                                            onChange={(e) => setKursJurnal(e.target.value)}
                                                            className="w-32"
                                                            step="0.01"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Status */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Status
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormSelect className="w-40" defaultValue={journalHeader.status} disabled>
                                                            <option value="Open">Open</option>
                                                            <option value="Posted">Posted</option>
                                                            <option value="Cancelled">Cancelled</option>
                                                        </FormSelect>
                                                    </div>
                                                </div>

                                                {/* Divider */}
                                                <div className="border-t border-slate-100 pt-4 space-y-4">
                                                    {/* Total Debet */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                            Total Debet
                                                        </label>
                                                        <div className="sm:col-span-3 flex items-center gap-2">
                                                            <FormInput
                                                                type="number"
                                                                defaultValue={formatTotal(journalHeader.totalDebetLocal)}
                                                                className="w-40"
                                                                readOnly
                                                            />
                                                            <FormInput
                                                                type="number"
                                                                defaultValue={formatTotal(journalHeader.totalDebetOriginal)}
                                                                className="w-40"
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Total Kredit */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                            Total Kredit
                                                        </label>
                                                        <div className="sm:col-span-3 flex items-center gap-2">
                                                            <FormInput
                                                                type="number"
                                                                defaultValue={formatTotal(journalHeader.totalKreditLocal)}
                                                                className="w-40"
                                                                readOnly
                                                            />
                                                            <FormInput
                                                                type="number"
                                                                defaultValue={formatTotal(journalHeader.totalKreditOriginal)}
                                                                className="w-40"
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Total Konversi */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                        <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                            Total Konversi
                                                        </label>
                                                        <div className="sm:col-span-3">
                                                            <FormInput
                                                                type="number"
                                                                defaultValue={formatTotal(journalHeader.totalKonversi)}
                                                                className="w-40"
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Summary Sidebar */}
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-0">
                                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">receipt_long</span>
                                                <h3 className="font-bold text-slate-800">Ringkasan Jurnal</h3>
                                            </div>
                                            <div className="p-4 md:p-6 space-y-3">
                                                {[
                                                    { label: "Journal No",     value: journalHeader.journalNo    },
                                                    { label: "Tanggal",        value: journalHeader.tanggal      },
                                                    { label: "Kode Transaksi", value: kodeTransaksi              },
                                                    { label: "Mata Uang",      value: mataUang                   },
                                                    { label: "Kurs",           value: kursJurnal                 },
                                                ].map((row) => (
                                                    <div key={row.label} className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">{row.label}</span>
                                                        <span className="font-semibold text-slate-700">{row.value}</span>
                                                    </div>
                                                ))}
                                                <div className="pt-3 border-t border-slate-100 space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-bold text-slate-900">Total Debet</span>
                                                        <span className="text-base font-black text-primary">
                                                            {formatTotal(journalHeader.totalDebetLocal)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-bold text-slate-900">Total Kredit</span>
                                                        <span className="text-base font-black text-primary">
                                                            {formatTotal(journalHeader.totalKreditLocal)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Action Buttons */}
                                            <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2">
                                                <button className="col-span-2 py-3 bg-primary text-white rounded font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                                                    <span className="material-symbols-outlined">save</span> SIMPAN
                                                </button>
                                                <button className="py-2 bg-white border border-slate-200 text-slate-600 rounded text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined !text-sm">help</span> INFO
                                                </button>
                                                <button className="py-2 bg-white border border-slate-200 text-slate-600 rounded text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined !text-sm">print</span> PRINT
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Tab: Detail ──────────────────────────────────────── */}
                        {activeTab === "details" && (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                {/* Detail Action Bar */}
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 shrink-0">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-800">
                                            :: Daftar Detail Jurnal {journalHeader.journalNo}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {allDetails.length} baris entri jurnal
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MultiFilter fields={DETAIL_FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                        <Link
                                            href="/accounting/transaction-journal/1/new"
                                            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                        >
                                            <span className="material-symbols-outlined text-lg">add_circle</span>
                                            Add New
                                        </Link>
                                    </div>
                                </div>

                                {/* Detail Table */}
                                <div className="flex-1 overflow-y-auto no-scrollbar">
                                    <DataTable
                                        data={filteredDetails}
                                        columns={detailColumns}
                                        keyField="id"
                                        renderMobileCard={renderDetailMobileCard}
                                    />

                                    {/* Totals Footer */}
                                    <div className="bg-white rounded-xl border border-primary/10 shadow-sm p-4 md:p-6 mt-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="material-symbols-outlined text-primary">receipt_long</span>
                                            <h3 className="font-bold text-slate-800">Total Jurnal</h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { label: "Total Debet",  value: totalDebet  },
                                                { label: "Total Kredit", value: totalKredit },
                                            ].map((total) => (
                                                <div key={total.label} className="border border-slate-100 rounded-lg p-3">
                                                    <p className="text-xs text-slate-400 mb-1">{total.label}</p>
                                                    <p className="text-base font-black text-slate-900">{formatNumber(total.value)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Footer StatusBar */}
            <StatusBar />
        </div>
    );
}
