"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatusBar from "../components/StatusBar";

interface SalesOrder {
    id: string;
    noSO: string;
    tanggal: string;
    pelanggan: string;
    wilayah: string;
    total: string;
    status: "Approved" | "Pending" | "Draft";
}

const salesOrders: SalesOrder[] = [
    {
        id: "SOJ2603-0001",
        noSO: "SOJ 2603-0001",
        tanggal: "09/03/2026",
        pelanggan: "TOKO MAKMUR JAYA",
        wilayah: "Jakarta Selatan",
        total: "IDR 28.500.000,00",
        status: "Approved",
    },
    {
        id: "SOJ2603-0002",
        noSO: "SOJ 2603-0002",
        tanggal: "09/03/2026",
        pelanggan: "CV SUMBER BERKAH",
        wilayah: "Bandung",
        total: "IDR 15.750.000,00",
        status: "Pending",
    },
    {
        id: "SOJ2603-0003",
        noSO: "SOJ 2603-0003",
        tanggal: "08/03/2026",
        pelanggan: "PT MITRA SENTOSA",
        wilayah: "Surabaya",
        total: "IDR 67.200.000,00",
        status: "Approved",
    },
    {
        id: "SOJ2603-0004",
        noSO: "SOJ 2603-0004",
        tanggal: "08/03/2026",
        pelanggan: "UD HARAPAN BARU",
        wilayah: "Denpasar",
        total: "IDR 9.350.000,00",
        status: "Draft",
    },
    {
        id: "SOJ2603-0005",
        noSO: "SOJ 2603-0005",
        tanggal: "07/03/2026",
        pelanggan: "TOKO SEJAHTERA",
        wilayah: "Semarang",
        total: "IDR 22.800.000,00",
        status: "Pending",
    },
];

const statusStyles: Record<SalesOrder["status"], string> = {
    Approved: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Draft: "bg-slate-100 text-slate-800",
};

export default function SalesOrderListPage() {
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
                                    Daftar Pesanan Penjualan
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola dan pantau semua pesanan penjualan Anda.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-primary/10 rounded-lg text-sm font-semibold hover:bg-primary/5 transition-colors">
                                    <span className="material-symbols-outlined text-lg">
                                        filter_list
                                    </span>
                                    Filter
                                </button>
                                <Link
                                    href="/sales/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">
                                        add_circle
                                    </span>
                                    Tambah Pesanan Baru
                                </Link>
                            </div>
                        </div>

                        {/* Table Container */}
                        <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden">
                            {/* Mobile Card View */}
                            <div className="block md:hidden divide-y divide-primary/5">
                                {salesOrders.map((so) => (
                                    <div key={so.id} className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Link
                                                    href={`/sales/${so.id}`}
                                                    className="font-semibold text-primary text-sm hover:underline"
                                                >
                                                    {so.noSO}
                                                </Link>
                                                <p className="text-xs text-slate-500 mt-0.5">{so.tanggal}</p>
                                            </div>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[so.status]}`}
                                            >
                                                {so.status}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{so.pelanggan}</p>
                                            <p className="text-xs text-slate-500">{so.wilayah}</p>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                            <span className="text-sm font-bold text-slate-900">{so.total}</span>
                                            <div className="flex items-center gap-1">
                                                <Link
                                                    href={`/sales/${so.id}`}
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
                                                No. SO
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Tanggal
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Pelanggan
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Wilayah
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
                                        {salesOrders.map((so) => (
                                            <tr
                                                key={so.id}
                                                className="hover:bg-primary/5 transition-colors cursor-pointer"
                                            >
                                                <td className="px-6 py-4">
                                                    <Link
                                                        href={`/sales/${so.id}`}
                                                        className="font-semibold text-primary text-sm tracking-tight hover:underline"
                                                    >
                                                        {so.noSO}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 text-sm">{so.tanggal}</td>
                                                <td className="px-6 py-4 text-sm font-medium">
                                                    {so.pelanggan}
                                                </td>
                                                <td className="px-6 py-4 text-sm">{so.wilayah}</td>
                                                <td className="px-6 py-4 text-sm font-bold">
                                                    {so.total}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[so.status]}`}
                                                    >
                                                        {so.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/sales/${so.id}`}
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
                                    Menampilkan 1 sampai 5 dari 40 data
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
                                        8
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
