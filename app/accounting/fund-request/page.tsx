"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";
import DataTable, { Column } from "../../components/DataTable";

// ─── Types ────────────────────────────────────────────────────────────────────

type FundRequestStatus = "Approved" | "Pending" | "Draft" | "Rejected";

interface FundRequest {
    id: string;
    pengajuanNo: string;
    tanggal: string;
    kodeAkun: string;
    status: FundRequestStatus;
    keterangan: string;
}

// ─── Status Styles ────────────────────────────────────────────────────────────

const statusStyles: Record<FundRequestStatus, string> = {
    Approved: "bg-green-100 text-green-800",
    Pending:  "bg-yellow-100 text-yellow-800",
    Draft:    "bg-slate-100 text-slate-800",
    Rejected: "bg-red-100 text-red-800",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const allData: FundRequest[] = [
    { id: "1",  pengajuanNo: "PKK20040008", tanggal: "2020-04-15", kodeAkun: "KAS KECIL, GD PIK", status: "Approved", keterangan: "Permintaan Dana Atas Akun : 110.01.01 - KAS KECIL, GD PIK [14]" },
    { id: "2",  pengajuanNo: "PKK20040007", tanggal: "2020-04-13", kodeAkun: "KAS KECIL, GD PIK", status: "Approved", keterangan: "Permintaan Dana Atas Akun : 110.01.01 - KAS KECIL, GD PIK [19]" },
    { id: "3",  pengajuanNo: "PKK20040005", tanggal: "2020-04-13", kodeAkun: "KAS KECIL, GD PIK", status: "Approved", keterangan: "Permintaan Dana Atas Akun : 110.01.01 - KAS KECIL, GD PIK [12]" },
    { id: "4",  pengajuanNo: "PKK20040005", tanggal: "2020-04-09", kodeAkun: "KAS KECIL, GD PIK", status: "Approved", keterangan: "Permintaan Dana Atas Akun : 110.01.01 - KAS KECIL, GD PIK [26]" },
    { id: "5",  pengajuanNo: "PKK20040004", tanggal: "2020-04-07", kodeAkun: "KAS KECIL, GD PIK", status: "Approved", keterangan: "Permintaan Dana Atas Akun : 110.01.01 - KAS KECIL, GD PIK [20]" },
    { id: "6",  pengajuanNo: "PKK20040003", tanggal: "2020-04-06", kodeAkun: "KAS KECIL, GD PIK", status: "Approved", keterangan: "Permintaan Dana Atas Akun : 110.01.01 - KAS KECIL, GD PIK [12]" },
    { id: "7",  pengajuanNo: "PKK20040002", tanggal: "2020-04-03", kodeAkun: "KAS KECIL, GD PIK", status: "Approved", keterangan: "Permintaan Dana Atas Akun : 110.01.01 - KAS KECIL, GD PIK [17]" },
    { id: "8",  pengajuanNo: "PKK20040001", tanggal: "2020-04-01", kodeAkun: "KAS KECIL, GD PIK", status: "Approved", keterangan: "Permintaan Dana Atas Akun : 110.01.01 - KAS KECIL, GD PIK [25]" },
    { id: "9",  pengajuanNo: "PKK20030020", tanggal: "2020-03-30", kodeAkun: "KAS KECIL, GD PIK", status: "Approved", keterangan: "Permintaan Dana Atas Akun : 110.01.01 - KAS KECIL, GD PIK [18]" },
    { id: "10", pengajuanNo: "PKK20030019", tanggal: "2020-03-28", kodeAkun: "KAS KECIL, GD PIK", status: "Approved", keterangan: "Permintaan Dana Atas Akun : 110.01.01 - KAS KECIL, GD PIK [13]" },
    { id: "11", pengajuanNo: "PKK20030018", tanggal: "2020-03-25", kodeAkun: "KAS KECIL, GD PIK", status: "Approved", keterangan: "Permintaan Dana Atas Akun : 110.01.01 - KAS KECIL, GD PIK [8]"  },
    { id: "12", pengajuanNo: "PKK20030017", tanggal: "2020-03-23", kodeAkun: "KAS KECIL, GD PIK", status: "Pending",  keterangan: "Permintaan Dana Atas Akun : 110.01.01 - KAS KECIL, GD PIK [5]"  },
    { id: "13", pengajuanNo: "PKK20030016", tanggal: "2020-03-20", kodeAkun: "KAS KECIL, GD PIK", status: "Draft",    keterangan: "Permintaan Dana Atas Akun : 110.01.01 - KAS KECIL, GD PIK [3]"  },
];

// ─── Filter Fields ────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
    { key: "pengajuanNo", label: "Pengajuan#", type: "text"   },
    { key: "tanggal",     label: "Tanggal",    type: "text"   },
    { key: "kodeAkun",   label: "Kode Akun",  type: "text"   },
    {
        key: "status", label: "Status", type: "select", options: [
            { label: "Approved", value: "Approved" },
            { label: "Pending",  value: "Pending"  },
            { label: "Draft",    value: "Draft"    },
            { label: "Rejected", value: "Rejected" },
        ],
    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FundRequestListPage() {
    const [filteredData, setFilteredData] = useState<FundRequest[]>(allData);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(allData);
            return;
        }
        const result = allData.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof FundRequest];
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

    const columns: Column<FundRequest>[] = [
        {
            header: "No.",
            key: "id",
            render: (_item, idx) => (
                <span className="text-sm text-slate-400 font-medium">{(idx ?? 0) + 1}.</span>
            ),
        },
        {
            header: "Pengajuan#",
            key: "pengajuanNo",
            render: (item) => (
                <Link
                    href={`/accounting/fund-request/${item.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {item.pengajuanNo}
                </Link>
            ),
        },
        {
            header: "Tanggal",
            key: "tanggal",
            render: (item) => <span className="text-sm text-slate-600">{item.tanggal}</span>,
        },
        {
            header: "Kode Akun",
            key: "kodeAkun",
            render: (item) => <span className="text-sm text-slate-700">{item.kodeAkun}</span>,
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
            header: "Keterangan",
            key: "keterangan",
            render: (item) => <span className="text-sm text-slate-600">{item.keterangan}</span>,
        },
        {
            header: "Aksi",
            key: "aksi",
            align: "right",
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/accounting/fund-request/${item.id}`}
                        className="text-sm font-semibold text-primary hover:text-primary/70 transition-colors"
                        title="View"
                    >
                        View
                    </Link>
                    <button
                        className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors"
                        title="Delete"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    const renderMobileCard = (item: FundRequest, idx?: number) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-medium">{(idx ?? 0) + 1}.</span>
                        <Link
                            href={`/accounting/fund-request/${item.id}`}
                            className="font-semibold text-primary text-sm hover:underline"
                        >
                            {item.pengajuanNo}
                        </Link>
                    </div>
                    <div className="mt-1.5 space-y-0.5">
                        <p className="text-xs text-slate-500">
                            Tanggal: <span className="font-medium text-slate-700">{item.tanggal}</span>
                        </p>
                        <p className="text-xs text-slate-500">
                            Kode Akun: <span className="font-medium text-slate-700">{item.kodeAkun}</span>
                        </p>
                        <p className="text-xs text-slate-500 truncate">{item.keterangan}</p>
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[item.status]}`}>
                        {item.status}
                    </span>
                </div>
            </div>
            <div className="flex justify-end items-center pt-2 border-t border-slate-100 gap-3">
                <Link
                    href={`/accounting/fund-request/${item.id}`}
                    className="text-sm font-semibold text-primary hover:text-primary/70 transition-colors"
                >
                    View
                </Link>
                <button className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors">
                    Delete
                </button>
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
                                    Permintaan Dana
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Daftar pencatatan permintaan dana kas kecil dan operasional.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/accounting/fund-request/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Add New
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
