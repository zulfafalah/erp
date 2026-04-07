"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../../components/MultiFilter";
import DataTable, { Column } from "../../../components/DataTable";

// ─── Types ────────────────────────────────────────────────────────────────────

type JenisBliyet = "BG" | "Transfer" | "Tunai" | "BATAL";

interface VendorPayment {
    id: string;
    noBukti: string;
    jenis: JenisBliyet;
    keterangan: string;
    kurs: string;
    pemasok: string;
    akun: string;
    jmlOriginal: number;
    jmlAlokasi: number;
    tglSetor: string;
    tglCair: string;
    sudahCair: boolean;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const vendorPayments: VendorPayment[] = [
    {
        id: "BGO2207-0001",
        noBukti: "BGO 2207-0001",
        jenis: "BG",
        keterangan: "BG",
        kurs: "IDR 1.00",
        pemasok: "UNILEVER",
        akun: "120.01.01-BCA 194-398-7878",
        jmlOriginal: 1000000.00,
        jmlAlokasi: 550152.90,
        tglSetor: "2022-07-01",
        tglCair: "2022-07-01",
        sudahCair: true,
    },
    {
        id: "BGO2206-0001",
        noBukti: "BGO 2206-0001",
        jenis: "BG",
        keterangan: "BG BCA 38747837487384",
        kurs: "IDR 1.00",
        pemasok: "UNILEVER",
        akun: "120.01.01-BCA 194-398-7878",
        jmlOriginal: 2000000.00,
        jmlAlokasi: 1528798.97,
        tglSetor: "2022-06-30",
        tglCair: "2022-06-30",
        sudahCair: true,
    },
    {
        id: "BGO1912-0006",
        noBukti: "BGO 1912-0006",
        jenis: "Transfer",
        keterangan: "Transfer",
        kurs: "IDR 1.00",
        pemasok: "CV. CITRA HARAPAN JAYA",
        akun: "120.01.02-BCA 194-448-7878",
        jmlOriginal: 113850000.00,
        jmlAlokasi: 113850000.00,
        tglSetor: "2019-12-24",
        tglCair: "2019-12-24",
        sudahCair: true,
    },
    {
        id: "BGO1912-0005",
        noBukti: "BGO 1912-0005",
        jenis: "Transfer",
        keterangan: "Transfer",
        kurs: "IDR 1.00",
        pemasok: "CARREFOUR PURI INDAH",
        akun: "120.01.02-BCA 194-448-7878",
        jmlOriginal: 160200000.00,
        jmlAlokasi: 160200000.00,
        tglSetor: "2019-12-23",
        tglCair: "2019-12-23",
        sudahCair: true,
    },
    {
        id: "BGO1912-0004",
        noBukti: "BGO 1912-0004",
        jenis: "Transfer",
        keterangan: "Transfer",
        kurs: "IDR 1.00",
        pemasok: "WAHANA INDAH SURYA BAHARI, PT",
        akun: "120.01.02-BCA 194-448-7878",
        jmlOriginal: 617387232.00,
        jmlAlokasi: 617387232.00,
        tglSetor: "2019-12-20",
        tglCair: "2019-12-20",
        sudahCair: true,
    },
    {
        id: "BGO1912-0003",
        noBukti: "BGO 1912-0003",
        jenis: "Transfer",
        keterangan: "Transfer",
        kurs: "IDR 1.00",
        pemasok: "CARREFOUR DENPASAR",
        akun: "120.01.02-BCA 194-448-7878",
        jmlOriginal: 332039600.00,
        jmlAlokasi: 332039600.00,
        tglSetor: "2019-12-16",
        tglCair: "2019-12-16",
        sudahCair: true,
    },
    {
        id: "BGO1912-0002",
        noBukti: "BGO 1912-0002",
        jenis: "Transfer",
        keterangan: "Transfer",
        kurs: "IDR 1.00",
        pemasok: "UNILEVER",
        akun: "120.01.02-BCA 194-448-7878",
        jmlOriginal: 2000000000.00,
        jmlAlokasi: 2000000000.00,
        tglSetor: "2019-12-12",
        tglCair: "2019-12-12",
        sudahCair: true,
    },
    {
        id: "BGO1912-0001",
        noBukti: "BGO 1912-0001",
        jenis: "Transfer",
        keterangan: "Transfer",
        kurs: "IDR 1.00",
        pemasok: "UNILEVER",
        akun: "120.01.02-BCA 194-448-7878",
        jmlOriginal: 3000000000.00,
        jmlAlokasi: 3000000000.00,
        tglSetor: "2019-12-12",
        tglCair: "2019-12-12",
        sudahCair: true,
    },
    {
        id: "BGO1911-0006",
        noBukti: "BGO 1911-0006",
        jenis: "Transfer",
        keterangan: "Transfer",
        kurs: "IDR 1.00",
        pemasok: "UNILEVER",
        akun: "120.01.02-BCA 194-448-7878",
        jmlOriginal: 2000000000.00,
        jmlAlokasi: 2000000000.00,
        tglSetor: "2019-11-14",
        tglCair: "2019-11-14",
        sudahCair: true,
    },
    {
        id: "BGO1911-0005",
        noBukti: "BGO 1911-0005",
        jenis: "Transfer",
        keterangan: "Transfer",
        kurs: "IDR 1.00",
        pemasok: "UNILEVER",
        akun: "120.01.02-BCA 194-448-7878",
        jmlOriginal: 3000000000.00,
        jmlAlokasi: 3000000000.00,
        tglSetor: "2019-11-14",
        tglCair: "2019-11-14",
        sudahCair: true,
    },
    {
        id: "BGO1911-0004",
        noBukti: "BGO 1911-0004",
        jenis: "Transfer",
        keterangan: "BATAL",
        kurs: "IDR 1.00",
        pemasok: "UNILEVER",
        akun: "110.02.01-KAS BESAR PUSAT",
        jmlOriginal: 0.00,
        jmlAlokasi: 0.00,
        tglSetor: "2019-01-14",
        tglCair: "2019-01-14",
        sudahCair: false,
    },
    {
        id: "BGO1911-0003",
        noBukti: "BGO 1911-0003",
        jenis: "Transfer",
        keterangan: "Transfer",
        kurs: "IDR 1.00",
        pemasok: "UNILEVER",
        akun: "120.01.02-BCA 194-448-7878",
        jmlOriginal: 3000000000.00,
        jmlAlokasi: 2000000000.00,
        tglSetor: "2019-11-04",
        tglCair: "2019-11-04",
        sudahCair: true,
    },
    {
        id: "BGO1911-0002",
        noBukti: "BGO 1911-0002",
        jenis: "Transfer",
        keterangan: "Transfer",
        kurs: "IDR 1.00",
        pemasok: "UNILEVER",
        akun: "120.01.02-BCA 194-448-7878",
        jmlOriginal: 3000000000.00,
        jmlAlokasi: 3000000000.00,
        tglSetor: "2019-11-04",
        tglCair: "2019-11-04",
        sudahCair: true,
    },
    {
        id: "BGO1911-0001",
        noBukti: "BGO 1911-0001",
        jenis: "Transfer",
        keterangan: "Transfer",
        kurs: "IDR 1.00",
        pemasok: "UNILEVER",
        akun: "120.01.02-BCA 194-448-7878",
        jmlOriginal: 3000000000.00,
        jmlAlokasi: 3000000000.00,
        tglSetor: "2019-11-04",
        tglCair: "2019-11-04",
        sudahCair: true,
    },
    {
        id: "BGO1910-0005",
        noBukti: "BGO 1910-0005",
        jenis: "Transfer",
        keterangan: "Transfer",
        kurs: "IDR 1.00",
        pemasok: "MANDALA DHARMA KRIDA, PT",
        akun: "120.01.02-BCA 194-448-7878",
        jmlOriginal: 12149000.00,
        jmlAlokasi: 12149000.00,
        tglSetor: "2019-10-15",
        tglCair: "2019-10-15",
        sudahCair: true,
    },
    {
        id: "BGO1910-0004",
        noBukti: "BGO 1910-0004",
        jenis: "Transfer",
        keterangan: "Transfer",
        kurs: "IDR 1.00",
        pemasok: "MANDALA DHARMA KRIDA, PT",
        akun: "120.01.02-BCA 194-448-7878",
        jmlOriginal: 317375200.00,
        jmlAlokasi: 317375204.31,
        tglSetor: "2019-10-14",
        tglCair: "2019-10-14",
        sudahCair: true,
    },
    {
        id: "BGO1910-0003",
        noBukti: "BGO 1910-0003",
        jenis: "Transfer",
        keterangan: "Transfer",
        kurs: "IDR 1.00",
        pemasok: "UNILEVER",
        akun: "120.01.02-BCA 194-448-7878",
        jmlOriginal: 2000000000.00,
        jmlAlokasi: 2000000000.00,
        tglSetor: "2019-10-14",
        tglCair: "2019-10-14",
        sudahCair: true,
    },
    {
        id: "BGO1910-0002",
        noBukti: "BGO 1910-0002",
        jenis: "Transfer",
        keterangan: "Transfer",
        kurs: "IDR 1.00",
        pemasok: "UNILEVER",
        akun: "120.01.02-BCA 194-448-7878",
        jmlOriginal: 3000000000.00,
        jmlAlokasi: 3000000000.00,
        tglSetor: "2019-10-14",
        tglCair: "2019-10-14",
        sudahCair: true,
    },
    {
        id: "BGO1910-0001",
        noBukti: "BGO 1910-0001",
        jenis: "Transfer",
        keterangan: "Transfer",
        kurs: "IDR 1.00",
        pemasok: "MANDALA DHARMA KRIDA, PT",
        akun: "120.01.02-BCA 194-448-7878",
        jmlOriginal: 198362745.00,
        jmlAlokasi: 198362745.00,
        tglSetor: "2019-10-01",
        tglCair: "2019-10-01",
        sudahCair: true,
    },
    {
        id: "BGO1909-0009",
        noBukti: "BGO 1909-0009",
        jenis: "Transfer",
        keterangan: "Transfer",
        kurs: "IDR 1.00",
        pemasok: "UNILEVER",
        akun: "120.01.02-BCA 194-448-7878",
        jmlOriginal: 1000000000.00,
        jmlAlokasi: 1000000000.00,
        tglSetor: "2019-09-24",
        tglCair: "2019-09-24",
        sudahCair: true,
    },
];

// ─── Filter Fields ─────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
    { key: "noBukti",   label: "No. Bukti",  type: "text" },
    { key: "pemasok",   label: "Pemasok",    type: "text" },
    { key: "akun",      label: "Akun",       type: "text" },
    {
        key: "jenis",
        label: "Jenis",
        type: "select",
        options: [
            { label: "BG",       value: "BG" },
            { label: "Transfer", value: "Transfer" },
            { label: "Tunai",    value: "Tunai" },
            { label: "BATAL",    value: "BATAL" },
        ],
    },
    {
        key: "sudahCair",
        label: "Sudah Cair",
        type: "select",
        options: [
            { label: "Ya",    value: "true" },
            { label: "Belum", value: "false" },
        ],
    },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

const fmtCur = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const jenisBadge = (jenis: JenisBliyet) => {
    const map: Record<JenisBliyet, string> = {
        BG:       "bg-blue-100 text-blue-800",
        Transfer: "bg-indigo-100 text-indigo-800",
        Tunai:    "bg-green-100 text-green-800",
        BATAL:    "bg-red-100 text-red-800",
    };
    return map[jenis] ?? "bg-slate-100 text-slate-800";
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function VendorPaymentsListPage() {
    const [filteredData, setFilteredData] = useState<VendorPayment[]>(vendorPayments);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(vendorPayments);
            return;
        }
        const result = vendorPayments.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof VendorPayment];
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

    const columns: Column<VendorPayment>[] = [
        {
            header: "Bukti #",
            key: "noBukti",
            render: (r) => (
                <Link
                    href={`/finance/accounts-payable/vendor-payments/${r.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {r.noBukti}
                </Link>
            ),
        },
        {
            header: "Jenis",
            key: "jenis",
            render: (r) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${jenisBadge(r.jenis)}`}>
                    {r.jenis}
                </span>
            ),
        },
        {
            header: "Keterangan",
            key: "keterangan",
            render: (r) => <span className="text-sm text-slate-600">{r.keterangan}</span>,
        },
        {
            header: "Kurs",
            key: "kurs",
            render: (r) => <span className="text-sm text-slate-500">{r.kurs}</span>,
        },
        {
            header: "Pemasok",
            key: "pemasok",
            render: (r) => <span className="text-sm font-medium text-slate-900">{r.pemasok}</span>,
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
                <span className="text-sm font-semibold text-right block">
                    {fmtCur(r.jmlOriginal)}
                </span>
            ),
        },
        {
            header: "Jml Alokasi",
            key: "jmlAlokasi",
            align: "right",
            render: (r) => {
                const isPartial = r.jmlAlokasi < r.jmlOriginal && r.jmlAlokasi > 0;
                const isEmpty   = r.jmlAlokasi === 0;
                return (
                    <span className={`text-sm font-semibold text-right block ${
                        isEmpty   ? "text-red-500"
                            : isPartial ? "text-amber-600"
                                : "text-emerald-600"
                    }`}>
                        {fmtCur(r.jmlAlokasi)}
                    </span>
                );
            },
        },
        {
            header: "Tgl. Setor",
            key: "tglSetor",
            render: (r) => (
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${r.sudahCair ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                    {r.tglSetor}
                </span>
            ),
        },
        {
            header: "Tgl. Cair",
            key: "tglCair",
            render: (r) => (
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${r.sudahCair ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-500"}`}>
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
                        href={`/finance/accounts-payable/vendor-payments/${r.id}`}
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

    const renderMobileCard = (r: VendorPayment) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        href={`/finance/accounts-payable/vendor-payments/${r.id}`}
                        className="font-semibold text-primary text-sm hover:underline"
                    >
                        {r.noBukti}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{r.tglSetor}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${jenisBadge(r.jenis)}`}>
                    {r.jenis}
                </span>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-900">{r.pemasok}</p>
                <p className="text-xs text-slate-500">{r.akun}</p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <div>
                    <p className="text-[11px] text-slate-400">Jml Original</p>
                    <span className="text-sm font-bold text-slate-900">{fmtCur(r.jmlOriginal)}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Link
                        href={`/finance/accounts-payable/vendor-payments/${r.id}`}
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
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-28 md:pb-8 space-y-4 md:space-y-8">
                        {/* Title and Actions */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                                    Pembayaran ke Pemasok
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Pencatatan pengeluaran pembayaran ke pemasok (BG, Transfer, Tunai).
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/finance/accounts-payable/vendor-payments/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Pembayaran
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
