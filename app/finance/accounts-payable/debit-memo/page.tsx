"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../../components/MultiFilter";
import DataTable, { Column } from "../../../components/DataTable";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DebitMemo {
    id: string;
    tipe: "Potongan" | "Retur";
    tanggal: string;
    noTransaksi: string;
    noBilyct: string;
    pemasok: string;
    refAkun: string;
    status: "Approved" | "Pending" | "Draft" | "Closed";
    jumlah: number;
    ppn: number;
    grandTotal: number;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const debitMemos: DebitMemo[] = [
    {
        id: "DBN2206-0001",
        tipe: "Potongan",
        tanggal: "2022-06-30",
        noTransaksi: "DBN 2206-0001",
        noBilyct: "Document",
        pemasok: "UNILEVER [RP]",
        refAkun: "POTONGAN PEMBELIAN",
        status: "Approved",
        jumlah: 216461.32,
        ppn: 21646.13,
        grandTotal: 238107.45,
    },
    {
        id: "DBN1911-0005",
        tipe: "Potongan",
        tanggal: "2019-11-15",
        noTransaksi: "DBN 1911-0005",
        noBilyct: "Document",
        pemasok: "UNILEVER [RP]",
        refAkun: "POTONGAN PEMBELIAN",
        status: "Approved",
        jumlah: 85560955.00,
        ppn: 8556095.50,
        grandTotal: 94117050.50,
    },
    {
        id: "DBN1911-0004",
        tipe: "Potongan",
        tanggal: "2019-11-15",
        noTransaksi: "DBN 1911-0004",
        noBilyct: "Document",
        pemasok: "UNILEVER [RP]",
        refAkun: "POTONGAN PEMBELIAN",
        status: "Approved",
        jumlah: 83252369.00,
        ppn: 8325236.90,
        grandTotal: 91577605.90,
    },
    {
        id: "DBN1911-0003",
        tipe: "Potongan",
        tanggal: "2019-11-15",
        noTransaksi: "DBN 1911-0003",
        noBilyct: "Document",
        pemasok: "UNILEVER [RP]",
        refAkun: "POTONGAN PEMBELIAN",
        status: "Approved",
        jumlah: 80071523.00,
        ppn: 8007152.30,
        grandTotal: 88078675.30,
    },
    {
        id: "DBN1911-0002",
        tipe: "Potongan",
        tanggal: "2019-11-15",
        noTransaksi: "DBN 1911-0002",
        noBilyct: "Document",
        pemasok: "UNILEVER [RP]",
        refAkun: "POTONGAN PEMBELIAN",
        status: "Approved",
        jumlah: 243359705.00,
        ppn: 24335970.50,
        grandTotal: 267695675.50,
    },
    {
        id: "DBN1911-0001",
        tipe: "Potongan",
        tanggal: "2019-11-15",
        noTransaksi: "DBN 1911-0001",
        noBilyct: "Document",
        pemasok: "UNILEVER [RP]",
        refAkun: "POTONGAN PEMBELIAN",
        status: "Approved",
        jumlah: 154088068.20,
        ppn: 15408806.82,
        grandTotal: 169496875.02,
    },
    {
        id: "DBN1910-0002",
        tipe: "Potongan",
        tanggal: "2019-10-17",
        noTransaksi: "DBN 1910-0002",
        noBilyct: "Document",
        pemasok: "UNILEVER [RP]",
        refAkun: "POTONGAN PEMBELIAN",
        status: "Approved",
        jumlah: 105637246.00,
        ppn: 10563724.60,
        grandTotal: 116200970.60,
    },
    {
        id: "DBN1910-0003",
        tipe: "Potongan",
        tanggal: "2019-10-17",
        noTransaksi: "DBN 1910-0003",
        noBilyct: "Document",
        pemasok: "UNILEVER [RP]",
        refAkun: "POTONGAN PEMBELIAN",
        status: "Approved",
        jumlah: 220465975.00,
        ppn: 22046597.50,
        grandTotal: 242512572.50,
    },
    {
        id: "DBN1910-0004",
        tipe: "Potongan",
        tanggal: "2019-10-17",
        noTransaksi: "DBN 1910-0004",
        noBilyct: "Document",
        pemasok: "UNILEVER [RP]",
        refAkun: "POTONGAN PEMBELIAN",
        status: "Approved",
        jumlah: 124640518.00,
        ppn: 12464051.80,
        grandTotal: 137104569.80,
    },
    {
        id: "DBN1910-0005",
        tipe: "Potongan",
        tanggal: "2019-10-17",
        noTransaksi: "DBN 1910-0005",
        noBilyct: "Document",
        pemasok: "UNILEVER [RP]",
        refAkun: "POTONGAN PEMBELIAN",
        status: "Approved",
        jumlah: 117124380.00,
        ppn: 11712438.00,
        grandTotal: 128836818.00,
    },
    {
        id: "DBN1910-0006",
        tipe: "Potongan",
        tanggal: "2019-10-17",
        noTransaksi: "DBN 1910-0006",
        noBilyct: "Document",
        pemasok: "UNILEVER [RP]",
        refAkun: "POTONGAN PEMBELIAN",
        status: "Approved",
        jumlah: 88580638.00,
        ppn: 8858063.80,
        grandTotal: 97438701.80,
    },
    {
        id: "DBN1910-0001",
        tipe: "Potongan",
        tanggal: "2019-10-15",
        noTransaksi: "DBN 1910-0001",
        noBilyct: "Document",
        pemasok: "UNILEVER [RP]",
        refAkun: "POTONGAN PEMBELIAN",
        status: "Approved",
        jumlah: 496585452.00,
        ppn: 49658545.20,
        grandTotal: 546243997.20,
    },
    {
        id: "DBN1907-0002",
        tipe: "Potongan",
        tanggal: "2019-07-31",
        noTransaksi: "DBN 1907-0002",
        noBilyct: "Document",
        pemasok: "UNILEVER [RP]",
        refAkun: "POTONGAN PEMBELIAN",
        status: "Closed",
        jumlah: 342474700.00,
        ppn: 34247470.00,
        grandTotal: 376722170.00,
    },
    {
        id: "DBN1907-0003",
        tipe: "Potongan",
        tanggal: "2019-07-31",
        noTransaksi: "DBN 1907-0003",
        noBilyct: "Document",
        pemasok: "UNILEVER [RP]",
        refAkun: "POTONGAN PEMBELIAN",
        status: "Closed",
        jumlah: 228799758.00,
        ppn: 22879975.80,
        grandTotal: 251609834.00,
    },
    {
        id: "DBN1907-0004",
        tipe: "Potongan",
        tanggal: "2019-07-31",
        noTransaksi: "DBN 1907-0004",
        noBilyct: "Document",
        pemasok: "UNILEVER [RP]",
        refAkun: "POTONGAN PEMBELIAN",
        status: "Closed",
        jumlah: 194935701.55,
        ppn: 19493570.15,
        grandTotal: 214429271.70,
    },
    {
        id: "DBN1907-0005",
        tipe: "Potongan",
        tanggal: "2019-07-31",
        noTransaksi: "DBN 1907-0005",
        noBilyct: "Document",
        pemasok: "UNILEVER [RP]",
        refAkun: "POTONGAN PEMBELIAN",
        status: "Closed",
        jumlah: 171381572.73,
        ppn: 17138157.27,
        grandTotal: 188519730.00,
    },
    {
        id: "DBN1907-0006",
        tipe: "Potongan",
        tanggal: "2019-07-31",
        noTransaksi: "DBN 1907-0006",
        noBilyct: "Document",
        pemasok: "UNILEVER [RP]",
        refAkun: "POTONGAN PEMBELIAN",
        status: "Closed",
        jumlah: 126288618.18,
        ppn: 12628861.82,
        grandTotal: 138917480.00,
    },
    {
        id: "DBN1907-0007",
        tipe: "Potongan",
        tanggal: "2019-07-31",
        noTransaksi: "DBN 1907-0007",
        noBilyct: "Document",
        pemasok: "UNILEVER [RP]",
        refAkun: "POTONGAN PEMBELIAN",
        status: "Closed",
        jumlah: 105245381.82,
        ppn: 10524538.18,
        grandTotal: 115769920.00,
    },
    {
        id: "DBN1907-0001",
        tipe: "Potongan",
        tanggal: "2019-07-31",
        noTransaksi: "DBN 1907-0001",
        noBilyct: "Document",
        pemasok: "UNILEVER [RP]",
        refAkun: "POTONGAN PEMBELIAN",
        status: "Closed",
        jumlah: 302249127.27,
        ppn: 30224912.73,
        grandTotal: 332474040.00,
    },
    {
        id: "DBN1906-0010",
        tipe: "Potongan",
        tanggal: "2019-06-10",
        noTransaksi: "DBN 1906-0010",
        noBilyct: "Document",
        pemasok: "UNILEVER [RP]",
        refAkun: "POTONGAN PEMBELIAN",
        status: "Closed",
        jumlah: 266401854.55,
        ppn: 26640185.45,
        grandTotal: 293042040.00,
    },
];

// ─── Status ────────────────────────────────────────────────────────────────────

const statusStyles: Record<DebitMemo["status"], string> = {
    Approved: "bg-green-100 text-green-800",
    Pending:  "bg-yellow-100 text-yellow-800",
    Draft:    "bg-slate-100 text-slate-800",
    Closed:   "bg-emerald-100 text-emerald-800",
};

// ─── Filter Fields ─────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
    { key: "noTransaksi", label: "No. Transaksi", type: "text" },
    { key: "pemasok",     label: "Pemasok",       type: "text" },
    { key: "tipe",        label: "Tipe",           type: "select", options: [
        { label: "Potongan", value: "Potongan" },
        { label: "Retur",    value: "Retur" },
    ]},
    {
        key: "status",
        label: "Status",
        type: "select",
        options: [
            { label: "Approved", value: "Approved" },
            { label: "Closed",   value: "Closed" },
            { label: "Pending",  value: "Pending" },
            { label: "Draft",    value: "Draft" },
        ],
    },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

const fmtCur = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function DebitMemoListPage() {
    const [filteredData, setFilteredData] = useState<DebitMemo[]>(debitMemos);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(debitMemos);
            return;
        }
        const result = debitMemos.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof DebitMemo];
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

    const columns: Column<DebitMemo>[] = [
        {
            header: "Tipe",
            key: "tipe",
            render: (r) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    r.tipe === "Potongan"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                }`}>
                    {r.tipe}
                </span>
            ),
        },
        {
            header: "Tanggal",
            key: "tanggal",
            render: (r) => <span className="text-sm">{r.tanggal}</span>,
        },
        {
            header: "Transaksi #",
            key: "noTransaksi",
            render: (r) => (
                <Link
                    href={`/finance/accounts-payable/debit-memo/${r.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {r.noTransaksi}
                </Link>
            ),
        },
        {
            header: "Bilyct #",
            key: "noBilyct",
            render: (r) => <span className="text-sm text-slate-600">{r.noBilyct}</span>,
        },
        {
            header: "Pemasok",
            key: "pemasok",
            render: (r) => <span className="text-sm font-medium">{r.pemasok}</span>,
        },
        {
            header: "Ref Akun",
            key: "refAkun",
            render: (r) => <span className="text-sm text-slate-600">{r.refAkun}</span>,
        },
        {
            header: "Status",
            key: "status",
            render: (r) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[r.status]}`}>
                    {r.status}
                </span>
            ),
        },
        {
            header: "Jumlah",
            key: "jumlah",
            align: "right",
            render: (r) => (
                <span className="text-sm font-bold text-right block">
                    {fmtCur(r.jumlah)}
                </span>
            ),
        },
        {
            header: "PPN",
            key: "ppn",
            align: "right",
            render: (r) => (
                <span className="text-sm text-right block text-slate-600">
                    {fmtCur(r.ppn)}
                </span>
            ),
        },
        {
            header: "Grand Total",
            key: "grandTotal",
            align: "right",
            render: (r) => (
                <span className="text-sm font-bold text-right block text-primary">
                    {fmtCur(r.grandTotal)}
                </span>
            ),
        },
        {
            header: "Aksi",
            key: "aksi",
            align: "right",
            render: (r) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/finance/accounts-payable/debit-memo/${r.id}`}
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

    const renderMobileCard = (r: DebitMemo) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        href={`/finance/accounts-payable/debit-memo/${r.id}`}
                        className="font-semibold text-primary text-sm hover:underline"
                    >
                        {r.noTransaksi}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{r.tanggal}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[r.status]}`}>
                    {r.status}
                </span>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-900">{r.pemasok}</p>
                <p className="text-xs text-slate-500">{r.refAkun}</p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <div>
                    <p className="text-[11px] text-slate-400">Grand Total</p>
                    <span className="text-sm font-bold text-primary">{fmtCur(r.grandTotal)}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Link
                        href={`/finance/accounts-payable/debit-memo/${r.id}`}
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

    // Summary totals
    const totalJumlah    = filteredData.reduce((s, r) => s + r.jumlah, 0);
    const totalPpn       = filteredData.reduce((s, r) => s + r.ppn, 0);
    const totalGrandTotal = filteredData.reduce((s, r) => s + r.grandTotal, 0);

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
                                    Daftar Debit Memo
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Pencatatan debit memo hutang pemasok (potongan & retur).
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/finance/accounts-payable/debit-memo/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Debit Memo
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
