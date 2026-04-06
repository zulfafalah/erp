"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";
import DataTable, { Column } from "../../components/DataTable";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
    id: string;
    kode: string;
    grupBarang: string;
    namaBarang: string;
    uom: string;
    hJualMin: number;
    hJualMax: number;
    gambar?: string;
    barcodes: string[];
    kodeInternal: string[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const allData: Product[] = [
    {
        id: "R0033",
        kode: "R0033",
        grupBarang: "PERSONAL CARE",
        namaBarang: "PONDS FW LGHTNNG DAY CR SPF18 PA12X3X10G",
        uom: "1 DUS@36.00 Pcs",
        hJualMin: 0.00,
        hJualMax: 0.00,
        barcodes: ["8999999042288"],
        kodeInternal: ["8999999042288"],
    },
    {
        id: "R0034",
        kode: "R0034",
        grupBarang: "PERSONAL CARE",
        namaBarang: "PONDS AGE MIRACLE NIGHT CREAM 12X3X10GR",
        uom: "1 DUS@36.00 Pcs",
        hJualMin: 0.00,
        hJualMax: 0.00,
        barcodes: ["GB124924"],
        kodeInternal: ["GB124924"],
    },
    {
        id: "A0001",
        kode: "A0001",
        grupBarang: "PERSONAL CARE",
        namaBarang: "AXE DEO DORANT BLACK 12X150ML",
        uom: "1 DUS@12.00 Pcs",
        hJualMin: 236363.64,
        hJualMax: 304545.45,
        barcodes: ["19308300185849"],
        kodeInternal: ["93008300225527"],
    },
    {
        id: "A0002",
        kode: "A0002",
        grupBarang: "PERSONAL CARE",
        namaBarang: "AXE DEO DORANT BODY SPRAY APOLLO 12X150ML",
        uom: "1 DUS@12.00 Pcs",
        hJualMin: 236363.64,
        hJualMax: 304545.45,
        barcodes: ["19308300126619"],
        kodeInternal: ["93008300077813"],
    },
    {
        id: "A0003",
        kode: "A0003",
        grupBarang: "PERSONAL CARE",
        namaBarang: "AXE DEO DORANT DARK 12X150ML",
        uom: "1 DUS@12.00 Pcs",
        hJualMin: 236363.64,
        hJualMax: 304545.45,
        barcodes: ["44808814133322"],
        kodeInternal: ["44808833141375"],
    },
    {
        id: "A0004",
        kode: "A0004",
        grupBarang: "PERSONAL CARE",
        namaBarang: "AXE DEO DORANT GOLD 12X150ML",
        uom: "1 DUS@12.00 Pcs",
        hJualMin: 236363.64,
        hJualMax: 304545.45,
        barcodes: ["19308300150519"],
        kodeInternal: ["93008300015380"],
    },
    {
        id: "A0005",
        kode: "A0005",
        grupBarang: "PERSONAL CARE",
        namaBarang: "AXE DEO DARK TEMPTATION 12 X 150 ML",
        uom: "1 DUS@12.00 Pcs",
        hJualMin: 0.00,
        hJualMax: 0.00,
        barcodes: ["8999990049433"],
        kodeInternal: ["9309990049433"],
    },
    {
        id: "A0006",
        kode: "A0006",
        grupBarang: "BEVERAGES",
        namaBarang: "AADUMMY",
        uom: "1 DUS@1.00 Pcs",
        hJualMin: 5350.00,
        hJualMax: 6020.00,
        barcodes: [],
        kodeInternal: [],
    },
    {
        id: "A0007",
        kode: "A0007",
        grupBarang: "BEVERAGES",
        namaBarang: "AITEM133",
        uom: "1 DUS@1.00 Pcs",
        hJualMin: 1.00,
        hJualMax: 1.00,
        barcodes: [],
        kodeInternal: [],
    },
    {
        id: "B0001",
        kode: "B0001",
        grupBarang: "HOME CARE",
        namaBarang: "B 29 DETERGENT 288X45GR",
        uom: "1 DUS@288.00 Pcs",
        hJualMin: 1.00,
        hJualMax: 170181.82,
        barcodes: ["18992929412523"],
        kodeInternal: ["89932929412526"],
    },
];

// ─── Filter Fields ────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
    { key: "kode",       label: "Kode Barang",   type: "text" },
    { key: "namaBarang", label: "Nama Barang",   type: "text" },
    { key: "grupBarang", label: "Grup Barang",   type: "text" },
    { key: "uom",        label: "UOM",           type: "text" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtNum = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductListPage() {
    const [filteredData, setFilteredData] = useState<Product[]>(allData);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(allData);
            return;
        }
        const result = allData.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof Product];
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

    const columns: Column<Product>[] = [
        {
            header: "Grup Barang",
            key: "grupBarang",
            render: (item) => (
                <span className="text-sm text-slate-600">{item.grupBarang}</span>
            ),
        },
        {
            header: "Nama Barang",
            key: "namaBarang",
            render: (item) => (
                <div>
                    <Link
                        href={`/master-data/product/${item.id}`}
                        className="font-semibold text-primary text-sm tracking-tight hover:underline block"
                    >
                        {item.namaBarang}
                    </Link>
                    <div className="flex flex-wrap gap-x-1 mt-0.5">
                        {item.kodeInternal.map((k, i) => (
                            <span key={i} className="text-xs text-slate-400">{k}</span>
                        ))}
                        {item.kodeInternal.length > 0 && (
                            <Link
                                href={`/master-data/product/${item.id}`}
                                className="text-xs text-primary/60 hover:text-primary"
                            >
                                (Show)
                            </Link>
                        )}
                    </div>
                </div>
            ),
        },
        {
            header: "UOM",
            key: "uom",
            render: (item) => <span className="text-sm text-slate-600">{item.uom}</span>,
        },
        {
            header: "H. Jual Min",
            key: "hJualMin",
            align: "right",
            render: (item) => (
                <span className="text-sm text-right block">
                    {fmtNum(item.hJualMin)}
                </span>
            ),
        },
        {
            header: "H. Jual Max",
            key: "hJualMax",
            align: "right",
            render: (item) => (
                <span className="text-sm font-medium text-right block">
                    {fmtNum(item.hJualMax)}
                </span>
            ),
        },
        {
            header: "Gambar",
            key: "gambar",
            render: (item) => (
                <div className="w-10 h-10 rounded-md border border-slate-200 bg-slate-100 flex items-center justify-center overflow-hidden">
                    {item.gambar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.gambar} alt={item.namaBarang} className="w-full h-full object-cover" />
                    ) : (
                        <span className="material-symbols-outlined text-slate-300 text-base">image</span>
                    )}
                </div>
            ),
        },
        {
            header: "Aksi",
            key: "aksi",
            align: "right",
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/master-data/product/${item.id}`}
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

    const renderMobileCard = (item: Product) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                    <Link
                        href={`/master-data/product/${item.id}`}
                        className="font-semibold text-primary text-sm hover:underline block truncate"
                    >
                        {item.namaBarang}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{item.grupBarang} · {item.uom}</p>
                </div>
                <div className="w-10 h-10 shrink-0 rounded-md border border-slate-200 bg-slate-100 flex items-center justify-center">
                    {item.gambar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.gambar} alt={item.namaBarang} className="w-full h-full object-cover rounded-md" />
                    ) : (
                        <span className="material-symbols-outlined text-slate-300 text-base">image</span>
                    )}
                </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <div>
                    <p className="text-xs text-slate-400">Min / Max</p>
                    <p className="text-sm font-semibold text-slate-800">
                        {fmtNum(item.hJualMin)} / {fmtNum(item.hJualMax)}
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    <Link
                        href={`/master-data/product/${item.id}`}
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
                                    Daftar Produk
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola master data barang/produk di sistem.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/master-data/product/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Produk Baru
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
