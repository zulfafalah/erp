"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../../components/MultiFilter";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaymentAllocationAR {
    id: string;
    noTransaksi: string;
    tanggal: string;
    pelanggan: string;
    status: "Approved" | "Pending" | "Draft";
    akunBank: string;
    catatan: string;
    mataUang: string;
    jumlah: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const allData: PaymentAllocationAR[] = [
    {
        id: "ARS2604-0001",
        noTransaksi: "ARS 2604-0001",
        tanggal: "2026-04-10",
        pelanggan: "AYU - A.0026",
        status: "Approved",
        akunBank: "BCA 194-398-7878",
        catatan: "",
        mataUang: "RP",
        jumlah: 327971.70,
    },
    {
        id: "ARS2309-0001",
        noTransaksi: "ARS 2309-0001",
        tanggal: "2023-09-08",
        pelanggan: "ABUN - A.0003",
        status: "Approved",
        akunBank: "BCA 194-398-7878",
        catatan: "",
        mataUang: "RP",
        jumlah: 6000.00,
    },
    {
        id: "ARS2107-0001",
        noTransaksi: "ARS 2107-0001",
        tanggal: "2021-07-06",
        pelanggan: "DAMAS KARYA ABADI, PT - D.0008",
        status: "Approved",
        akunBank: "BCA 194-398-7878",
        catatan: "",
        mataUang: "RP",
        jumlah: 15000000.01,
    },
    {
        id: "ARS1912-0153",
        noTransaksi: "ARS 1912-0153",
        tanggal: "2019-12-17",
        pelanggan: "BERSATU INDAH GEMILANG,CV - B.0005",
        status: "Approved",
        akunBank: "BCA 194-398-7878",
        catatan: "SIL.1911.0100",
        mataUang: "RP",
        jumlah: 223148000.00,
    },
    {
        id: "ARS1912-0152",
        noTransaksi: "ARS 1912-0152",
        tanggal: "2019-12-31",
        pelanggan: "AKA - A.0040",
        status: "Approved",
        akunBank: "BCA 194-398-7878",
        catatan: "SIL.1912.0139",
        mataUang: "RP",
        jumlah: 122785000.00,
    },
    {
        id: "ARS1912-0151",
        noTransaksi: "ARS 1912-0151",
        tanggal: "2019-12-31",
        pelanggan: "ROBERT SERANG - R.0004",
        status: "Approved",
        akunBank: "BCA 194-398-7878",
        catatan: "SIL.1912.0105",
        mataUang: "RP",
        jumlah: 46890000.00,
    },
    {
        id: "ARS1912-0150",
        noTransaksi: "ARS 1912-0150",
        tanggal: "2019-12-30",
        pelanggan: "NURMALA - N.0001",
        status: "Approved",
        akunBank: "BCA 194-398-7878",
        catatan: "SIL.1912.0022",
        mataUang: "RP",
        jumlah: 57350000.00,
    },
    {
        id: "ARS1912-0149",
        noTransaksi: "ARS 1912-0149",
        tanggal: "2019-12-30",
        pelanggan: "SANDRY - S.0001",
        status: "Approved",
        akunBank: "BCA 194-398-7878",
        catatan: "SIL.1912.0103",
        mataUang: "RP",
        jumlah: 74600000.00,
    },
    {
        id: "ARS1912-0148",
        noTransaksi: "ARS 1912-0148",
        tanggal: "2019-12-30",
        pelanggan: "MURITRD - M.0026",
        status: "Approved",
        akunBank: "BCA 194-398-7878",
        catatan: "SIL.1912.0106",
        mataUang: "RP",
        jumlah: 48805000.00,
    },
    {
        id: "ARS1912-0147",
        noTransaksi: "ARS 1912-0147",
        tanggal: "2019-12-30",
        pelanggan: "ADNAN - A.0007",
        status: "Approved",
        akunBank: "BCA 194-398-7878",
        catatan: "SIL.1912.0116",
        mataUang: "RP",
        jumlah: 43000000.00,
    },
    {
        id: "ARS1912-0146",
        noTransaksi: "ARS 1912-0146",
        tanggal: "2019-12-30",
        pelanggan: "JANI WIDJAJA - J.0001",
        status: "Approved",
        akunBank: "BCA 194-398-7878",
        catatan: "SIL.2001-0020;SIL.2001-0021;SIL.2001-0014;SIL.2001-0054;SIL.2001-0077",
        mataUang: "RP",
        jumlah: 85000000.00,
    },
    {
        id: "ARS1912-0145",
        noTransaksi: "ARS 1912-0145",
        tanggal: "2019-12-30",
        pelanggan: "HANDI TAN - H.0007",
        status: "Approved",
        akunBank: "BCA 194-398-7878",
        catatan: "SIL.1912.0110",
        mataUang: "RP",
        jumlah: 52776000.00,
    },
    {
        id: "ARS1912-0144",
        noTransaksi: "ARS 1912-0144",
        tanggal: "2019-12-27",
        pelanggan: "BERSATU INDAH GEMILANG,CV - B.0005",
        status: "Approved",
        akunBank: "BCA 194-398-7878",
        catatan: "SIL.1912.0016",
        mataUang: "RP",
        jumlah: 355093000.00,
    },
    {
        id: "ARS1912-0143",
        noTransaksi: "ARS 1912-0143",
        tanggal: "2019-12-27",
        pelanggan: "YENNY - Y.0006",
        status: "Approved",
        akunBank: "BCA 194-398-7878",
        catatan: "SIL.1912.0118",
        mataUang: "RP",
        jumlah: 64000000.00,
    },
    {
        id: "ARS1912-0142",
        noTransaksi: "ARS 1912-0142",
        tanggal: "2019-12-27",
        pelanggan: "KAROLINA - K.0007",
        status: "Approved",
        akunBank: "BCA 194-398-7878",
        catatan: "SIL.1912.0101",
        mataUang: "RP",
        jumlah: 19800000.00,
    },
    {
        id: "ARS1912-0141",
        noTransaksi: "ARS 1912-0141",
        tanggal: "2019-12-27",
        pelanggan: "DARLICHE JAYA - D.0002",
        status: "Approved",
        akunBank: "BCA 194-398-7878",
        catatan: "SIL.1912.0097",
        mataUang: "RP",
        jumlah: 4830000.00,
    },
    {
        id: "ARS1912-0140",
        noTransaksi: "ARS 1912-0140",
        tanggal: "2019-12-27",
        pelanggan: "ASIONG - A.0033",
        status: "Approved",
        akunBank: "BCA 194-398-7878",
        catatan: "SIL.1912.0138",
        mataUang: "RP",
        jumlah: 3420000.00,
    },
    {
        id: "ARS1912-0139",
        noTransaksi: "ARS 1912-0139",
        tanggal: "2019-12-27",
        pelanggan: "ASIONG - A.0033",
        status: "Approved",
        akunBank: "BCA 194-398-7878",
        catatan: "SIL.1912.0078",
        mataUang: "RP",
        jumlah: 45959000.00,
    },
    {
        id: "ARS1912-0138",
        noTransaksi: "ARS 1912-0138",
        tanggal: "2019-12-27",
        pelanggan: "ASIONG - A.0033",
        status: "Approved",
        akunBank: "BCA 194-398-7878",
        catatan: "SIL.1912.0073",
        mataUang: "RP",
        jumlah: 5125000.00,
    },
    {
        id: "ARS1912-0137",
        noTransaksi: "ARS 1912-0137",
        tanggal: "2019-12-27",
        pelanggan: "ASIONG - A.0033",
        status: "Approved",
        akunBank: "BCA 194-398-7878",
        catatan: "SIL.1912.0059",
        mataUang: "RP",
        jumlah: 78008000.00,
    },
];

// ─── Status Styles ────────────────────────────────────────────────────────────

const statusStyles: Record<PaymentAllocationAR["status"], string> = {
    Approved: "bg-green-100 text-green-800",
    Pending:  "bg-yellow-100 text-yellow-800",
    Draft:    "bg-slate-100 text-slate-800",
};

// ─── Filter Fields ────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
    { key: "noTransaksi", label: "No. Transaksi", type: "text" },
    { key: "pelanggan",   label: "Pelanggan",      type: "text" },
    { key: "akunBank",    label: "Akun Bank",      type: "text" },
    { key: "catatan",     label: "Catatan",         type: "text" },
    { key: "mataUang",    label: "Mata Uang",       type: "text" },
    {
        key: "status",
        label: "Status",
        type: "select",
        options: [
            { label: "Approved", value: "Approved" },
            { label: "Pending",  value: "Pending" },
            { label: "Draft",    value: "Draft" },
        ],
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCur = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PaymentAllocationARListPage() {
    const [filteredData, setFilteredData] = useState<PaymentAllocationAR[]>(allData);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(allData);
            return;
        }
        const result = allData.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof PaymentAllocationAR];
                if (itemValue === undefined) return true;
                const itemStr = String(itemValue).toLowerCase();
                const valStr  = value.toLowerCase();
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
        setFilteredData(result);
    };

    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            {/* Top Navigation Bar */}
            <Navbar />

            <main className="flex-1 flex overflow-hidden">
                {/* Sidebar Navigation */}
                <Sidebar />

                {/* Main Content Area */}
                <section className="flex-1 flex flex-col bg-background-light overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-28 md:pb-8 space-y-4 md:space-y-8">
                        {/* Title and Actions */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                                    Alokasi Penerimaan Pembayaran Dari Pelanggan
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola dan pantau semua alokasi penerimaan pembayaran dari pelanggan.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/finance/accounts-receivable/payment-allocation/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Alokasi Baru
                                </Link>
                            </div>
                        </div>

                        {/* Table Container */}
                        <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden">
                            {/* Mobile Card View */}
                            <div className="block md:hidden divide-y divide-primary/5">
                                {filteredData.map((item) => (
                                    <div key={item.id} className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Link
                                                    href={`/finance/accounts-receivable/payment-allocation/${item.id}`}
                                                    className="font-semibold text-primary text-sm hover:underline"
                                                >
                                                    {item.noTransaksi}
                                                </Link>
                                                <p className="text-xs text-slate-500 mt-0.5">{item.tanggal}</p>
                                            </div>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[item.status]}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{item.pelanggan}</p>
                                            <p className="text-xs text-slate-500">{item.akunBank}{item.catatan ? ` — ${item.catatan}` : ""}</p>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                            <span className="text-sm font-bold text-slate-900">
                                                {item.mataUang} {fmtCur(item.jumlah)}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <Link
                                                    href={`/finance/accounts-receivable/payment-allocation/${item.id}`}
                                                    className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-base">edit_square</span>
                                                </Link>
                                                <button className="p-1.5 text-slate-400 hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined text-base">print</span>
                                                </button>
                                                <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                                                    <span className="material-symbols-outlined text-base">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-primary/10">
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">#</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Transaksi #</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Tanggal</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Pelanggan</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Akun Bank</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Catatan</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Mata Uang</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Jumlah</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-primary/5">
                                        {filteredData.map((item, idx) => (
                                            <tr key={item.id} className="hover:bg-primary/5 transition-colors cursor-pointer">
                                                <td className="px-6 py-4 text-sm text-slate-500">{idx + 1}</td>
                                                <td className="px-6 py-4">
                                                    <Link
                                                        href={`/finance/accounts-receivable/payment-allocation/${item.id}`}
                                                        className="font-semibold text-primary text-sm tracking-tight hover:underline"
                                                    >
                                                        {item.noTransaksi}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 text-sm">{item.tanggal}</td>
                                                <td className="px-6 py-4 text-sm font-medium">{item.pelanggan}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[item.status]}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{item.akunBank}</td>
                                                <td className="px-6 py-4 text-sm text-slate-500 max-w-[200px] truncate" title={item.catatan}>{item.catatan || "—"}</td>
                                                <td className="px-6 py-4 text-sm text-slate-500">{item.mataUang}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-right">{fmtCur(item.jumlah)}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/finance/accounts-receivable/payment-allocation/${item.id}`}
                                                            className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                                            title="View/Edit"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">edit_square</span>
                                                        </Link>
                                                        <button
                                                            className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                                            title="Print"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">print</span>
                                                        </button>
                                                        <button
                                                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-4 md:px-6 py-4 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                                <p className="text-sm text-slate-500 text-center md:text-left">
                                    Menampilkan 1 sampai {Math.min(20, filteredData.length)} dari {filteredData.length} data
                                </p>
                                <div className="flex flex-wrap justify-center items-center gap-1">
                                    <button className="p-2 border border-primary/10 rounded hover:bg-white disabled:opacity-50" disabled>
                                        <span className="material-symbols-outlined text-lg">chevron_left</span>
                                    </button>
                                    <button className="px-3 py-1 bg-primary text-white rounded text-sm font-bold">1</button>
                                    <button className="px-3 py-1 hover:bg-white text-sm font-medium rounded transition-colors">2</button>
                                    <button className="px-3 py-1 hover:bg-white text-sm font-medium rounded transition-colors">3</button>
                                    <span className="px-2 text-slate-400">...</span>
                                    <button className="p-2 border border-primary/10 rounded hover:bg-white">
                                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer StatusBar */}
            <StatusBar />
        </div>
    );
}
