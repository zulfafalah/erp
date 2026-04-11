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

type FundRequestStatus = "Approved" | "Pending" | "Draft" | "Rejected";

interface FundRequestHeader {
    pengajuanNo: string;
    tanggal: string;
    kodeAkun: string;
    keterangan: string;
    status: FundRequestStatus;
}

interface FundRequestDetail {
    id: string;
    noBukti: string;
    tanggal: string;
    keterangan: string;
    jumlah: number;
}

// ─── Status Styles ────────────────────────────────────────────────────────────

const statusStyles: Record<FundRequestStatus, string> = {
    Approved: "bg-green-100 text-green-700 border-green-200",
    Pending:  "bg-yellow-100 text-yellow-700 border-yellow-200",
    Draft:    "bg-slate-100 text-slate-700 border-slate-200",
    Rejected: "bg-red-100 text-red-700 border-red-200",
};

// ─── Tabs ────────────────────────────────────────────────────────────────────

const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "header",  label: "Header",        icon: "description" },
    { key: "details", label: "Daftar Detail", icon: "list_alt"    },
];

// ─── Mock Data ────────────────────────────────────────────────────────────────

const fundRequestHeader: FundRequestHeader = {
    pengajuanNo: "PKK20040008",
    tanggal:     "2020-04-15",
    kodeAkun:    "110.01.01",
    keterangan:  "Permintaan Dana Atas Akun : 110.01.01 - KAS KECIL, GD PIK",
    status:      "Approved",
};

const kodeAkunOptions = [
    { value: "110.01.01", label: "110.01.01 - KAS KECIL, GD PIK"      },
    { value: "110.01.02", label: "110.01.02 - KAS KECIL, GD MEDAN"    },
    { value: "110.01.03", label: "110.01.03 - KAS KECIL, GD JAKARTA"  },
    { value: "110.02.01", label: "110.02.01 - KAS BESAR"               },
    { value: "120.01.01", label: "120.01.01 - BANK BCA (IDR)"          },
    { value: "120.01.02", label: "120.01.02 - BANK MANDIRI (IDR)"      },
];

const allDetails: FundRequestDetail[] = [
    { id: "1", noBukti: "BKK-2020-04-001", tanggal: "2020-04-15", keterangan: "Pembelian ATK Kantor",              jumlah: 350000  },
    { id: "2", noBukti: "BKK-2020-04-002", tanggal: "2020-04-15", keterangan: "Biaya Pengiriman Barang",           jumlah: 125000  },
    { id: "3", noBukti: "BKK-2020-04-003", tanggal: "2020-04-15", keterangan: "Pembelian Konsumsi Rapat",          jumlah: 450000  },
    { id: "4", noBukti: "BKK-2020-04-004", tanggal: "2020-04-15", keterangan: "Biaya Parkir dan Tol",             jumlah: 85000   },
    { id: "5", noBukti: "BKK-2020-04-005", tanggal: "2020-04-15", keterangan: "Pembelian Alat Kebersihan",        jumlah: 210000  },
];

// ─── Filter Fields ────────────────────────────────────────────────────────────

const DETAIL_FILTER_FIELDS: FilterField[] = [
    { key: "noBukti",    label: "No. Bukti",   type: "text" },
    { key: "tanggal",    label: "Tanggal",      type: "text" },
    { key: "keterangan", label: "Keterangan",   type: "text" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatRupiah = (n: number) =>
    "Rp " + n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FundRequestDetailPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabKey>("header");
    const [filteredDetails, setFilteredDetails] = useState<FundRequestDetail[]>(allDetails);

    // Header form state
    const [tanggal,    setTanggal]    = useState(fundRequestHeader.tanggal);
    const [kodeAkun,   setKodeAkun]   = useState(fundRequestHeader.kodeAkun);
    const [keterangan, setKeterangan] = useState(fundRequestHeader.keterangan);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredDetails(allDetails);
            return;
        }
        const result = allDetails.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof FundRequestDetail];
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

    const totalJumlah = filteredDetails.reduce((s, d) => s + d.jumlah, 0);

    const detailColumns: Column<FundRequestDetail>[] = [
        {
            header: "#",
            key: "id",
            render: (_item, idx) => (
                <span className="text-sm text-slate-400 font-medium">{(idx ?? 0) + 1}.</span>
            ),
        },
        {
            header: "No. Bukti",
            key: "noBukti",
            render: (item) => (
                <Link
                    href={`/accounting/fund-request/1/${item.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {item.noBukti}
                </Link>
            ),
        },
        {
            header: "Tanggal",
            key: "tanggal",
            render: (item) => <span className="text-sm text-slate-600">{item.tanggal}</span>,
        },
        {
            header: "Keterangan",
            key: "keterangan",
            render: (item) => <span className="text-sm text-slate-700">{item.keterangan}</span>,
        },
        {
            header: "Jumlah",
            key: "jumlah",
            render: (item) => (
                <span className="text-sm font-semibold text-slate-800">{formatRupiah(item.jumlah)}</span>
            ),
        },
        {
            header: "Aksi",
            key: "aksi",
            align: "right",
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/accounting/fund-request/1/${item.id}`}
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

    const renderDetailMobileCard = (item: FundRequestDetail, idx?: number) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-medium">{(idx ?? 0) + 1}.</span>
                        <Link
                            href={`/accounting/fund-request/1/${item.id}`}
                            className="font-semibold text-primary text-sm hover:underline"
                        >
                            {item.noBukti}
                        </Link>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{item.keterangan}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.tanggal}</p>
                </div>
                <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-slate-800">{formatRupiah(item.jumlah)}</p>
                </div>
            </div>
            <div className="flex justify-end items-center pt-2 border-t border-slate-100 gap-3">
                <Link
                    href={`/accounting/fund-request/1/${item.id}`}
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
                                onClick={() => router.push("/accounting/fund-request")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        :: Input Jurnal Umum
                                    </h1>
                                    <span className={`px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest border ${statusStyles[fundRequestHeader.status]}`}>
                                        {fundRequestHeader.status}
                                    </span>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    {fundRequestHeader.pengajuanNo} &mdash; {fundRequestHeader.tanggal}
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
                                                <span className="material-symbols-outlined text-primary">request_quote</span>
                                                <h3 className="font-bold text-slate-800">Informasi Permintaan Dana</h3>
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
                                                            defaultValue={fundRequestHeader.pengajuanNo}
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

                                                {/* Kode Akun */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Kode Akun
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormSelect
                                                            value={kodeAkun}
                                                            onChange={(e) => setKodeAkun(e.target.value)}
                                                            className="w-full max-w-lg"
                                                        >
                                                            {kodeAkunOptions.map((opt) => (
                                                                <option key={opt.value} value={opt.value}>
                                                                    {opt.label}
                                                                </option>
                                                            ))}
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
                                                            placeholder="Keterangan permintaan dana..."
                                                        />
                                                    </div>
                                                </div>

                                                {/* Status */}
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                    <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                        Status
                                                    </label>
                                                    <div className="sm:col-span-3">
                                                        <FormInput
                                                            defaultValue={fundRequestHeader.status}
                                                            className="w-40"
                                                            readOnly
                                                        />
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
                                                <h3 className="font-bold text-slate-800">Ringkasan</h3>
                                            </div>
                                            <div className="p-4 md:p-6 space-y-3">
                                                {[
                                                    { label: "No. Pengajuan", value: fundRequestHeader.pengajuanNo },
                                                    { label: "Tanggal",       value: tanggal                       },
                                                    { label: "Kode Akun",     value: kodeAkun                     },
                                                    { label: "Status",        value: fundRequestHeader.status      },
                                                ].map((row) => (
                                                    <div key={row.label} className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">{row.label}</span>
                                                        <span className="font-semibold text-slate-700">{row.value}</span>
                                                    </div>
                                                ))}
                                                <div className="pt-3 border-t border-slate-100">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-bold text-slate-900">Total Pengajuan</span>
                                                        <span className="text-base font-black text-primary">
                                                            {formatRupiah(allDetails.reduce((s, d) => s + d.jumlah, 0))}
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
                                                    <span className="material-symbols-outlined !text-sm">refresh</span> RESET
                                                </button>
                                                <button className="py-2 bg-white border border-slate-200 text-slate-600 rounded text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined !text-sm">help</span> INFO
                                                </button>
                                                <button className="col-span-2 py-2 bg-emerald-500 text-white rounded text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined !text-sm">verified</span> APPROVE
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Tab: Details ──────────────────────────────────────── */}
                        {activeTab === "details" && (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                {/* Detail Action Bar */}
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 shrink-0">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-800">
                                            :: Input Detail Pencatatan Permintaan Dana {fundRequestHeader.pengajuanNo}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {allDetails.length} baris detail bukti
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MultiFilter fields={DETAIL_FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                        <Link
                                            href="/accounting/fund-request/1/new"
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
                                            <h3 className="font-bold text-slate-800">Total Permintaan Dana</h3>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-500">Total Jumlah</span>
                                            <span className="text-base font-black text-primary">{formatRupiah(totalJumlah)}</span>
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
