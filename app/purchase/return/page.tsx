"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";
import DataTable, { Column } from "../../components/DataTable";

interface PurchaseReturn {
    id: string;
    tipe: string;
    outlet: string;
    returnNo: string;
    tanggal: string;
    pemasok: string;
    keterangan: string;
    status: "Approved" | "Pending" | "Draft" | "Closed";
    currency: string;
    qtyRetur: number;
    jumlah: number;
}

const purchaseReturns: PurchaseReturn[] = [
    {
        id: "BRB2401-0002",
        tipe: "Barang saja",
        outlet: "GKPK",
        returnNo: "BRB 2401-0002",
        tanggal: "2024-01-14",
        pemasok: "CHOP",
        keterangan: "Retur Pembelian ke CHOP",
        status: "Approved",
        currency: "RP",
        qtyRetur: 1.00,
        jumlah: 213851.49,
    },
    {
        id: "BRB2401-0001",
        tipe: "Barang saja",
        outlet: "GKPK",
        returnNo: "BRB 2401-0001",
        tanggal: "2024-01-14",
        pemasok: "CHOP",
        keterangan: "Retur Pembelian ke CHOP",
        status: "Approved",
        currency: "RP",
        qtyRetur: 1.00,
        jumlah: 106005.00,
    },
    {
        id: "BRB1907-0001",
        tipe: "Barang saja",
        outlet: "GKPK",
        returnNo: "BRB 1907-0001",
        tanggal: "2019-07-24",
        pemasok: "UNILEVER",
        keterangan: "Retur Pembelian ke UNILEVER",
        status: "Closed",
        currency: "RP",
        qtyRetur: 1.00,
        jumlah: 0.00,
    },
    {
        id: "BRB1903-0021",
        tipe: "Barang saja",
        outlet: "GDDPA8",
        returnNo: "BRB 1903-0021",
        tanggal: "2019-03-18",
        pemasok: "PT. UNIRAMA DUTA NIAGA",
        keterangan: "Retur Pembelian ke PT. UNIRAMA DUTA NIAGA (P1119A0002)",
        status: "Closed",
        currency: "RP",
        qtyRetur: 0.00,
        jumlah: 0.00,
    },
    {
        id: "BRB1903-0025",
        tipe: "Barang saja",
        outlet: "GDDPBM8",
        returnNo: "BRB 1903-0025",
        tanggal: "2019-03-13",
        pemasok: "PT. UNIRAMA DUTA NIAGA",
        keterangan: "Retur Pembelian ke PT. UNIRAMA DUTA NIAGA (P1119A0002)",
        status: "Closed",
        currency: "RP",
        qtyRetur: 0.00,
        jumlah: 0.00,
    },
    {
        id: "BRB1903-0024",
        tipe: "Barang saja",
        outlet: "GDDPA8",
        returnNo: "BRB 1903-0024",
        tanggal: "2019-03-13",
        pemasok: "PT. UNIRAMA DUTA NIAGA",
        keterangan: "Retur Pembelian ke PT. UNIRAMA DUTA NIAGA (P1119A0002)",
        status: "Closed",
        currency: "RP",
        qtyRetur: 0.00,
        jumlah: 0.00,
    },
    {
        id: "BRB1903-0019",
        tipe: "Barang saja",
        outlet: "GDDPA8",
        returnNo: "BRB 1903-0019",
        tanggal: "2019-03-08",
        pemasok: "UNILEVER",
        keterangan: "Retur Pembelian ke UNILEVER 010.004-18.69574733",
        status: "Closed",
        currency: "RP",
        qtyRetur: 62.00,
        jumlah: 12102434.10,
    },
    {
        id: "BRB1903-0018",
        tipe: "Barang saja",
        outlet: "GDDPA8",
        returnNo: "BRB 1903-0018",
        tanggal: "2019-03-08",
        pemasok: "UNILEVER",
        keterangan: "Retur Pembelian ke UNILEVER 010.004-18.69576180",
        status: "Closed",
        currency: "RP",
        qtyRetur: 13.00,
        jumlah: 1363448.90,
    },
    {
        id: "BRB1903-0017",
        tipe: "Barang saja",
        outlet: "GDDPA8",
        returnNo: "BRB 1903-0017",
        tanggal: "2019-03-08",
        pemasok: "UNILEVER",
        keterangan: "Retur Pembelian ke UNILEVER 010.004-18.69578643",
        status: "Closed",
        currency: "RP",
        qtyRetur: 11.00,
        jumlah: 2163174.20,
    },
    {
        id: "BRB1903-0016",
        tipe: "Barang saja",
        outlet: "GDDPA8",
        returnNo: "BRB 1903-0016",
        tanggal: "2019-03-08",
        pemasok: "UNILEVER",
        keterangan: "Retur Pembelian ke UNILEVER 010.004-18.69579746",
        status: "Closed",
        currency: "RP",
        qtyRetur: 2.00,
        jumlah: 205763.20,
    },
    {
        id: "BRB1903-0015",
        tipe: "Barang saja",
        outlet: "GDDPA8",
        returnNo: "BRB 1903-0015",
        tanggal: "2019-03-08",
        pemasok: "UNILEVER",
        keterangan: "Retur Pembelian ke UNILEVER 010.004-18.69576073",
        status: "Closed",
        currency: "RP",
        qtyRetur: 5.00,
        jumlah: 524403.00,
    },
    {
        id: "BRB1903-0014",
        tipe: "Barang saja",
        outlet: "GDDPA8",
        returnNo: "BRB 1903-0014",
        tanggal: "2019-03-08",
        pemasok: "UNILEVER",
        keterangan: "Retur Pembelian ke UNILEVER 010.004-18.69576036",
        status: "Closed",
        currency: "RP",
        qtyRetur: 14.00,
        jumlah: 1315380.00,
    },
    {
        id: "BRB1903-0013",
        tipe: "Barang saja",
        outlet: "GDDPA8",
        returnNo: "BRB 1903-0013",
        tanggal: "2019-03-08",
        pemasok: "UNILEVER",
        keterangan: "Retur Pembelian ke UNILEVER 010.004-18.69576152",
        status: "Closed",
        currency: "RP",
        qtyRetur: 13.00,
        jumlah: 1363448.90,
    },
    {
        id: "BRB1903-0012",
        tipe: "Barang saja",
        outlet: "GDDPA8",
        returnNo: "BRB 1903-0012",
        tanggal: "2019-03-08",
        pemasok: "UNILEVER",
        keterangan: "Retur Pembelian ke UNILEVER 010.004-18.6.69.A.4735",
        status: "Closed",
        currency: "RP",
        qtyRetur: 40.00,
        jumlah: 19271880.10,
    },
    {
        id: "BRB1903-0011",
        tipe: "Barang saja",
        outlet: "GDDPA8",
        returnNo: "BRB 1903-0011",
        tanggal: "2019-03-08",
        pemasok: "UNILEVER",
        keterangan: "Retur Pembelian ke UNILEVER 010.004-18.69553175",
        status: "Closed",
        currency: "RP",
        qtyRetur: 9.00,
        jumlah: 839045.90,
    },
    {
        id: "BRB1903-0010",
        tipe: "Barang saja",
        outlet: "GDDPA8",
        returnNo: "BRB 1903-0010",
        tanggal: "2019-03-08",
        pemasok: "UNILEVER",
        keterangan: "Retur Pembelian ke UNILEVER 010.004-18.69553036",
        status: "Closed",
        currency: "RP",
        qtyRetur: 9.00,
        jumlah: 913926.50,
    },
    {
        id: "BRB1903-0009",
        tipe: "Barang saja",
        outlet: "GDDPA8",
        returnNo: "BRB 1903-0009",
        tanggal: "2019-03-08",
        pemasok: "UNILEVER",
        keterangan: "Retur Pembelian ke UNILEVER 010.004-18.69552377",
        status: "Closed",
        currency: "RP",
        qtyRetur: 5.00,
        jumlah: 524403.00,
    },
    {
        id: "BRB1903-0008",
        tipe: "Barang saja",
        outlet: "GDDPA8",
        returnNo: "BRB 1903-0008",
        tanggal: "2019-03-08",
        pemasok: "UNILEVER",
        keterangan: "Retur Pembelian ke UNILEVER 010.004-18.69556534",
        status: "Closed",
        currency: "RP",
        qtyRetur: 10.00,
        jumlah: 1048807.10,
    },
    {
        id: "BRB1903-0007",
        tipe: "Barang saja",
        outlet: "GDDPA8",
        returnNo: "BRB 1903-0007",
        tanggal: "2019-03-08",
        pemasok: "UNILEVER",
        keterangan: "Retur Pembelian ke UNILEVER 010.004-18.69556327",
        status: "Closed",
        currency: "RP",
        qtyRetur: 9.00,
        jumlah: 913926.50,
    },
    {
        id: "BRB1903-0006",
        tipe: "Barang saja",
        outlet: "GDDPA8",
        returnNo: "BRB 1903-0006",
        tanggal: "2019-03-08",
        pemasok: "UNILEVER",
        keterangan: "Retur Pembelian ke UNILEVER 010.004-18.69551753",
        status: "Closed",
        currency: "RP",
        qtyRetur: 12.00,
        jumlah: 1258567.20,
    },
];

const statusStyles: Record<PurchaseReturn["status"], string> = {
    Approved: "bg-green-100 text-green-800",
    Pending:  "bg-yellow-100 text-yellow-800",
    Draft:    "bg-slate-100 text-slate-800",
    Closed:   "bg-emerald-100 text-emerald-800",
};

const formatCurrency = (value: number) =>
    value.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const FILTER_FIELDS: FilterField[] = [
    { key: "returnNo", label: "No. Return", type: "text" },
    { key: "outlet", label: "Outlet", type: "text" },
    { key: "pemasok", label: "Pemasok", type: "text" },
    { key: "tipe", label: "Tipe", type: "text" },
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

export default function PurchaseReturnListPage() {
    const [filteredData, setFilteredData] = useState<PurchaseReturn[]>(purchaseReturns);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(purchaseReturns);
            return;
        }
        const result = purchaseReturns.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof PurchaseReturn];
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

    const columns: Column<PurchaseReturn>[] = [
        {
            header: "Tipe",
            key: "tipe",
            render: (item) => <span className="text-sm text-slate-600">{item.tipe}</span>,
        },
        {
            header: "Outlet",
            key: "outlet",
            render: (item) => <span className="text-sm font-medium">{item.outlet}</span>,
        },
        {
            header: "Return#",
            key: "returnNo",
            render: (item) => (
                <Link
                    href={`/purchase/return/${item.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {item.returnNo}
                </Link>
            ),
        },
        {
            header: "Tanggal",
            key: "tanggal",
            render: (item) => <span className="text-sm">{item.tanggal}</span>,
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
                <span className="text-sm text-slate-500 max-w-[220px] truncate block">{item.keterangan}</span>
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
            render: (item) => <span className="text-sm text-slate-500">{item.currency}</span>,
        },
        {
            header: "Qty Retur",
            key: "qtyRetur",
            align: "right",
            render: (item) => (
                <span className="text-sm font-semibold">{formatCurrency(item.qtyRetur)}</span>
            ),
        },
        {
            header: "Jumlah",
            key: "jumlah",
            align: "right",
            render: (item) => <span className="text-sm font-bold">{formatCurrency(item.jumlah)}</span>,
        },
        {
            header: "Aksi",
            key: "aksi",
            align: "right",
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/purchase/return/${item.id}`}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                        title="View"
                    >
                        <span className="material-symbols-outlined text-lg">edit_square</span>
                    </Link>
                    <button
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                        title="Print SJ"
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

    const renderMobileCard = (item: PurchaseReturn) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        href={`/purchase/return/${item.id}`}
                        className="font-semibold text-primary text-sm hover:underline"
                    >
                        {item.returnNo}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{item.outlet} · {item.tanggal}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[item.status]}`}>
                    {item.status}
                </span>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-900">{item.pemasok}</p>
                <p className="text-xs text-slate-500 truncate">{item.keterangan}</p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <div>
                    <p className="text-xs text-slate-400">Qty Retur</p>
                    <span className="text-sm font-semibold text-slate-900">{formatCurrency(item.qtyRetur)}</span>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400">Jumlah</p>
                    <span className="text-sm font-bold text-slate-900">{item.currency} {formatCurrency(item.jumlah)}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Link
                        href={`/purchase/return/${item.id}`}
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
                                    Daftar Retur Pembelian Barang
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola dan pantau semua retur pembelian (purchase return) barang.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/purchase/return/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Retur Baru
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
