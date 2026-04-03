"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";
import DataTable, { Column } from "../../components/DataTable";

interface PurchaseInvoice {
    id: string;
    outlet: string;
    noPO: string;
    noNota: string;
    tanggal: string;
    pemasok: string;
    keterangan: string;
    status: "Approved" | "Pending" | "Draft" | "Closed";
    currency: string;
    jumlah: number;
    totalBayar: number;
}

const purchaseInvoices: PurchaseInvoice[] = [
    {
        id: "PIV2401-0002",
        outlet: "GKPK",
        noPO: "POB 2401-0005",
        noNota: "PIV 2401-0002",
        tanggal: "2024-01-24",
        pemasok: "TRIAL",
        keterangan: "Nota Pembelian atas TRIAL",
        status: "Approved",
        currency: "RP",
        jumlah: 41000,
        totalBayar: 0,
    },
    {
        id: "PIV2401-0001",
        outlet: "GKPK",
        noPO: "POB 2401-0001",
        noNota: "PIV 2401-0001",
        tanggal: "2024-01-14",
        pemasok: "CHUP",
        keterangan: "Nota Pembelian atas CHUP",
        status: "Approved",
        currency: "RP",
        jumlah: 31157547,
        totalBayar: 0,
    },
    {
        id: "PIV2207-0001",
        outlet: "GKPK",
        noPO: "POB 2207-0001",
        noNota: "PIV 2207-0001",
        tanggal: "2022-07-01",
        pemasok: "UNILEVER",
        keterangan: "Nota Pembelian atas UNILEVER",
        status: "Approved",
        currency: "RP",
        jumlah: 550000,
        totalBayar: 550000,
    },
    {
        id: "PIV2206-0003",
        outlet: "GKPK",
        noPO: "POB 2206-0003",
        noNota: "PIV 2206-0003",
        tanggal: "2022-06-30",
        pemasok: "UNILEVER",
        keterangan: "Nota Pembelian atas UNILEVER",
        status: "Approved",
        currency: "RP",
        jumlah: 215961.32,
        totalBayar: 0,
    },
    {
        id: "PIV2206-0002",
        outlet: "GKPK",
        noPO: "POB 2206-0001",
        noNota: "PIV 2206-0002",
        tanggal: "2022-06-30",
        pemasok: "UNILEVER",
        keterangan: "Nota Pembelian atas UNILEVER",
        status: "Approved",
        currency: "RP",
        jumlah: 421205.73,
        totalBayar: 421205.73,
    },
    {
        id: "PIV2206-0001",
        outlet: "GKPK",
        noPO: "POB 2206-0001",
        noNota: "PIV 2206-0001",
        tanggal: "2022-06-30",
        pemasok: "UNILEVER",
        keterangan: "Nota Pembelian atas UNILEVER",
        status: "Approved",
        currency: "RP",
        jumlah: 1107592.74,
        totalBayar: 1107592.74,
    },
    {
        id: "PIV2107-0002",
        outlet: "GKPK",
        noPO: "POB 2107-0001",
        noNota: "PIV 2109-0002",
        tanggal: "2021-09-01",
        pemasok: "BEKASI SQUARE",
        keterangan: "Nota Pembelian atas BEKASI SQUARE",
        status: "Approved",
        currency: "RP",
        jumlah: 4843215.12,
        totalBayar: 0,
    },
    {
        id: "PIV2109-0001",
        outlet: "GKPK",
        noPO: "POB 2107-0001",
        noNota: "PIV 2109-0001",
        tanggal: "2021-09-01",
        pemasok: "BEKASI SQUARE",
        keterangan: "Nota Pembelian atas BEKASI SQUARE",
        status: "Approved",
        currency: "RP",
        jumlah: 4843215.12,
        totalBayar: 0,
    },
    {
        id: "PIV2107-0001",
        outlet: "GKPK",
        noPO: "POB 2107-0001",
        noNota: "PIV 2107-0001",
        tanggal: "2021-07-06",
        pemasok: "BEKASI SQUARE",
        keterangan: "Nota Pembelian atas BEKASI SQUARE",
        status: "Approved",
        currency: "RP",
        jumlah: 27443816.01,
        totalBayar: 0,
    },
    {
        id: "PIV2107-0001b",
        outlet: "GOOPC7",
        noPO: "POB 2107-0001",
        noNota: "PIV 2107-0001",
        tanggal: "2021-07-06",
        pemasok: "BEKASI SQUARE",
        keterangan: "Nota Pembelian dari BEKASI SQUARE",
        status: "Approved",
        currency: "RP",
        jumlah: 6860964,
        totalBayar: 0,
    },
    {
        id: "PIV2106-0001",
        outlet: "GOOPC7",
        noPO: "POB 2106-0001",
        noNota: "PIV 2106-0001",
        tanggal: "2021-06-30",
        pemasok: "CARREFOUR MATARAM",
        keterangan: "Nota Pembelian dari CARREFOUR MATARAM",
        status: "Approved",
        currency: "RP",
        jumlah: 17585818.97,
        totalBayar: 0,
    },
    {
        id: "PIV1912-0084",
        outlet: "GOOPA8",
        noPO: "POB 1912-0032",
        noNota: "PIV 1912-0084",
        tanggal: "2019-12-30",
        pemasok: "UNILEVER",
        keterangan: "Nota Pembelian atas UNILEVER",
        status: "Closed",
        currency: "RP",
        jumlah: 60201514.51,
        totalBayar: 0,
    },
    {
        id: "PIV1912-0083",
        outlet: "GOOPA8",
        noPO: "POB 1912-0032",
        noNota: "PIV 1912-0083",
        tanggal: "2019-12-30",
        pemasok: "UNILEVER",
        keterangan: "Nota Pembelian atas UNILEVER",
        status: "Closed",
        currency: "RP",
        jumlah: 209761374.6,
        totalBayar: 0,
    },
    {
        id: "PIV1912-0082",
        outlet: "GOOPA8",
        noPO: "POB 1912-0031",
        noNota: "PIV 1912-0082",
        tanggal: "2019-12-30",
        pemasok: "UNILEVER",
        keterangan: "Nota Pembelian atas UNILEVER",
        status: "Closed",
        currency: "RP",
        jumlah: 76429933.19,
        totalBayar: 0,
    },
    {
        id: "PIV1912-0081",
        outlet: "GOOPA8",
        noPO: "POB 1912-0031",
        noNota: "PIV 1912-0081",
        tanggal: "2019-12-30",
        pemasok: "UNILEVER",
        keterangan: "Nota Pembelian atas UNILEVER",
        status: "Closed",
        currency: "RP",
        jumlah: 209761373.8,
        totalBayar: 0,
    },
    {
        id: "PIV1912-0080",
        outlet: "GOOPA8",
        noPO: "POB 1912-0031",
        noNota: "PIV 1912-0080",
        tanggal: "2019-12-30",
        pemasok: "UNILEVER",
        keterangan: "Nota Pembelian atas UNILEVER",
        status: "Closed",
        currency: "RP",
        jumlah: 33771581.18,
        totalBayar: 0,
    },
    {
        id: "PIV1912-0079",
        outlet: "GOOPA8",
        noPO: "POB 1912-0030",
        noNota: "PIV 1912-0079",
        tanggal: "2019-12-30",
        pemasok: "UNILEVER",
        keterangan: "Nota Pembelian atas UNILEVER",
        status: "Closed",
        currency: "RP",
        jumlah: 149555859.8,
        totalBayar: 0,
    },
    {
        id: "PIV1912-0078",
        outlet: "GOOPA8",
        noPO: "POB 1912-0030",
        noNota: "PIV 1912-0078",
        tanggal: "2019-12-30",
        pemasok: "UNILEVER",
        keterangan: "Nota Pembelian atas UNILEVER",
        status: "Closed",
        currency: "RP",
        jumlah: 117571250.24,
        totalBayar: 0,
    },
    {
        id: "PIV1912-0077",
        outlet: "GOOPA8",
        noPO: "POB 1912-0029",
        noNota: "PIV 1912-0077",
        tanggal: "2019-12-30",
        pemasok: "UNILEVER",
        keterangan: "Nota Pembelian atas UNILEVER",
        status: "Closed",
        currency: "RP",
        jumlah: 209761374.6,
        totalBayar: 0,
    },
    {
        id: "PIV1912-0076",
        outlet: "GOOPA8",
        noPO: "POB 1912-0029",
        noNota: "PIV 1912-0076",
        tanggal: "2019-12-30",
        pemasok: "UNILEVER",
        keterangan: "Nota Pembelian atas UNILEVER",
        status: "Closed",
        currency: "RP",
        jumlah: 60201514.51,
        totalBayar: 0,
    },
];

const statusStyles: Record<PurchaseInvoice["status"], string> = {
    Approved: "bg-green-100 text-green-800",
    Pending:  "bg-yellow-100 text-yellow-800",
    Draft:    "bg-slate-100 text-slate-800",
    Closed:   "bg-emerald-100 text-emerald-800",
};

const formatCurrency = (value: number) =>
    value.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const FILTER_FIELDS: FilterField[] = [
    { key: "noNota", label: "No. Nota", type: "text" },
    { key: "noPO", label: "No. PO", type: "text" },
    { key: "outlet", label: "Outlet", type: "text" },
    { key: "pemasok", label: "Pemasok", type: "text" },
    {
        key: "status", label: "Status", type: "select", options: [
            { label: "Approved", value: "Approved" },
            { label: "Pending", value: "Pending" },
            { label: "Draft", value: "Draft" },
            { label: "Closed", value: "Closed" },
        ],
    },
    { key: "keterangan", label: "Keterangan", type: "text" },
];

export default function PurchaseInvoiceListPage() {
    const [filteredData, setFilteredData] = useState<PurchaseInvoice[]>(purchaseInvoices);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(purchaseInvoices);
            return;
        }
        const result = purchaseInvoices.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof PurchaseInvoice];
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

    const columns: Column<PurchaseInvoice>[] = [
        {
            header: "Outlet",
            key: "outlet",
            render: (inv) => <span className="text-sm font-medium">{inv.outlet}</span>,
        },
        {
            header: "No. PO",
            key: "noPO",
            render: (inv) => (
                <span className="text-sm text-primary font-semibold tracking-tight">{inv.noPO}</span>
            ),
        },
        {
            header: "No. Nota",
            key: "noNota",
            render: (inv) => (
                <Link
                    href={`/purchase-invoice/${inv.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {inv.noNota}
                </Link>
            ),
        },
        {
            header: "Tanggal",
            key: "tanggal",
            render: (inv) => <span className="text-sm">{inv.tanggal}</span>,
        },
        {
            header: "Pemasok",
            key: "pemasok",
            render: (inv) => <span className="text-sm font-medium">{inv.pemasok}</span>,
        },
        {
            header: "Keterangan",
            key: "keterangan",
            render: (inv) => (
                <span className="text-sm text-slate-500 max-w-[200px] truncate block">{inv.keterangan}</span>
            ),
        },
        {
            header: "Status",
            key: "status",
            render: (inv) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[inv.status]}`}>
                    {inv.status}
                </span>
            ),
        },
        {
            header: "Currency",
            key: "currency",
            render: (inv) => <span className="text-sm text-slate-500">{inv.currency}</span>,
        },
        {
            header: "Jumlah",
            key: "jumlah",
            align: "right",
            render: (inv) => <span className="text-sm font-bold">{formatCurrency(inv.jumlah)}</span>,
        },
        {
            header: "Total Bayar",
            key: "totalBayar",
            align: "right",
            render: (inv) => (
                <span className={`text-sm font-bold ${inv.totalBayar > 0 ? "text-amber-600" : "text-slate-900"}`}>
                    {formatCurrency(inv.totalBayar)}
                </span>
            ),
        },
        {
            header: "Aksi",
            key: "aksi",
            align: "right",
            render: (inv) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/purchase-invoice/${inv.id}`}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                        title="View"
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

    const renderMobileCard = (inv: PurchaseInvoice) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        href={`/purchase-invoice/${inv.id}`}
                        className="font-semibold text-primary text-sm hover:underline"
                    >
                        {inv.noNota}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{inv.noPO} · {inv.tanggal}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[inv.status]}`}>
                    {inv.status}
                </span>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-900">{inv.pemasok}</p>
                <p className="text-xs text-slate-500 truncate">{inv.keterangan}</p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <div>
                    <p className="text-xs text-slate-400">Jumlah</p>
                    <span className="text-sm font-bold text-slate-900">{inv.currency} {formatCurrency(inv.jumlah)}</span>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400">Total Bayar</p>
                    <span className={`text-sm font-bold ${inv.totalBayar > 0 ? "text-amber-600" : "text-slate-900"}`}>
                        {formatCurrency(inv.totalBayar)}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <Link
                        href={`/purchase-invoice/${inv.id}`}
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
                                    Daftar Nota Pembelian Barang
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola dan pantau semua nota pembelian (purchase invoice) masuk.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/purchase-invoice/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Invoice Baru
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
