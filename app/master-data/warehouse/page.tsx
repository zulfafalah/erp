"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";
import DataTable, { Column } from "../../components/DataTable";

interface Warehouse {
    id: string;
    kode: string;
    nama: string;
    alamat: string;
    telp: string;
    pic: string;
}

const allData: Warehouse[] = [
    { id: "WH-001", kode: "GDCTC",   nama: "GUDANG CARREFOUR TANGERANG CENTER", alamat: "Kompleks Mahkota Mas, Jl. M.H. Thamrin, Cikokol, RT.006/RW.036, Cikokol, Kec. Tangerang, Kota Tangerang, Banten 15117", telp: "085777764725", pic: "Bapak M. Nor" },
    { id: "WH-002", kode: "GDPA8",   nama: "GUDANG DADAP A8",                  alamat: "PERGUDANGAN MUTIARA KOSAMBI 1 BLOK A8 NO. 25-26",                                                                           telp: "",              pic: "BAPAK BEBEN NICCO" },
    { id: "WH-003", kode: "GDPB3A8", nama: "GUDANG DADAP B3 A8",               alamat: "GUDANG DADAP B3 A8",                                                                                                          telp: "",              pic: "GUDANG DADAP B3 A8" },
    { id: "WH-004", kode: "GDPB3C7", nama: "GUDANG DADAP B3C7",                alamat: "GDPB3C7",                                                                                                                     telp: "",              pic: "GUDANG DADAP B3 A8" },
    { id: "WH-005", kode: "GDPC7",   nama: "GUDANG DADAP C7",                  alamat: "PBK. MUATIARA KOSAMBI 1 BLOK C7 NO.16",                                                                                      telp: "",              pic: "BAPAK BEBEN NICCO" },
    { id: "WH-006", kode: "GDGK8",   nama: "GUDANG GIANT KALIBATA",            alamat: "Jl. Rawajati Timur I, RT.3/RW.2, Rawajati, Pancoran, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12710",             telp: "0800 199 8677 , 0811 9880 711", pic: "BPK. ZAINAL" },
    { id: "WH-007", kode: "GDGUM",   nama: "GUDANG GIANT UJUNG MENTENG",       alamat: "Jl. Raya Bekasi KM.25, RW.1, Ujung Menteng, Cakung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13960",               telp: "021-46802401 , 0815 9880 711", pic: "BPK. ZAINAL" },
    { id: "WH-008", kode: "GDNDK",   nama: "GUDANG MANDALA DHARMA KRIDA",      alamat: "BISNIS UNIT DISTRIBUSI JL. RAYA PEMDA NO. 50 SUKARAJA BOGOR JAWA BARAT",                                                    telp: "08118500805",  pic: "BPK. DADANG DIAYADI" },
    { id: "WH-009", kode: "GGPK",    nama: "Gudang Kapuk",                     alamat: "Alamat gudang, berikut kota, negara dan kodepos",                                                                             telp: "No. Tilp / No. Fax", pic: "Person in charge GD1" },
    { id: "WH-010", kode: "GGPKB1",  nama: "GUDANG KAPUK B1",                  alamat: "GUDANG KAPUK B1",                                                                                                             telp: "",              pic: "GUDANG KAPUK B1" },
];

const FILTER_FIELDS: FilterField[] = [
    { key: "kode",  label: "Kode",          type: "text" },
    { key: "nama",  label: "Nama Gudang",   type: "text" },
    { key: "alamat", label: "Alamat",       type: "text" },
    { key: "pic",   label: "PIC",           type: "text" },
];

export default function WarehouseListPage() {
    const [filteredData, setFilteredData] = useState<Warehouse[]>(allData);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(allData);
            return;
        }
        const result = allData.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof Warehouse];
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

    const columns: Column<Warehouse>[] = [
        {
            header: "Kode",
            key: "kode",
            render: (item) => (
                <Link
                    href={`/master-data/warehouse/${item.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {item.kode}
                </Link>
            ),
        },
        {
            header: "Nama Gudang",
            key: "nama",
            render: (item) => (
                <span className="text-sm font-medium text-slate-800">{item.nama}</span>
            ),
        },
        {
            header: "Alamat",
            key: "alamat",
            render: (item) => (
                <span className="text-sm text-slate-500 line-clamp-2 max-w-xs">{item.alamat}</span>
            ),
        },
        {
            header: "Telp",
            key: "telp",
            render: (item) => (
                <span className="text-sm text-slate-600">{item.telp || "—"}</span>
            ),
        },
        {
            header: "PIC",
            key: "pic",
            render: (item) => (
                <span className="text-sm text-slate-600">{item.pic || "—"}</span>
            ),
        },
        {
            header: "Aksi",
            key: "aksi",
            align: "right",
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/master-data/warehouse/${item.id}`}
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

    const renderMobileCard = (item: Warehouse) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        href={`/master-data/warehouse/${item.id}`}
                        className="font-semibold text-primary text-sm hover:underline"
                    >
                        {item.kode}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{item.nama}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-xs mr-1">warehouse</span>
                    Gudang
                </span>
            </div>
            <div>
                <p className="text-xs text-slate-500 line-clamp-2">{item.alamat}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                    <span className="text-slate-400 uppercase font-semibold">Telp</span>
                    <p className="text-slate-700 font-medium mt-0.5">{item.telp || "—"}</p>
                </div>
                <div>
                    <span className="text-slate-400 uppercase font-semibold">PIC</span>
                    <p className="text-slate-700 font-medium mt-0.5">{item.pic || "—"}</p>
                </div>
            </div>
            <div className="flex justify-end items-center pt-2 border-t border-slate-100 gap-1">
                <Link
                    href={`/master-data/warehouse/${item.id}`}
                    className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                >
                    <span className="material-symbols-outlined text-base">edit_square</span>
                </Link>
                <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined text-base">delete</span>
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
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-28 md:pb-8 space-y-4 md:space-y-8">

                        {/* Title & Actions */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                                    Daftar Gudang
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola master data gudang yang tersedia di sistem.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter
                                    fields={FILTER_FIELDS}
                                    onApplyFilter={handleApplyFilter}
                                />
                                <Link
                                    href="/master-data/warehouse/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Gudang Baru
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
