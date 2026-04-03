"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";
import DataTable, { Column } from "../../components/DataTable";

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

const FILTER_FIELDS: FilterField[] = [
    { key: "noPO", label: "No. PO", type: "text" },
    { key: "pemasok", label: "Pemasok", type: "text" },
    {
        key: "tipe", label: "Tipe", type: "select", options: [
            { label: "Lokal", value: "Lokal" },
            { label: "Luar Negeri", value: "Luar Negeri" },
        ]
    },
    {
        key: "status", label: "Status", type: "select", options: [
            { label: "Approved", value: "Approved" },
            { label: "Pending", value: "Pending" },
            { label: "Draft", value: "Draft" },
        ]
    },
];

export default function PurchaseOrderListPage() {
    const [filteredOrders, setFilteredOrders] = useState<PurchaseOrder[]>(purchaseOrders);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredOrders(purchaseOrders);
            return;
        }

        const result = purchaseOrders.filter((po) => {
            return rules.every((rule) => {
                const { field, operator, value } = rule;
                const poValue = po[field as keyof PurchaseOrder];
                if (poValue === undefined) return true;

                const poStr = String(poValue).toLowerCase();
                const valStr = value.toLowerCase();

                switch (operator) {
                    case "contains":
                        return poStr.includes(valStr);
                    case "equals":
                        return poStr === valStr;
                    case "not_equals":
                        return poStr !== valStr;
                    case "starts_with":
                        return poStr.startsWith(valStr);
                    case "ends_with":
                        return poStr.endsWith(valStr);
                    default:
                        return true;
                }
            });
        });
        setFilteredOrders(result);
    };

    const columns: Column<PurchaseOrder>[] = [
        {
            header: "No. PO",
            key: "noPO",
            render: (po) => (
                <Link
                    href={`/purchase-order/${po.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {po.noPO}
                </Link>
            ),
        },
        { header: "Tanggal", key: "tanggal", render: (po) => <span className="text-sm">{po.tanggal}</span> },
        { header: "Pemasok", key: "pemasok", render: (po) => <span className="text-sm font-medium">{po.pemasok}</span> },
        { header: "Tipe", key: "tipe", render: (po) => <span className="text-sm">{po.tipe}</span> },
        { header: "Total", key: "total", render: (po) => <span className="text-sm font-bold">{po.total}</span> },
        {
            header: "Status",
            key: "status",
            render: (po) => (
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[po.status]}`}
                >
                    {po.status}
                </span>
            ),
        },
        {
            header: "Aksi",
            key: "aksi",
            align: "right",
            render: (po) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/purchase-order/${po.id}`}
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

    const renderMobileCard = (po: PurchaseOrder) => (
        <div className="p-4 space-y-3">
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
                                    Daftar Pemesanan Pembelian
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola dan pantau semua pesanan pembelian operasional Anda.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                {/* <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-primary/10 rounded-lg text-sm font-semibold hover:bg-primary/5 transition-colors">
                                    <span className="material-symbols-outlined text-lg">
                                        description
                                    </span>
                                    Export PDF
                                </button> */}
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
