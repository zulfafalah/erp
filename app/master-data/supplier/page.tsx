"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";

interface Pemasok {
    id: string;
    kode: string;
    nama: string;
    kontak: string;
    alamat: string;
    telepon: string;
    isImportir: boolean;
    wilayah: string;
    sisaHutang: string;
}

const pemasokData: Pemasok[] = [
    {
        id: "PMSK-001",
        kode: "PMSK-001",
        nama: "CARREFOUR DENPASAR",
        kontak: "Budi Santoso",
        alamat: "Jl. Sunset Road No. 88, Kuta, Bali",
        telepon: "0361-123456",
        isImportir: false,
        wilayah: "Bali",
        sisaHutang: "IDR 13.875.000,00",
    },
    {
        id: "PMSK-002",
        kode: "PMSK-002",
        nama: "PT ABC INDONESIA",
        kontak: "Siti Rahmawati",
        alamat: "CBD Mega Kuningan, Jakarta Selatan",
        telepon: "021-9876543",
        isImportir: true,
        wilayah: "Jakarta",
        sisaHutang: "IDR 5.200.000,00",
    },
    {
        id: "PMSK-003",
        kode: "PMSK-003",
        nama: "SINAR JAYA ABADI",
        kontak: "Rudi Hartono",
        alamat: "Kawasan Industri Delta Silicon, Cikarang",
        telepon: "021-8901234",
        isImportir: false,
        wilayah: "Jawa Barat",
        sisaHutang: "IDR 42.150.000,00",
    },
    {
        id: "PMSK-004",
        kode: "PMSK-004",
        nama: "GLOBAL LOGISTICS",
        kontak: "Michael Tan",
        alamat: "Pelabuhan Tanjung Priok, Jakarta Utara",
        telepon: "021-4321098",
        isImportir: true,
        wilayah: "Jakarta",
        sisaHutang: "IDR 215.000.000,00",
    },
    {
        id: "PMSK-005",
        kode: "PMSK-005",
        nama: "MEDIKA UTAMA",
        kontak: "dr. Andi Wijaya",
        alamat: "Jl. Kesehatan No. 1, Bandung",
        telepon: "022-7654321",
        isImportir: false,
        wilayah: "Jawa Barat",
        sisaHutang: "IDR 8.900.000,00",
    },
];

export default function PemasokListPage() {
    const [filteredData, setFilteredData] = useState<Pemasok[]>(pemasokData);

    const filterFields: FilterField[] = [
        { key: "kode", label: "Kode Pemasok", type: "text" },
        { key: "nama", label: "Nama Pemasok", type: "text" },
        { key: "kontak", label: "Kontak / PIC", type: "text" },
        { key: "telepon", label: "Telepon", type: "text" },
        {
            key: "wilayah",
            label: "Wilayah",
            type: "select",
            options: [
                { label: "Bali", value: "Bali" },
                { label: "Jakarta", value: "Jakarta" },
                { label: "Jawa Barat", value: "Jawa Barat" },
            ]
        },
        {
            key: "isImportir",
            label: "Jenis Pemasok",
            type: "select",
            options: [
                { label: "Importir", value: "true" },
                { label: "Lokal", value: "false" },
            ]
        }
    ];

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(pemasokData);
            return;
        }

        const result = pemasokData.filter(pemasok => {
            // Semua rule harus cocok secara bersamaan (AND condition)
            return rules.every(rule => {
                let pValue = pemasok[rule.field as keyof Pemasok];

                // Konversi value boolean ke string untuk kemudahan filter select
                if (rule.field === 'isImportir') {
                    pValue = (pValue === true) ? "true" : "false";
                }

                if (pValue === undefined || pValue === null) return false;

                const stringValue = String(pValue).toLowerCase();
                const filterValue = rule.value.toLowerCase();

                switch (rule.operator) {
                    case 'contains':
                        return stringValue.includes(filterValue);
                    case 'equals':
                        return stringValue === filterValue;
                    case 'not_equals':
                        return stringValue !== filterValue;
                    case 'starts_with':
                        return stringValue.startsWith(filterValue);
                    case 'ends_with':
                        return stringValue.endsWith(filterValue);
                    default:
                        return true;
                }
            });
        });

        setFilteredData(result);
    };

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
                                    Daftar Pemasok
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola master data pemasok/supplier Anda.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter
                                    fields={filterFields}
                                    onApplyFilter={handleApplyFilter}
                                />
                                {/* <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-primary/10 rounded-lg text-sm font-semibold hover:bg-primary/5 transition-colors">
                                    <span className="material-symbols-outlined text-lg">
                                        description
                                    </span>
                                    Export Excel
                                </button> */}
                                <Link
                                    href="/master-data/supplier/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">
                                        add_circle
                                    </span>
                                    Tambah Pemasok Baru
                                </Link>
                            </div>
                        </div>

                        {/* Table Container */}
                        <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden">
                            {/* Mobile Card View */}
                            <div className="block md:hidden divide-y divide-primary/5">
                                {filteredData.map((p) => (
                                    <div key={p.id} className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Link
                                                    href={`/master-data/pemasok/${p.id}`}
                                                    className="font-semibold text-primary text-sm hover:underline"
                                                >
                                                    {p.kode} - {p.nama}
                                                </Link>
                                                <p className="text-xs text-slate-500 mt-0.5">{p.wilayah}</p>
                                            </div>
                                            {p.isImportir && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                                                    Importir
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{p.kontak} ({p.telepon})</p>
                                            <p className="text-xs text-slate-500 truncate">{p.alamat}</p>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Sisa Hutang</p>
                                                <span className="text-sm font-bold text-red-600">{p.sisaHutang}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Link
                                                    href={`/master-data/pemasok/${p.id}`}
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
                                ))}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-primary/10">
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Kode & Nama
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Kontak & Telp
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Wilayah
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Importir
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Sisa Hutang
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-primary/5">
                                        {filteredData.map((p) => (
                                            <tr
                                                key={p.id}
                                                className="hover:bg-primary/5 transition-colors cursor-pointer"
                                            >
                                                <td className="px-6 py-4">
                                                    <Link
                                                        href={`/master-data/pemasok/${p.id}`}
                                                        className="font-semibold text-primary text-sm tracking-tight hover:underline flex flex-col"
                                                    >
                                                        <span>{p.kode}</span>
                                                        <span className="text-slate-700">{p.nama}</span>
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="font-medium text-slate-900">{p.kontak}</div>
                                                    <div className="text-slate-500 text-xs">{p.telepon}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {p.wilayah}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    {p.isImportir ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                                                            Ya
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">
                                                            Tidak
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-red-600">
                                                    {p.sisaHutang}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/master-data/pemasok/${p.id}`}
                                                            className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                                            title="View/Edit"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">
                                                                edit_square
                                                            </span>
                                                        </Link>
                                                        <button
                                                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">
                                                                delete
                                                            </span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-4 md:px-6 py-4 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                                <p className="text-sm text-slate-500 text-center md:text-left">
                                    Menampilkan 1 sampai 5 dari 158 data
                                </p>
                                <div className="flex flex-wrap justify-center items-center gap-1">
                                    <button
                                        className="p-2 border border-primary/10 rounded hover:bg-white disabled:opacity-50"
                                        disabled
                                    >
                                        <span className="material-symbols-outlined text-lg">
                                            chevron_left
                                        </span>
                                    </button>
                                    <button className="px-3 py-1 bg-primary text-white rounded text-sm font-bold">
                                        1
                                    </button>
                                    <button className="px-3 py-1 hover:bg-white text-sm font-medium rounded transition-colors">
                                        2
                                    </button>
                                    <button className="px-3 py-1 hover:bg-white text-sm font-medium rounded transition-colors">
                                        3
                                    </button>
                                    <span className="px-2 text-slate-400">...</span>
                                    <button className="px-3 py-1 hover:bg-white text-sm font-medium rounded transition-colors">
                                        32
                                    </button>
                                    <button className="p-2 border border-primary/10 rounded hover:bg-white">
                                        <span className="material-symbols-outlined text-lg">
                                            chevron_right
                                        </span>
                                    </button>
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
