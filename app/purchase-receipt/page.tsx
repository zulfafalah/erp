"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatusBar from "../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../components/MultiFilter";
import DataTable, { Column } from "../components/DataTable";

// ── Types ──────────────────────────────────────────────────────────────────────
interface PurchaseReceipt {
    id: string;
    outlet: string;
    noPO: string;
    noBDP: string;
    noBPB: string;
    tanggal: string;
    pemasok: string;
    keterangan: string;
    status: "Approved" | "Closed" | "Pending" | "Draft";
    currency: string;
    jumlah: number;
    totalFaktur: number;
}

// ── Mock Data ──────────────────────────────────────────────────────────────────
const purchaseReceipts: PurchaseReceipt[] = [
    {
        id: "BPS2601-0001",
        outlet: "GDOPA8",
        noPO: "POB 2601-0001",
        noBDP: "BPS 2601-0001",
        noBPB: "BPS 2601-0001",
        tanggal: "2026-01-06",
        pemasok: "CARREFOUR MEDAN",
        keterangan: "Penerimaan Pembelian dari CARREFOUR MEDAN",
        status: "Closed",
        currency: "RP",
        jumlah: 3949193.52,
        totalFaktur: 0,
    },
    {
        id: "BPS2401-0005",
        outlet: "GDOPSJC7",
        noPO: "POB 2401-0005",
        noBDP: "BPS 2401-0002",
        noBPB: "BPS 2401-0002",
        tanggal: "2024-01-24",
        pemasok: "TRIAL",
        keterangan: "Penerimaan Pembelian dari TRIAL",
        status: "Approved",
        currency: "RP",
        jumlah: 41000,
        totalFaktur: 41000,
    },
    {
        id: "BPS2401-0001",
        outlet: "GKPK",
        noPO: "POB 2401-0001",
        noBDP: "BPS 2401-0001",
        noBPB: "BPS 2401-0001",
        tanggal: "2024-01-14",
        pemasok: "CHOP",
        keterangan: "Penerimaan Pembelian dari CHOP",
        status: "Approved",
        currency: "RP",
        jumlah: 117157047,
        totalFaktur: 117157047,
    },
    {
        id: "BPS2207-0005",
        outlet: "GKPK",
        noPO: "POB 2207-0005",
        noBDP: "BPS 2207-0004",
        noBPB: "BPS 2207-0004",
        tanggal: "2022-07-05",
        pemasok: "CHOP",
        keterangan: "Penerimaan Pembelian dari CHOP",
        status: "Approved",
        currency: "RP",
        jumlah: 1221000,
        totalFaktur: 0,
    },
    {
        id: "BPS2207-0004",
        outlet: "GKPK",
        noPO: "POB 2207-0004",
        noBDP: "BPS 2207-0003",
        noBPB: "BPS 2207-0003",
        tanggal: "2022-07-03",
        pemasok: "CHOP",
        keterangan: "Penerimaan Pembelian dari CHOP",
        status: "Approved",
        currency: "RP",
        jumlah: 555000,
        totalFaktur: 0,
    },
    {
        id: "BPS2207-0003",
        outlet: "GKPK",
        noPO: "POB 2207-0003",
        noBDP: "BPS 2207-0002",
        noBPB: "BPS 2207-0002",
        tanggal: "2022-07-03",
        pemasok: "CHOP",
        keterangan: "Penerimaan Pembelian dari CHOP",
        status: "Approved",
        currency: "RP",
        jumlah: 1110000,
        totalFaktur: 1110000,
    },
    {
        id: "BPS2207-0001",
        outlet: "GKPK",
        noPO: "POB 2207-0001",
        noBDP: "BPS 2207-0001",
        noBPB: "BPS 2207-0001",
        tanggal: "2022-07-01",
        pemasok: "UNILEVER",
        keterangan: "Penerimaan Pembelian dari UNILEVER",
        status: "Approved",
        currency: "RP",
        jumlah: 550000,
        totalFaktur: 550000,
    },
    {
        id: "BPS2206-0001",
        outlet: "GKPK",
        noPO: "POB 2206-0001",
        noBDP: "BPS 2206-0003",
        noBPB: "BPS 2206-0003",
        tanggal: "2022-06-30",
        pemasok: "UNILEVER",
        keterangan: "Penerimaan Pembelian dari UNILEVER",
        status: "Approved",
        currency: "RP",
        jumlah: 216461.22,
        totalFaktur: 216461.32,
    },
    {
        id: "BPS2206-0001B",
        outlet: "GDOPA8",
        noPO: "POB 2206-0001",
        noBDP: "BPS 2206-0001",
        noBPB: "BPS 2206-0001",
        tanggal: "2022-06-30",
        pemasok: "UNILEVER",
        keterangan: "Penerimaan Pembelian dari UNILEVER",
        status: "Approved",
        currency: "RP",
        jumlah: 421205.73,
        totalFaktur: 421205.73,
    },
    {
        id: "BPS2206-0001C",
        outlet: "GRBK",
        noPO: "POB 2206-0001",
        noBDP: "BPS 2206-0001",
        noBPB: "BPS 2206-0001",
        tanggal: "2022-06-30",
        pemasok: "UNILEVER",
        keterangan: "Penerimaan Pembelian dari UNILEVER",
        status: "Approved",
        currency: "RP",
        jumlah: 1107592.74,
        totalFaktur: 1107592.74,
    },
    {
        id: "BPS2202-0001",
        outlet: "GKPK",
        noPO: "POB 2202-0001",
        noBDP: "BPS 2202-0001",
        noBPB: "BPS 2202-0001",
        tanggal: "2022-02-18",
        pemasok: "BEKASI SQUARE",
        keterangan: "Penerimaan Pembelian dari BEKASI SQUARE",
        status: "Approved",
        currency: "RP",
        jumlah: 266805,
        totalFaktur: 0,
    },
    {
        id: "BPS2109-0002",
        outlet: "GRBK",
        noPO: "POB 2107-0001",
        noBDP: "BPS 2109-0002",
        noBPB: "BPS 2109-0002",
        tanggal: "2021-09-02",
        pemasok: "BEKASI SQUARE",
        keterangan: "Penerimaan Pembelian dari BEKASI SQUARE",
        status: "Approved",
        currency: "RP",
        jumlah: 4843215.12,
        totalFaktur: 4843215.12,
    },
    {
        id: "BPS2109-0001",
        outlet: "GDGIKB",
        noPO: "POB 2107-0001",
        noBDP: "BPS 2109-0001",
        noBPB: "BPS 2109-0001",
        tanggal: "2021-09-01",
        pemasok: "BEKASI SQUARE",
        keterangan: "Penerimaan Pembelian dari BEKASI SQUARE",
        status: "Approved",
        currency: "RP",
        jumlah: 4843215.12,
        totalFaktur: 4843215.12,
    },
    {
        id: "BPS2107-0003",
        outlet: "GDOPC7",
        noPO: "POB 2107-0001",
        noBDP: "BPS 2107-0003",
        noBPB: "BPS 2107-0003",
        tanggal: "2021-07-06",
        pemasok: "BEKASI SQUARE",
        keterangan: "Penerimaan Pembelian dari BEKASI SQUARE",
        status: "Approved",
        currency: "RP",
        jumlah: 6860954,
        totalFaktur: 6860954,
    },
    {
        id: "BPS2107-0002",
        outlet: "GKPK",
        noPO: "POB 2107-0001",
        noBDP: "BPS 2107-0002",
        noBPB: "BPS 2107-0002",
        tanggal: "2021-07-06",
        pemasok: "BEKASI SQUARE",
        keterangan: "Penerimaan Pembelian dari BEKASI SQUARE",
        status: "Approved",
        currency: "RP",
        jumlah: 10291431,
        totalFaktur: 0,
    },
    {
        id: "BPS2107-0001",
        outlet: "GDOPA8",
        noPO: "POB 2107-0001",
        noBDP: "BPS 2107-0001",
        noBPB: "BPS 2107-0001",
        tanggal: "2021-07-06",
        pemasok: "BEKASI SQUARE",
        keterangan: "Penerimaan Pembelian dari BEKASI SQUARE",
        status: "Approved",
        currency: "RP",
        jumlah: 17152385.01,
        totalFaktur: 37643816,
    },
    {
        id: "BPS2105-0001",
        outlet: "GDOPC7",
        noPO: "POB 2105-0001",
        noBDP: "BPS 2105-0002",
        noBPB: "BPS 2105-0002",
        tanggal: "2021-06-30",
        pemasok: "CARREFOUR MATARAM",
        keterangan: "Penerimaan Pembelian dari CARREFOUR MATARAM",
        status: "Approved",
        currency: "RP",
        jumlah: 17588618.97,
        totalFaktur: -17588618.97,
    },
    {
        id: "BPS1912-0021",
        outlet: "GDOPC7",
        noPO: "POB 1912-0021",
        noBDP: "BPS 1912-0017",
        noBPB: "BPS 1912-0017",
        tanggal: "2019-12-27",
        pemasok: "UNILEVER",
        keterangan: "Penerimaan Pembelian dari UNILEVER",
        status: "Closed",
        currency: "RP",
        jumlah: 330934538.98,
        totalFaktur: 330934538.98,
    },
    {
        id: "BPS1912-0014",
        outlet: "GDOPC7",
        noPO: "POB 1912-0014",
        noBDP: "BPS 1912-0016",
        noBPB: "BPS 1912-0016",
        tanggal: "2019-12-27",
        pemasok: "UNILEVER",
        keterangan: "Penerimaan Pembelian dari UNILEVER",
        status: "Closed",
        currency: "RP",
        jumlah: 406643105.21,
        totalFaktur: 406643105.21,
    },
    {
        id: "BPS1912-0024",
        outlet: "GDOPA8",
        noPO: "POB 1912-0024",
        noBDP: "BPS 1912-0015",
        noBPB: "BPS 1912-0015",
        tanggal: "2019-12-27",
        pemasok: "UNILEVER",
        keterangan: "Penerimaan Pembelian dari UNILEVER",
        status: "Closed",
        currency: "RP",
        jumlah: 242126798.12,
        totalFaktur: 242126798.12,
    },
];

// ── Status Styles ──────────────────────────────────────────────────────────────
const statusStyles: Record<PurchaseReceipt["status"], string> = {
    Approved: "bg-green-100 text-green-800",
    Closed:   "bg-emerald-100 text-emerald-800",
    Pending:  "bg-yellow-100 text-yellow-800",
    Draft:    "bg-slate-100 text-slate-800",
};

// ── Filter Fields ──────────────────────────────────────────────────────────────
const FILTER_FIELDS: FilterField[] = [
    { key: "outlet",   label: "Outlet",   type: "text" },
    { key: "noPO",     label: "No. PO",   type: "text" },
    { key: "noBDP",    label: "No. BDP",  type: "text" },
    { key: "noBPB",    label: "No. BPB",  type: "text" },
    { key: "pemasok",  label: "Pemasok",  type: "text" },
    {
        key: "status", label: "Status", type: "select", options: [
            { label: "Approved", value: "Approved" },
            { label: "Closed",   value: "Closed" },
            { label: "Pending",  value: "Pending" },
            { label: "Draft",    value: "Draft" },
        ],
    },
];

// ── Formatter ──────────────────────────────────────────────────────────────────
const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

// ── Page ───────────────────────────────────────────────────────────────────────
export default function PurchaseReceiptListPage() {
    const [filteredData, setFilteredData] = useState<PurchaseReceipt[]>(purchaseReceipts);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(purchaseReceipts);
            return;
        }
        const result = purchaseReceipts.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof PurchaseReceipt];
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

    const columns: Column<PurchaseReceipt>[] = [
        {
            header: "No.",
            key: "no",
            render: (_, index) => (
                <span className="text-sm text-slate-500">{(index ?? 0) + 1}</span>
            ),
        },
        {
            header: "Outlet",
            key: "outlet",
            render: (item) => <span className="text-sm font-medium">{item.outlet}</span>,
        },
        {
            header: "No.PO",
            key: "noPO",
            render: (item) => (
                <Link
                    href={`/purchase-receipt/${item.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline whitespace-nowrap"
                >
                    {item.noPO}
                </Link>
            ),
        },
        {
            header: "No.BDP",
            key: "noBDP",
            render: (item) => <span className="text-sm">{item.noBDP}</span>,
        },
        {
            header: "No.BPB",
            key: "noBPB",
            render: (item) => <span className="text-sm">{item.noBPB}</span>,
        },
        {
            header: "Tanggal",
            key: "tanggal",
            render: (item) => <span className="text-sm whitespace-nowrap">{item.tanggal}</span>,
        },
        {
            header: "Pemasok",
            key: "pemasok",
            render: (item) => <span className="text-sm font-medium">{item.pemasok}</span>,
        },
        {
            header: "Keterangan",
            key: "keterangan",
            render: (item) => (
                <span className="text-sm text-slate-500 max-w-xs block truncate">{item.keterangan}</span>
            ),
        },
        {
            header: "Status",
            key: "status",
            render: (item) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[item.status]}`}>
                    {item.status}
                </span>
            ),
        },
        {
            header: "Currency",
            key: "currency",
            render: (item) => <span className="text-sm">{item.currency}</span>,
        },
        {
            header: "Jumlah",
            key: "jumlah",
            align: "right",
            render: (item) => (
                <span className="text-sm font-bold text-right block whitespace-nowrap">
                    {formatRupiah(item.jumlah)}
                </span>
            ),
        },
        {
            header: "Total Faktur",
            key: "totalFaktur",
            align: "right",
            render: (item) => (
                <span
                    className={`text-sm font-bold text-right block whitespace-nowrap ${
                        item.totalFaktur < 0
                            ? "text-red-600"
                            : item.totalFaktur === 0
                            ? "text-yellow-600"
                            : "text-primary"
                    }`}
                >
                    {formatRupiah(item.totalFaktur)}
                </span>
            ),
        },
        {
            header: "Aksi",
            key: "aksi",
            align: "right",
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/purchase-receipt/${item.id}`}
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

    const renderMobileCard = (item: PurchaseReceipt) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        href={`/purchase-receipt/${item.id}`}
                        className="font-semibold text-primary text-sm hover:underline"
                    >
                        {item.noBPB}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{item.tanggal}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[item.status]}`}>
                    {item.status}
                </span>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-900">{item.pemasok}</p>
                <p className="text-xs text-slate-500">{item.keterangan}</p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <div>
                    <p className="text-xs text-slate-400">Jumlah</p>
                    <span className="text-sm font-bold text-slate-900">{item.currency} {formatRupiah(item.jumlah)}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Link
                        href={`/purchase-receipt/${item.id}`}
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
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-28 md:pb-8 space-y-4 md:space-y-8">
                        {/* Title and Actions */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                                    Daftar Penerimaan Pembelian Barang
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola dan pantau semua penerimaan pembelian barang dari pemasok.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/purchase-receipt/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Penerimaan Baru
                                </Link>
                            </div>
                        </div>

                        {/* Table */}
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
