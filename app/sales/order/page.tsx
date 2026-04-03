"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";
import DataTable, { Column } from "../../components/DataTable";

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

const FILTER_FIELDS: FilterField[] = [
    { key: "noSO", label: "No. SO", type: "text" },
    { key: "pelanggan", label: "Pelanggan", type: "text" },
    { key: "wilayah", label: "Wilayah", type: "text" },
    {
        key: "status",
        label: "Status",
        type: "select",
        options: [
            { label: "Approved", value: "Approved" },
            { label: "Pending", value: "Pending" },
            { label: "Draft", value: "Draft" },
        ],
    },
];

export default function SalesOrderListPage() {
    const [filteredOrders, setFilteredOrders] = useState<SalesOrder[]>(salesOrders);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredOrders(salesOrders);
            return;
        }
        const result = salesOrders.filter((so) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const soValue = so[field as keyof SalesOrder];
                if (soValue === undefined) return true;
                const soStr = String(soValue).toLowerCase();
                const valStr = value.toLowerCase();
                switch (operator) {
                    case "contains":    return soStr.includes(valStr);
                    case "equals":      return soStr === valStr;
                    case "not_equals":  return soStr !== valStr;
                    case "starts_with": return soStr.startsWith(valStr);
                    case "ends_with":   return soStr.endsWith(valStr);
                    default:            return true;
                }
            })
        );
        setFilteredOrders(result);
    };

    const columns: Column<SalesOrder>[] = [
        {
            header: "No. SO",
            key: "noSO",
            render: (so) => (
                <Link
                    href={`/sales/order/${so.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {so.noSO}
                </Link>
            ),
        },
        {
            header: "Tanggal",
            key: "tanggal",
            render: (so) => <span className="text-sm">{so.tanggal}</span>,
        },
        {
            header: "Pelanggan",
            key: "pelanggan",
            render: (so) => <span className="text-sm font-medium">{so.pelanggan}</span>,
        },
        {
            header: "Wilayah",
            key: "wilayah",
            render: (so) => <span className="text-sm">{so.wilayah}</span>,
        },
        {
            header: "Total",
            key: "total",
            render: (so) => <span className="text-sm font-bold">{so.total}</span>,
        },
        {
            header: "Status",
            key: "status",
            render: (so) => (
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[so.status]}`}
                >
                    {so.status}
                </span>
            ),
        },
        {
            header: "Aksi",
            key: "aksi",
            align: "right",
            render: (so) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/sales/order/${so.id}`}
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
            ),
        },
    ];

    const renderMobileCard = (so: SalesOrder) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        href={`/sales/order/${so.id}`}
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
                        href={`/sales/order/${so.id}`}
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
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/sales/order/new"
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
                        <DataTable
                            data={filteredOrders}
                            columns={columns}
                            keyField="id"
                            renderMobileCard={renderMobileCard}
                        />
                    </div>
                </section>
            </main>

            {/* Footer StatusBar */}
            <StatusBar />
        </div>
    );
}
