"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../../components/MultiFilter";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaymentAllocation {
    id: string;
    noTransaksi: string;
    tanggal: string;
    pemasok: string;
    status: "Approved" | "Pending" | "Draft";
    akunBank: string;
    catatan: string;
    mataUang: string;
    jumlah: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const paymentAllocations: PaymentAllocation[] = [
    {
        id: "APP2207-0001",
        noTransaksi: "APP 2207-0001",
        tanggal: "2022-07-01",
        pemasok: "UNILEVER - U.0001",
        status: "Approved",
        akunBank: "BCA 194-398-7878",
        catatan: "",
        mataUang: "RP",
        jumlah: 550152.90,
    },
    {
        id: "APP2206-0001",
        noTransaksi: "APP 2206-0001",
        tanggal: "2022-06-30",
        pemasok: "UNILEVER - U.0001",
        status: "Approved",
        akunBank: "BCA 194-398-7878",
        catatan: "",
        mataUang: "RP",
        jumlah: 1528798.47,
    },
    {
        id: "APP1912-0006",
        noTransaksi: "APP 1912-0006",
        tanggal: "2019-12-24",
        pemasok: "CV. CITRA HARAPAN JAYA - C.0017",
        status: "Approved",
        akunBank: "BCA 194-448-7878",
        catatan: "TRANSFER",
        mataUang: "RP",
        jumlah: 113850000.00,
    },
    {
        id: "APP1912-0005",
        noTransaksi: "APP 1912-0005",
        tanggal: "2019-12-23",
        pemasok: "CARREFOUR PURI INDAH - C.0005",
        status: "Approved",
        akunBank: "BCA 194-448-7878",
        catatan: "TRANSFER",
        mataUang: "RP",
        jumlah: 160200000.00,
    },
    {
        id: "APP1912-0004",
        noTransaksi: "APP 1912-0004",
        tanggal: "2019-12-20",
        pemasok: "WAHANA INDAH SURYA BAHARI, PT - W.0001",
        status: "Approved",
        akunBank: "BCA 194-448-7878",
        catatan: "TRANSFER",
        mataUang: "RP",
        jumlah: 617357232.00,
    },
    {
        id: "APP1912-0003",
        noTransaksi: "APP 1912-0003",
        tanggal: "2019-12-16",
        pemasok: "CARREFOUR DENPASAR - C.0016",
        status: "Approved",
        akunBank: "BCA 194-448-7878",
        catatan: "TRANSFER",
        mataUang: "RP",
        jumlah: 332039600.00,
    },
    {
        id: "APP1912-0002",
        noTransaksi: "APP 1912-0002",
        tanggal: "2019-12-12",
        pemasok: "UNILEVER - U.0001",
        status: "Approved",
        akunBank: "BCA 194-448-7878",
        catatan: "TRANSFER",
        mataUang: "RP",
        jumlah: 2000000000.00,
    },
    {
        id: "APP1912-0001",
        noTransaksi: "APP 1912-0001",
        tanggal: "2019-12-12",
        pemasok: "UNILEVER - U.0001",
        status: "Approved",
        akunBank: "BCA 194-448-7878",
        catatan: "TRANSFER",
        mataUang: "RP",
        jumlah: 3000000000.00,
    },
    {
        id: "APP1911-0005",
        noTransaksi: "APP 1911-0005",
        tanggal: "2019-11-14",
        pemasok: "UNILEVER - U.0001",
        status: "Approved",
        akunBank: "BCA 194-448-7878",
        catatan: "TRANSFER",
        mataUang: "RP",
        jumlah: 2000000000.00,
    },
    {
        id: "APP1911-0004",
        noTransaksi: "APP 1911-0004",
        tanggal: "2019-11-14",
        pemasok: "UNILEVER - U.0001",
        status: "Approved",
        akunBank: "BCA 194-448-7878",
        catatan: "TRANSFER",
        mataUang: "RP",
        jumlah: 3000000000.00,
    },
    {
        id: "APP1911-0003",
        noTransaksi: "APP 1911-0003",
        tanggal: "2019-11-04",
        pemasok: "UNILEVER - U.0001",
        status: "Approved",
        akunBank: "BCA 194-448-7878",
        catatan: "TRANSFER",
        mataUang: "RP",
        jumlah: 2000000000.00,
    },
    {
        id: "APP1911-0002",
        noTransaksi: "APP 1911-0002",
        tanggal: "2019-11-04",
        pemasok: "UNILEVER - U.0001",
        status: "Approved",
        akunBank: "BCA 194-448-7878",
        catatan: "TRANSFER",
        mataUang: "RP",
        jumlah: 3000000000.00,
    },
    {
        id: "APP1911-0001",
        noTransaksi: "APP 1911-0001",
        tanggal: "2019-11-04",
        pemasok: "UNILEVER - U.0001",
        status: "Approved",
        akunBank: "BCA 194-448-7878",
        catatan: "TRANSFER",
        mataUang: "RP",
        jumlah: 3000000000.00,
    },
    {
        id: "APP1910-0005",
        noTransaksi: "APP 1910-0005",
        tanggal: "2019-10-15",
        pemasok: "MANDALA DHARMA KRIDA, PT - M.0001",
        status: "Approved",
        akunBank: "BCA 194-448-7878",
        catatan: "TRANSFER",
        mataUang: "RP",
        jumlah: 12149000.00,
    },
    {
        id: "APP1910-0004",
        noTransaksi: "APP 1910-0004",
        tanggal: "2019-10-14",
        pemasok: "MANDALA DHARMA KRIDA, PT - M.0001",
        status: "Approved",
        akunBank: "BCA 194-448-7878",
        catatan: "TRANSFER",
        mataUang: "RP",
        jumlah: 317375204.31,
    },
    {
        id: "APP1910-0003",
        noTransaksi: "APP 1910-0003",
        tanggal: "2019-10-14",
        pemasok: "UNILEVER - U.0001",
        status: "Approved",
        akunBank: "BCA 194-448-7878",
        catatan: "TRANSFER",
        mataUang: "RP",
        jumlah: 2000000000.00,
    },
    {
        id: "APP1910-0002",
        noTransaksi: "APP 1910-0002",
        tanggal: "2019-10-14",
        pemasok: "UNILEVER - U.0001",
        status: "Approved",
        akunBank: "BCA 194-448-7878",
        catatan: "TRANSFER",
        mataUang: "RP",
        jumlah: 3000000000.00,
    },
    {
        id: "APP1910-0001",
        noTransaksi: "APP 1910-0001",
        tanggal: "2019-10-01",
        pemasok: "MANDALA DHARMA KRIDA, PT - M.0001",
        status: "Approved",
        akunBank: "BCA 194-448-7878",
        catatan: "TRANSFER",
        mataUang: "RP",
        jumlah: 198562715.00,
    },
    {
        id: "APP1909-0009",
        noTransaksi: "APP 1909-0009",
        tanggal: "2019-09-24",
        pemasok: "UNILEVER - U.0001",
        status: "Approved",
        akunBank: "BCA 194-448-7878",
        catatan: "TRANSFER",
        mataUang: "RP",
        jumlah: 1000000000.00,
    },
    {
        id: "APP1909-0008",
        noTransaksi: "APP 1909-0008",
        tanggal: "2019-09-24",
        pemasok: "UNILEVER - U.0001",
        status: "Approved",
        akunBank: "BCA 194-448-7878",
        catatan: "TRANSFER",
        mataUang: "RP",
        jumlah: 3000000000.00,
    },
];

// ─── Status Styles ────────────────────────────────────────────────────────────

const statusStyles: Record<PaymentAllocation["status"], string> = {
    Approved: "bg-green-100 text-green-800",
    Pending:  "bg-yellow-100 text-yellow-800",
    Draft:    "bg-slate-100 text-slate-800",
};

// ─── Filter Fields ────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
    { key: "noTransaksi", label: "No. Transaksi", type: "text" },
    { key: "pemasok",     label: "Pemasok",       type: "text" },
    { key: "akunBank",    label: "Akun Bank",     type: "text" },
    { key: "catatan",     label: "Catatan",        type: "text" },
    { key: "mataUang",    label: "Mata Uang",      type: "text" },
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

export default function PaymentAllocationListPage() {
    const [filteredData, setFilteredData] = useState<PaymentAllocation[]>(paymentAllocations);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(paymentAllocations);
            return;
        }
        const result = paymentAllocations.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof PaymentAllocation];
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
                    {/* Page Body */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-28 md:pb-8 space-y-4 md:space-y-8">
                        {/* Title and Actions */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                                    Alokasi Pembayaran Ke Pemasok
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola dan pantau semua alokasi pengeluaran pembayaran ke pemasok.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/finance/accounts-payable/payment-allocation/new"
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
                                                    href={`/finance/accounts-payable/payment-allocation/${item.id}`}
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
                                            <p className="text-sm font-medium text-slate-900">{item.pemasok}</p>
                                            <p className="text-xs text-slate-500">{item.akunBank}{item.catatan ? ` — ${item.catatan}` : ""}</p>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                            <span className="text-sm font-bold text-slate-900">
                                                {item.mataUang} {fmtCur(item.jumlah)}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <Link
                                                    href={`/finance/accounts-payable/payment-allocation/${item.id}`}
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
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Pemasok</th>
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
                                                        href={`/finance/accounts-payable/payment-allocation/${item.id}`}
                                                        className="font-semibold text-primary text-sm tracking-tight hover:underline"
                                                    >
                                                        {item.noTransaksi}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 text-sm">{item.tanggal}</td>
                                                <td className="px-6 py-4 text-sm font-medium">{item.pemasok}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[item.status]}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{item.akunBank}</td>
                                                <td className="px-6 py-4 text-sm text-slate-500">{item.catatan || "—"}</td>
                                                <td className="px-6 py-4 text-sm text-slate-500">{item.mataUang}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-right">{fmtCur(item.jumlah)}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/finance/accounts-payable/payment-allocation/${item.id}`}
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
