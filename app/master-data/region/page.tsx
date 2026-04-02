"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";
import DataTable, { Column } from "../../components/DataTable";

interface Region {
    id: string;
    kota: string;
    kode: string;
    nama: string;
}

const allData: Region[] = [
    { id: "RG-001", kota: "EXPORT",    kode: "EXPORT",    nama: "EXPORT" },
    { id: "RG-002", kota: "JAKARTA",   kode: "JAKARTA",   nama: "JAKARTA" },
    { id: "RG-003", kota: "JAWA",      kode: "JAWA",      nama: "JAWA" },
    { id: "RG-004", kota: "KALIMANTAN",kode: "KALIMANTAN",nama: "KALIMANTAN" },
    { id: "RG-005", kota: "MEDAN",     kode: "MEDAN",     nama: "MEDAN" },
    { id: "RG-006", kota: "SULAWESI",  kode: "SULAWESI",  nama: "SULAWESI" },
    { id: "RG-007", kota: "SURABAYA",  kode: "SURABAYA",  nama: "SURABAYA" },
];

const FILTER_FIELDS: FilterField[] = [
    { key: "kota", label: "Nama Kota",    type: "text" },
    { key: "kode", label: "Kode Wilayah", type: "text" },
    { key: "nama", label: "Nama Wilayah", type: "text" },
];

export default function RegionListPage() {
    const [filteredData, setFilteredData] = useState<Region[]>(allData);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(allData);
            return;
        }
        const result = allData.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof Region];
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

    const columns: Column<Region>[] = [
        {
            header: "Nama Kota",
            key: "kota",
            render: (item) => (
                <span className="text-sm font-medium text-slate-800">
                    {item.kota}
                </span>
            ),
        },
        {
            header: "Kode Wilayah",
            key: "kode",
            render: (item) => (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-primary/10 text-primary uppercase">
                    {item.kode}
                </span>
            ),
        },
        {
            header: "Nama Wilayah",
            key: "nama",
            render: (item) => (
                <Link
                    href={`/master-data/region/${item.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {item.nama}
                </Link>
            ),
        },
        {
            header: "Aksi",
            key: "aksi",
            align: "right",
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/master-data/region/${item.id}`}
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

    const renderMobileCard = (item: Region) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        href={`/master-data/region/${item.id}`}
                        className="font-semibold text-primary text-sm hover:underline"
                    >
                        {item.nama}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{item.kode}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary uppercase">
                    {item.kota}
                </span>
            </div>
            <div className="flex justify-end items-center pt-2 border-t border-slate-100 gap-1">
                <Link
                    href={`/master-data/region/${item.id}`}
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
                                    Daftar Wilayah
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola master data wilayah yang tersedia di sistem.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter
                                    fields={FILTER_FIELDS}
                                    onApplyFilter={handleApplyFilter}
                                />
                                <Link
                                    href="/master-data/region/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Wilayah Baru
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
