"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatusBar from "../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../components/MultiFilter";
import DataTable, { Column } from "../components/DataTable";

interface PurchaseRequest {
    id: string;
    noPRF: string;
    tanggal: string;
    requester: string;
    status: "Approved" | "Pending" | "Draft";
    keterangan: string;
    jumlah: string;
    alokasi: string;
}

const purchaseRequests: PurchaseRequest[] = [
    {
        id: "PRF2401-0005",
        noPRF: "PRF 2401-0005",
        tanggal: "2024-01-24",
        requester: "BEKASI SQUARE",
        status: "Approved",
        keterangan: "Pemesanan Pembe...",
        jumlah: "RP 0.00",
        alokasi: "RP 0.00",
    },
    {
        id: "PRF2401-0004",
        noPRF: "PRF 2401-0004",
        tanggal: "2024-01-24",
        requester: "TRIAL",
        status: "Approved",
        keterangan: "Pemesanan Pembe...",
        jumlah: "RP 1.10",
        alokasi: "RP 0.00",
    },
    {
        id: "PRF2401-0003",
        noPRF: "PRF 2401-0003",
        tanggal: "2024-01-23",
        requester: "TRIAL",
        status: "Draft",
        keterangan: "Pemesanan Pembe...",
        jumlah: "RP 3.30",
        alokasi: "RP 0.00",
    },
    {
        id: "PRF2401-0002",
        noPRF: "PRF 2401-0002",
        tanggal: "2024-01-22",
        requester: "TRIAL",
        status: "Draft",
        keterangan: "Pemesanan Pembe...",
        jumlah: "RP 0.00",
        alokasi: "RP 0.00",
    },
    {
        id: "PRF2401-0001",
        noPRF: "PRF 2401-0001",
        tanggal: "2024-01-22",
        requester: "TRIAL",
        status: "Approved",
        keterangan: "Pemesanan Pembe...",
        jumlah: "RP 0.00",
        alokasi: "RP 0.00",
    },
];

const statusStyles: Record<PurchaseRequest["status"], string> = {
    Approved: "bg-green-100 text-green-800",
    Pending:  "bg-yellow-100 text-yellow-800",
    Draft:    "bg-slate-100 text-slate-800",
};

const FILTER_FIELDS: FilterField[] = [
    { key: "noPRF", label: "No. PRF", type: "text" },
    { key: "requester", label: "Requester", type: "text" },
    {
        key: "status", label: "Status", type: "select", options: [
            { label: "Approved", value: "Approved" },
            { label: "Pending", value: "Pending" },
            { label: "Draft", value: "Draft" },
        ],
    },
    { key: "keterangan", label: "Keterangan", type: "text" },
];

export default function PurchaseRequestListPage() {
    const [filteredData, setFilteredData] = useState<PurchaseRequest[]>(purchaseRequests);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(purchaseRequests);
            return;
        }
        const result = purchaseRequests.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof PurchaseRequest];
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
        setFilteredData(result);
    };

    const columns: Column<PurchaseRequest>[] = [
        {
            header: "PRF No.",
            key: "noPRF",
            render: (prf) => (
                <Link
                    href={`/purchase-request/${prf.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {prf.noPRF}
                </Link>
            ),
        },
        {
            header: "Tanggal",
            key: "tanggal",
            render: (prf) => <span className="text-sm">{prf.tanggal}</span>,
        },
        {
            header: "Requester",
            key: "requester",
            render: (prf) => <span className="text-sm font-medium">{prf.requester}</span>,
        },
        {
            header: "Status",
            key: "status",
            render: (prf) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[prf.status]}`}>
                    {prf.status}
                </span>
            ),
        },
        {
            header: "Keterangan",
            key: "keterangan",
            render: (prf) => (
                <span className="text-sm text-slate-500 max-w-[160px] truncate block">{prf.keterangan}</span>
            ),
        },
        {
            header: "Jumlah",
            key: "jumlah",
            render: (prf) => <span className="text-sm font-bold">{prf.jumlah}</span>,
        },
        {
            header: "Alokasi",
            key: "alokasi",
            render: (prf) => <span className="text-sm font-bold text-primary">{prf.alokasi}</span>,
        },
        {
            header: "Aksi",
            key: "aksi",
            align: "right",
            render: (prf) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/purchase-request/${prf.id}`}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                        title="Edit"
                    >
                        <span className="material-symbols-outlined text-lg">edit_square</span>
                    </Link>
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

    const renderMobileCard = (prf: PurchaseRequest) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        href={`/purchase-request/${prf.id}`}
                        className="font-semibold text-primary text-sm hover:underline"
                    >
                        {prf.noPRF}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{prf.tanggal}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[prf.status]}`}>
                    {prf.status}
                </span>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-900">{prf.requester}</p>
                <p className="text-xs text-slate-500 truncate">{prf.keterangan}</p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <div>
                    <p className="text-xs text-slate-400">Jumlah</p>
                    <span className="text-sm font-bold text-slate-900">{prf.jumlah}</span>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400">Alokasi</p>
                    <span className="text-sm font-bold text-primary">{prf.alokasi}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Link
                        href={`/purchase-request/${prf.id}`}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-base">edit_square</span>
                    </Link>
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
                                    Daftar Permintaan Pembelian
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola dan pantau semua permintaan pembelian barang.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/purchase-request/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah PRF Baru
                                </Link>
                            </div>
                        </div>

                        {/* Table Container */}
                        <DataTable
                            data={filteredData}
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
