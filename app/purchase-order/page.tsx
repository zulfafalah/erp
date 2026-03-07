"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatusBar from "../components/StatusBar";

interface PurchaseOrder {
    id: string;
    noPO: string;
    tanggal: string;
    pemasok: string;
    tipe: string;
    total: string;
    status: "Approved" | "Pending" | "Draft";
}

const purchaseOrders: PurchaseOrder[] = [
    {
        id: "POB2603-0001",
        noPO: "POB 2603-0001",
        tanggal: "07/03/2026",
        pemasok: "CARREFOUR DENPASAR",
        tipe: "Lokal",
        total: "IDR 13.875.000,00",
        status: "Approved",
    },
    {
        id: "POB2603-0002",
        noPO: "POB 2603-0002",
        tanggal: "07/03/2026",
        pemasok: "PT ABC INDONESIA",
        tipe: "Lokal",
        total: "IDR 5.200.000,00",
        status: "Pending",
    },
    {
        id: "POB2603-0003",
        noPO: "POB 2603-0003",
        tanggal: "06/03/2026",
        pemasok: "SINAR JAYA ABADI",
        tipe: "Lokal",
        total: "IDR 42.150.000,00",
        status: "Draft",
    },
    {
        id: "POB2603-0004",
        noPO: "POB 2603-0004",
        tanggal: "05/03/2026",
        pemasok: "GLOBAL LOGISTICS",
        tipe: "Luar Negeri",
        total: "IDR 215.000.000,00",
        status: "Approved",
    },
    {
        id: "POB2603-0005",
        noPO: "POB 2603-0005",
        tanggal: "05/03/2026",
        pemasok: "MEDIKA UTAMA",
        tipe: "Lokal",
        total: "IDR 8.900.000,00",
        status: "Pending",
    },
];

const statusStyles: Record<PurchaseOrder["status"], string> = {
    Approved:
        "bg-green-100 text-green-800",
    Pending:
        "bg-yellow-100 text-yellow-800",
    Draft:
        "bg-slate-100 text-slate-800",
};

export default function PurchaseOrderListPage() {
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
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-8">
                        {/* Title and Actions */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                                    Daftar Pemesanan Pembelian
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola dan pantau semua pesanan pembelian operasional Anda.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-primary/10 rounded-lg text-sm font-semibold hover:bg-primary/5 transition-colors">
                                    <span className="material-symbols-outlined text-lg">
                                        filter_list
                                    </span>
                                    Filter
                                </button>
                                <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-primary/10 rounded-lg text-sm font-semibold hover:bg-primary/5 transition-colors">
                                    <span className="material-symbols-outlined text-lg">
                                        description
                                    </span>
                                    Export PDF
                                </button>
                                <Link
                                    href="/purchase-order/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">
                                        add_circle
                                    </span>
                                    Tambah Pesanan Baru
                                </Link>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                            {/* Total Draft */}
                            <div className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Total Draft
                                    </p>
                                    <h3 className="text-2xl font-bold mt-1">12</h3>
                                    <p className="text-xs text-green-600 font-semibold mt-1 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">
                                            trending_up
                                        </span>{" "}
                                        +5% vs bulan lalu
                                    </p>
                                </div>
                                <div className="bg-slate-100 p-3 rounded-lg">
                                    <span className="material-symbols-outlined text-primary">
                                        edit_note
                                    </span>
                                </div>
                            </div>

                            {/* Total Approved */}
                            <div className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Total Approved
                                    </p>
                                    <h3 className="text-2xl font-bold mt-1">45</h3>
                                    <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">
                                            trending_down
                                        </span>{" "}
                                        -2% vs bulan lalu
                                    </p>
                                </div>
                                <div className="bg-slate-100 p-3 rounded-lg">
                                    <span className="material-symbols-outlined text-primary">
                                        verified
                                    </span>
                                </div>
                            </div>

                            {/* Total Nilai PO */}
                            <div className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Total Nilai PO Bulan Ini
                                    </p>
                                    <h3 className="text-2xl font-bold mt-1">
                                        IDR 1.250.000.000
                                    </h3>
                                    <p className="text-xs text-green-600 font-semibold mt-1 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">
                                            trending_up
                                        </span>{" "}
                                        +15% target
                                    </p>
                                </div>
                                <div className="bg-slate-100 p-3 rounded-lg">
                                    <span className="material-symbols-outlined text-primary">
                                        payments
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Table Container */}
                        <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden">
                            {/* Mobile Card View */}
                            <div className="block md:hidden divide-y divide-primary/5">
                                {purchaseOrders.map((po) => (
                                    <div key={po.id} className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Link
                                                    href={`/purchase-order/${po.id}`}
                                                    className="font-semibold text-primary text-sm hover:underline"
                                                >
                                                    {po.noPO}
                                                </Link>
                                                <p className="text-xs text-slate-500 mt-0.5">{po.tanggal}</p>
                                            </div>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[po.status]}`}
                                            >
                                                {po.status}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{po.pemasok}</p>
                                            <p className="text-xs text-slate-500">{po.tipe}</p>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                            <span className="text-sm font-bold text-slate-900">{po.total}</span>
                                            <div className="flex items-center gap-1">
                                                <Link
                                                    href={`/purchase-order/${po.id}`}
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
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                No. PO
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Tanggal
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Pemasok
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Tipe
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Total
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-primary/5">
                                        {purchaseOrders.map((po) => (
                                            <tr
                                                key={po.id}
                                                className="hover:bg-primary/5 transition-colors cursor-pointer"
                                            >
                                                <td className="px-6 py-4">
                                                    <Link
                                                        href={`/purchase-order/${po.id}`}
                                                        className="font-semibold text-primary text-sm tracking-tight hover:underline"
                                                    >
                                                        {po.noPO}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 text-sm">{po.tanggal}</td>
                                                <td className="px-6 py-4 text-sm font-medium">
                                                    {po.pemasok}
                                                </td>
                                                <td className="px-6 py-4 text-sm">{po.tipe}</td>
                                                <td className="px-6 py-4 text-sm font-bold">
                                                    {po.total}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[po.status]}`}
                                                    >
                                                        {po.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/purchase-order/${po.id}`}
                                                            className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                                            title="View/Edit"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">
                                                                edit_square
                                                            </span>
                                                        </Link>
                                                        <button
                                                            className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                                            title="Print"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">
                                                                print
                                                            </span>
                                                        </button>
                                                        <button
                                                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">
                                                                delete
                                                            </span>
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
                                    Menampilkan 1 sampai 5 dari 57 data
                                </p>
                                <div className="flex flex-wrap justify-center items-center gap-1">
                                    <button
                                        className="p-2 border border-primary/10 rounded hover:bg-white disabled:opacity-50"
                                        disabled
                                    >
                                        <span className="material-symbols-outlined text-lg">
                                            chevron_left
                                        </span>
                                    </button>
                                    <button className="px-3 py-1 bg-primary text-white rounded text-sm font-bold">
                                        1
                                    </button>
                                    <button className="px-3 py-1 hover:bg-white text-sm font-medium rounded transition-colors">
                                        2
                                    </button>
                                    <button className="px-3 py-1 hover:bg-white text-sm font-medium rounded transition-colors">
                                        3
                                    </button>
                                    <span className="px-2 text-slate-400">...</span>
                                    <button className="px-3 py-1 hover:bg-white text-sm font-medium rounded transition-colors">
                                        12
                                    </button>
                                    <button className="p-2 border border-primary/10 rounded hover:bg-white">
                                        <span className="material-symbols-outlined text-lg">
                                            chevron_right
                                        </span>
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
