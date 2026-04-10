"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../../components/MultiFilter";
import DataTable, { Column } from "../../../components/DataTable";

// ─── Types ────────────────────────────────────────────────────────────────────

type TipeType   = "Freed" | "Potongan" | "Refund";
type StatusType = "Approved" | "Pending" | "Draft" | "Closed";

interface CreditMemo {
    id: string;
    tipe: TipeType;
    tanggal: string;
    noTransaksi: string;
    noBilyct: string;
    pelanggan: string;
    refAkun: string;
    status: StatusType;
    jumlah: number;
    ppn: number;
    grandTotal: number;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const creditMemos: CreditMemo[] = [
    {
        id: "CRN1912-0001",
        tipe: "Freed",
        tanggal: "2019-12-16",
        noTransaksi: "CRN 1912-0001",
        noBilyct: "BGI 1912-0087",
        pelanggan: "Yenny [RP]",
        refAkun: "BIAYA SELISIH BAYAR PEMBELIAN & PENJUALAN",
        status: "Approved",
        jumlah: 2000.00,
        ppn: 0.00,
        grandTotal: 2000.00,
    },
    {
        id: "CRN1912-0002",
        tipe: "Potongan",
        tanggal: "2019-12-09",
        noTransaksi: "CRN 1912-0002",
        noBilyct: "SIL 1911-0002",
        pelanggan: "Grand Semesta Mandiri,PT [RP]",
        refAkun: "PAJAK PPN KELUARAN",
        status: "Approved",
        jumlah: 33476611.63,
        ppn: 0.00,
        grandTotal: 33476611.63,
    },
    {
        id: "CRN1911-0028",
        tipe: "Refund",
        tanggal: "2019-11-19",
        noTransaksi: "CRN 1911-0028",
        noBilyct: "SIL 1911-0028",
        pelanggan: "Subur Lumimbu,PT [RP]",
        refAkun: "KAS BESAR PUSAT",
        status: "Approved",
        jumlah: 143800.00,
        ppn: 0.00,
        grandTotal: 143800.00,
    },
    {
        id: "CRN1911-0005",
        tipe: "Potongan",
        tanggal: "2019-11-18",
        noTransaksi: "CRN 1911-0005",
        noBilyct: "SIF 1910-0001",
        pelanggan: "Lisun Importacao E Exportacao [RP]",
        refAkun: "BIAYA SELISIH KURS",
        status: "Approved",
        jumlah: 1934633.87,
        ppn: 0.00,
        grandTotal: 1934633.87,
    },
    {
        id: "CRN1911-0003",
        tipe: "Potongan",
        tanggal: "2019-11-12",
        noTransaksi: "CRN 1911-0003",
        noBilyct: "SIL1990947",
        pelanggan: "SUPRANDI [RP]",
        refAkun: "BIAYA PENGHAPUSAN PIUTANG",
        status: "Approved",
        jumlah: 110000.00,
        ppn: 0.00,
        grandTotal: 110000.00,
    },
    {
        id: "CRN1911-0002",
        tipe: "Potongan",
        tanggal: "2019-11-12",
        noTransaksi: "CRN 1911-0002",
        noBilyct: "SIL1990918",
        pelanggan: "Mut.TRD [RP]",
        refAkun: "BIAYA PENGHAPUSAN PIUTANG",
        status: "Approved",
        jumlah: 21000.00,
        ppn: 0.00,
        grandTotal: 21000.00,
    },
    {
        id: "CRN1911-0001",
        tipe: "Potongan",
        tanggal: "2019-11-04",
        noTransaksi: "CRN 1911-0001",
        noBilyct: "SIL 1903-0076",
        pelanggan: "Allong (Retail) [RP]",
        refAkun: "BIAYA PENGHAPUSAN PIUTANG",
        status: "Approved",
        jumlah: 29600000.00,
        ppn: 0.00,
        grandTotal: 29600000.00,
    },
    {
        id: "CRN1910-0138",
        tipe: "Refund",
        tanggal: "2019-10-25",
        noTransaksi: "CRN 1910-0138",
        noBilyct: "BGI 1910-0138",
        pelanggan: "YOSEP [RP]",
        refAkun: "BCA 194-398-7878",
        status: "Approved",
        jumlah: 5130000.00,
        ppn: 0.00,
        grandTotal: 5130000.00,
    },
    {
        id: "CRN1910-0004",
        tipe: "Potongan",
        tanggal: "2019-10-08",
        noTransaksi: "CRN 1910-0004",
        noBilyct: "SIL 1908-0095",
        pelanggan: "UD. Global Sukses Mandiri [RP]",
        refAkun: "PAJAK PPN KELUARAN",
        status: "Approved",
        jumlah: 34254254.03,
        ppn: 0.00,
        grandTotal: 34254254.03,
    },
    {
        id: "CRN1910-0003",
        tipe: "Potongan",
        tanggal: "2019-10-08",
        noTransaksi: "CRN 1910-0003",
        noBilyct: "SIL 1908-0085",
        pelanggan: "UD. Global Sukses Mandiri [RP]",
        refAkun: "PAJAK PPN KELUARAN",
        status: "Approved",
        jumlah: 46632470.07,
        ppn: 0.00,
        grandTotal: 46632470.07,
    },
    {
        id: "CRN1910-0013",
        tipe: "Refund",
        tanggal: "2019-10-03",
        noTransaksi: "CRN 1910-0013",
        noBilyct: "BGI 1910-0013",
        pelanggan: "CV. Toko Barokah [RP]",
        refAkun: "BCA 194-398-7878",
        status: "Approved",
        jumlah: 1250000.00,
        ppn: 0.00,
        grandTotal: 1250000.00,
    },
    {
        id: "CRN1910-0005",
        tipe: "Potongan",
        tanggal: "2019-10-02",
        noTransaksi: "CRN 1910-0005",
        noBilyct: "SIL 1908-1001",
        pelanggan: "UD. Global Sukses Mandiri [RP]",
        refAkun: "PAJAK PPN KELUARAN",
        status: "Approved",
        jumlah: 28050057.00,
        ppn: 0.00,
        grandTotal: 28050057.00,
    },
    {
        id: "CRN1910-0006",
        tipe: "Potongan",
        tanggal: "2019-10-02",
        noTransaksi: "CRN 1910-0006",
        noBilyct: "SIL 1908-1002",
        pelanggan: "UD. Global Sukses Mandiri [RP]",
        refAkun: "PAJAK PPN KELUARAN",
        status: "Approved",
        jumlah: 5570182.00,
        ppn: 0.00,
        grandTotal: 5570182.00,
    },
    {
        id: "CRN1909-0011",
        tipe: "Potongan",
        tanggal: "2019-09-09",
        noTransaksi: "CRN 1909-0011",
        noBilyct: "SIL 1908-1011",
        pelanggan: "UD. Global Sukses Mandiri [RP]",
        refAkun: "PAJAK PPN KELUARAN",
        status: "Approved",
        jumlah: 33686929.01,
        ppn: 0.00,
        grandTotal: 33686929.01,
    },
    {
        id: "CRN1909-0002",
        tipe: "Potongan",
        tanggal: "2019-09-04",
        noTransaksi: "CRN 1909-0002",
        noBilyct: "SAP 1812-0002",
        pelanggan: "Mulia Jaya [RP]",
        refAkun: "BIAYA PENGHAPUSAN PIUTANG",
        status: "Approved",
        jumlah: 3305000.00,
        ppn: 0.00,
        grandTotal: 3305000.00,
    },
    {
        id: "CRN1909-0007",
        tipe: "Freed",
        tanggal: "2019-09-02",
        noTransaksi: "CRN 1909-0007",
        noBilyct: "BGI 1909-0007",
        pelanggan: "Ciganjar, TK [RP]",
        refAkun: "BIAYA SELISIH BAYAR PEMBELIAN & PENJUALAN",
        status: "Closed",
        jumlah: 500.00,
        ppn: 0.00,
        grandTotal: 500.00,
    },
    {
        id: "CRN1908-0017",
        tipe: "Potongan",
        tanggal: "2019-08-28",
        noTransaksi: "CRN 1908-0017",
        noBilyct: "SIL 1907-0155",
        pelanggan: "UD. Global Sukses Mandiri [RP]",
        refAkun: "PAJAK PPN KELUARAN",
        status: "Approved",
        jumlah: 25225870.00,
        ppn: 0.00,
        grandTotal: 25225870.00,
    },
    {
        id: "CRN1908-0001",
        tipe: "Potongan",
        tanggal: "2019-08-26",
        noTransaksi: "CRN 1908-0001",
        noBilyct: "SIL 1907-0129",
        pelanggan: "UD. Global Sukses Mandiri [RP]",
        refAkun: "PAJAK PPN KELUARAN",
        status: "Approved",
        jumlah: 21501704.00,
        ppn: 0.00,
        grandTotal: 21501704.00,
    },
    {
        id: "CRN1908-0003",
        tipe: "Potongan",
        tanggal: "2019-08-13",
        noTransaksi: "CRN 1908-0003",
        noBilyct: "SIF 1905-0001",
        pelanggan: "Shenzhen Lian Li Chuang Mao Trading Co.,LTD [RP]",
        refAkun: "BIAYA SELISIH KURS",
        status: "Approved",
        jumlah: 1446275.27,
        ppn: 0.00,
        grandTotal: 1446275.27,
    },
    {
        id: "CRN1907-0095",
        tipe: "Refund",
        tanggal: "2019-07-26",
        noTransaksi: "CRN 1907-0095",
        noBilyct: "BGI 1907-0095",
        pelanggan: "Adman [RP]",
        refAkun: "BCA 194-398-7878",
        status: "Closed",
        jumlah: 792000.00,
        ppn: 0.00,
        grandTotal: 792000.00,
    },
];

// ─── Status ────────────────────────────────────────────────────────────────────

const statusStyles: Record<StatusType, string> = {
    Approved: "bg-green-100 text-green-800",
    Pending:  "bg-yellow-100 text-yellow-800",
    Draft:    "bg-slate-100 text-slate-800",
    Closed:   "bg-emerald-100 text-emerald-800",
};

const tipeStyles: Record<TipeType, string> = {
    Freed:    "bg-purple-100 text-purple-800",
    Potongan: "bg-blue-100 text-blue-800",
    Refund:   "bg-orange-100 text-orange-800",
};

// ─── Filter Fields ─────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
    { key: "noTransaksi", label: "No. Transaksi", type: "text" },
    { key: "pelanggan",   label: "Pelanggan",      type: "text" },
    {
        key: "tipe",
        label: "Tipe",
        type: "select",
        options: [
            { label: "Freed",    value: "Freed" },
            { label: "Potongan", value: "Potongan" },
            { label: "Refund",   value: "Refund" },
        ],
    },
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

export default function CreditMemoListPage() {
    const [filteredData, setFilteredData] = useState<CreditMemo[]>(creditMemos);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(creditMemos);
            return;
        }
        const result = creditMemos.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof CreditMemo];
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

    const columns: Column<CreditMemo>[] = [
        {
            header: "Tipe",
            key: "tipe",
            render: (r) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tipeStyles[r.tipe]}`}>
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
                    href={`/finance/accounts-receivable/credit-memo/${r.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {r.noTransaksi}
                </Link>
            ),
        },
        {
            header: "Bilyct #",
            key: "noBilyct",
            render: (r) => (
                <Link
                    href={`/finance/accounts-receivable/credit-memo/${r.id}`}
                    className="text-sm text-primary hover:underline"
                >
                    {r.noBilyct}
                </Link>
            ),
        },
        {
            header: "Pelanggan",
            key: "pelanggan",
            render: (r) => <span className="text-sm font-medium">{r.pelanggan}</span>,
        },
        {
            header: "Ref Akun",
            key: "refAkun",
            render: (r) => (
                <span className="text-sm text-slate-600 max-w-[220px] truncate block" title={r.refAkun}>
                    {r.refAkun}
                </span>
            ),
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
                        href={`/finance/accounts-receivable/credit-memo/${r.id}`}
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

    const renderMobileCard = (r: CreditMemo) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        href={`/finance/accounts-receivable/credit-memo/${r.id}`}
                        className="font-semibold text-primary text-sm hover:underline"
                    >
                        {r.noTransaksi}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{r.tanggal}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[r.status]}`}>
                        {r.status}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tipeStyles[r.tipe]}`}>
                        {r.tipe}
                    </span>
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-900">{r.pelanggan}</p>
                <p className="text-xs text-slate-500 truncate">{r.refAkun}</p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <div>
                    <p className="text-[11px] text-slate-400">Grand Total</p>
                    <span className="text-sm font-bold text-primary">{fmtCur(r.grandTotal)}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Link
                        href={`/finance/accounts-receivable/credit-memo/${r.id}`}
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
    const totalJumlah     = filteredData.reduce((s, r) => s + r.jumlah, 0);
    const totalPpn        = filteredData.reduce((s, r) => s + r.ppn, 0);
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
                                    Daftar Credit Memo
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Pencatatan credit memo piutang pelanggan (freed, potongan & refund).
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/finance/accounts-receivable/credit-memo/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Credit Memo
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

                        {/* Summary Footer */}
                        <div className="bg-white rounded-xl border border-primary/10 shadow-sm px-4 md:px-6 py-4 flex flex-col sm:flex-row gap-4 sm:gap-8">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">receipt</span>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Jumlah</p>
                                    <p className="text-base md:text-lg font-black text-slate-900">{fmtCur(totalJumlah)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-amber-500">percent</span>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total PPN</p>
                                    <p className="text-base md:text-lg font-black text-amber-600">{fmtCur(totalPpn)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-emerald-500">payments</span>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Grand Total</p>
                                    <p className="text-base md:text-lg font-black text-emerald-600">{fmtCur(totalGrandTotal)}</p>
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
