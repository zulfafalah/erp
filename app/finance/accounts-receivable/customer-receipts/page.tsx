"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../../components/MultiFilter";
import DataTable, { Column } from "../../../components/DataTable";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CustomerReceipt {
    id: string;
    noBukti: string;
    jenis: string;
    keterangan: string;
    kurs: number;
    pelanggan: string;
    akun: string;
    jmlOriginal: number;
    jmlAlokasi: number;
    tglSetor: string;
    tglCair: string;
    sudahCair: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const allData: CustomerReceipt[] = [
    {
        id: "BGI2604-0001",
        noBukti: "BGI 2604-0001",
        jenis: "Transfer",
        keterangan: "Transfer",
        kurs: 1.00,
        pelanggan: "AYU",
        akun: "120.01.01-BCA 194-398-7878",
        jmlOriginal: 1000000,
        jmlAlokasi: 327971.70,
        tglSetor: "2026-04-10",
        tglCair: "2026-04-10",
        sudahCair: true,
    },
    {
        id: "BGI2309-0001",
        noBukti: "BGI 2309-0001",
        jenis: "Transfer",
        keterangan: "Transfer",
        kurs: 1.00,
        pelanggan: "ABUN",
        akun: "120.01.01-BCA 194-398-7878",
        jmlOriginal: 10000,
        jmlAlokasi: 6000,
        tglSetor: "2023-09-08",
        tglCair: "2023-09-08",
        sudahCair: true,
    },
    {
        id: "BGI2107-0001",
        noBukti: "BGI 2107-0001",
        jenis: "Cheque",
        keterangan: "Cheque BCA 738718371",
        kurs: 1.00,
        pelanggan: "DAMAS KARYA ABADI, PT",
        akun: "120.01.01-BCA 194-398-7878",
        jmlOriginal: 17000000,
        jmlAlokasi: 15038000.01,
        tglSetor: "2021-07-06",
        tglCair: "2021-07-06",
        sudahCair: true,
    },
    {
        id: "BGI1912-0152",
        noBukti: "BGI 1912-0152",
        jenis: "Transfer",
        keterangan: "Transfer 31/12/2019",
        kurs: 1.00,
        pelanggan: "AKA",
        akun: "120.01.01-BCA 194-398-7878",
        jmlOriginal: 122785000,
        jmlAlokasi: 122785000,
        tglSetor: "2019-12-31",
        tglCair: "2019-12-31",
        sudahCair: true,
    },
    {
        id: "BGI1912-0151",
        noBukti: "BGI 1912-0151",
        jenis: "Transfer",
        keterangan: "Transfer 31/12/2019",
        kurs: 1.00,
        pelanggan: "ROBERT SERANG",
        akun: "120.01.01-BCA 194-398-7878",
        jmlOriginal: 46890000,
        jmlAlokasi: 45890000,
        tglSetor: "2019-12-31",
        tglCair: "2019-12-31",
        sudahCair: true,
    },
    {
        id: "BGI1912-0150",
        noBukti: "BGI 1912-0150",
        jenis: "Transfer",
        keterangan: "Transfer 30/12/2019",
        kurs: 1.00,
        pelanggan: "NURMALA",
        akun: "120.01.01-BCA 194-398-7878",
        jmlOriginal: 57350000,
        jmlAlokasi: 57350000,
        tglSetor: "2019-12-30",
        tglCair: "2019-12-30",
        sudahCair: true,
    },
    {
        id: "BGI1912-0149",
        noBukti: "BGI 1912-0149",
        jenis: "Transfer",
        keterangan: "Transfer 30/12/2019",
        kurs: 1.00,
        pelanggan: "SANDRY",
        akun: "120.01.01-BCA 194-398-7878",
        jmlOriginal: 74600000,
        jmlAlokasi: 74600000,
        tglSetor: "2019-12-30",
        tglCair: "2019-12-30",
        sudahCair: true,
    },
    {
        id: "BGI1912-0148",
        noBukti: "BGI 1912-0148",
        jenis: "Transfer",
        keterangan: "Transfer 30/12/2019",
        kurs: 1.00,
        pelanggan: "MURITRD",
        akun: "120.01.01-BCA 194-398-7878",
        jmlOriginal: 48805000,
        jmlAlokasi: 48805000,
        tglSetor: "2019-12-30",
        tglCair: "2019-12-30",
        sudahCair: true,
    },
    {
        id: "BGI1912-0147",
        noBukti: "BGI 1912-0147",
        jenis: "Transfer",
        keterangan: "Transfer 30/12/2019",
        kurs: 1.00,
        pelanggan: "ADNAN",
        akun: "120.01.01-BCA 194-398-7878",
        jmlOriginal: 43000000,
        jmlAlokasi: 43000000,
        tglSetor: "2019-12-30",
        tglCair: "2019-12-30",
        sudahCair: true,
    },
    {
        id: "BGI1912-0146",
        noBukti: "BGI 1912-0146",
        jenis: "Transfer",
        keterangan: "Transfer 30/12/2019",
        kurs: 1.00,
        pelanggan: "JANI WIDJAJA",
        akun: "120.01.01-BCA 194-398-7878",
        jmlOriginal: 85000000,
        jmlAlokasi: 85000000,
        tglSetor: "2019-12-30",
        tglCair: "2019-12-30",
        sudahCair: true,
    },
    {
        id: "BGI1912-0145",
        noBukti: "BGI 1912-0145",
        jenis: "Transfer",
        keterangan: "Transfer 30/12/2019",
        kurs: 1.00,
        pelanggan: "HANDI TAN",
        akun: "120.01.01-BCA 194-398-7878",
        jmlOriginal: 52776000,
        jmlAlokasi: 52776000,
        tglSetor: "2019-12-30",
        tglCair: "2019-12-30",
        sudahCair: true,
    },
    {
        id: "BGI1912-0144",
        noBukti: "BGI 1912-0144",
        jenis: "Transfer",
        keterangan: "Transfer 27/12/2019",
        kurs: 1.00,
        pelanggan: "BERSATU INDAH GEMILANG,CV",
        akun: "120.01.01-BCA 194-398-7878",
        jmlOriginal: 356093000,
        jmlAlokasi: 356093000,
        tglSetor: "2019-12-27",
        tglCair: "2019-12-27",
        sudahCair: true,
    },
    {
        id: "BGI1912-0143",
        noBukti: "BGI 1912-0143",
        jenis: "Transfer",
        keterangan: "Transfer 27/12/2019",
        kurs: 1.00,
        pelanggan: "YENNY",
        akun: "120.01.01-BCA 194-398-7878",
        jmlOriginal: 64000000,
        jmlAlokasi: 64000000,
        tglSetor: "2019-12-27",
        tglCair: "2019-12-27",
        sudahCair: true,
    },
    {
        id: "BGI1912-0142",
        noBukti: "BGI 1912-0142",
        jenis: "Transfer",
        keterangan: "Transfer 27/12/2019 TF Rp 88.630.000",
        kurs: 1.00,
        pelanggan: "KAROLINA",
        akun: "120.01.01-BCA 194-398-7878",
        jmlOriginal: 19800000,
        jmlAlokasi: 19800000,
        tglSetor: "2019-12-27",
        tglCair: "2019-12-27",
        sudahCair: true,
    },
    {
        id: "BGI1912-0141",
        noBukti: "BGI 1912-0141",
        jenis: "Transfer",
        keterangan: "Transfer 27/12/2019 TF Rp 88.630.000",
        kurs: 1.00,
        pelanggan: "DARLICHE JAYA",
        akun: "120.01.01-BCA 194-398-7878",
        jmlOriginal: 4830000,
        jmlAlokasi: 4830000,
        tglSetor: "2019-12-27",
        tglCair: "2019-12-27",
        sudahCair: true,
    },
    {
        id: "BGI1912-0140",
        noBukti: "BGI 1912-0140",
        jenis: "Transfer",
        keterangan: "Transfer 27/12/2019",
        kurs: 1.00,
        pelanggan: "ASIONG",
        akun: "120.01.01-BCA 194-398-7878",
        jmlOriginal: 3420000,
        jmlAlokasi: 3420000,
        tglSetor: "2019-12-27",
        tglCair: "2019-12-27",
        sudahCair: true,
    },
    {
        id: "BGI1912-0139",
        noBukti: "BGI 1912-0139",
        jenis: "Transfer",
        keterangan: "Transfer 27/12/2019",
        kurs: 1.00,
        pelanggan: "ASIONG",
        akun: "120.01.01-BCA 194-398-7878",
        jmlOriginal: 45959000,
        jmlAlokasi: 45959000,
        tglSetor: "2019-12-27",
        tglCair: "2019-12-27",
        sudahCair: true,
    },
    {
        id: "BGI1912-0138",
        noBukti: "BGI 1912-0138",
        jenis: "Transfer",
        keterangan: "Transfer 27/12/2019",
        kurs: 1.00,
        pelanggan: "ASIONG",
        akun: "120.01.01-BCA 194-398-7878",
        jmlOriginal: 5125000,
        jmlAlokasi: 5125000,
        tglSetor: "2019-12-27",
        tglCair: "2019-12-27",
        sudahCair: true,
    },
    {
        id: "BGI1912-0137",
        noBukti: "BGI 1912-0137",
        jenis: "Transfer",
        keterangan: "Transfer 27/12/2019",
        kurs: 1.00,
        pelanggan: "ASIONG",
        akun: "120.01.01-BCA 194-398-7878",
        jmlOriginal: 70028000,
        jmlAlokasi: 78028000,
        tglSetor: "2019-12-27",
        tglCair: "2019-12-27",
        sudahCair: true,
    },
    {
        id: "BGI1912-0136",
        noBukti: "BGI 1912-0136",
        jenis: "Transfer",
        keterangan: "Transfer 27/12/2019 TF Rp 349.022.000",
        kurs: 1.00,
        pelanggan: "LIMA DARA",
        akun: "120.01.01-BCA 194-398-7878",
        jmlOriginal: 84366000,
        jmlAlokasi: 84366000,
        tglSetor: "2019-12-27",
        tglCair: "2019-12-27",
        sudahCair: true,
    },
];

// ─── Filter Fields ────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
    { key: "noBukti", label: "No. Bukti", type: "text" },
    { key: "pelanggan", label: "Pelanggan", type: "text" },
    {
        key: "jenis", label: "Jenis", type: "select", options: [
            { label: "Transfer", value: "Transfer" },
            { label: "Cheque", value: "Cheque" },
            { label: "Tunai", value: "Tunai" },
        ]
    },
    { key: "keterangan", label: "Keterangan", type: "text" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCur = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CustomerReceiptsListPage() {
    const [filteredData, setFilteredData] = useState<CustomerReceipt[]>(allData);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(allData);
            return;
        }
        const result = allData.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof CustomerReceipt];
                if (itemValue === undefined) return true;
                const itemStr = String(itemValue).toLowerCase();
                const valStr = value.toLowerCase();
                switch (operator) {
                    case "contains": return itemStr.includes(valStr);
                    case "equals": return itemStr === valStr;
                    case "not_equals": return itemStr !== valStr;
                    case "starts_with": return itemStr.startsWith(valStr);
                    case "ends_with": return itemStr.endsWith(valStr);
                    default: return true;
                }
            })
        );
        setFilteredData(result);
    };

    const columns: Column<CustomerReceipt>[] = [
        {
            header: "#",
            key: "no",
            render: (_r, idx) => <span className="text-sm text-slate-500">{(idx ?? 0) + 1}.</span>,
        },
        {
            header: "Bukti #",
            key: "noBukti",
            render: (r) => (
                <Link
                    href={`/finance/accounts-receivable/customer-receipts/${r.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {r.noBukti}
                </Link>
            ),
        },
        {
            header: "Jenis",
            key: "jenis",
            render: (r) => <span className="text-sm">{r.jenis}</span>,
        },
        {
            header: "Keterangan",
            key: "keterangan",
            render: (r) => (
                <span className="text-sm text-slate-600 max-w-[200px] truncate block" title={r.keterangan}>
                    {r.keterangan}
                </span>
            ),
        },
        {
            header: "Kurs",
            key: "kurs",
            align: "right",
            render: (r) => <span className="text-sm text-right block">{r.kurs.toFixed(2)}</span>,
        },
        {
            header: "Pelanggan",
            key: "pelanggan",
            render: (r) => <span className="text-sm font-medium">{r.pelanggan}</span>,
        },
        {
            header: "Akun",
            key: "akun",
            render: (r) => <span className="text-sm text-slate-600">{r.akun}</span>,
        },
        {
            header: "Jml Original",
            key: "jmlOriginal",
            align: "right",
            render: (r) => (
                <span className="text-sm font-bold text-right block">
                    {fmtCur(r.jmlOriginal)}
                </span>
            ),
        },
        {
            header: "Jml Alokasi",
            key: "jmlAlokasi",
            align: "right",
            render: (r) => (
                <span
                    className={`text-sm font-bold text-right block ${r.jmlAlokasi >= r.jmlOriginal
                            ? "text-primary"
                            : "text-amber-600"
                        }`}
                >
                    {fmtCur(r.jmlAlokasi)}
                </span>
            ),
        },
        {
            header: "Tgl. Setor",
            key: "tglSetor",
            render: (r) => <span className="text-sm">{r.tglSetor}</span>,
        },
        {
            header: "Tgl. Cair",
            key: "tglCair",
            render: (r) => (
                <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${r.sudahCair
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                >
                    {r.tglCair}
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
                        href={`/finance/accounts-receivable/customer-receipts/${r.id}`}
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

    const renderMobileCard = (r: CustomerReceipt) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        href={`/finance/accounts-receivable/customer-receipts/${r.id}`}
                        className="font-semibold text-primary text-sm hover:underline"
                    >
                        {r.noBukti}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{r.tglSetor}</p>
                </div>
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${r.sudahCair ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}
                >
                    {r.sudahCair ? "Cair" : "Belum Cair"}
                </span>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-900">{r.pelanggan}</p>
                <p className="text-xs text-slate-500">{r.jenis} · {r.keterangan}</p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <div>
                    <p className="text-[11px] text-slate-400">Jml Original</p>
                    <span className="text-sm font-bold text-slate-900">{fmtCur(r.jmlOriginal)}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Link
                        href={`/finance/accounts-receivable/customer-receipts/${r.id}`}
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
    const totalOriginal = filteredData.reduce((s, r) => s + r.jmlOriginal, 0);
    const totalAlokasi = filteredData.reduce((s, r) => s + r.jmlAlokasi, 0);

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
                                    Penerimaan Pembayaran Pelanggan
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Pencatatan penerimaan pembayaran dari pelanggan (Customer Receipts).
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/finance/accounts-receivable/customer-receipts/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Penerimaan Baru
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
